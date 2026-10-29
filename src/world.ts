import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { State, World, Book } from './model';
import { plantById, plants } from './botany';
export type Interaction = {
    kind: 'door' | 'book' | 'bed' | 'lab' | 'greenhouse' | 'companion' | 'portal' | 'station';
    id: string;
    label: string;
};
type Collider = {
    x: number;
    z: number;
    w: number;
    d: number;
};
export class AtlasWorld {
    renderer: T.WebGLRenderer;
    scene = new T.Scene();
    camera = new T.PerspectiveCamera(57, 1, .1, 100);
    controls: OrbitControls;
    root = new T.Group();
    world: World = 'library';
    state: State;
    clickables: T.Object3D[] = [];
    colliders: Collider[] = [];
    beds = new Map<string, T.Group>();
    keys = new Set<string>();
    frame = 0;
    last = 0;
    lastRender = 0;
    time = 0;
    disposed = false;
    interactive = true;
    hover: Interaction | null = null;
    onHover: (i: Interaction | null) => void;
    onAction: (i: Interaction) => void;
    geometries: T.BufferGeometry[] = [];
    materials: T.Material[] = [];
    textures: T.Texture[] = [];
    wind: T.Group[] = [];
    avatar?: T.Group;
    cat?: T.Group;
    door?: T.Group;
    doorOpening = 0;
    nightLight?: T.DirectionalLight;
    ambientLight?: T.HemisphereLight;
    roomLamps: T.PointLight[] = [];
    lastDaylightUpdate = -1;
    lastWorld = '';
    resizeObserver: ResizeObserver;
    dirty = true;
    dragging = false;
    down = { x: 0, y: 0 };
    yaw = 0;
    pitch = -.06;
    transition = 0;
    movementVelocity = new T.Vector2();
    focusCooldown = 0;
    targetPos = new T.Vector3();
    targetLook = new T.Vector3();
    constructor(public host: HTMLElement, s: State, onAction: (i: Interaction) => void, onHover: (i: Interaction | null) => void) { this.state = s; this.onAction = onAction; this.onHover = onHover; this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); this.renderer.setClearColor('#263a31'); this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = T.PCFSoftShadowMap; this.renderer.toneMapping = T.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.12; host.appendChild(this.renderer.domElement); this.controls = new OrbitControls(this.camera, this.renderer.domElement); this.controls.enabled = false; this.controls.enableDamping = true; this.controls.addEventListener('change', () => { this.dirty = true; }); this.controls.minDistance = 1.4; this.controls.maxDistance = 12; this.controls.maxPolarAngle = Math.PI * .49; this.scene.add(this.root); this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(host); this.resize(); window.addEventListener('keydown', this.keydown); window.addEventListener('keyup', this.keyup); window.addEventListener('blur', this.blur); this.renderer.domElement.addEventListener('pointerdown', this.pointerdown); window.addEventListener('pointerup', this.pointerup); this.renderer.domElement.addEventListener('pointermove', this.pointermove); this.renderer.domElement.addEventListener('webglcontextlost', this.contextlost); this.build('library'); this.frame = requestAnimationFrame(this.tick); }
    contextlost = (e: Event) => { e.preventDefault(); this.onAction({ kind: 'lab', id: 'context-lost', label: 'Graphics context lost. Save your data and reload.' }); };
    resize() { this.dirty = true; const { width, height } = this.host.getBoundingClientRect(); this.renderer.setSize(width, height); this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); }
    keydown = (e: KeyboardEvent) => { if (!this.interactive || /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName))
        return; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key))
        e.preventDefault(); this.keys.add(e.key.toLowerCase()); if (e.key.toLowerCase() === 'e' && !e.repeat) {
        const target = this.pickCenter() || this.hover;
        if (target) this.act(target);
    } if (e.key.toLowerCase() === 'r')
        this.resetCamera(); };
    keyup = (e: KeyboardEvent) => this.keys.delete(e.key.toLowerCase());
    blur = () => { this.keys.clear(); this.dragging = false; this.movementVelocity.set(0, 0); };
    pointerdown = (e: PointerEvent) => { this.dragging = true; this.down = { x: e.clientX, y: e.clientY }; };
    pointerup = (e: PointerEvent) => { if (this.dragging && this.interactive && Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) < 5) {
        const hit = this.pick(e.clientX, e.clientY);
        if (hit)
            this.act(hit);
    } this.dragging = false; };
    pointermove = (e: PointerEvent) => { if (!this.interactive)
        return; if (this.dragging && this.world !== 'study') {
        this.yaw -= e.movementX * .004;
        this.pitch = T.MathUtils.clamp(this.pitch - e.movementY * .003, -.8, .75);
        this.dirty = true;
    } const hit = this.pick(e.clientX, e.clientY); if (hit?.id !== this.hover?.id || hit?.kind !== this.hover?.kind) {
        this.hover = hit;
        this.onHover(hit);
    } this.renderer.domElement.style.cursor = hit ? 'pointer' : this.dragging ? 'grabbing' : 'grab'; };
    pickCenter() {
        if (this.world === 'study') return null;
        const rect = this.renderer.domElement.getBoundingClientRect();
        const candidate = this.pick(rect.left + rect.width / 2, rect.top + rect.height / 2);
        if (!candidate) return null;
        const ray = new T.Raycaster();
        ray.setFromCamera(new T.Vector2(0, 0), this.camera);
        const hit = ray.intersectObjects(this.clickables, true).find(h => h.distance < 3.8);
        return hit ? candidate : null;
    }
    pick(x: number, y: number) { if (this.world !== 'study') {
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.set(this.pitch, this.yaw, 0);
    } this.camera.updateMatrixWorld(true); const r = this.renderer.domElement.getBoundingClientRect(), ray = new T.Raycaster(); ray.setFromCamera(new T.Vector2((x - r.left) / r.width * 2 - 1, -(y - r.top) / r.height * 2 + 1), this.camera); const hits = ray.intersectObjects(this.clickables, true); for (const h of hits) {
        let o: T.Object3D | null = h.object;
        while (o && !o.userData.interaction)
            o = o.parent;
        if (o?.userData.interaction && h.distance < 16)
            return o.userData.interaction as Interaction;
    } return null; }
    act(i: Interaction) { this.dirty = true; if (i.kind === 'door') {
        if (this.doorOpening)
            return;
        this.doorOpening = .01;
        this.onHover({ kind: 'door', id: 'opening', label: 'Opening the garden door…' });
        return;
    } this.onAction(i); }
    mat(color: string, roughness = .78, metalness = 0) { const m = new T.MeshStandardMaterial({ color, roughness, metalness }); this.materials.push(m); return m; }
    geo(g: T.BufferGeometry) { this.geometries.push(g); return g; }
    mesh(g: T.BufferGeometry, m: T.Material, x = 0, y = 0, z = 0, parent: T.Object3D = this.root) { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; }
    box(w: number, h: number, d: number, x: number, y: number, z: number, m: T.Material, parent: T.Object3D = this.root) { return this.mesh(this.geo(new T.BoxGeometry(w, h, d)), m, x, y, z, parent); }
    sphere(r: number, x: number, y: number, z: number, m: T.Material, parent: T.Object3D = this.root, scale = [1, 1, 1]) { const o = this.mesh(this.geo(new T.SphereGeometry(r, 16, 12)), m, x, y, z, parent); o.scale.set(...scale as [
        number,
        number,
        number
    ]); return o; }
    cylinder(r: number, h: number, x: number, y: number, z: number, m: T.Material, parent: T.Object3D = this.root, r2 = r) { return this.mesh(this.geo(new T.CylinderGeometry(r, r2, h, 16)), m, x, y, z, parent); }
    label(text: string, w: number, h: number, x: number, y: number, z: number, parent: T.Object3D = this.root, bg = '#e8dfc7', fg = '#263c30') { const c = document.createElement('canvas'); c.width = 768; c.height = 192; const a = c.getContext('2d')!; a.fillStyle = bg; a.fillRect(0, 0, 768, 192); a.strokeStyle = fg; a.lineWidth = 3; a.strokeRect(12, 12, 744, 168); a.fillStyle = fg; a.font = '32px Georgia'; a.textAlign = 'center'; a.textBaseline = 'middle'; const words = text.split(' '); let lines = ['']; for (const word of words) {
        const l = lines.length - 1;
        if (a.measureText(lines[l] + word).width > 680)
            lines.push(word + ' ');
        else
            lines[l] += word + ' ';
    } lines.slice(0, 3).forEach((l, i) => a.fillText(l, 384, 96 + (i - (Math.min(lines.length, 3) - 1) / 2) * 41)); const texture = new T.CanvasTexture(c); texture.colorSpace = T.SRGBColorSpace; this.textures.push(texture); const m = new T.MeshBasicMaterial({ map: texture }); this.materials.push(m); return this.mesh(this.geo(new T.PlaneGeometry(w, h)), m, x, y, z, parent); }
    bind(o: T.Object3D, i: Interaction) { o.userData.interaction = i; this.clickables.push(o); }
    clear() { this.root.clear(); this.geometries.forEach(g => g.dispose()); this.materials.forEach(m => m.dispose()); this.textures.forEach(t => t.dispose()); this.geometries = []; this.materials = []; this.textures = []; this.clickables = []; this.colliders = []; this.wind = []; this.beds.clear(); this.avatar = undefined; this.cat = undefined; this.door = undefined; this.roomLamps = []; this.ambientLight = undefined; this.renderer.renderLists.dispose(); this.hover = null; this.onHover(null); }
    build(world: World) { this.dirty = true; if (this.lastWorld && this.lastWorld !== world && !this.state.settings.reducedMotion) { this.renderer.domElement.classList.remove('atlas-room-arrival'); void this.renderer.domElement.offsetWidth; this.renderer.domElement.classList.add('atlas-room-arrival'); } this.lastWorld = world; this.clear(); this.world = world; this.doorOpening = 0; this.scene.background = new T.Color(world === 'garden' ? '#afc6bb' : '#272d24'); this.scene.fog = new T.Fog(world === 'garden' ? '#afc6bb' : '#383d30', world === 'garden' ? 22 : 25, world === 'garden' ? 65 : 55); const hemi = new T.HemisphereLight('#e5ede4', '#654d33', world === 'garden' ? 2 : 1.35); this.root.add(hemi); this.ambientLight = hemi; const sun = new T.DirectionalLight('#ffdfab', this.state.settings.night ? .45 : 3.5); sun.position.set(-7, 12, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -17; sun.shadow.camera.right = 17; sun.shadow.camera.top = 17; sun.shadow.camera.bottom = -17; sun.shadow.normalBias = .035; this.root.add(sun); this.nightLight = sun; if (world === 'garden')
        this.buildGarden();
    else if (world === 'quarters' || world === 'clinical')
        this.buildAcademyRoom(world);
    else {
        this.buildLibrary(world === 'study');
        if (world === 'library') this.buildAcademyPortals();
    } this.applySettings(); this.resetCamera(); }
    buildAcademyPortals() {
        const brass = this.mat('#b9995c', .35, .55), oak = this.mat('#342a23');
        for (const [x, target, name] of [[-5.7, 'quarters', 'PERSONAL QUARTERS'], [5.7, 'clinical', 'CLINICAL HALL']] as const) {
            const frame = this.box(1.55, 2.8, .18, x, 1.4, 6.45, oak);
            this.box(1.28, 2.48, .1, x, 1.28, 6.35, brass);
            const plate = this.label(name, 1.55, .45, x, 3.14, 6.2);
            this.bind(frame, {kind:'portal', id:target, label:`Enter ${name.toLowerCase()}`});
            this.bind(plate, {kind:'portal', id:target, label:`Enter ${name.toLowerCase()}`});
        }
    }
    buildAcademyRoom(room: 'quarters' | 'clinical') {
        const privateRoom = room === 'quarters';
        const wood = this.mat('#5a3a29'), stone = this.mat('#3b413d'), brass = this.mat('#b99b68', .35, .45), fabric = this.mat('#72806c'), parchment = this.mat('#dfcda4'), glass = this.mat('#7c9e94', .15, .35);
        this.box(16, .25, 13, 0, -.15, 0, wood);
        // Inlaid floorboards, ceiling beams and warm sconces make the rooms feel inhabited.
        const floorTrim = this.mat('#735039'), paleStone = this.mat('#a19579');
        for (let x = -7.4; x <= 7.4; x += .8) this.box(.035, .012, 12.6, x, -.012, 0, floorTrim);
        for (const z of [-5.2, -2.6, 0, 2.6, 5.2]) this.box(15.7, .25, .3, 0, 5.84, z, wood);
        for (const x of [-7.5, 7.5]) for (const z of [-4.8, 0, 4.8]) {
            this.box(.26, 2.5, .26, x, 3.75, z, paleStone);
            const lamp = new T.PointLight('#ffc783', 9, 5, 2);
            lamp.position.set(x > 0 ? x - .35 : x + .35, 3.3, z); this.root.add(lamp); this.roomLamps.push(lamp);
            this.sphere(.14, x > 0 ? x - .35 : x + .35, 3.3, z, brass);
        }
        // The far wall has framed, illuminated glazing instead of an unbroken slab.
        for (const x of [-5.5, 5.5]) {
            this.box(1.6, 2.6, .07, x, 3.6, -6.12, brass);
            this.box(1.35, 2.36, .075, x, 3.6, -6.06, glass);
            this.box(.09, 2.36, .09, x, 3.6, -5.99, wood);
            this.box(1.35, .08, .09, x, 3.6, -5.99, wood);
        }
        this.box(16, 6, .3, 0, 3, -6.4, stone);
        this.box(.3, 6, 13, -8, 3, 0, stone);
        this.box(.3, 6, 13, 8, 3, 0, stone);
        this.box(16, .25, 13, 0, 6.1, 0, wood);
        for (const x of [-6,-3,0,3,6]) { this.box(.13, 6, .16, x, 3, -6.22, wood); }
        for (const x of [-4,0,4]) { const light=new T.PointLight('#ffd7a0', 25, 8); light.position.set(x,4,-2); this.root.add(light); this.roomLamps.push(light); this.sphere(.12,x,4,-2,brass); }
        this.label(privateRoom ? 'HISHAM’S QUARTERS' : 'THE CLINICAL HALL', 4.8, .8, 0, 4.8, -6.17);
        const exit = this.box(1.9, 3, .25, 0, 1.5, 6.35, wood);
        this.bind(exit, {kind:'portal',id:'library',label:'Return to the library'});
        this.label('LIBRARY', 1.7, .45, 0, 3.15, 6.17);
        if (privateRoom) {
            this.colliders.push({x:-4.8,z:-2.5,w:3.3,d:4.3},{x:3,z:-3.5,w:3.6,d:1.8},{x:-6.5,z:-4.5,w:2.7,d:1});
            this.box(3.1,.5,4.1,-4.8,.65,-2.5,wood);
            this.box(2.8,.35,3.65,-4.8,1,-2.5,fabric);
            this.box(2.65,.2,.8,-4.8,1.28,-4,parchment);
            const desk=this.box(3.4,.25,1.5,3,1.6,-3.5,wood);
            for (const x of [1.6,4.4]) this.box(.18,1.4,.18,x,.8,-3.5,brass);
            this.bind(desk,{kind:'station',id:'quarters',label:'Open daily routines and reflections'});
            this.label('DAILY PLANNER',2.3,.43,3,2.12,-3.55);
            this.box(2.5,2.7,.6,-6.5,1.5,-4.5,wood);
            for(let i=0;i<4;i++) this.box(2.3,.13,.57,-6.5,.6+i*.58,-4.5,brass);
        } else {
            for(const x of [-4.8,0,4.8]) {
                this.colliders.push({x,z:-2.2,w:3.35,d:1.8});
                const table=this.box(3.2,.22,1.6,x,1.5,-2.2,wood);
                for(const dx of [-1.3,1.3]) this.box(.13,1.4,.13,x+dx,.78,-2.2,brass);
                this.box(1.6,.14,.9,x,1.69,-2.2,parchment);
                this.cylinder(.18,.65,x+.9,2,-2.1,glass);
                this.bind(table,{kind:'station',id:'clinical',label:'Begin a clinical pharmacy case'});
            }
            this.label('CASE DISCUSSION • EVIDENCE • SAFETY',5,.6,0,3.65,-6.13);
            this.box(8,2.2,.15,0,2.45,-6.15,this.mat('#243e37'));
        }
        // A fellow academy scholar provides a quiet sense of life without blocking paths.
        this.buildAvatar(privateRoom ? -1.7 : 6.35, 0, privateRoom ? -3.4 : -3.8);
    }
    updateDaylight(force = false) {
        const time = new Date();
        const minute = time.getHours() * 60 + time.getMinutes();
        if (!force && minute === this.lastDaylightUpdate) return;
        this.lastDaylightUpdate = minute;
        // Civil-time-inspired ambient curve; manual Evening lighting overrides it.
        const hour = minute / 60;
        const daylight = Math.max(0, Math.min(1, (hour - 5.5) / 2.5, (20 - hour) / 2.5));
        const brightness = this.state.settings.night ? 0.08 : daylight;
        if (this.nightLight) this.nightLight.intensity = .35 + brightness * 3.15;
        if (this.ambientLight) this.ambientLight.intensity = .8 + brightness * (this.world === 'garden' ? 1.2 : .55);
        this.roomLamps.forEach(lamp => { lamp.intensity = (this.world === 'quarters' || this.world === 'clinical' ? 8 : 5) + (1-brightness)*6; });
        const sky = new T.Color(this.world === 'garden' ? '#101d2b' : '#161e28');
        sky.lerp(new T.Color(this.world === 'garden' ? '#afc6bb' : '#272d24'), brightness);
        this.scene.background = sky;
        if (this.scene.fog instanceof T.Fog) this.scene.fog.color.copy(sky);
        this.renderer.toneMappingExposure = .78 + brightness * .34;
        this.dirty = true;
    }
    applySettings() { const p = this.state.settings; this.renderer.setPixelRatio(Math.min(devicePixelRatio, p.quality === 'Low' ? 1 : p.quality === 'Medium' ? 1.25 : p.quality === 'Ultra' ? 2 : 1.5)); this.renderer.shadowMap.enabled = p.quality !== 'Low'; this.updateDaylight(true); if (this.avatar) {
        this.avatar.traverse(o => { if (o.userData.part === 'outfit')
            ((o as T.Mesh).material as T.MeshStandardMaterial).color.set(p.outfit); if (o.userData.part === 'hair')
            ((o as T.Mesh).material as T.MeshStandardMaterial).color.set(p.hair); if (o.userData.part === 'skin')
            ((o as T.Mesh).material as T.MeshStandardMaterial).color.set(p.skin); });
    } if (this.cat)
        this.cat.traverse(o => { if (o.userData.fur)
            ((o as T.Mesh).material as T.MeshStandardMaterial).color.set(p.companion === 'Cream' ? '#dfd2ae' : p.companion === 'Sage' ? '#809780' : '#b98250'); }); }
    update(s: State) { this.dirty = true; const prior = this.state; this.state = s; if (this.world !== 'garden' && prior.books.map(b => b.id + b.title).join('|') !== s.books.map(b => b.id + b.title).join('|')) {
        this.build(this.world);
        return;
    } this.applySettings(); if (this.world === 'garden' && prior.beds !== s.beds)
        this.updateBeds(); if (this.world === 'study' && prior.settings.camera !== s.settings.camera)
        this.studyCamera(); }
    woodTexture() { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const a = c.getContext('2d')!; a.fillStyle = '#62472e'; a.fillRect(0, 0, 512, 512); for (let i = 0; i < 1000; i++) {
        const y = (i * 73) % 512;
        a.strokeStyle = `rgba(${i % 2 ? 24 : 210},${i % 2 ? 15 : 157},${i % 2 ? 10 : 90},.11)`;
        a.beginPath();
        a.moveTo(0, y);
        a.bezierCurveTo(160, y + Math.sin(i) * 4, 330, y - 3, 512, y + 2);
        a.stroke();
    } const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(1, 4); t.colorSpace = T.SRGBColorSpace; this.textures.push(t); const m = this.mat('#bda382'); m.map = t; return m; }
    buildLibrary(study: boolean) {
        const fill = new T.PointLight('#ffe5bb', 65, 22, 2);
        fill.position.set(0, 4, 2);
        this.root.add(fill);
        const fill2 = new T.PointLight('#c5dac4', 45, 18, 2);
        fill2.position.set(-5, 3, -3);
        this.root.add(fill2);
        const wood = this.mat('#423024'), edge = this.mat('#76583c'), brass = this.mat('#b89758', .32, .7), wall = this.mat('#8a9180'), fabric = this.mat('#6b7e68'), floor = this.woodTexture();
        this.box(18, .2, 16, 0, -.12, 0, wood);
        for (let i = 0; i < 24; i++)
            this.box(.735, .06, 15.8, -8.7 + i * .75, 0, 0, floor);
        this.box(18, 5.6, .25, 0, 2.8, -8, wall);
        this.box(.25, 5.6, 16, -9, 2.8, 0, wall);
        this.box(.25, 5.6, 16, 9, 2.8, 0, wall);
        this.box(18, .18, 16, 0, 5.65, 0, this.mat('#777d6b'));
        for (let x = -8; x <= 8; x += 4) {
            this.box(.22, .4, 16, x, 5.4, 0, wood);
            this.box(.22, 5.2, .28, x, 2.6, -7.75, wood);
        }
        for (const x of [-8.85, 8.85]) {
            this.box(.14, .25, 16, x, .23, 0, wood);
            this.box(.14, .2, 16, x, 5.2, 0, brass);
        }
        // A deliberate wall of shelves; every labeled volume comes from supplied metadata.
        const positions = [-6.8, -3.4, 0];
        positions.forEach((x) => { this.box(3.1, 4.4, .65, x, 2.3, -7.35, wood); for (const dx of [-1.5, 1.5])
            this.box(.12, 4.5, .9, x + dx, 2.3, -7.12, edge); for (let y = .25; y < 4.7; y += .86)
            this.box(3.15, .10, .95, x, y, -7.1, edge); this.box(3.3, .2, 1, x, 4.65, -7.1, wood); });
        this.state.books.forEach((b, i) => { const shelf = Math.floor(i / 15) % 4, col = Math.floor(i / 5) % 3, k = i % 5; const x = positions[col] - .95 + k * .46, h = .52 + (i % 4) * .055; const g = this.book(b, i); g.position.set(x, .31 + shelf * .86 + h / 2, -6.95); g.userData.home = g.position.clone(); this.root.add(g); this.bind(g, { kind: 'book', id: b.id, label: b.title }); });
        for (let z = -4; z <= 3; z += 3.5) {
            const pane = this.mat('#b6d1c2', .25);
            pane.emissive = new T.Color('#87a995');
            pane.emissiveIntensity = .35;
            this.box(.12, 3.2, 2.5, -8.83, 3, z, pane);
            for (const dz of [-1.3, 0, 1.3])
                this.box(.3, 3.5, .09, -8.65, 3, z + dz, wood);
            this.box(.35, .14, 2.8, -8.6, 2.8, z, wood);
            this.box(.8, .15, 3, -8.45, 1.3, z, edge);
            this.potted(-8.2, 1.4, z, 1);
        }
        // Exactly one functional library garden door.
        const doorRoot = new T.Group();
        doorRoot.position.set(5.5, 0, -7.7);
        this.root.add(doorRoot);
        this.box(2.35, 3.8, .3, 0, 1.9, 0, wood, doorRoot);
        for (const x of [-1.25, 1.25])
            this.box(.17, 4, .5, x, 2, .05, brass, doorRoot);
        this.box(2.65, .18, .5, 0, 4, .05, brass, doorRoot);
        const hinge = new T.Group();
        hinge.position.x = -1.15;
        doorRoot.add(hinge);
        this.box(2.25, 3.7, .2, 1.12, 1.85, .23, this.mat('#344d3d'), hinge);
        for (let y = .7; y < 3.5; y += 1.1)
            this.box(1.8, .8, .06, 1.12, y, .37, wood, hinge);
        this.sphere(.09, 1.98, 1.75, .48, brass, hinge);
        this.label('MEDICAL GARDEN', 2.1, .45, 1.12, 3.08, .43, hinge);
        this.door = hinge;
        this.bind(doorRoot, { kind: 'door', id: 'garden-door', label: 'Open Medical Garden door' });
        const rug = this.mat('#5c6650');
        this.box(7, .025, 5, 0, .05, .7, rug);
        for (const x of [-3.2, 3.2])
            this.box(.04, .03, 4.6, x, .07, .7, brass);
        for (const z of [-1.5, 2.9])
            this.box(6.4, .03, .04, 0, .07, z, brass);
        // Upholstered seating and low table, with collision footprints.
        const sofa = new T.Group();
        sofa.position.set(4.9, 0, 1.9);
        this.root.add(sofa);
        this.box(3.6, .5, 1.2, 0, .55, 0, fabric, sofa);
        this.box(3.6, 1.2, .3, 0, 1.15, .5, fabric, sofa);
        for (const x of [-1.65, 1.65])
            this.box(.3, .7, 1.35, x, .9, 0, fabric, sofa);
        for (let x = -1.1; x < 1.5; x += 1.1) {
            this.box(1, .15, 1, x, .88, -.1, this.mat('#9c9b78'), sofa);
            const cushion = this.box(.65, .65, .22, x, 1.25, .25, this.mat(x < 0 ? '#bda17a' : '#758974'), sofa);
            cushion.rotation.z = .12;
        }
        this.colliders.push({ x: 4.9, z: 1.9, w: 3.8, d: 1.5 });
        this.box(2.5, .14, 1.5, 1.5, .65, 1.3, edge);
        for (const x of [.5, 2.5])
            for (const z of [.8, 1.8])
                this.cylinder(.055, .6, x, .3, z, brass);
        this.colliders.push({ x: 1.5, z: 1.3, w: 2.5, d: 1.5 });
        this.cylinder(.15, .18, 1.8, .81, 1.1, this.mat('#d4c7ad'));
        this.book(this.state.books[0], 1).position.set(1, .85, 1.2);
        this.desk(-3.6, -2.5);
        this.colliders.push({ x: -3.6, z: -2.5, w: 3.2, d: 1.5 });
        this.potted(7.5, 0, -5, 2.2);
        this.potted(-6.8, 0, 3.8, 2.1);
        // Fireplace on the right wall, with inset glowing coals and mantel.
        const fire = new T.Group();
        fire.position.set(8.5, 0, -2.2);
        fire.rotation.y = -Math.PI / 2;
        this.root.add(fire);
        this.box(3, 2.6, .7, 0, 1.3, 0, wood, fire);
        this.box(2, 1.65, .1, 0, .9, .4, this.mat('#171a14'), fire);
        this.box(3.3, .18, 1.1, 0, 2.65, 0, edge, fire);
        const coal = this.mat('#d47932');
        coal.emissive.set('#e5541b');
        coal.emissiveIntensity = 2;
        for (let i = 0; i < 7; i++) {
            const f = this.sphere(.16, -.7 + i * .23, .35, .52, coal, fire, [.6, 1.2 + (i % 3) * .3, .7]);
            f.userData.flame = true;
        }
        const glow = new T.PointLight('#ffb15b', 10, 7, 2);
        glow.position.set(7.1, 1, -2.2);
        this.root.add(glow);
        this.label('THE READING ROOM', 3.2, .5, -3, 4.95, -7.73);
        this.buildCat(3.7, .2, 3.9);
        if (study) {
            this.buildAvatar(-3.6, 0, -1.65);
            this.controls.enabled = true;
        }
        else
            this.controls.enabled = false;
    }
    book(b: Book, i: number) { const g = new T.Group(), color = ['#526752', '#8e5845', '#ad925b', '#496e71', '#6e5c73', '#a27853'][i % 6], m = this.mat(color), h = .52 + (i % 4) * .055; this.box(.19, h, .44, 0, 0, 0, this.mat('#d8d0bb'), g); this.box(.225, .04, .49, 0, h / 2, 0, m, g); this.box(.225, .04, .49, 0, -h / 2, 0, m, g); this.box(.225, h, .045, 0, 0, .245, m, g); const label = this.label(b.title, h * .8, .15, 0, 0, .272, g, color, '#f0dfb7'); label.rotation.z = Math.PI / 2; for (const y of [-h * .32, h * .32])
        this.box(.225, .014, .005, 0, y, .274, this.mat('#bca169'), g); return g; }
    desk(x: number, z: number) { const wood = this.mat('#725139'), metal = this.mat('#b69c64', .25, .7); this.box(3.2, .17, 1.5, x, 1.28, z, wood); for (const dx of [-1.35, 1.35])
        for (const dz of [-.53, .53])
            this.box(.13, 1.2, .13, x + dx, .6, z + dz, wood); this.box(.9, .7, .13, x, 1, z - .62, wood); this.box(1, .12, .9, x, .65, z + 1, this.mat('#526b5b')); this.box(1, 1, .13, x, 1.1, z + 1.38, this.mat('#526b5b')); this.cylinder(.22, .05, x - 1, 1.41, z, metal); this.cylinder(.035, .75, x - 1, 1.78, z, metal); const shade = this.mesh(this.geo(new T.ConeGeometry(.35, .3, 24, 1, true)), this.mat('#baad83'), x - 1, 2.18, z); shade.rotation.x = Math.PI; const light = new T.PointLight('#ffdf9b', 12, 6); light.position.set(x - 1, 2, z); this.root.add(light); this.box(.82, .035, .57, x, 1.4, z, this.mat('#ddd5b7')); this.box(.018, .04, .6, x, 1.43, z, wood); this.cylinder(.11, .18, x + .8, 1.47, z + .13, this.mat('#c5b28d')); }
    potted(x: number, y: number, z: number, scale: number) { const g = new T.Group(); g.position.set(x, y, z); g.scale.setScalar(scale); this.root.add(g); this.cylinder(.23, .36, 0, .18, 0, this.mat('#a77855'), g, .17); for (let i = 0; i < 9; i++) {
        const a = i * 2.4;
        this.leaf(g, Math.cos(a) * .12, .35 + i * .035, Math.sin(a) * .12, a, .43, .16, this.mat(i % 2 ? '#4e7957' : '#73916a'));
    } return g; }
    leaf(parent: T.Object3D, x: number, y: number, z: number, angle: number, len: number, width: number, material: T.Material) { const shape = new T.Shape(); shape.moveTo(0, 0); shape.bezierCurveTo(width, len * .35, width * .5, len * .8, 0, len); shape.bezierCurveTo(-width * .5, len * .8, -width, len * .35, 0, 0); const geo = this.geo(new T.ShapeGeometry(shape, 5)); const o = this.mesh(geo, material, x, y, z, parent); material.side = T.DoubleSide; o.rotation.set(-.5, angle, -.45); return o; }
    buildAvatar(x: number, y: number, z: number) { const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = Math.PI; this.root.add(g); this.avatar = g; const cloth = this.mat(this.state.settings.outfit), skin = this.mat(this.state.settings.skin), hair = this.mat(this.state.settings.hair), pants = this.mat('#3d4540'); const torso = this.mesh(this.geo(new T.LatheGeometry([new T.Vector2(.22, .63), new T.Vector2(.29, .85), new T.Vector2(.3, 1.25), new T.Vector2(.22, 1.42)], 24)), cloth, 0, 0, 0, g); torso.userData.part = 'outfit'; const head = this.sphere(.23, 0, 1.69, 0, skin, g, [.88, 1.15, .9]); head.userData.part = 'skin'; const cap = this.sphere(.24, 0, 1.8, -.025, hair, g, [.94, .83, .95]); cap.userData.part = 'hair'; for (const side of [-1, 1]) {
        this.sphere(.026, side * .085, 1.71, .19, this.mat('#26302b'), g, [1, 1, .35]);
        const arm = this.cylinder(.08, .6, side * .3, 1.1, .12, cloth, g);
        arm.rotation.x = -.7;
        arm.userData.part = 'outfit';
        this.sphere(.075, side * .3, .88, .35, skin, g).userData.part = 'skin';
        const leg = this.cylinder(.11, .65, side * .16, .54, .24, pants, g);
        leg.rotation.x = -1.15;
        this.cylinder(.09, .52, side * .16, .23, .5, pants, g);
        this.sphere(.13, side * .16, .05, .56, pants, g, [.75, .5, 1.5]);
    } return g; }
    buildCat(x: number, y: number, z: number) { const g = new T.Group(); g.position.set(x, y, z); this.root.add(g); this.cat = g; const fur = this.mat('#b98250'); const body = this.sphere(.36, 0, .25, 0, fur, g, [1.3, .75, .8]); body.userData.fur = true; this.sphere(.23, -.32, .4, .04, fur, g).userData.fur = true; for (const side of [-1, 1]) {
        const ear = this.mesh(this.geo(new T.ConeGeometry(.105, .23, 3)), fur, -.32 + side * .14, .64, .025, g);
        ear.rotation.z = -side * .3;
        ear.userData.fur = true;
        this.sphere(.026, -.35 + side * .09, .43, .24, this.mat('#26352b'), g);
        this.sphere(.10, -.25 + side * .22, .07, .23, fur, g).userData.fur = true;
    } const tail = new T.CatmullRomCurve3([new T.Vector3(.3, .2, 0), new T.Vector3(.65, .2, .2), new T.Vector3(.7, .1, .45), new T.Vector3(.4, .08, .5)]); this.mesh(this.geo(new T.TubeGeometry(tail, 20, .06, 8, false)), fur, 0, 0, 0, g).userData.fur = true; this.bind(g, { kind: 'companion', id: 'cat', label: 'Greet your companion' }); return g; }
    buildGarden() {
        const grass = this.mat('#65794c'), stone = this.mat('#b8ad8d'), wood = this.mat('#64503a'), soil = this.mat('#473d29'), metal = this.mat('#526b58', .35, .5);
        this.box(38, .2, 44, 0, -.17, -8, grass);
        this.box(3.3, .05, 32, 0, 0, -4, stone);
        for (let z = -18; z < 12; z += 1.4)
            this.box(3.2, .015, .035, 0, .035, z, this.mat('#91866f'));
        this.box(24, .05, 2.3, 0, .01, -4, stone);
        // Garden return gate; paths lead physically to greenhouse and laboratory.
        const gate = new T.Group();
        gate.position.set(0, 0, 11);
        gate.rotation.y = Math.PI;
        this.root.add(gate);
        for (const x of [-1.4, 1.4])
            this.box(.18, 3.2, .3, x, 1.6, 0, metal, gate);
        this.box(3, .2, .3, 0, 3.1, 0, metal, gate);
        this.label('RETURN TO LIBRARY', 2.5, .4, 0, 2.7, .18, gate);
        this.bind(gate, { kind: 'door', id: 'library-door', label: 'Return to the library' });
        this.door = gate;
        for (let i = 0; i < 8; i++) {
            const x = i % 2 === 0 ? -4.5 : 4.5, z = 5 - Math.floor(i / 2) * 4;
            const g = new T.Group();
            g.position.set(x, 0, z);
            this.root.add(g);
            this.box(4, .35, 2.6, 0, .18, 0, wood, g);
            this.box(3.7, .1, 2.3, 0, .38, 0, soil, g);
            for (const dx of [-2, 2])
                this.box(.13, .5, 2.85, dx, .25, 0, wood, g);
            for (const dz of [-1.35, 1.35])
                this.box(4, .5, .13, 0, .25, dz, wood, g);
            this.label(plants[i].common.toUpperCase(), 1.7, .32, 0, .65, 1.44, g);
            this.bind(g, { kind: 'bed', id: `bed-${i}`, label: `${plants[i].common} · select bed` });
            const planting = new T.Group();
            g.add(planting);
            this.beds.set(`bed-${i}`, planting);
            this.colliders.push({ x, z, w: 4.2, d: 2.9 });
        }
        this.updateBeds();
        // Perimeter trees and dense instanced grass, all generated originally.
        for (let i = 0; i < 18; i++) {
            const a = i / 18 * Math.PI * 2, x = Math.cos(a) * 16, z = Math.sin(a) * 18 - 6;
            const trunk = this.mat('#665744'), leaf = this.mat(i % 2 ? '#647e50' : '#839364');
            this.cylinder(.22, 3, x, 1.5, z, trunk);
            for (let j = 0; j < 4; j++)
                this.sphere(1.8, x + Math.sin(j * 2) * .7, 3.8 + j * .4, z + Math.cos(j * 2) * .7, leaf, this.root, [1, 1.2, 1]);
        }
        const blade = this.geo(new T.ConeGeometry(.045, .35, 3));
        const blades = new T.InstancedMesh(blade, this.mat('#8a9a60'), 2000);
        const dummy = new T.Object3D();
        for (let i = 0; i < 2000; i++) {
            let x = Math.sin(i * 127.1) * 17, z = Math.cos(i * 311.7) * 20 - 7;
            if (Math.abs(x) < 2 || Math.abs(z + 4) < 1.4) {
                x += x > 0 ? 7 : -7;
            }
            dummy.position.set(x, .1, z);
            dummy.rotation.y = i * 1.7;
            dummy.scale.setScalar(.7 + (i % 8) * .14);
            dummy.updateMatrix();
            blades.setMatrixAt(i, dummy.matrix);
        }
        blades.castShadow = false;
        this.root.add(blades);
        // Ornate greenhouse, accessible through the path; no extra scene door.
        const greenhouse = new T.Group();
        greenhouse.position.set(-9, 0, -14);
        this.root.add(greenhouse);
        this.box(7, .15, 7, 0, .07, 0, stone, greenhouse);
        const glass = new T.MeshPhysicalMaterial({ color: '#b5cdb4', transparent: true, opacity: .17, roughness: .15, metalness: .1, side: T.DoubleSide, depthWrite: false });
        this.materials.push(glass);
        for (const x of [-3.5, 3.5]) {
            this.box(.08, 3, 7, x, 1.5, 0, glass, greenhouse);
            for (let z = -3.5; z <= 3.5; z += 1.75)
                this.box(.10, 3.4, .10, x, 1.7, z, metal, greenhouse);
        }
        this.box(7, 3, .08, 0, 1.5, -3.5, glass, greenhouse);
        for (const x of [-3.5, -1.75, 0, 1.75, 3.5]) {
            this.box(.1, 3, .1, x, 1.5, -3.5, metal, greenhouse);
            const beam = this.box(.1, 3.8, .1, x / 2, 3.8, 0, metal, greenhouse);
            beam.rotation.z = x < 0 ? -.78 : .78;
        }
        for (const sign of [-1, 1]) {
            const roof = this.box(4.2, .06, 7, sign * 1.75, 3.85, 0, glass, greenhouse);
            roof.rotation.z = -sign * .4;
        }
        this.box(.1, .12, 7, 0, 4.65, 0, metal, greenhouse);
        this.label('THE CONSERVATORY', 3.2, .45, 0, 3.1, 3.6, greenhouse);
        for (let x = -2; x <= 2; x += 4) {
            this.box(1.2, 1.2, 4, x, .6, 0, wood, greenhouse);
            for (let z = -1.5; z <= 1.5; z += 1.5) {
                const p = this.potted(-9 + x, 1.25, -14 + z, .8);
                this.wind.push(p);
            }
        }
        const station = this.box(1, .2, .8, -9, 1.2, -12, wood);
        this.bind(station, { kind: 'greenhouse', id: 'morphology', label: 'Examine botanical families' });
        const lab = new T.Group();
        lab.position.set(9, 0, -14);
        this.root.add(lab);
        this.box(7, .12, 7, 0, .06, 0, stone, lab);
        for (const x of [-3.5, 3.5])
            for (const z of [-3.5, 3.5])
                this.box(.2, 3.3, .2, x, 1.65, z, wood, lab);
        this.box(7.6, .25, 7.6, 0, 3.4, 0, wood, lab);
        this.label('BOTANICAL RESEARCH', 3.5, .45, 0, 3, 3.6, lab);
        this.box(5, .16, 1.3, 0, 1.2, -1, wood, lab);
        for (const x of [-2, 2])
            this.box(.18, 1.2, 1, x, .6, -1, wood, lab);
        for (let i = 0; i < 5; i++) {
            this.cylinder(.16, .4, -1.8 + i * .8, 1.48, -1, this.mat(i % 2 ? '#8ca7a0' : '#c3b288'), lab);
            this.cylinder(.06, .18, -1.8 + i * .8, 1.77, -1, metal, lab);
        }
        this.bind(lab, { kind: 'lab', id: 'chromatography', label: 'Open the research notebook' });
        // Low fountain and bench.
        this.cylinder(1, .35, 0, .2, -10, stone);
        this.cylinder(.8, .03, 0, .39, -10, this.mat('#6eaaa1', .1, .4));
        this.cylinder(.1, 1, 0, .7, -10, stone);
        this.cylinder(.45, .13, 0, 1.25, -10, stone);
        this.colliders.push({ x: 0, z: -10, w: 2, d: 2 });
        for (const x of [-9, 9]) {
            this.box(3, .16, 1, x, .6, 0, wood);
            for (const dx of [-1.2, 1.2])
                this.box(.13, .6, .8, x + dx, .3, 0, metal);
            this.box(3, .7, .12, x, 1, .45, wood);
            this.colliders.push({ x, z: 0, w: 3, d: 1.2 });
        }
        this.buildCat(7, .15, 8);
    }
    releaseGroup(g: T.Group) { const geometries = new Set<T.BufferGeometry>(), materials = new Set<T.Material>(); g.traverse(o => { if (o instanceof T.Mesh) {
        geometries.add(o.geometry);
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => materials.add(m));
    } }); geometries.forEach(x => x.dispose()); materials.forEach(x => x.dispose()); this.geometries = this.geometries.filter(x => !geometries.has(x)); this.materials = this.materials.filter(x => !materials.has(x)); g.clear(); }
    updateBeds() { for (const b of this.state.beds) {
        const g = this.beds.get(b.id);
        if (!g)
            continue; /* dispose removed plant resources immediately */
        this.releaseGroup(g);
        if (b.stage < 0)
            continue;
        const p = plantById(b.species), scale = [.04, .12, .3, .55, .8, 1][b.stage], green = this.mat(b.health < 30 ? '#8b8051' : '#54764b'), petal = this.mat(p.color);
        for (let i = 0; i < 9; i++) {
            const plant = new T.Group();
            plant.position.set((i % 3 - 1) * 1.05, .44, (Math.floor(i / 3) - 1) * .68);
            plant.scale.setScalar(scale);
            g.add(plant);
            const h = p.form === 'willow' ? 1.8 : p.form === 'bells' ? 1.6 : 1;
            this.cylinder(.018, h, 0, h / 2, 0, green, plant);
            for (let k = 0; k < 7; k++) {
                const a = k * 2.4;
                const l = this.leaf(plant, 0, .15 + k * h * .10, 0, a, p.form === 'broad' ? .75 : p.form === 'needle' ? .3 : .43, p.form === 'needle' ? .025 : .14, green);
                l.rotation.z = (k % 2 ? 1 : -1) * .7;
            }
            if (b.stage >= 4) {
                if (['spike', 'bells', 'needle'].includes(p.form)) {
                    for (let k = 0; k < 8; k++)
                        this.sphere(.07, Math.sin(k * 2.4) * .07, h - .15 + k * .07, Math.cos(k * 2.4) * .07, petal, plant, [1, 1.4, 1]);
                }
                else {
                    this.sphere(.08, 0, h, 0, this.mat('#d2ae4d'), plant);
                    for (let k = 0; k < 8; k++)
                        this.sphere(.1, Math.sin(k * Math.PI / 4) * .12, h, Math.cos(k * Math.PI / 4) * .12, petal, plant, [.6, .25, 1]);
                }
            }
        }
        g.userData.stage = b.stage;
    } }
    resetCamera() { this.dirty = true; this.movementVelocity.set(0,0); this.yaw = 0; this.pitch = -.06; if (this.world === 'garden') {
        this.camera.position.set(0, 2.1, 9);
        this.yaw = 0;
        this.pitch = -.12;
    }
    else if (this.world === 'study') {
        this.studyCamera(true);
        return;
    }
    else if (this.world === 'quarters' || this.world === 'clinical')
        this.camera.position.set(.2, 2.15, 3.9);
    else
        this.camera.position.set(.2, 2.15, 5.1); this.controls.enabled = false; this.transition = 0; }
    studyCamera(immediate = false) { const views: Record<string, [
        number[],
        number[]
    ]> = { 'Wide room': [[2, 3.1, 4], [-3.5, 1.25, -2]], 'Desk focus': [[-.7, 2.5, -.5], [-3.5, 1.4, -2.5]], Character: [[-2, 2.1, -4], [-3.6, 1.4, -1.65]], Window: [[-5.1, 2.4, 1], [-8.3, 2.7, -3]], Reading: [[-3.6, 2.9, -1.1], [-3.6, 1.35, -2.5]], Companion: [[5.3, 1.3, 5.9], [3.7, .4, 3.9]] }; const [p, l] = views[this.state.settings.camera] || views['Wide room']; this.targetPos.fromArray(p); this.targetLook.fromArray(l); this.controls.enabled = false; if (immediate || this.state.settings.reducedMotion) {
        this.camera.position.copy(this.targetPos);
        this.controls.target.copy(this.targetLook);
        this.controls.enabled = true;
        this.controls.update();
    }
    else
        this.transition = 1; }
    move(forward: number, side: number, dt: number) {
        if (this.world === 'study') return;
        // Frame-rate-independent acceleration/deceleration avoids abrupt keyboard starts.
        const magnitude = Math.hypot(forward, side) || 1;
        const maxSpeed = this.keys.has('shift') ? 4.5 : 2.6;
        const desiredX = side / magnitude * maxSpeed;
        const desiredY = forward / magnitude * maxSpeed;
        const blend = 1 - Math.exp(-11 * dt);
        this.movementVelocity.x += (desiredX - this.movementVelocity.x) * blend;
        this.movementVelocity.y += (desiredY - this.movementVelocity.y) * blend;
        if (this.movementVelocity.lengthSq() < .0002) return;
        this.dirty = true;
        const dx = (-Math.sin(this.yaw) * this.movementVelocity.y + Math.cos(this.yaw) * this.movementVelocity.x) * dt;
        const dz = (-Math.cos(this.yaw) * this.movementVelocity.y - Math.sin(this.yaw) * this.movementVelocity.x) * dt;
        const p = this.camera.position;
        const room = this.world === 'quarters' || this.world === 'clinical';
        const valid = (x: number, z: number) => Math.abs(x) < (this.world === 'garden' ? 17 : room ? 7.55 : 7.4)
            && z > (this.world === 'garden' ? -22 : -6.05)
            && z < (this.world === 'garden' ? 10 : room ? 6.05 : 7)
            && !this.colliders.some(c => Math.abs(x - c.x) < c.w / 2 + .32 && Math.abs(z - c.z) < c.d / 2 + .32);
        if (valid(p.x + dx, p.z)) p.x += dx; else this.movementVelocity.x *= .6;
        if (valid(p.x, p.z + dz)) p.z += dz; else this.movementVelocity.y *= .6;
    }
    teleport(where: string) { this.dirty = true; if (this.world === 'garden') {
        const poses: Record<string, number[]> = { entrance: [0, 2.1, 9], beds: [0, 2.1, 5], greenhouse: [-9, 2.1, -10], lab: [9, 2.1, -10] };
        this.camera.position.fromArray(poses[where] || poses.entrance);
        this.yaw = 0;
        this.pitch = -.14;
    }
    else {
        this.camera.position.set(where === 'door' ? 5.5 : -3, 2.1, where === 'door' ? -4.5 : -4.5);
        this.yaw = 0;
        this.pitch = 0;
    } }
    tick = (now: number) => { if (this.disposed)
        return; if (now - this.lastRender < (this.interactive ? 33 : 250)) {
        this.frame = requestAnimationFrame(this.tick);
        return;
    } this.lastRender = now; const dt = Math.min(.05, (now - (this.last || now)) / 1000); this.last = now; this.time += dt; this.updateDaylight(); if (this.interactive) {
        const forward = Number(this.keys.has('w') || this.keys.has('arrowup')) - Number(this.keys.has('s') || this.keys.has('arrowdown'));
        const side = Number(this.keys.has('d') || this.keys.has('arrowright')) - Number(this.keys.has('a') || this.keys.has('arrowleft'));
        this.move(forward, side, dt);
        this.focusCooldown -= dt;
        if (this.focusCooldown <= 0 && !this.dragging) {
            this.focusCooldown = .15;
            const target = this.pickCenter();
            if (target?.id !== this.hover?.id || target?.kind !== this.hover?.kind) {
                this.hover = target;
                this.onHover(target);
            }
        }
    } if (this.world !== 'study') {
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.set(this.pitch, this.yaw, 0);
    }
    else if (this.transition) {
        this.camera.position.lerp(this.targetPos, Math.min(1, dt * 5));
        this.controls.target.lerp(this.targetLook, Math.min(1, dt * 5));
        this.camera.lookAt(this.controls.target);
        if (this.camera.position.distanceTo(this.targetPos) < .02) {
            this.transition = 0;
            this.controls.enabled = true;
        }
    }
    else
        this.controls.update(); if (!this.state.settings.reducedMotion) {
        if (this.cat)
            this.cat.scale.y = 1 + Math.sin(this.time * 1.9) * .025;
        if (this.avatar)
            this.avatar.rotation.z = Math.sin(this.time * .8) * .008;
        for (const g of this.beds.values())
            g.rotation.z = Math.sin(this.time + g.id) * .008;
        this.root.traverse(o => { if (o.userData.flame)
            o.scale.y = 1.2 + Math.sin(this.time * 9 + o.id) * .4; });
    } if (this.doorOpening) {
        this.doorOpening += dt * 1.5;
        if (this.door)
            this.door.rotation.y = -Math.min(1, this.doorOpening) * 1.2;
        if (this.doorOpening >= 1) {
            this.doorOpening = 0;
            this.onAction({ kind: 'door', id: this.world === 'garden' ? 'library-door' : 'garden-door', label: 'Transition' });
        }
    } if (!this.state.settings.reducedMotion || this.dirty || this.doorOpening || this.transition) {
        this.renderer.render(this.scene, this.camera);
        this.dirty = false;
    } this.frame = requestAnimationFrame(this.tick); };
    dispose() { this.disposed = true; cancelAnimationFrame(this.frame); this.resizeObserver.disconnect(); this.controls.dispose(); window.removeEventListener('keydown', this.keydown); window.removeEventListener('keyup', this.keyup); window.removeEventListener('blur', this.blur); window.removeEventListener('pointerup', this.pointerup); this.renderer.domElement.removeEventListener('pointerdown', this.pointerdown); this.renderer.domElement.removeEventListener('pointermove', this.pointermove); this.renderer.domElement.removeEventListener('webglcontextlost', this.contextlost); this.clear(); this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer.domElement.remove(); }
}
