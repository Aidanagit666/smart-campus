import type { Booking, CheckResult, RejectReason, Room } from '@/types';
import { MINUTES_PER_DAY, durationLabel, minutesToLabel } from '@/lib/time';

export const MAX_BOOKING_MINUTES = 120;

interface IntervalValidation {
  isValid: boolean;
  startNotBeforeEnd: boolean;
  outsideDay: boolean;
}

export interface IntervalDetails extends IntervalValidation {
  duration: number | null;
  durationOverLimit: boolean;
}

function validateInterval(start: number, end: number): IntervalValidation {
  const isNumeric = !Number.isNaN(start) && !Number.isNaN(end);
  const startNotBeforeEnd = isNumeric && start >= end;
  const outsideDay = isNumeric && (start < 0 || end > MINUTES_PER_DAY);
  return {
    isValid: isNumeric && !startNotBeforeEnd && !outsideDay,
    startNotBeforeEnd,
    outsideDay,
  };
}

export function describeInterval(start: number, end: number): IntervalDetails {
  const duration = end > start ? end - start : null;
  return {
    ...validateInterval(start, end),
    duration,
    durationOverLimit: duration !== null && duration > MAX_BOOKING_MINUTES,
  };
}

function intervalsOverlap(aStart: number, aEnd: number, b: Booking): boolean {
  // Touching endpoints are allowed: [a, b) and [b, c) do not overlap.
  return aStart < b.end && b.start < aEnd;
}

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number,
): CheckResult {
  const reasons: RejectReason[] = [];
  const messages: string[] = [];
  const interval = describeInterval(start, end);

  // AC1: valid interval — 0 <= start < end <= 1440 and start after current time.
  const validRange = interval.isValid;
  if (!validRange) {
    reasons.push('invalid-interval');
    messages.push(
      'The interval is invalid. Start must be earlier than end, and both must fall within 00:00–24:00.',
    );
  }

  const startAfterNow = start > currentTime;
  if (validRange && !startAfterNow) {
    reasons.push('start-before-now');
    messages.push(
      `Start time must be after the current time (${minutesToLabel(currentTime)}).`,
    );
  }

  // AC2: booking longer than 120 minutes.
  if (validRange && interval.durationOverLimit) {
    reasons.push('too-long');
    messages.push(
      `The requested duration is ${durationLabel(end - start)}, which exceeds the 120-minute maximum.`,
    );
  }

  // AC3: room is blocked.
  if (room.blocked) {
    reasons.push('room-blocked');
    messages.push(
      `${room.name} is currently blocked${room.blockedReason ? `: ${room.blockedReason}` : '.'}`,
    );
  }

  // AC4: overlapping an existing booking.
  if (validRange) {
    const conflicts = room.bookings.filter((b) => intervalsOverlap(start, end, b));
    if (conflicts.length > 0) {
      reasons.push('overlapping-booking');
      const detail = conflicts
        .map(
          (b) =>
            `${minutesToLabel(b.start)}–${minutesToLabel(b.end)} (${b.purpose})`,
        )
        .join(', ');
      messages.push(`The interval overlaps an existing booking: ${detail}.`);
    }
  }

  return {
    available: reasons.length === 0,
    reasons,
    messages,
  };
}
