import type { EvidenceEvent } from './types';
export const normalizeEvents = (events: EvidenceEvent[]) => Array.from(new Map(events.map(e => [e.id, e])).values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
export const correlationScore = (a: EvidenceEvent, b: EvidenceEvent) => { const gap = Math.abs(new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) / 60000; return Math.max(0, Math.round((1 - Math.min(gap, 10) / 10) * 70 + (a.kind === b.kind ? 15 : 0) + (a.deviceId !== b.deviceId ? 15 : 0))); };
