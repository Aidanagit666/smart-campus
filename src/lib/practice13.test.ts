import { describe, expect, it } from 'vitest';
import { checkAvailability } from '@/lib/availability';
import { SAMPLE_ROOMS } from '@/data/rooms';

const room = SAMPLE_ROOMS.find(r => r.id === 'room-101')!;
const blocked = SAMPLE_ROOMS.find(r => r.id === 'room-103')!;
const now = 480;

describe('Practice 13 - Shared acceptance tests', () => {
  it('T1: Free interval', () => {
    expect(checkAvailability(room, 720, 780, now).available)
      .toBe(true);
  });

  it('T2: Overlapping booking', () => {
    const result = checkAvailability(room, 630, 690, now);
    expect(result.available).toBe(false);
    expect(result.reasons).toContain('overlapping-booking');
  });

  it('T3: Blocked room', () => {
    const result = checkAvailability(blocked, 720, 780, now);
    expect(result.available).toBe(false);
    expect(result.reasons).toContain('room-blocked');
  });

  it('T4: Zero duration', () => {
    const result = checkAvailability(room, 720, 720, now);
    expect(result.available).toBe(false);
    expect(result.reasons).toContain('invalid-interval');
  });

  it('T5: Duration exceeds 120 minutes', () => {
    const result = checkAvailability(room, 690, 811, now);
    expect(result.available).toBe(false);
    expect(result.reasons).toContain('too-long');
  });

  it('T6: Past start time', () => {
    const result = checkAvailability(room, 420, 450, now);
    expect(result.available).toBe(false);
    expect(result.reasons).toContain('start-before-now');
  });

  it('T7: Adjacent interval', () => {
    expect(checkAvailability(room, 660, 720, now).available)
      .toBe(true);
  });

  it('T8: Booking data remains unchanged', () => {
    const before = JSON.stringify(SAMPLE_ROOMS);

    checkAvailability(room, 720, 780, now);
    checkAvailability(room, 630, 690, now);
    checkAvailability(blocked, 720, 780, now);
    checkAvailability(room, 720, 720, now);
    checkAvailability(room, 690, 811, now);
    checkAvailability(room, 420, 450, now);
    checkAvailability(room, 660, 720, now);

    expect(JSON.stringify(SAMPLE_ROOMS)).toBe(before);
  });
});
