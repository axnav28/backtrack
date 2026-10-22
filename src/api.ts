import type { Camera, Investigation } from './types';
export async function loadDemo() { const r = await fetch('/api/demo'); return r.json() as Promise<{ cameras: Camera[]; investigation: Investigation }>; }
export async function runInvestigation(input: { question: string; cameras: string[]; start: string; end: string }) { const r = await fetch('/api/investigations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) }); if (!r.ok) throw new Error((await r.json()).error ?? 'Investigation failed'); return r.json() as Promise<Investigation>; }
