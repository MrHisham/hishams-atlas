import { useEffect, useRef, useState, lazy, Suspense, type ReactNode } from 'react';
import { BookOpen, Leaf, Headphones, Settings, Timer, ArrowUpRight, Library, Sun, Moon, Search, Upload, ChevronRight, Compass, Check, NotebookPen, FlaskConical, Download, ArrowLeft, Flower2 } from 'lucide-react';
import { AtlasWorld, type Interaction } from './world';
import { initialState, gardenAction, settleFocus, stages, type State, type World, type Book } from './model';
import { attachFile, db, download, loadState, makeBackup, restoreBackup, saveState } from './storage';
import { plants, plantById, type Plant } from './botany';
const Reader = lazy(() => import('./Reader').then(m => ({ default: m.Reader })));
import { Ambience } from './audio';
import {FieldBook} from './FieldBook';
type Panel = 'library' | 'fieldbook' | 'herbarium' | 'study' | 'sound' | 'settings' | 'lab' | 'greenhouse' | null;
export default function App() {
    const [state, setState] = useState<State>(initialState), [ready, setReady] = useState(false), [saveStatus, setSaveStatus] = useState('Opening local atlas…'), [world, setWorld] = useState<World>('library'), [panel, setPanel] = useState<Panel>(null), [hover, setHover] = useState<Interaction | null>(null), [bedId, setBedId] = useState('bed-0'), [plantId, setPlantId] = useState<string | null>(null), [reader, setReader] = useState<string | null>(null), [inspect, setInspect] = useState<string | null>(null), [query, setQuery] = useState(''), [collection, setCollection] = useState('All'), [onlyFavorites, setOnlyFavorites] = useState(false), [toast, setToast] = useState(''), [clock, setClock] = useState(Date.now()), [task, setTask] = useState(''), [showAnswer, setShowAnswer] = useState(false), [menu, setMenu] = useState(false), [restore, setRestore] = useState<string | null>(null), [graphicsError, setGraphicsError] = useState(''), [labRun, setLabRun] = useState(false), [labSample, setLabSample] = useState('peppermint');
    const host = useRef<HTMLDivElement>(null), engine = useRef<AtlasWorld | null>(null), stateRef = useRef(state), audio = useRef(new Ambience()), player = useRef<HTMLAudioElement>(null), [tracks, setTracks] = useState<{
        name: string;
        url: string;
    }[]>([]), [track, setTrack] = useState(0), [playing, setPlaying] = useState(false), [seek, setSeek] = useState(0), [length, setLength] = useState(0), [loop, setLoop] = useState(false), [shuffle, setShuffle] = useState(false);
    const urls = useRef<string[]>([]), toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    stateRef.current = state;
    const notify = (t: string) => { setToast(t); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 4000); };
    const change = (fn: (s: State) => State) => setState(fn);
    const settings = (patch: Partial<State['settings']>) => change(s => ({ ...s, settings: { ...s.settings, ...patch } }));
    useEffect(() => { loadState().then(s => { const q = new URLSearchParams(location.search); if (q.get('graphics') === 'Low')
        s.settings.quality = 'Low'; if (q.get('motion') === 'off')
        s.settings.reducedMotion = true; setState(settleFocus(s)); setReady(true); }).catch(e => setSaveStatus('Storage could not open. Reload before editing: ' + String(e))); }, []);
    useEffect(() => { if (!ready)
        return; setSaveStatus('Saving…'); let current = true; saveState(state).then(() => { if (current)
        setSaveStatus('Saved on this device'); }).catch(e => { if (current)
        setSaveStatus('Save failed — export a backup: ' + String(e)); }); return () => { current = false; }; }, [state, ready]);
    useEffect(() => { if (!ready || !host.current)
        return; try {
        engine.current = new AtlasWorld(host.current, stateRef.current, i => { if (i.kind === 'door') {
            setWorld(i.id === 'garden-door' ? 'garden' : 'library');
            setPanel(null);
        }
        else if (i.kind === 'book')
            setInspect(i.id);
        else if (i.kind === 'bed') {
            setBedId(i.id);
            setPlantId(null);
            setPanel(null);
        }
        else if (i.kind === 'lab') {
            if (i.id === 'context-lost')
                setGraphicsError(i.label);
            else
                setPanel('lab');
        }
        else if (i.kind === 'greenhouse')
            setPanel('greenhouse');
        else
            notify('Your companion curls up beside you.'); }, setHover);
    }
    catch (e) {
        setGraphicsError('3D renderer unavailable: ' + String(e));
    } return () => { engine.current?.dispose(); engine.current = null; }; }, [ready]);
    useEffect(() => { if (engine.current)
        engine.current.build(world); }, [world]);
    useEffect(() => { engine.current?.update(state); document.documentElement.style.fontSize = state.settings.fontSize + 'px'; document.documentElement.dataset.motion = state.settings.reducedMotion ? 'reduced' : 'full'; }, [state]);
    useEffect(() => { if (engine.current) {
        engine.current.interactive = !panel && !reader && !inspect;
        engine.current.keys.clear();
        engine.current.controls.enabled = world === 'study' && !panel && !reader && !inspect;
    } }, [panel, reader, inspect, world]);
    useEffect(() => { const id = setInterval(() => { const now = Date.now(); setClock(now); setState(s => settleFocus(s, now)); }, 1000); return () => clearInterval(id); }, []);
    useEffect(() => { const key = (e: KeyboardEvent) => { if (e.key === 'Escape') {
        setPanel(null);
        setReader(null);
        setInspect(null);
        setPlantId(null);
        setMenu(false);
    } }; window.addEventListener('keydown', key); return () => { window.removeEventListener('keydown', key); audio.current.stop(); urls.current.forEach(URL.revokeObjectURL); clearTimeout(toastTimer.current); }; }, []);
    useEffect(() => { if (player.current)
        player.current.volume = state.settings.volume / 100; audio.current.setVolume(state.settings.volume); }, [state.settings.volume]);
    useEffect(() => { if (player.current && tracks.length) {
        player.current.load();
        if (playing)
            player.current.play().catch(e => { setPlaying(false); notify(String(e)); });
    } }, [track, tracks]);
    useEffect(() => { if (!panel && !reader && !inspect)
        return; const previous = document.activeElement as HTMLElement; const root = document.querySelector<HTMLElement>(reader ? '.reader' : inspect ? '.inspect' : '.workspace'); if (!root)
        return; const focusable = () => Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([hidden]),select,textarea,a[href],summary')).filter(e => e.offsetParent !== null); const first = setTimeout(() => focusable()[0]?.focus(), 0); const trap = (e: KeyboardEvent) => { if (e.key !== 'Tab')
        return; const items = focusable(), at = items.indexOf(document.activeElement as HTMLElement); if (e.shiftKey && (at <= 0)) {
        e.preventDefault();
        items[items.length - 1]?.focus();
    }
    else if (!e.shiftKey && (at === items.length - 1 || at < 0)) {
        e.preventDefault();
        items[0]?.focus();
    } }; document.addEventListener('keydown', trap); return () => { clearTimeout(first); document.removeEventListener('keydown', trap); if (previous?.isConnected)
        previous.focus(); }; }, [panel, reader, inspect]);
    const openPanel = (p: Panel) => { setPanel(x => x === p ? null : p); setMenu(false); setPlantId(null); };
    const go = (w: World) => { setWorld(w); setPanel(null); setMenu(false); setInspect(null); setPlantId(null); };
    const action = (a: 'prepare' | 'sow' | 'water' | 'harvest' | 'day') => { change(s => gardenAction(s, bedId, a)); notify(a === 'day' ? 'A new simulated day. Moisture and growth updated.' : a === 'harvest' ? 'Virtual specimen added to your herbarium.' : a === 'water' ? 'The soil drinks in the water.' : a === 'sow' ? 'A new beginning, tucked into the soil.' : 'The bed is ready for seeds.'); };
    const importBooks = async (files: FileList | null) => { if (!files)
        return; try {
        const added: Book[] = [];
        for (const file of Array.from(files)) {
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!['pdf', 'png', 'jpg', 'jpeg', 'webp', 'txt', 'md'].includes(ext || '')) {
                notify('Unsupported format. Use PDF, image, TXT or Markdown. EPUB is not included.');
                continue;
            }
            const fileId = await attachFile(file);
            added.push({ id: crypto.randomUUID(), title: file.name.replace(/\.[^.]+$/, ''), collection: 'Imported', type: ext === 'pdf' ? 'PDF' : file.type.startsWith('image/') ? 'Image' : 'Note', notes: 'Imported from a local file', progress: 0, fileId, fileType: ext === 'pdf' ? 'application/pdf' : file.type || 'text/plain' });
        }
        change(s => ({ ...s, books: [...s.books, ...added] }));
        notify(`${added.length} local files added. Original files are untouched.`);
    }
    catch (e) {
        notify('Import failed: ' + String(e));
    } };
    const backup = async () => { try {
        download('hishams-atlas-backup.json', await makeBackup(state));
        notify('Backup created, including imported files.');
    }
    catch (e) {
        notify('Backup failed: ' + String(e));
    } };
    const selectedBed = state.beds.find(b => b.id === bedId)!, selectedPlant = plantById(selectedBed.species), selectedBook = state.books.find(b => b.id === inspect), readingBook = state.books.find(b => b.id === reader), plant = plantId ? plantById(plantId) : null;
    const remaining = state.focus.deadline ? Math.max(0, Math.ceil((state.focus.deadline - clock) / 1000)) : state.focus.remaining, fmt = (v: number) => `${Math.floor(v / 60).toString().padStart(2, '0')}:${(v % 60).toString().padStart(2, '0')}`;
    const collections = ['All', ...new Set(state.books.map(b => b.collection))], books = state.books.filter(b => (collection === 'All' || b.collection === collection) && (!onlyFavorites || b.favorite) && [b.title, b.collection, b.notes, ...(b.tags || [])].join(' ').toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title));
    const dueCard = state.cards.find(c => c.due <= clock);
    return <div className="app"><div className="world" ref={host}/><div className="vignette"/>
 <header className="topbar"><button className="identity" onClick={() => { setPanel(null); setMenu(false); }}><span className="emblem">A<span>✦</span></span><span><strong>Hisham’s Atlas</strong><small>A PLACE FOR CURIOUS MINDS</small></span></button><div className="world-switch" aria-label="World modes"><button className={world === 'library' ? 'active' : ''} onClick={() => go('library')}><Compass size={15}/>Explore world</button><button className={world === 'study' ? 'active' : ''} onClick={() => go('study')}><Sun size={15}/>Cinematic study</button><button aria-label="Medical Garden information" className={world === 'garden' ? 'active garden-link' : 'garden-link'} onClick={() => world === 'garden' ? openPanel('fieldbook') : notify('Enter through the Medical Garden door at the rear right of the library. Use “Find garden door” below.')}><Leaf size={15}/>Medical garden</button></div><button className="menu-toggle" aria-label="Open navigation" onClick={() => setMenu(!menu)}>☰</button><button className="icon-button night" aria-label="Toggle day and night" onClick={() => settings({ night: !state.settings.night })}>{state.settings.night ? <Moon size={18}/> : <Sun size={18}/>}</button></header>
 <nav className={`rail ${menu ? 'expanded' : ''}`} aria-label="Workspace"><Rail icon={<Library />} label="Library" active={panel === 'library'} onClick={() => openPanel('library')}/><Rail icon={<Flower2 />} label="Field book" active={panel === 'fieldbook'} onClick={() => openPanel('fieldbook')}/><Rail icon={<NotebookPen />} label="Herbarium" active={panel === 'herbarium'} onClick={() => openPanel('herbarium')}/><div className="mobile-worlds"><button onClick={() => go('library')}>Explore world</button><button onClick={() => go('study')}>Cinematic study</button></div><span className="rail-line"/><Rail icon={<Timer />} label="Study tools" active={panel === 'study'} onClick={() => openPanel('study')}/><Rail icon={<Headphones />} label="Soundscape" active={panel === 'sound'} onClick={() => openPanel('sound')}/><Rail icon={<Settings />} label="Settings" active={panel === 'settings'} onClick={() => openPanel('settings')}/><small>ATLAS V</small></nav>
 <div className="location"><span className="eyebrow">{world === 'garden' ? 'THE LIVING COLLECTION' : world === 'study' ? 'MAKE ROOM FOR FOCUS' : 'YOUR PRIVATE KNOWLEDGE UNIVERSE'}</span><h1>{world === 'garden' ? 'The medical garden.' : world === 'study' ? 'Stay a little longer.' : 'A world of your own.'}</h1><p>{world === 'garden' ? 'A little care. A new discovery.' : world === 'study' ? 'Settle in. Let the rest of the world wait.' : 'Follow your curiosity, one page at a time.'}</p><span className="location-tag"><span className="dot"/>{world === 'garden' ? `Botanical garden · Day ${state.day}` : world === 'study' ? 'Cinematic study · The reading room' : 'Explore world · The reading room'}</span></div>
 <div className="world-bottom"><div className="chapter"><small>{world === 'garden' ? '02 / THE GARDEN' : '01 / THE READING ROOM'}</small><span>{world === 'garden' ? 'Where knowledge takes root.' : 'Collected thoughts. Endless possibilities.'}</span></div><div className="context">{hover ? <button onClick={() => engine.current?.act(hover)}><span className="keycap">E</span>{hover.label}<ChevronRight size={16}/></button> : <span>Drag to look around <i>·</i> WASD to walk <i>·</i> R to reset</span>}</div><div className="saved"><span className="dot"/>{saveStatus}</div></div>
 {!panel && world === 'library' && <div className="world-actions"><button onClick={() => engine.current?.teleport('shelves')}><BookOpen size={16}/>Approach the shelves</button><button onClick={() => { engine.current?.teleport('door'); notify('Click the Medical Garden door to enter.'); }}>Find garden door <ArrowUpRight size={16}/></button></div>}
 {!panel && world === 'study' && <div className="study-strip"><span className="eyebrow">A MOMENT OF FOCUS</span><strong>{fmt(remaining)}</strong><button className="primary" onClick={() => change(s => ({ ...s, focus: s.focus.deadline ? { ...s.focus, deadline: null, remaining: Math.max(0, Math.ceil((s.focus.deadline - Date.now()) / 1000)) } : { ...s.focus, remaining: s.focus.remaining || s.focus.duration * 60, deadline: Date.now() + (s.focus.remaining || s.focus.duration * 60) * 1000 } }))}>{state.focus.deadline ? 'Pause session' : 'Begin session'}</button><select aria-label="Cinematic camera" value={state.settings.camera} onChange={e => settings({ camera: e.target.value })}>{['Wide room', 'Desk focus', 'Character', 'Window', 'Reading', 'Companion'].map(x => <option key={x}>{x}</option>)}</select><button onClick={() => openPanel('study')}>Study tools ↗</button></div>}
 {!panel && world === 'garden' && <><div className="garden-destinations"><button onClick={() => engine.current?.teleport('beds')}>Cultivation beds</button><button onClick={() => engine.current?.teleport('greenhouse')}>Conservatory</button><button onClick={() => engine.current?.teleport('lab')}>Research pavilion</button><button onClick={() => { engine.current?.teleport('entrance'); notify('Turn around to click the return gate, or use the accessible return below.'); }}>Return gate</button><button onClick={() => go('library')}>Accessible return</button></div><section className="garden-tools"><div><small>FIELDWORK / {bedId.replace('bed-', 'BED ')}</small><h3>{selectedPlant.common}{selectedPlant.toxic ? ' ⚠' : ''}</h3><p>{selectedBed.stage < 0 ? selectedBed.prepared ? 'Prepared soil' : 'Unprepared soil' : stages[selectedBed.stage]} · Moisture {selectedBed.moisture}% · Health {selectedBed.health}%</p></div><div className="row"><button disabled={selectedBed.stage >= 0 || selectedBed.prepared} onClick={() => action('prepare')}>♧ Prepare</button><button disabled={!selectedBed.prepared || selectedBed.stage >= 0} onClick={() => action('sow')}>✦ Sow</button><button disabled={selectedBed.stage < 0 || selectedBed.moisture >= 100} onClick={() => action('water')}>♧ Water</button><button disabled={selectedBed.stage !== 5} onClick={() => action('harvest')}>{selectedPlant.toxic ? 'Record observation' : 'Collect specimen'}</button><button onClick={() => action('day')}>Next day →</button><button onClick={() => { setPanel('fieldbook'); setPlantId(selectedPlant.id); }}>Examine <Leaf size={14}/></button></div><small>SIMULATION · Growth is accelerated and simplified; not cultivation advice.</small></section></>}
 <div className="touch-move" aria-label="Movement controls"><button aria-label="Walk forward" onPointerDown={() => engine.current?.keys.add('w')} onPointerUp={() => engine.current?.keys.clear()} onPointerLeave={() => engine.current?.keys.clear()}>↑</button><div><button aria-label="Walk left" onPointerDown={() => engine.current?.keys.add('a')} onPointerUp={() => engine.current?.keys.clear()} onPointerLeave={() => engine.current?.keys.clear()}>←</button><button aria-label="Walk backward" onPointerDown={() => engine.current?.keys.add('s')} onPointerUp={() => engine.current?.keys.clear()} onPointerLeave={() => engine.current?.keys.clear()}>↓</button><button aria-label="Walk right" onPointerDown={() => engine.current?.keys.add('d')} onPointerUp={() => engine.current?.keys.clear()} onPointerLeave={() => engine.current?.keys.clear()}>→</button></div></div>
 {panel && <section className={`workspace ${panel === 'library' || panel === 'fieldbook' ? 'wide' : ''}`} aria-label={panel} role="region"><header><div><small>HISHAM’S ATLAS / WORKSPACE</small><h2>{{ library: 'Your collected world.', fieldbook: 'The botanical atlas.', herbarium: 'The herbarium.', study: 'A practice of attention.', sound: 'Set the atmosphere.', settings: 'Make yourself at home.', lab: 'The research notebook.', greenhouse: 'Inside the conservatory.' }[panel]}</h2></div><button className="close" aria-label="Close workspace" onClick={() => { setPanel(null); setPlantId(null); }}>✕</button></header><div className="workspace-content">
 {panel === 'library' && <><div className="section-top"><p className="muted">{state.books.length} resources · {collections.length - 1} collections<br />The supplied collection contains titles and metadata. Attach your own files.</p><label className="button primary"><Upload size={16}/> Import books<input hidden type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md" onChange={e => { importBooks(e.target.files); e.target.value = ''; }}/></label></div><div className="search-row"><Search size={18}/><input aria-label="Search catalogue" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a title, a thought, a subject…"/><select aria-label="Collection filter" value={collection} onChange={e => setCollection(e.target.value)}>{collections.map(c => <option key={c}>{c}</option>)}</select><button onClick={() => setOnlyFavorites(!onlyFavorites)}>{onlyFavorites ? '★ Favorites' : '☆ All'}</button></div><div className="book-grid">{books.map((b, i) => <div className="book-card" key={b.id}><button className="book-open" onClick={() => setReader(b.id)}><div className={`cover cover-${i % 6}`}><small>HISHAM’S ATLAS</small><span className="cover-line"/><strong>{b.title}</strong><span className="cover-ornament">✦</span><small>{b.fileId ? 'YOUR LOCAL FILE' : 'CATALOGUE RECORD'}</small></div><h3>{b.title}</h3><p>{b.collection}</p><div className="progress"><span style={{ width: b.progress + '%' }}/></div></button><button className="book-manage" aria-label={'Inspect ' + b.title} onClick={() => setInspect(b.id)}>Inspect & organize ↗</button></div>)}</div>{!books.length && <div className="empty">No matching resources.</div>}<div className="row"><button onClick={() => { const name = prompt('Title for a new note or resource'); if (name?.trim())
            change(s => ({ ...s, books: [...s.books, { id: crypto.randomUUID(), title: name.trim(), collection: 'My notes', type: 'Note', notes: '', progress: 0 }] })); }}>＋ New resource</button><label className="button">Import Atlas 4 metadata<input hidden type="file" accept="application/json" onChange={async (e) => { try {
            const raw = JSON.parse(await e.target.files![0].text());
            const list = Array.isArray(raw) ? raw : raw.resources || raw.catalogue?.resources;
            if (!Array.isArray(list))
                throw Error('Expected resources array');
            const safe: Book[] = list.map((x: Record<string, unknown>) => { if (typeof x.title !== 'string')
                throw Error('Missing title'); return { id: typeof x.id === 'string' ? x.id : crypto.randomUUID(), title: x.title, collection: typeof x.collection === 'string' ? x.collection : 'Imported', notes: typeof x.notes === 'string' ? x.notes : '', type: typeof x.type === 'string' ? x.type : 'Book', progress: 0 }; });
            change(s => ({ ...s, books: [...s.books, ...safe.filter(b => !s.books.some(x => x.id === b.id))] }));
            notify('Metadata merged without replacing existing records. Original JSON is unchanged.');
        }
        catch (e) {
            notify(String(e));
        } }}/></label><button onClick={backup}><Download size={16}/>Backup everything</button></div></>}
 {panel === 'fieldbook' && <FieldBook state={state} change={change} selectedId={plantId} select={setPlantId} onReader={setReader} onBed={id=>{setBedId(id);setPanel(null)}} notify={notify}/>}
 {panel === 'herbarium' && <><div className="section-top"><p className="muted">{state.specimens.length} virtual records · Search, observe, connect.</p><input aria-label="Search herbarium" placeholder="Search species…" value={query} onChange={e => setQuery(e.target.value)}/></div>{!state.specimens.length && <div className="empty"><Leaf size={40}/><h3>Your first discovery is waiting.</h3><p>Prepare a bed, sow, water and advance five simulated days. Collect a mature specimen to begin.</p><button onClick={() => { setPanel(null); notify('Find the single garden door at the rear right of the library.'); }}>Return to the world</button></div>}{state.specimens.filter(h => plantById(h.species).common.toLowerCase().includes(query.toLowerCase())).map((h, i) => <article className="specimen" key={h.id}><Botanical p={plantById(h.species)}/><div><small>VIRTUAL HERBARIUM / {String(i + 1).padStart(3, '0')}</small><h3>{plantById(h.species).common}</h3><i>{plantById(h.species).latin}</i><p>Simulated day {h.day} · {h.bed} · {h.part}<br />{h.stage < 0 ? 'Recognition record' : stages[h.stage]} · {h.confidence}</p><textarea aria-label="Specimen observations" value={h.observations} onChange={e => change(s => ({ ...s, specimens: s.specimens.map(x => x.id === h.id ? { ...x, observations: e.target.value } : x) }))} placeholder="Collection observations…"/><button onClick={() => { setPanel('fieldbook'); setPlantId(h.species); }}>Open species record ↗</button></div></article>)}</>}
 {panel === 'study' && <><div className="focus-card"><small>{state.focus.mode.toUpperCase()} / TIME WELL SPENT</small><strong>{fmt(remaining)}</strong><div className="row"><button className="primary" onClick={() => change(s => ({ ...s, focus: s.focus.deadline ? { ...s.focus, deadline: null, remaining: Math.max(0, Math.ceil((s.focus.deadline - Date.now()) / 1000)) } : { ...s.focus, deadline: Date.now() + (s.focus.remaining || s.focus.duration * 60) * 1000, remaining: s.focus.remaining || s.focus.duration * 60 } }))}>{state.focus.deadline ? 'Pause' : 'Begin'}</button><button onClick={() => change(s => ({ ...s, focus: { ...s.focus, deadline: null, remaining: s.focus.duration * 60 } }))}>Reset</button></div><div className="row">{[['Focus', 25], ['Short break', 5], ['Long break', 15]].map(([m, n]) => <button key={m} onClick={() => change(s => ({ ...s, focus: { mode: String(m), duration: Number(n), remaining: Number(n) * 60, deadline: null } }))}>{m}</button>)}<label>Minutes<input aria-label="Focus duration" type="number" min="1" max="180" value={state.focus.duration} onChange={e => { const duration = Math.max(1, Math.min(180, Number(e.target.value) || 1)); change(s => ({ ...s, focus: { ...s.focus, duration, remaining: duration * 60, deadline: null } })); }}/></label></div></div><div className="stats"><div><strong>{state.sessions.filter(x => x.mode === 'Focus').length}</strong><small>FOCUS SESSIONS</small></div><div><strong>{state.sessions.filter(x => x.mode === 'Focus').reduce((a, x) => a + x.minutes, 0)}</strong><small>MINUTES COLLECTED</small></div></div><h3>One thing at a time.</h3><form className="row" onSubmit={e => { e.preventDefault(); if (!task.trim())
            return; change(s => ({ ...s, tasks: [...s.tasks, { id: crypto.randomUUID(), text: task.trim(), done: false }] })); setTask(''); }}><input aria-label="New task" value={task} onChange={e => setTask(e.target.value)} placeholder="What would you like to work on?"/><button type="submit">＋</button></form>{state.tasks.map(t => <div className="task" key={t.id}><button aria-label={'Complete ' + t.text} onClick={() => change(s => ({ ...s, tasks: s.tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x) }))}>{t.done ? <Check size={18}/> : <span className="checkbox"/>}</button><span className={t.done ? 'done' : ''}>{t.text}</span><button aria-label={'Remove ' + t.text} onClick={() => change(s => ({ ...s, tasks: s.tasks.filter(x => x.id !== t.id) }))}>×</button></div>)}<h3>Flashcard practice</h3>{dueCard ? <article className="annotation"><p>{dueCard.front}</p>{showAnswer && <blockquote>{dueCard.back}</blockquote>}<button onClick={() => setShowAnswer(true)}>Reveal answer</button>{showAnswer && <div className="row">{[['Again', 0], ['Remembered', 1], ['Easy', 3]].map(([label, days]) => <button key={label} onClick={() => { change(s => ({ ...s, cards: s.cards.map(c => c.id === dueCard.id ? { ...c, interval: Number(days), due: Date.now() + Number(days) * 86400000 + (days === 0 ? 60000 : 0) } : c) })); setShowAnswer(false); }}>{label}</button>)}</div>}</article> : <p className="muted">No cards due. Create flashcards from your reading desk.</p>}<details><summary>Session history ({state.sessions.length})</summary>{state.sessions.slice().reverse().map((s, i) => <p key={i}>{s.mode} · {s.minutes} min · {new Date(s.at).toLocaleString()}</p>)}</details></>}
 {panel === 'sound' && <><p className="intro">A soundtrack for your own small world.</p><label className="button primary"><Upload size={16}/>Choose local audio<input hidden type="file" accept="audio/*" multiple onChange={e => { const loaded = Array.from(e.target.files || []).map(f => { const url = URL.createObjectURL(f); urls.current.push(url); return { name: f.name, url }; }); setTracks(t => [...t, ...loaded]); }}/></label><div className="audio-art"><Headphones size={52}/><span>THE ATLAS SESSIONS</span></div><h3>{tracks[track]?.name || 'Bring a song you love.'}</h3><div className="row"><button disabled={!tracks.length} onClick={() => setTrack(i => (i - 1 + tracks.length) % tracks.length)}>Previous</button><button className="primary" disabled={!tracks.length} onClick={async () => { if (!player.current)
            return; if (playing) {
            player.current.pause();
            setPlaying(false);
        }
        else
            try {
                await player.current.play();
                setPlaying(true);
            }
            catch (e) {
                notify(String(e));
            } }}>{playing ? 'Pause' : 'Play'}</button><button disabled={!tracks.length} onClick={() => setTrack(i => (i + 1) % tracks.length)}>Next</button></div><input aria-label="Music position" type="range" min="0" max={length || 1} step=".1" value={seek} onChange={e => { const n = Number(e.target.value); if (player.current)
            player.current.currentTime = n; setSeek(n); }}/><small>{fmt(Math.floor(seek))} / {fmt(Math.floor(length))}</small><div className="row"><label><input type="checkbox" checked={loop} onChange={e => setLoop(e.target.checked)}/>Loop</label><label><input type="checkbox" checked={shuffle} onChange={e => setShuffle(e.target.checked)}/>Shuffle</label></div><ol className="playlist">{tracks.map((t, i) => <li key={t.url}><button onClick={() => setTrack(i)} className={track === i ? 'active' : ''}>{t.name}</button></li>)}</ol><h3>Outside the window</h3><p className="muted">Original synthesized ambience. Sound begins when you choose a soundscape.</p><div className="row">{['Off', 'Rain', 'Wind', 'Fireplace'].map(kind => <button key={kind} className={state.settings.ambience === kind ? 'active' : ''} onClick={async () => { settings({ ambience: kind }); try {
            await audio.current.play(kind, state.settings.volume);
        }
        catch (e) {
            notify(String(e));
        } }}>{kind}</button>)}</div><label>Mix volume<input aria-label="Audio volume" type="range" min="0" max="100" value={state.settings.volume} onChange={e => settings({ volume: Number(e.target.value) })}/></label><p className="muted">Audio files stay on your device and must be selected again after reload. Saved ambience is resumed by clicking its button.</p></>}
 {panel === 'settings' && <><p className="muted">A few small adjustments to make this place yours.</p><h3>The world</h3><label>Graphics quality<select value={state.settings.quality} onChange={e => settings({ quality: e.target.value })}>{['Low', 'Medium', 'High', 'Ultra'].map(x => <option key={x}>{x}</option>)}</select></label><label><input type="checkbox" checked={state.settings.night} onChange={e => settings({ night: e.target.checked })}/>Evening lighting</label><label><input type="checkbox" checked={state.settings.reducedMotion} onChange={e => settings({ reducedMotion: e.target.checked })}/>Reduce ambient motion</label><label>Text size<input type="range" min="14" max="22" value={state.settings.fontSize} onChange={e => settings({ fontSize: Number(e.target.value) })}/></label><h3>Your study companion</h3><div className="row"><label>Outfit<input aria-label="Outfit color" type="color" value={state.settings.outfit} onChange={e => settings({ outfit: e.target.value })}/></label><label>Hair<input aria-label="Hair color" type="color" value={state.settings.hair} onChange={e => settings({ hair: e.target.value })}/></label><label>Skin<input aria-label="Skin tone" type="color" value={state.settings.skin} onChange={e => settings({ skin: e.target.value })}/></label></div><label>Cat appearance<select value={state.settings.companion} onChange={e => settings({ companion: e.target.value })}>{['Ginger', 'Cream', 'Sage'].map(x => <option key={x}>{x}</option>)}</select></label><h3>Accessibility & data</h3><label><input type="checkbox" checked={state.settings.gardenShortcut} onChange={e => settings({ gardenShortcut: e.target.checked })}/>Enable direct garden navigation</label>{state.settings.gardenShortcut && <button onClick={() => go('garden')}>Enter garden directly</button>}<div className="row"><button onClick={backup}><Download size={16}/>Export full backup</button><label className="button"><Upload size={16}/>Restore backup<input hidden type="file" accept="application/json" onChange={async (e) => { const f = e.target.files?.[0]; if (f)
            setRestore(await f.text()); e.target.value = ''; }}/></label></div>{restore && <div className="notice"><p>Restore replaces the active atlas. An independent snapshot of current metadata and its file blobs will remain in this browser. Export a portable backup first.</p><button onClick={async () => { try {
            await backup();
            const next = await restoreBackup(restore, state);
            setState(next);
            setRestore(null);
            engine.current?.update(next);
            engine.current?.build(world);
            notify('Backup verified and restored.');
        }
        catch (e) {
            notify('Restore rejected: ' + String(e));
        } }}>Verify and restore</button><button onClick={() => setRestore(null)}>Cancel</button></div>}<button onClick={() => { settings(initialState().settings); notify('Appearance defaults restored; your collection is unchanged.'); }}>Restore appearance defaults</button><details><summary>Controls & privacy</summary><p>WASD or arrows to walk; drag to look; click objects; E activates the object under the pointer; R resets camera; Escape closes panels. Study mode uses drag to orbit and scroll to zoom. All personal data is stored in IndexedDB under this browser’s origin. Export backups regularly. No account, analytics or cloud storage.</p></details></>}
 {panel === 'greenhouse' && <><p className="intro">Observe before you name.</p><p>Compare the families represented in the garden. These images are stylized teaching motifs and cannot authenticate real material.</p><div className="plant-grid">{plants.slice(0, 4).map(p => <button className="plant-card" key={p.id} onClick={() => { setPanel('fieldbook'); setPlantId(p.id); }}><Botanical p={p}/><h3>{p.common}</h3><i>{p.family}</i></button>)}</div><h3>A botanical authentication checklist</h3><p>Document provenance, scientific name, plant part, macroscopic observations and the literature consulted. Expert comparison and validated methods are required for real-world authentication.</p><button onClick={() => { setPanel('lab'); setLabRun(false); }}>Open the research notebook <ArrowUpRight size={16}/></button></>}
 {panel === 'lab' && <><span className="badge">TEACHING SIMULATION / SYNTHETIC DATA</span><p className="intro">A pattern is the beginning of a question.</p><p>Explore how two separated signals might appear in a chromatogram. These curves are mathematical examples and contain no measurements of the selected plant.</p><label>Notebook context<select value={labSample} onChange={e => { setLabSample(e.target.value); setLabRun(false); }}>{plants.filter(p => !p.toxic && !p.recognitionOnly).map(p => <option key={p.id} value={p.id}>{p.common}</option>)}</select></label><button className="primary" onClick={() => setLabRun(true)}><FlaskConical size={16}/>Generate teaching trace</button>{labRun && <><svg className="chromatogram" viewBox="0 0 600 220" role="img" aria-label="Synthetic chromatogram with two simulated peaks"><path d="M45 20V180H580" fill="none" stroke="currentColor"/><path d={'M' + Array.from({ length: 500 }, (_, i) => `${45 + i},${175 - 115 * Math.exp(-(((i - 140) / 18) ** 2)) - 75 * Math.exp(-(((i - 330) / 28) ** 2))}`).join(' L')} fill="none" stroke="#73977c" strokeWidth="3"/><text x="220" y="210">Arbitrary time units</text><text x="60" y="25">Synthetic response</text></svg><p className="muted">Peak position and shape alone do not identify a compound. No extraction recipe or analytical result is implied.</p><button onClick={() => { change(s => ({ ...s, plantNotes: { ...s.plantNotes, [labSample]: (s.plantNotes[labSample] || '') + '\nTeaching chromatogram viewed: two synthetic peaks; no experimental identification.' } })); notify('Simulation observation added to the botanical notebook.'); }}>Record observation</button></>}<h3>Compound study: (−)-menthol</h3><p>C₁₀H₂₀O · Monoterpene alcohol · PubChem CID 16666</p><a href="https://pubchem.ncbi.nlm.nih.gov/compound/l-Menthol" target="_blank" rel="noreferrer">Verified identity & stereochemistry at PubChem ↗</a><p className="muted">The molecular structure viewer and the broader compound-class curriculum remain planned.</p></>}
 </div></section>}
 {selectedBook && <div className="modal-backdrop"><section className="inspect modal" role="dialog" aria-modal="true" aria-label="Book inspection"><header><span className="eyebrow">FROM YOUR SHELF</span><button aria-label="Close inspection" onClick={() => setInspect(null)}>✕</button></header><div className="inspection-book"><BookPreview book={selectedBook}/></div><div className="inspection-meta"><small>{selectedBook.collection}</small><h2>{selectedBook.title}</h2><p>{selectedBook.notes}</p><label>Collection<input aria-label="Edit collection" value={selectedBook.collection} onChange={e => change(s => ({ ...s, books: s.books.map(b => b.id === selectedBook.id ? { ...b, collection: e.target.value } : b) }))}/></label><label>Tags<input placeholder="Separate with commas" value={(selectedBook.tags || []).join(',')} onChange={e => change(s => ({ ...s, books: s.books.map(b => b.id === selectedBook.id ? { ...b, tags: e.target.value.split(',') } : b) }))}/></label><div className="row"><button className="primary" onClick={() => { setReader(selectedBook.id); setInspect(null); }}>Open reading desk <ArrowUpRight size={16}/></button><button onClick={() => change(s => ({ ...s, books: s.books.map(b => b.id === selectedBook.id ? { ...b, favorite: !b.favorite } : b) }))}>{selectedBook.favorite ? '★ Favorite' : '☆ Favorite'}</button><label className="button">Attach PDF<input hidden type="file" accept="application/pdf" onChange={async (e) => { const file = e.target.files?.[0]; if (!file)
        return; try {
        const id = await attachFile(file);
        change(s => ({ ...s, books: s.books.map(b => b.id === selectedBook.id ? { ...b, fileId: id, fileType: 'application/pdf' } : b) }));
        notify('PDF attached.');
    }
    catch (e) {
        notify(String(e));
    } }}/></label></div><h4>Backlinks</h4>{state.links.filter(l => l.to === selectedBook.id).map(l => <button key={l.from} onClick={() => { setInspect(null); setPanel('fieldbook'); setPlantId(l.from); }}>{plantById(l.from)?.common || l.from} ↗</button>)}<button onClick={() => setInspect(null)}>Return to the shelf</button></div></section></div>}
 {readingBook && <Suspense fallback={<div className="loading"><h2>Opening reading desk…</h2></div>}><Reader book={readingBook} state={state} change={change} close={() => setReader(null)}/></Suspense>}
 {graphicsError && <div className="graphics-error" role="alert"><p>{graphicsError}</p><button onClick={() => openPanel('library')}>Open catalogue</button><button onClick={() => location.reload()}>Reload graphics</button></div>}
 {!ready && <div className="loading"><span className="emblem">A</span><h2>Opening your atlas…</h2><p>{saveStatus}</p></div>}
 <audio ref={player} src={tracks[track]?.url} loop={loop} onTimeUpdate={() => setSeek(player.current?.currentTime || 0)} onLoadedMetadata={() => setLength(Number.isFinite(player.current?.duration) ? player.current!.duration : 0)} onEnded={() => { if (tracks.length > 1)
        setTrack(i => shuffle ? (i + 1 + Math.floor(Math.random() * (tracks.length - 1))) % tracks.length : (i + 1) % tracks.length);
    else
        setPlaying(false); }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
 {toast && <div className="toast" role="status">{toast}</div>}
 </div>;
}
function Rail({ icon, label, active, onClick }: {
    icon: ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}) { return <button className={active ? 'active' : ''} aria-label={label} title={label} onClick={onClick}>{icon}<span>{label}</span></button>; }
function PlantPage({ p }: {
    p: Plant;
}) { return <><div className="plant-heading"><Botanical p={p}/><div><small>BOTANICAL STUDY / {p.family.toUpperCase()}</small><h2>{p.common}</h2><i>{p.latin}</i><p>Study material: {p.part}</p></div></div>{p.toxic && <p className="warning">{p.safety}</p>}<p>{p.identity}</p><dl><dt>Traditional use</dt><dd>{p.traditional}</dd><dt>Human evidence</dt><dd>{p.human}</dd><dt>Safety & interactions</dt><dd>{p.safety}</dd><dt>Chemistry focus</dt><dd>{p.chemistry}</dd><dt>Quality control</dt><dd>Identity, provenance, contamination and preparation must be evaluated. This entry is not a pharmacopoeial specification.</dd><dt>In vitro / animal evidence</dt><dd>Not reviewed in this edition. No efficacy inference is made.</dd></dl><div className="source"><small>SOURCE & REVIEW</small><p><a href={p.source} target="_blank" rel="noreferrer">{p.organization} · {p.common} ↗</a></p><small>Accessed 29 October 2026 · Evidence summary<br />{p.review}. Publication year: consult source.</small></div></>; }
export function Botanical({ p }: {
    p: Plant;
}) { if(!['peppermint','chamomile','lavender','rosemary','milkthistle','turmeric','willow','foxglove'].includes(p.id)) return <svg className="botanical" viewBox="0 0 180 220" role="img" aria-label="Symbolic study plate; not a botanical identification image"><rect x="20" y="20" width="140" height="180" rx="60" fill="none" stroke="#a6b193"/><text x="90" y="100" textAnchor="middle" fill="#7b906c" fontFamily="Georgia" fontSize="44">{p.common.split(' ').map(w=>w[0]).slice(0,2).join('')}</text><text x="90" y="135" textAnchor="middle" fill="#8a987b" fontSize="9">RECOGNITION RECORD</text><text x="90" y="155" textAnchor="middle" fill="#8a987b" fontSize="8">NOT AN IDENTIFICATION PLATE</text></svg>; const spike = ['spike', 'bells', 'needle', 'willow'].includes(p.form); return <svg className="botanical" viewBox="0 0 180 220" role="img" aria-label={`Stylized ${p.common} illustration`}><path d="M92 202Q80 125 97 38" fill="none" stroke="#68795a" strokeWidth="2"/>{Array.from({ length: 7 }, (_, i) => { const y = 175 - i * 19, side = i % 2 ? -1 : 1; return <g key={i} transform={`translate(91 ${y}) scale(${side} 1) rotate(${-15 - i * 3})`}><path d={`M0 0Q${p.form === 'needle' ? 15 : 42} -30 ${p.form === 'needle' ? 38 : 53} -12Q30 15 0 0`} fill={i % 2 ? '#8c9a75' : '#708665'} stroke="#586c50" strokeWidth=".7"/><path d="M0 0L43 -11" stroke="#b4bb8c" strokeWidth=".6"/></g>; })}{spike ? Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={94 + (i % 2 ? -6 : 6)} cy={35 + i * 5} rx={p.form === 'bells' ? 8 : 5} ry="7" fill={p.color} stroke="#81715f" strokeWidth=".5"/>) : <g transform="translate(97 35)">{Array.from({ length: 10 }, (_, i) => <ellipse key={i} cy="-14" rx="5" ry="13" transform={`rotate(${i * 36})`} fill={p.color} stroke="#ae9d78" strokeWidth=".5"/>)}<circle r="8" fill="#c2a154"/></g>}<path d="M89 202l-10 11m12-11 5 12m-6-13 17 10" stroke="#aa9270" fill="none"/></svg>; }
function BookPreview({ book }: {
    book: Book;
}) { const ref = useRef<HTMLDivElement>(null); useEffect(() => { if (!ref.current)
    return; /* dedicated, disposable Three scene with orbit/zoom */ /* dedicated, disposable Three scene with orbit/zoom */ let instance: AtlasWorld | undefined; try {
    const s = initialState();
    s.books = [book];
    instance = new AtlasWorld(ref.current, s, () => { }, () => { });
    instance.clear();
    instance.world = 'study';
    instance.scene.background = null;
    instance.root.add(new (T.HemisphereLight)('#ffffff', '#50412e', 3));
    const mesh = instance.book(book, 0);
    mesh.scale.setScalar(4);
    instance.root.add(mesh);
    instance.camera.position.set(1.1, .3, 3.4);
    instance.controls.target.set(0, 0, 0);
    instance.controls.enabled = true;
    instance.controls.minDistance = 1.8;
    instance.controls.maxDistance = 6;
    instance.camera.lookAt(0, 0, 0);
}
catch { } return () => instance?.dispose(); }, [book.id]); return <><div ref={ref} className="book-preview"/><small>Drag to rotate · Scroll to zoom</small></>; }
import * as T from 'three';
