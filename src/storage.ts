import Dexie, { type Table } from 'dexie';
import { initialState, validateState, type State } from './model';
class AtlasDB extends Dexie {
    state!: Table<{
        id: string;
        value: State;
    }>;
    files!: Table<{
        id: string;
        blob: Blob;
        name: string;
    }>;
    snapshots!: Table<{
        id: string;
        value: State;
    }>;
    constructor() { super('hishams-atlas-5'); this.version(1).stores({ state: 'id', files: 'id', snapshots: 'id' }); }
}
export const db = new AtlasDB();
export async function loadState() { const row = await db.state.get('main'); return row ? validateState(row.value) : initialState(); }
let queue = Promise.resolve();
export function saveState(value: State) { queue = queue.catch(() => { }).then(async () => { await db.state.put({ id: 'main', value }); }); return queue; }
export async function attachFile(file: File) { const id = crypto.randomUUID(); await db.files.put({ id, blob: file, name: file.name }); return id; }
export async function makeBackup(state: State) { await queue; const files = await db.files.toArray(); const encoded = await Promise.all(files.map(async (f) => ({ id: f.id, name: f.name, type: f.blob.type, data: await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result).split(',')[1]); r.onerror = reject; r.readAsDataURL(f.blob); }) }))); return JSON.stringify({ format: 'hishams-atlas', version: 1, created: new Date().toISOString(), state, files: encoded }); }
export async function restoreBackup(text: string, current: State) { const raw = JSON.parse(text); if (raw.format !== 'hishams-atlas' || raw.version !== 1 || !Array.isArray(raw.files))
    throw Error('Unsupported backup format'); const state = validateState(raw.state); const files = raw.files.map((f: unknown) => { if (!f || typeof f !== 'object')
    throw Error('Invalid file'); const v = f as Record<string, unknown>; if (!['id', 'name', 'type', 'data'].every(k => typeof v[k] === 'string'))
    throw Error('Invalid file record'); const bytes = Uint8Array.from(atob(v.data as string), c => c.charCodeAt(0)); return { id: v.id as string, name: v.name as string, blob: new Blob([bytes], { type: v.type as string }) }; }); if (new Set(files.map((f: {
    id: string;
}) => f.id)).size !== files.length)
    throw Error('Duplicate file IDs'); for (const b of state.books)
    if (b.fileId && !files.some((f: {
        id: string;
    }) => f.id === b.fileId))
        throw Error('Backup is missing a referenced file'); await queue; await db.transaction('rw', db.state, db.files, db.snapshots, async () => { await db.snapshots.put({ id: new Date().toISOString(), value: current }); /* keep old file blobs to preserve rollback */ /* keep old file blobs to preserve rollback */ await db.files.bulkPut(files); await db.state.put({ id: 'main', value: state }); }); return state; }
export function download(name: string, data: Blob | string) { const url = URL.createObjectURL(typeof data === 'string' ? new Blob([data], { type: 'application/json' }) : data); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 3000); }
