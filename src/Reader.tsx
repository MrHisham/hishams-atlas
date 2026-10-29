import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { db } from './storage';
import type { Book, State, Annotation } from './model';
pdfjs.GlobalWorkerOptions.workerSrc = worker;
export function Reader({ book, state, change, close }: {
    book: Book;
    state: State;
    change: (fn: (s: State) => State) => void;
    close: () => void;
}) {
    const [doc, setDoc] = useState<pdfjs.PDFDocumentProxy | null>(null), [error, setError] = useState(''), [page, setPage] = useState(book.page || 1), [zoom, setZoom] = useState(1), [text, setText] = useState(''), [quote, setQuote] = useState(''), [search, setSearch] = useState(''), [found, setFound] = useState<number[]>([]), [rect, setRect] = useState<Annotation['rect']>(), [mark, setMark] = useState(false), [plain, setPlain] = useState(''), [image, setImage] = useState('');
    const canvas = useRef<HTMLCanvasElement>(null), area = useRef<HTMLDivElement>(null), start = useRef<{
        x: number;
        y: number;
    } | undefined>(undefined), renderJob = useRef<pdfjs.RenderTask | null>(null);
    useEffect(() => { let active = true, task: pdfjs.PDFDocumentLoadingTask | undefined, url = ''; (async () => { try {
        if (!book.fileId)
            return;
        const f = await db.files.get(book.fileId);
        if (!f)
            throw Error('Attached file is missing');
        if (book.fileType === 'application/pdf') {
            task = pdfjs.getDocument({ data: new Uint8Array(await f.blob.arrayBuffer()) });
            const d = await task.promise;
            if (active)
                setDoc(d);
            else
                await d.destroy();
        }
        else if (book.fileType?.startsWith('image/')) {
            url = URL.createObjectURL(f.blob);
            if (active)
                setImage(url);
        }
        else if (active)
            setPlain(await f.blob.text());
    }
    catch (e) {
        if (active)
            setError(String(e));
    } })(); return () => { active = false; task?.destroy(); if (url)
        URL.revokeObjectURL(url); }; }, [book.fileId]);
    useEffect(() => { if (!doc || !canvas.current)
        return; let active = true; let job: pdfjs.RenderTask | undefined; (async () => { try {
        await renderJob.current?.promise.catch(() => { });
        const p = await doc.getPage(page);
        if (!active || !canvas.current)
            return;
        const v = p.getViewport({ scale: zoom * 1.35 });
        const c = canvas.current;
        c.width = v.width;
        c.height = v.height;
        job = p.render({ canvas: c, canvasContext: c.getContext('2d')!, viewport: v });
        renderJob.current = job;
        await job.promise;
        if (active)
            change(s => ({ ...s, books: s.books.map(b => b.id === book.id ? { ...b, page, progress: Math.round(page / doc.numPages * 100) } : b) }));
    }
    catch (e) {
        if (active && !(e instanceof Error && e.name === 'RenderingCancelledException'))
            setError(String(e));
    } })(); return () => { active = false; job?.cancel(); }; }, [doc, page, zoom]);
    useEffect(() => { const key = (e: KeyboardEvent) => { if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName))
        return; if (e.key === 'ArrowRight' && doc) {
        e.preventDefault();
        setPage(p => Math.min(doc.numPages, p + 1));
    } if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPage(p => Math.max(1, p - 1));
    } if (e.key === '+' || e.key === '=')
        setZoom(z => Math.min(3, z + .2)); if (e.key === '-')
        setZoom(z => Math.max(.4, z - .2)); }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, [doc]);
    useEffect(() => { const root = document.querySelector<HTMLElement>('.reader'); if (!root)
        return; const previous = document.activeElement as HTMLElement; const items = () => Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]),input,select,textarea')).filter(e => e.offsetParent !== null); items()[0]?.focus(); const key = (e: KeyboardEvent) => { if (e.key !== 'Tab')
        return; const list = items(), i = list.indexOf(document.activeElement as HTMLElement); if (e.shiftKey && i <= 0) {
        e.preventDefault();
        list.at(-1)?.focus();
    }
    else if (!e.shiftKey && (i === list.length - 1 || i < 0)) {
        e.preventDefault();
        list[0]?.focus();
    } }; document.addEventListener('keydown', key); return () => { document.removeEventListener('keydown', key); if (previous.isConnected)
        previous.focus(); }; }, []);
    const annotations = state.annotations.filter(n => n.bookId === book.id);
    const save = () => { if (!text.trim() && !quote.trim() && !rect)
        return; change(s => ({ ...s, annotations: [...s.annotations, { id: crypto.randomUUID(), bookId: book.id, page, text, quote, rect, created: new Date().toISOString() }] })); setText(''); setQuote(''); setRect(undefined); setMark(false); };
    const searchPdf = async () => { if (!doc || !search.trim())
        return; setFound([]); const results = []; for (let i = 1; i <= doc.numPages; i++) {
        const p = await doc.getPage(i), c = await p.getTextContent();
        if (c.items.map(x => 'str' in x ? x.str : '').join(' ').toLowerCase().includes(search.toLowerCase()))
            results.push(i);
    } setFound(results); setError(results.length ? '' : `No matches for “${search}”. Scanned PDFs require OCR, which is not included.`); if (results.length)
        setPage(results[0]); };
    return <div className="reader modal" role="dialog" aria-modal="true" aria-label="Reading desk"><header><div><small>YOUR READING DESK</small><h2>{book.title}</h2></div><button onClick={() => area.current?.requestFullscreen().catch(() => setError('Fullscreen is unavailable.'))}>Fullscreen</button><button aria-label="Close reader" onClick={close}>✕</button></header><div className="reader-tools"><button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>←</button><label>Page <input aria-label="PDF page" type="number" min="1" max={doc?.numPages || 1} value={page} onChange={e => setPage(Math.max(1, Math.min(doc?.numPages || 1, Number(e.target.value) || 1)))}/></label><span>/ {doc?.numPages || '—'}</span><button disabled={!doc || page >= doc.numPages} onClick={() => setPage(p => p + 1)}>→</button><button onClick={() => setZoom(z => Math.max(.4, z - .2))}>−</button><span>{Math.round(zoom * 100)}%</span><button onClick={() => setZoom(z => Math.min(3, z + .2))}>＋</button><button onClick={() => change(s => ({ ...s, books: s.books.map(b => b.id === book.id ? { ...b, bookmarks: b.bookmarks?.includes(page) ? b.bookmarks.filter(p => p !== page) : [...(b.bookmarks || []), page] } : b) }))}>{book.bookmarks?.includes(page) ? '★ Bookmarked' : '☆ Bookmark'}</button><button className={mark ? 'active' : ''} onClick={() => setMark(!mark)}>Highlight area</button><input aria-label="Search PDF text" placeholder="Search PDF text…" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchPdf()}/><button onClick={searchPdf}>Find</button></div><div className="reader-body"><div className="pages" ref={area}>{error && <p role="alert" className="notice">{error}</p>}{!book.fileId && <div className="empty"><h2>A title waiting for its pages.</h2><p>The supplied catalogue contains metadata only. Attach your PDF from the library to read it here. Notes and flashcards work without a file.</p></div>}{found.length > 0 && <p>Matches: {found.map(p => <button key={p} onClick={() => setPage(p)}>{p}</button>)}</p>}{doc && <div className={`pdf-page ${mark ? 'marking' : ''}`} onPointerDown={e => { if (!mark)
        return; const r = e.currentTarget.getBoundingClientRect(); start.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={e => { if (!mark || !start.current)
        return; const r = e.currentTarget.getBoundingClientRect(), x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)); setRect({ x: Math.min(start.current.x, x), y: Math.min(start.current.y, y), w: Math.abs(x - start.current.x), h: Math.abs(y - start.current.y) }); start.current = undefined; }}><canvas ref={canvas}/>{[...annotations.filter(a => a.page === page && a.rect).map(a => a.rect!), ...(rect ? [rect] : [])].map((r, i) => <div key={i} className="highlight" style={{ left: r.x * 100 + '%', top: r.y * 100 + '%', width: r.w * 100 + '%', height: r.h * 100 + '%' }}/>)}</div>}{plain && <pre>{plain}</pre>}{image && <img className="imported-image" src={image} alt={book.title}/>}</div><aside><small>THOUGHTS IN THE MARGINS</small><h3>Notes & highlights</h3><p className="muted">Page {page}. Drag an area on the PDF to anchor a highlight. Add a quote or reflection below.</p><label>Quote<input value={quote} onChange={e => setQuote(e.target.value)} placeholder="Optional passage"/></label><label>Note<textarea aria-label="Reader note" value={text} onChange={e => setText(e.target.value)} placeholder="What would you like to remember?"/></label><button className="primary" onClick={save}>Save annotation</button><button onClick={() => { if (!text && !quote)
        return; change(s => ({ ...s, cards: [...s.cards, { id: crypto.randomUUID(), front: quote || book.title, back: text, due: Date.now(), interval: 0, source: book.id }] })); setText(''); setQuote(''); }}>Make flashcard</button><h4>Bookmarks</h4><div className="row">{book.bookmarks?.map(p => <button key={p} onClick={() => setPage(p)}>p. {p}</button>)}</div>{annotations.map(n => <article className="annotation" key={n.id}><button onClick={() => setPage(n.page)}>Page {n.page} ↗</button>{n.quote && <blockquote>{n.quote}</blockquote>}<p>{n.text}</p><button aria-label="Delete annotation" onClick={() => change(s => ({ ...s, annotations: s.annotations.filter(a => a.id !== n.id) }))}>Remove</button></article>)}</aside></div></div>;
}
