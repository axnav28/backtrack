import crypto from 'node:crypto';
import type { EvidenceEvent } from '../src/types.js';
const API_BASE = 'https://api.amazonvision.com';
const OAUTH_BASE = 'https://oauth.ring.com';
type TokenResponse = { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; token_type?: string };
export function ringAccountId(user: any): string | null { const value = user?.data?.id ?? user?.data?.attributes?.account_id ?? user?.id ?? user?.account_id; return value ? String(value) : null; }
export class RingClient {
  constructor(private readonly accessToken: string, private readonly hardwareId = process.env.RING_HARDWARE_ID ?? crypto.randomUUID()) {}
  private async get(path: string) { const response = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json', 'User-Agent': 'BackTrack/0.1', Hardware_Id: this.hardwareId } }); if (!response.ok) throw new Error(`Ring API request failed: ${response.status}`); return response.json() as Promise<any>; }
  private async post(path: string, body: unknown) { const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json', 'User-Agent': 'BackTrack/0.1', Hardware_Id: this.hardwareId }, body: JSON.stringify(body) }); if (!response.ok) throw new Error(`Ring API request failed: ${response.status}`); return response.json() as Promise<any>; }
  private async media(path: string, body: unknown) { const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json', 'User-Agent': 'BackTrack/0.1', Hardware_Id: this.hardwareId }, body: JSON.stringify(body), redirect: 'manual' }); if (response.status !== 200 && response.status !== 201 && response.status !== 303) throw new Error(`Ring media request failed: ${response.status}`); const location = response.headers.get('location'); if (location) { const safe = new URL(location); if (!['https:'].includes(safe.protocol) || !['api.amazonvision.com', 'app-content.ring.com'].includes(safe.hostname)) throw new Error('Ring returned an untrusted media location'); return { location: safe.toString(), status: response.status }; } return { location: null, status: response.status } }
  devices() { return this.get('/v1/devices?include=status,capabilities,location,configurations'); }
  events(deviceId: string) { return this.get(`/v1/history/devices/${encodeURIComponent(deviceId)}/events`); }
  user() { return this.get('/v1/users/me'); }
  confirmIntegration() { return this.post('/v1/accounts/me/app-integrations', { data: { type: 'app-integrations', attributes: { status: 'completed' } } }); }
  videoDownload(deviceId: string, timestamp: number, duration = 60000, componentId?: string) { return this.media(`/v1/devices/${encodeURIComponent(deviceId)}/media/video/download`, { timestamp, duration, ...(componentId ? { components: [{ component_id: componentId }] } : {}) }); }
  imageDownload(deviceId: string, timestamp: number, componentId?: string) { return this.media(`/v1/devices/${encodeURIComponent(deviceId)}/media/image/download`, { type: 'at_timestamp', timestamp, image_options: { format: 'jpeg' }, ...(componentId ? { components: [{ component_id: componentId }] } : {}) }); }
  async whepSession(deviceId: string, offerSdp: string) { const response = await fetch(`${API_BASE}/v1/devices/${encodeURIComponent(deviceId)}/media/streaming/whep/sessions`, { method: 'POST', headers: { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/sdp', Accept: 'application/sdp', 'User-Agent': 'BackTrack/0.1', Hardware_Id: this.hardwareId }, body: offerSdp }); if (response.status !== 201) throw new Error(`Ring WHEP request failed: ${response.status}`); return { answerSdp: await response.text(), location: response.headers.get('location') } }
}
export async function exchangeRingCode(code: string): Promise<TokenResponse> { const body = new URLSearchParams({ grant_type: 'authorization_code', code, client_id: process.env.RING_CLIENT_ID ?? '', client_secret: process.env.RING_CLIENT_SECRET ?? '' }); const response = await fetch(`${OAUTH_BASE}/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', 'User-Agent': 'BackTrack/0.1' }, body }); if (!response.ok) throw new Error(`Ring token exchange failed: ${response.status}`); return response.json() as Promise<TokenResponse>; }
export function verifyRingSignature(rawBody: Buffer, signature: string | undefined, signingKey = process.env.RING_HMAC_KEY) { if (!signingKey || !signature) return false; const expected = crypto.createHmac('sha256', signingKey).update(rawBody).digest('hex'); const received = signature.replace(/^sha256=/, ''); return received.length === expected.length && crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected)); }
export function makeRingNonce(time: number | string, accountId: string, signingKey = process.env.RING_HMAC_KEY) {
  if (!signingKey) throw new Error('RING_HMAC_KEY is not configured.');
  return crypto.createHmac('sha256', signingKey).update(`${time}:${accountId}`).digest('base64url');
}
export function verifyRingNonce(time: number | string, nonce: string | undefined, accountId: string, signingKey = process.env.RING_HMAC_KEY, maxAgeMs = 600_000, now = Date.now()) {
  if (!nonce || !signingKey) return false;
  const parsedTime = Number(time);
  if (!Number.isFinite(parsedTime) || Math.abs(now - parsedTime) > maxAgeMs) return false;
  const expected = makeRingNonce(time, accountId, signingKey);
  return nonce.length === expected.length && crypto.timingSafeEqual(Buffer.from(nonce), Buffer.from(expected));
}
function ringTypeToKind(type: unknown): EvidenceEvent['kind'] {
  const value = String(type ?? '').toLowerCase();
  if (value.includes('package')) return 'package';
  if (value.includes('doorbell')) return 'doorbell';
  if (value.includes('person')) return 'person';
  if (value.includes('motion')) return 'motion';
  return 'unknown';
}
export function normalizeRingEvent(payload: any, cameraName: string, deviceId: string): EvidenceEvent {
  const data = payload?.data ?? payload;
  const attributes = data?.attributes ?? data;
  const timestamp = attributes.timestamp ?? attributes.created_at ?? attributes.createdAt ?? payload?.timestamp;
  if (!timestamp) throw new Error('Ring event has no timestamp');
  const type = attributes.type ?? data?.type ?? payload?.type;
  const eventId = data?.id ?? payload?.id ?? payload?.event_id;
  if (!eventId) throw new Error('Ring event has no identifier');
  const endTimestamp = attributes.end_timestamp ?? attributes.ended_at ?? timestamp;
  return { id: String(eventId), deviceId, cameraName, kind: ringTypeToKind(type), label: String(attributes.label ?? type ?? 'Ring event'), timestamp: new Date(timestamp).toISOString(), endTimestamp: new Date(endTimestamp).toISOString(), hasRecording: Boolean(attributes.media?.url ?? attributes.recording_url ?? attributes.video_url ?? attributes.component_ids?.length), mode: 'live', rawType: type ? String(type) : undefined };
}
