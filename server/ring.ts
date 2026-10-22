import crypto from 'node:crypto';
import type { EvidenceEvent } from '../src/types';
const API_BASE = 'https://api.amazonvision.com';
const OAUTH_BASE = 'https://oauth.ring.com';
type TokenResponse = { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; token_type?: string };
export class RingClient {
  constructor(private readonly accessToken: string, private readonly hardwareId = process.env.RING_HARDWARE_ID ?? crypto.randomUUID()) {}
  private async get(path: string) { const response = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json', 'User-Agent': 'BackTrack/0.1', Hardware_Id: this.hardwareId } }); if (!response.ok) throw new Error(`Ring API request failed: ${response.status}`); return response.json() as Promise<any>; }
  private async post(path: string, body: unknown) { const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json', 'User-Agent': 'BackTrack/0.1', Hardware_Id: this.hardwareId }, body: JSON.stringify(body) }); if (!response.ok) throw new Error(`Ring API request failed: ${response.status}`); return response.json() as Promise<any>; }
  devices() { return this.get('/v1/devices?include=status,capabilities,location,configurations'); }
  events(deviceId: string) { return this.get(`/v1/history/devices/${encodeURIComponent(deviceId)}/events`); }
  user() { return this.get('/v1/users/me'); }
  confirmIntegration() { return this.post('/v1/accounts/me/app-integrations', { data: { type: 'app-integrations', attributes: { status: 'completed' } } }); }
}
export async function exchangeRingCode(code: string): Promise<TokenResponse> { const body = new URLSearchParams({ grant_type: 'authorization_code', code, client_id: process.env.RING_CLIENT_ID ?? '', client_secret: process.env.RING_CLIENT_SECRET ?? '' }); const response = await fetch(`${OAUTH_BASE}/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', 'User-Agent': 'BackTrack/0.1' }, body }); if (!response.ok) throw new Error(`Ring token exchange failed: ${response.status}`); return response.json() as Promise<TokenResponse>; }
export function verifyRingSignature(rawBody: Buffer, signature: string | undefined, signingKey = process.env.RING_HMAC_KEY) { if (!signingKey || !signature) return false; const expected = crypto.createHmac('sha256', signingKey).update(rawBody).digest('hex'); const received = signature.replace(/^sha256=/, ''); return received.length === expected.length && crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected)); }
export function normalizeRingEvent(payload: any, cameraName: string, deviceId: string): EvidenceEvent { const timestamp = payload.timestamp ?? payload.created_at ?? payload.createdAt; if (!timestamp) throw new Error('Ring event has no timestamp'); return { id: String(payload.id ?? payload.event_id), deviceId, cameraName, kind: payload.type === 'motion' ? 'motion' : payload.type === 'person' ? 'person' : 'unknown', label: payload.type ?? 'Ring event', timestamp: new Date(timestamp).toISOString(), endTimestamp: new Date(payload.end_timestamp ?? timestamp).toISOString(), hasRecording: Boolean(payload.media?.url ?? payload.recording_url), mode: 'live', rawType: payload.type } }
