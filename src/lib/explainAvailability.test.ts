import { describe, expect, it, vi } from 'vitest';
import { explainAvailability, type ExplanationInput } from './explainAvailability';
import { createMockLlmAdapter, type LlmAdapter } from './mockLlmAdapter';

const available: ExplanationInput = {
  roomName: 'Room 101', start: 660, end: 720,
  result: { available: true, reasons: [], messages: [] },
};
const unavailable: ExplanationInput = {
  roomName: 'Room 101', start: 600, end: 660,
  result: { available: false, reasons: ['overlapping-booking'], messages: ['The interval overlaps an existing booking.'] },
};

describe('Explain availability (mock LLM)', () => {
  it('explains available result without inventing bookings', async () => {
    expect(await explainAvailability(available, createMockLlmAdapter())).toMatchObject({ ok: true, status: 'available' });
  });
  it('explains unavailable result using existing reason', async () => {
    const output = await explainAvailability(unavailable, createMockLlmAdapter());
    expect(output).toMatchObject({ ok: true, status: 'unavailable' });
    if (output.ok) expect(output.summary).toContain(unavailable.result.messages[0]);
  });
  it('rejects an empty room before calling the adapter', async () => {
    const complete = vi.fn(async () => '{}');
    expect(await explainAvailability({ ...available, roomName: '' }, { complete })).toMatchObject({ error: 'invalid-input' });
    expect(complete).not.toHaveBeenCalled();
  });
  it('rejects an inconsistent verdict', async () => {
    expect(await explainAvailability({ ...available, result: { available: true, reasons: ['too-long'], messages: ['Over limit'] } }, createMockLlmAdapter())).toMatchObject({ error: 'invalid-input' });
  });
  it('rejects an overly long room label', async () => {
    expect(await explainAvailability({ ...available, roomName: 'x'.repeat(101) }, createMockLlmAdapter())).toMatchObject({ error: 'invalid-input' });
  });
  it('reports an adapter failure', async () => {
    const adapter: LlmAdapter = { complete: async () => { throw new Error('failure'); } };
    expect(await explainAvailability(available, adapter)).toMatchObject({ error: 'adapter-failure' });
  });
  it('reports a timeout', async () => {
    const adapter: LlmAdapter = { complete: () => new Promise<string>(() => {}) };
    expect(await explainAvailability(available, adapter, 10)).toMatchObject({ error: 'timeout' });
  });
  it('rejects non-JSON model output', async () => {
    expect(await explainAvailability(available, { complete: async () => 'not json' })).toMatchObject({ error: 'invalid-output' });
  });
  it('rejects a flipped model verdict', async () => {
    const adapter: LlmAdapter = { complete: async () => JSON.stringify({ status: 'unavailable', summary: 'invented booking', citations: [] }) };
    expect(await explainAvailability(available, adapter)).toMatchObject({ error: 'invalid-output' });
  });
});

// Practice #11: regression tests for code review findings R1 and R2.

describe('Practice #11 - Code review regression tests', () => {
  it('R1: rejects times outside the allowed day range', async () => {
    const complete = vi.fn(async () => '{}');
    const adapter: LlmAdapter = { complete };

    const invalidStarts = [
      { ...available, start: 1500, end: 1600 },
      { ...available, start: -10 },
      { ...available, end: -5 },
    ];

    for (const input of invalidStarts) {
      const output = await explainAvailability(input, adapter);
      expect(output).toMatchObject({
        ok: false,
        error: 'invalid-input',
      });
    }

    expect(complete).not.toHaveBeenCalled();
  });

  it('R2: rejects oversized explanations before the adapter call', async () => {
    const complete = vi.fn(async () => '{}');
    const adapter: LlmAdapter = { complete };

    const input: ExplanationInput = {
      ...unavailable,
      result: {
        available: false,
        reasons: ['overlapping-booking', 'room-blocked'],
        messages: [
          'A'.repeat(270),
          'B'.repeat(270),
        ],
      },
    };

    const output = await explainAvailability(input, adapter);

    expect(output).toMatchObject({
      ok: false,
      error: 'invalid-input',
    });
    expect(complete).not.toHaveBeenCalled();
  });
});
