export interface Booking {
  start: number; // minutes from midnight (0–1440)
  end: number;
  bookedBy: string;
  purpose: string;
}

export const EQUIPMENT_OPTIONS = [
  'Projector',
  'Whiteboard',
  'Video conferencing',
  'Lab computers',
] as const;

export type Equipment = (typeof EQUIPMENT_OPTIONS)[number];

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: Equipment[];
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export type RejectReason =
  | 'invalid-interval'
  | 'start-before-now'
  | 'too-long'
  | 'room-blocked'
  | 'overlapping-booking';

export interface CheckResult {
  available: boolean;
  reasons: RejectReason[];
  messages: string[];
}
