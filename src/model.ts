import { z } from 'zod';
import catalogue from './catalogue.json';
export type World = 'library' | 'study' | 'garden' | 'quarters' | 'clinical';
export interface Book {
    id: string;
    title: string;
    collection: string;
    type: string;
    notes: string;
    subtitle?: string;
    url?: string;
    progress: number;
    favorite?: boolean;
    tags?: string[];
    fileId?: string;
    fileType?: string;
    page?: number;
    bookmarks?: number[];
}
export interface Annotation {
    id: string;
    bookId: string;
    page: number;
    text: string;
    quote: string;
    rect?: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    created: string;
}
export interface Bed {
    id: string;
    species: string;
    stage: number;
    moisture: number;
    age: number;
    health: number;
    harvests: number;
    prepared: boolean;
}
export interface Specimen {
    id: string;
    species: string;
    day: number;
    part: string;
    bed: string;
    stage: number;
    observations: string;
    confidence: string;
    links: string[];
}
export interface Task {
    id: string;
    text: string;
    done: boolean;
}
export interface Card {
    id: string;
    front: string;
    back: string;
    due: number;
    interval: number;
    source: string;
}
export interface LifeActivity { id: string; title: string; category: string; date: string; minutes: number; xp: number; }
export interface LifeGoal { id: string; title: string; category: string; done: boolean; created: string; }
export interface DailyRoutine { id: string; title: string; time: string; category: string; completedOn: string[]; }
export interface Quarters { intention: string; journal: string; routines: DailyRoutine[]; }
export const emptyQuarters = (): Quarters => ({ intention: '', journal: '', routines: [
 { id: 'morning-plan', title: 'Plan my day', time: '08:00', category: 'Personal', completedOn: [] },
 { id: 'study-session', title: 'Focused pharmacy study', time: '10:00', category: 'Learning', completedOn: [] },
 { id: 'evening-reflect', title: 'Evening reflection', time: '20:00', category: 'Wellbeing', completedOn: [] }
] });
export interface ClinicalAttempt { id: string; caseId: string; selected: number[]; correct: number; total: number; completedAt: string; }
export interface Life { activities: LifeActivity[]; goals: LifeGoal[]; quarters: Quarters; clinicalAttempts: ClinicalAttempt[]; }
export const emptyLife = (): Life => ({ activities: [], goals: [], quarters: emptyQuarters(), clinicalAttempts: [] });
export const lifeCategories = ['Pharmacology', 'Clinical pharmacy', 'Pharmacognosy', 'Pharmaceutics', 'Research', 'Wellbeing'] as const;
export const lifeXP = (activities: LifeActivity[]) => activities.reduce((n, a) => n + a.xp, 0);
export const lifeLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;
export interface State {
    life: Life;
    version: 1;
    books: Book[];
    annotations: Annotation[];
    beds: Bed[];
    specimens: Specimen[];
    plantNotes: Record<string, string>;
    tasks: Task[];
    cards: Card[];
    day: number;
    focus: {
        remaining: number;
        deadline: number | null;
        duration: number;
        mode: string;
    };
    sessions: {
        at: string;
        minutes: number;
        mode: string;
    }[];
    settings: {
        night: boolean;
        quality: string;
        reducedMotion: boolean;
        fontSize: number;
        outfit: string;
        hair: string;
        skin: string;
        companion: string;
        camera: string;
        ambience: string;
        volume: number;
        gardenShortcut: boolean;
    };
    links: {
        from: string;
        to: string;
    }[];
}
export const speciesIds = ['peppermint', 'chamomile', 'lavender', 'rosemary', 'milkthistle', 'turmeric', 'willow', 'foxglove'];
export const stages = ['Seed', 'Germination', 'Seedling', 'Vegetative', 'Mature', 'Harvest ready'];
export function initialState(): State { return { version: 1, life: emptyLife(), books: catalogue.map(b => ({ ...b, progress: b.progress || 0 })), annotations: [], beds: speciesIds.map((s, i) => ({ id: `bed-${i}`, species: s, stage: -1, moisture: 0, age: 0, health: 100, harvests: 0, prepared: false })), specimens: [], plantNotes: {}, tasks: [], cards: [], day: 1, focus: { remaining: 1500, deadline: null, duration: 25, mode: 'Focus' }, sessions: [], settings: { night: false, quality: 'High', reducedMotion: false, fontSize: 16, outfit: '#75968a', hair: '#443028', skin: '#bd8e6e', companion: 'Ginger', camera: 'Wide room', ambience: 'Off', volume: 35, gardenShortcut: false }, links: [] }; }
export function gardenAction(s: State, id: string, action: 'prepare' | 'sow' | 'water' | 'harvest' | 'day'): State {
    const next = structuredClone(s), bed = next.beds.find(b => b.id === id);
    if (action === 'day') {
        next.day++;
        next.beds.forEach(b => { if (b.stage < 0)
            return; b.age++; if (b.moisture >= 20 && b.health > 20) {
            b.stage = Math.min(5, b.stage + 1);
            b.health = Math.min(100, b.health + 5);
        }
        else
            b.health = Math.max(0, b.health - 12); b.moisture = Math.max(0, b.moisture - 24); });
        return next;
    }
    if (!bed)
        return next;
    if (action === 'prepare' && bed.stage < 0)
        bed.prepared = true;
    if (action === 'sow' && bed.stage < 0 && bed.prepared) {
        bed.stage = 0;
        bed.age = 0;
        bed.health = 100;
        bed.moisture = 30;
    }
    if (action === 'water' && bed.stage >= 0)
        bed.moisture = Math.min(100, bed.moisture + 45);
    if (action === 'harvest' && bed.stage === 5) {
        next.specimens.push({ id: crypto.randomUUID(), species: bed.species, day: next.day, part: bed.species === 'turmeric' ? 'Rhizome' : bed.species === 'willow' ? 'Bark (simulated)' : bed.species === 'chamomile' ? 'Flower head' : 'Study specimen', bed: bed.id, stage: bed.stage, observations: '', confidence: 'Simulated identity; not a real-world identification', links: [] });
        bed.harvests++;
        bed.stage = -1;
        bed.moisture = 0;
        bed.prepared = false;
        bed.age = 0;
    }
    return next;
}
export function settleFocus(s: State, now = Date.now()): State { if (!s.focus.deadline || now < s.focus.deadline)
    return s; return { ...s, focus: { ...s.focus, deadline: null, remaining: 0 }, sessions: [...s.sessions, { at: new Date(s.focus.deadline).toISOString(), minutes: s.focus.duration, mode: s.focus.mode }] }; }
const finite = z.number().finite();
const bookSchema = z.object({ id: z.string(), title: z.string(), collection: z.string(), type: z.string(), notes: z.string(), progress: finite.min(0).max(100), subtitle: z.string().optional(), url: z.string().optional(), favorite: z.boolean().optional(), tags: z.array(z.string()).optional(), fileId: z.string().optional(), fileType: z.string().optional(), page: finite.int().positive().optional(), bookmarks: z.array(finite.int().positive()).optional() });
const routineSchema = z.object({ id: z.string(), title: z.string().min(1).max(120), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), category: z.string().max(80), completedOn: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(500) });
const quartersSchema = z.object({ intention: z.string().max(400), journal: z.string().max(4000), routines: z.array(routineSchema).max(100) });
const clinicalAttemptSchema = z.object({ id: z.string(), caseId: z.string(), selected: z.array(finite.int().min(0).max(10)).max(15), correct: finite.int().min(0).max(15), total: finite.int().min(1).max(15), completedAt: z.string().datetime() });
const lifeSchema = z.object({ clinicalAttempts: z.array(clinicalAttemptSchema).max(2000).default([]), quarters: quartersSchema.default(emptyQuarters), activities: z.array(z.object({ id: z.string(), title: z.string().max(240), category: z.string().max(80), date: z.string(), minutes: finite.min(0).max(1440), xp: finite.min(0).max(10000) })), goals: z.array(z.object({ id: z.string(), title: z.string().max(240), category: z.string().max(80), done: z.boolean(), created: z.string() })) });
export const stateSchema = z.object({ life: lifeSchema.default(emptyLife), version: z.literal(1), books: z.array(bookSchema), annotations: z.array(z.object({ id: z.string(), bookId: z.string(), page: finite.int().positive(), text: z.string(), quote: z.string(), rect: z.object({ x: finite.min(0).max(1), y: finite.min(0).max(1), w: finite.min(0).max(1), h: finite.min(0).max(1) }).optional(), created: z.string() })), beds: z.array(z.object({ id: z.string(), species: z.enum(speciesIds as [
            string,
            ...string[]
        ]), stage: finite.int().min(-1).max(5), moisture: finite.min(0).max(100), age: finite.min(0), health: finite.min(0).max(100), harvests: finite.min(0), prepared: z.boolean() })).length(8), specimens: z.array(z.object({ id: z.string(), species: z.enum(speciesIds as [
            string,
            ...string[]
        ]), day: finite.min(1), part: z.string(), bed: z.string(), stage: finite, text: z.string().optional(), observations: z.string(), confidence: z.string(), links: z.array(z.string()) })), plantNotes: z.record(z.string(), z.string()), tasks: z.array(z.object({ id: z.string(), text: z.string(), done: z.boolean() })), cards: z.array(z.object({ id: z.string(), front: z.string(), back: z.string(), due: finite, interval: finite, source: z.string() })), day: finite.int().min(1), focus: z.object({ remaining: finite.min(0), deadline: finite.nullable(), duration: finite.positive().max(180), mode: z.string() }), sessions: z.array(z.object({ at: z.string(), minutes: finite, mode: z.string() })), settings: z.object({ night: z.boolean(), quality: z.enum(['Low', 'Medium', 'High', 'Ultra']), reducedMotion: z.boolean(), fontSize: finite.min(14).max(22), outfit: z.string().regex(/^#[0-9a-f]{6}$/i), hair: z.string().regex(/^#[0-9a-f]{6}$/i), skin: z.string().regex(/^#[0-9a-f]{6}$/i), companion: z.enum(['Ginger', 'Cream', 'Sage']), camera: z.enum(['Wide room', 'Desk focus', 'Character', 'Window', 'Reading', 'Companion']), ambience: z.enum(['Off', 'Rain', 'Wind', 'Fireplace']), volume: finite.min(0).max(100), gardenShortcut: z.boolean() }), links: z.array(z.object({ from: z.string(), to: z.string() })) });
export function validateState(input: unknown): State { const s = stateSchema.parse(input) as State; for (const arr of [s.books, s.beds, s.annotations, s.specimens, s.tasks, s.cards, s.life.activities, s.life.goals, s.life.quarters.routines, s.life.clinicalAttempts])
    if (new Set(arr.map(x => x.id)).size !== arr.length)
        throw Error('Backup contains duplicate IDs'); for (let i = 0; i < 8; i++)
    if (!s.beds.some(b => b.id === `bed-${i}`))
        throw Error('Missing garden bed'); for (const a of s.annotations)
    if (!s.books.some(b => b.id === a.bookId))
        throw Error('Annotation references a missing resource'); return s; }
