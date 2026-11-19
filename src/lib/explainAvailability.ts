import type { CheckResult } from '@/types';
import { minutesToLabel } from '@/lib/time';
import type { LlmAdapter } from '@/lib/mockLlmAdapter';

export interface ExplanationInput {
  roomName: string;
  start: number;
  end: number;
  result: CheckResult;
}

export type ExplanationOutcome =
  | { ok: true; summary: string; status: 'available' | 'unavailable'; source: 'mock' }
  | { ok: false; message: string; error: 'invalid-input' | 'timeout' | 'adapter-failure' | 'invalid-output' };

const FALLBACK = 'The confirmed availability result above is unchanged.';
const ALLOWED_REASONS = new Set([
  'invalid-interval', 'start-before-now', 'too-long', 'room-blocked', 'overlapping-booking',
]);

function valid(input: ExplanationInput): boolean {
  const { roomName, start, end, result } = input;
  return typeof roomName === 'string' && roomName.trim().length > 0 && roomName.length <= 100 &&
    Number.isFinite(start) && Number.isFinite(end) && start >= 0 && start <= 1440 && end >= 0 && end <= 1440 &&
    typeof result?.available === 'boolean' && Array.isArray(result.reasons) &&
    Array.isArray(result.messages) && result.reasons.length === result.messages.length &&
    result.reasons.length <= 5 && result.available === (result.reasons.length === 0) &&
    result.reasons.every((r) => ALLOWED_REASONS.has(r)) &&
    result.messages.every((m) => typeof m === 'string' && m.trim().length > 0 && m.length <= 300);
}

function expectedSummary(input: ExplanationInput): string {
  const status = input.result.available ? 'available' : 'unavailable';
  const base = `${input.roomName} is ${status} from ${minutesToLabel(input.start)} to ${minutesToLabel(input.end)}.`;
  return base + (input.result.available ? '' : ` ${input.result.messages.join(' ')}`);
}

export async function explainAvailability(
  input: ExplanationInput,
  adapter: LlmAdapter,
  timeoutMs = 1500,
): Promise<ExplanationOutcome> {
  if (!valid(input)) return { ok: false, error: 'invalid-input', message: `Invalid explanation input. ${FALLBACK}` };
  if (expectedSummary(input).length > 500) {
    return {
      ok: false,
      error: 'invalid-input',
      message: `Explanation input is too long. ${FALLBACK}`,
    };
  }
  const prompt = JSON.stringify({
    roomName: input.roomName,
    startLabel: minutesToLabel(input.start),
    endLabel: minutesToLabel(input.end),
    available: input.result.available,
    messages: input.result.messages,
  });
  if (prompt.length > 2000) {
    return { ok: false, error: 'invalid-input', message: `Explanation input is too long. ${FALLBACK}` };
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  let raw: string;
  try {
    raw = await Promise.race([
      adapter.complete(prompt),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('mock-timeout')), timeoutMs);
      }),
    ]);
  } catch (error) {
    const timeout = error instanceof Error && error.message === 'mock-timeout';
    return { ok: false, error: timeout ? 'timeout' : 'adapter-failure',
      message: `${timeout ? 'Explanation timed out.' : 'Explanation service failed.'} ${FALLBACK}` };
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('bad-json');
    const value = parsed as Record<string, unknown>;
    const status = input.result.available ? 'available' : 'unavailable';
    const expectedCitations = input.result.available ? [] : input.result.messages;
    if (value.status !== status || typeof value.summary !== 'string' || value.summary.length > 500 ||
      value.summary !== expectedSummary(input) ||
      !Array.isArray(value.citations) ||
      JSON.stringify(value.citations) !== JSON.stringify(expectedCitations)) throw new Error('bad-output');
    return { ok: true, status, summary: value.summary, source: 'mock' };
  } catch {
    return { ok: false, error: 'invalid-output', message: `The explanation did not match the verified result. ${FALLBACK}` };
  }
}
