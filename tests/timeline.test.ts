import { describe, expect, it } from 'vitest';
import { demoEvents } from '../src/demo';
import { correlationScore, normalizeEvents } from '../src/timeline';
describe('timeline reconstruction', () => { it('deduplicates and orders provider events', () => { const result = normalizeEvents([demoEvents[3], demoEvents[0], demoEvents[0]]); expect(result.map(e => e.id)).toEqual(['evt-0712-drive', 'evt-0719-drive']); }); it('scores adjacent cross-camera events as related candidates', () => { expect(correlationScore(demoEvents[2], demoEvents[3])).toBeGreaterThan(70); }); });
