import { describe, expect, it } from 'vitest';
import { SAMPLE_ROOMS } from '@/data/rooms';
import { filterRooms, parseAttendees } from '@/lib/roomFilters';

describe('F1: rooms are filtered by capacity', () => {
  it('shows only rooms with capacity greater than or equal to attendees', () => {
    const ids = filterRooms(SAMPLE_ROOMS, 25, []).map((r) => r.id);
    expect(ids).toEqual(['room-101', 'room-102', 'room-103', 'room-201']);
  });

  it('includes a room whose capacity exactly matches the attendee count', () => {
    const ids = filterRooms(SAMPLE_ROOMS, 20, []).map((r) => r.id);
    expect(ids).toContain('room-205');
  });

  it('returns no rooms when attendees exceed every capacity', () => {
    expect(filterRooms(SAMPLE_ROOMS, 61, [])).toEqual([]);
  });
});

describe('F2: rooms are filtered by required equipment', () => {
  it('shows only rooms that contain ALL selected equipment', () => {
    const ids = filterRooms(SAMPLE_ROOMS, 1, ['Projector', 'Video conferencing']).map(
      (r) => r.id,
    );
    expect(ids).toEqual(['room-103', 'room-201']);
  });

  it('shows every room when no equipment is required', () => {
    expect(filterRooms(SAMPLE_ROOMS, 1, [])).toHaveLength(SAMPLE_ROOMS.length);
  });
});

describe('F1 and F2 combined', () => {
  it('applies capacity and equipment together', () => {
    const ids = filterRooms(SAMPLE_ROOMS, 50, ['Projector', 'Whiteboard']).map((r) => r.id);
    expect(ids).toEqual(['room-201']);
  });

  it('does not mutate the room fixtures', () => {
    const before = structuredClone(SAMPLE_ROOMS);
    filterRooms(SAMPLE_ROOMS, 30, ['Whiteboard']);
    expect(SAMPLE_ROOMS).toEqual(before);
  });
});

describe('attendee input parsing', () => {
  it('accepts whole numbers of at least 1', () => {
    expect(parseAttendees('1')).toBe(1);
    expect(parseAttendees(' 12 ')).toBe(12);
  });

  it('rejects zero, blanks, decimals, and text', () => {
    expect(parseAttendees('0')).toBeNull();
    expect(parseAttendees('')).toBeNull();
    expect(parseAttendees('2.5')).toBeNull();
    expect(parseAttendees('abc')).toBeNull();
    expect(parseAttendees('-3')).toBeNull();
  });
});
