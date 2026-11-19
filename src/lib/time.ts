export const MINUTES_PER_DAY = 1440;

const QUICK_SET_STEP_MIN = 15;
const QUICK_SET_DURATION_MIN = 60;

function clampToDay(min: number): number {
  return Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(min)));
}

function toClock(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function minutesToTime(min: number): string {
  return toClock(clampToDay(min));
}

export function timeToMinutes(time: string): number {
  const parts = time.split(':');
  if (parts.length < 2) return NaN;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
  return h * 60 + m;
}

export function minutesToLabel(min: number): string {
  const clamped = clampToDay(min);
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0
    ? `${displayH}:00 ${period}`
    : `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

export function durationLabel(minutes: number): string {
  if (minutes <= 0) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function percentOfDay(min: number): string {
  return `${(min / MINUTES_PER_DAY) * 100}%`;
}

export function currentMinutesOfDay(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export interface QuickSetTimes {
  start: string;
  end: string;
}

// Returns null when the interval would end after midnight, which cannot be expressed as a valid time input.
export function quickSetTimes(currentMinutes: number, offsetMin: number): QuickSetTimes | null {
  const start =
    (Math.floor(currentMinutes / QUICK_SET_STEP_MIN) + 1) * QUICK_SET_STEP_MIN + offsetMin;
  const end = start + QUICK_SET_DURATION_MIN;
  if (end >= MINUTES_PER_DAY) return null;
  return { start: toClock(start), end: toClock(end) };
}
