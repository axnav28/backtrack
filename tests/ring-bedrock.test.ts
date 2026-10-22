import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { makeRingNonce, normalizeRingEvent, verifyRingNonce, verifyRingSignature } from '../server/ring.js';
import { parseBedrockReport } from '../server/bedrock.js';

describe('Ring security and event adapter', () => {
  it('verifies the raw webhook signature', () => {
    const body = Buffer.from('{"meta":{"request_id":"req-1"}}');
    const key = 'test-signing-key';
    const signature = `sha256=${crypto.createHmac('sha256', key).update(body).digest('hex')}`;
    expect(verifyRingSignature(body, signature, key)).toBe(true);
    expect(verifyRingSignature(Buffer.from('{"changed":true}'), signature, key)).toBe(false);
  });

  it('creates and validates a short-lived account-link nonce', () => {
    const now = Date.now();
    const nonce = makeRingNonce(now, 'account-123', 'test-signing-key');
    expect(verifyRingNonce(now, nonce, 'account-123', 'test-signing-key', 600_000, now)).toBe(true);
    expect(verifyRingNonce(now, nonce, 'other-account', 'test-signing-key', 600_000, now)).toBe(false);
    expect(verifyRingNonce(now - 601_000, nonce, 'account-123', 'test-signing-key', 600_000, now)).toBe(false);
  });

  it('normalizes the documented nested webhook event shape', () => {
    const event = normalizeRingEvent({ data: { id: 'evt-1', type: 'motion', attributes: { timestamp: '2026-10-22T12:00:00Z', component_ids: ['cam-1'] } } }, 'Front Door', 'cam-1');
    expect(event).toMatchObject({ id: 'evt-1', deviceId: 'cam-1', kind: 'motion', hasRecording: true, mode: 'live' });
  });
});

describe('Bedrock response adapter', () => {
  it('accepts valid JSON and rejects unstructured model output', () => {
    expect(parseBedrockReport(JSON.stringify({ summary: 'Observed activity.', facts: ['Motion at 12:00.'], inferences: [], uncertainties: ['No video.'] }))).toEqual({ summary: 'Observed activity.', facts: ['Motion at 12:00.'], inferences: [], uncertainties: ['No video.'] });
    expect(parseBedrockReport('not json')).toBeNull();
    expect(parseBedrockReport(JSON.stringify({ summary: 'missing arrays' }))).toBeNull();
  });
});
