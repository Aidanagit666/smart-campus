import { describe, expect, it } from 'vitest';
import type { Room } from '@/types';
import { SAMPLE_ROOMS } from '@/data/rooms';
import { checkAvailability, describeInterval } from '@/lib/availability';

const NOW = 480; // 08:00

const openRoom: Room = {
  id: 'open',
  name: 'Open Room',
  building: 'Test Block',
  capacity: 10,
  equipment: [],
  blocked: false,
  bookings: [],
};

const room101 = SAMPLE_ROOMS[0];

describe('AC1: invalid and past requests are rejected', () => {
  it('rejects a start time before the current time', () => {
    const result = checkAvailability(openRoom, 540, 600, 600);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['start-before-now']);
  });

  it('rejects a start time equal to the current time', () => {
    const result = checkAvailability(openRoom, NOW, 600, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['start-before-now']);
  });

  it('rejects start equal to end', () => {
    const result = checkAvailability(openRoom, 600, 600, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['invalid-interval']);
  });

  it('rejects start later than end', () => {
    const result = checkAvailability(openRoom, 660, 600, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['invalid-interval']);
  });
});

describe('AC2: bookings longer than 120 minutes are rejected', () => {
  it('accepts a valid 120-minute booking', () => {
    const result = checkAvailability(openRoom, 600, 720, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('rejects a 121-minute booking', () => {
    const result = checkAvailability(openRoom, 600, 721, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['too-long']);
  });
});

describe('AC3: blocked rooms are rejected', () => {
  it('rejects a booking for a blocked room', () => {
    const blockedRoom = SAMPLE_ROOMS[2];
    const result = checkAvailability(blockedRoom, 600, 660, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['room-blocked']);
  });
});

describe('AC4: overlapping bookings are rejected, endpoint touching is allowed', () => {
  it('rejects an interval that starts inside an existing booking', () => {
    const result = checkAvailability(room101, 650, 670, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['overlapping-booking']);
  });

  it('rejects an interval that ends inside an existing booking', () => {
    const result = checkAvailability(room101, 590, 610, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['overlapping-booking']);
  });

  it('rejects a one-minute overlap at the start boundary', () => {
    const result = checkAvailability(room101, 540, 601, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['overlapping-booking']);
  });

  it('rejects a one-minute overlap at the end boundary', () => {
    const result = checkAvailability(room101, 659, 700, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['overlapping-booking']);
  });

  it('allows an interval that ends exactly where an existing booking starts', () => {
    const result = checkAvailability(room101, 540, 600, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('allows an interval that starts exactly where an existing booking ends', () => {
    const result = checkAvailability(room101, 660, 720, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toEqual([]);
  });

});

describe('AC5: fixture booking data is not mutated', () => {
  it('leaves SAMPLE_ROOMS unchanged after availability checks', () => {
    const before = structuredClone(SAMPLE_ROOMS);

    checkAvailability(room101, 650, 670, NOW);
    checkAvailability(SAMPLE_ROOMS[2], 600, 660, NOW);
    checkAvailability(room101, 540, 600, NOW);
    checkAvailability(room101, 600, 721, NOW);

    expect(SAMPLE_ROOMS).toEqual(before);
  });
});

describe('AC6: feedback messages are present and descriptive', () => {
  it('explains an overlap with the conflicting booking details', () => {
    const result = checkAvailability(room101, 650, 670, NOW);
    expect(result.messages).toEqual([
      'The interval overlaps an existing booking: 10:00 AM–11:00 AM (Algorithms Lecture).',
    ]);
  });

  it('explains a duration over the limit', () => {
    const result = checkAvailability(openRoom, 600, 721, NOW);
    expect(result.messages).toEqual([
      'The requested duration is 2 hr 1 min, which exceeds the 120-minute maximum.',
    ]);
  });

  it('explains a blocked room with its reason', () => {
    const result = checkAvailability(SAMPLE_ROOMS[2], 600, 660, NOW);
    expect(result.messages).toEqual([
      'Room 103 is currently blocked: Under maintenance — HVAC repair',
    ]);
  });
});

describe('F3: blocked rooms are never reported as available', () => {
  it('rejects every blocked sample room at a valid, future time', () => {
    const blockedRooms = SAMPLE_ROOMS.filter((room) => room.blocked);
    expect(blockedRooms.length).toBeGreaterThan(0);
    for (const room of blockedRooms) {
      const result = checkAvailability(room, 600, 660, NOW);
      expect(result.available).toBe(false);
      expect(result.reasons).toContain('room-blocked');
    }
  });

  it('rejects a blocked room with no bookings', () => {
    const blockedEmpty: Room = { ...openRoom, blocked: true };
    const result = checkAvailability(blockedEmpty, 600, 660, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['room-blocked']);
  });
});

describe('boundary cases', () => {
  it('accepts a valid start and end after the current time', () => {
    const result = checkAvailability(openRoom, 600, 660, NOW);
    expect(result.available).toBe(true);
  });

  it('accepts an interval that ends exactly at 24:00', () => {
    const result = checkAvailability(openRoom, 1380, 1440, NOW);
    expect(result.available).toBe(true);
  });

  it('rejects an interval that ends after 24:00', () => {
    const result = checkAvailability(openRoom, 1380, 1441, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toEqual(['invalid-interval']);
  });
});

describe('interval description', () => {
  it('reports no duration when end is not after start', () => {
    expect(describeInterval(600, 600).duration).toBeNull();
    expect(describeInterval(660, 600).duration).toBeNull();
  });

  it('flags durations over 120 minutes only', () => {
    expect(describeInterval(600, 720).durationOverLimit).toBe(false);
    expect(describeInterval(600, 721).durationOverLimit).toBe(true);
  });

  it('treats NaN times as invalid without a duration', () => {
    const details = describeInterval(NaN, 600);
    expect(details.isValid).toBe(false);
    expect(details.duration).toBeNull();
    expect(details.startNotBeforeEnd).toBe(false);
    expect(details.outsideDay).toBe(false);
  });
});

describe('F5 scope: only the selected room bookings are checked', () => {
  it('ignores bookings that belong to other rooms', () => {
    const room205 = SAMPLE_ROOMS[4];
    const result = checkAvailability(room205, 600, 660, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toEqual([]);
  });
});

