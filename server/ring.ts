import crypto from 'node:crypto';
import type { EvidenceEvent } from '../src/types';
const API_BASE = 'https://api.amazonvision.com';
export class RingClient {
  constructor(private readonly accessToken: string, private readonly hardwareId = process.env.RING_HARDWARE_ID ?? crypto.randomUUID()) {}
  private async get(path: string) { const response = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json', 'User-Agent': 'BackTrack/0.1', Hardware_Id: this.hardwareId } }); if (!response.ok) throw new Error(`Ring API request failed: ${response.status}`); return response.json() as Promise<any>; }
  devices() { return this.get('/v1/devices?include=status,capabilities,location,configurations'); }
  events(deviceId: string) { return this.get(`/v1/history/devices/${encodeURIComponent(deviceId)}/events`); }
}
export function normalizeRingEvent(payload: any, cameraName: string, deviceId: string): EvidenceEvent { const timestamp = payload.timestamp ?? payload.created_at ?? payload.createdAt; if (!timestamp) throw new Error('Ring event has no timestamp'); return { id: String(payload.id ?? payload.event_id), deviceId, cameraName, kind: payload.type === 'motion' ? 'motion' : payload.type === 'person' ? 'person' : 'unknown', label: payload.type ?? 'Ring event', timestamp: new Date(timestamp).toISOString(), endTimestamp: new Date(payload.end_timestamp ?? timestamp).toISOString(), hasRecording: Boolean(payload.media?.url ?? payload.recording_url), mode: 'live', rawType: payload.type } }
