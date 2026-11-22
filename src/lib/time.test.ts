import { describe, expect, it } from 'vitest';
import {
  durationLabel,
  minutesToTime,
  percentOfDay,
  quickSetTimes,
  timeToMinutes,
} from '@/lib/time';

describe('time helpers', () => {
  it('clamps minutesToTime to the day', () => {
    expect(minutesToTime(-30)).toBe('00:00');
    expect(minutesToTime(1500)).toBe('24:00');
    expect(minutesToTime(600)).toBe('10:00');
  });

  it('rounds quick-set starts up to the next 15 minutes and adds one hour', () => {
    expect(quickSetTimes(547, 0)).toEqual({ start: '09:15', end: '10:15' });
    expect(quickSetTimes(547, 60)).toEqual({ start: '10:15', end: '11:15' });
  });

  it('always starts strictly after the current time, even on a quarter hour', () => {
    expect(quickSetTimes(900, 0)).toEqual({ start: '15:15', end: '16:15' });
  });

  it('keeps intervals that end before midnight', () => {
    expect(quickSetTimes(1320, 0)).toEqual({ start: '22:15', end: '23:15' });
  });

  it('returns null when the interval would end after midnight', () => {
    expect(quickSetTimes(1380, 0)).toBeNull();
    expect(quickSetTimes(1430, 0)).toBeNull();
    expect(quickSetTimes(1320, 60)).toBeNull();
  });

  it('formats percentages of the day', () => {
    expect(percentOfDay(720)).toBe('50%');
  });

  it('formats durations for display', () => {
    expect(durationLabel(0)).toBe('0 min');
    expect(durationLabel(60)).toBe('1 hr');
    expect(durationLabel(121)).toBe('2 hr 1 min');
  });
    it('rejects invalid clock times', () => {
    expect(Number.isNaN(timeToMinutes('25:90'))).toBe(true);
    expect(Number.isNaN(timeToMinutes('12:99'))).toBe(true);
    expect(Number.isNaN(timeToMinutes('abc'))).toBe(true);
    expect(timeToMinutes('10:30')).toBe(630);
  });
});
