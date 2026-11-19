import { useMemo } from 'react';
import type { Room } from '@/types';
import { minutesToLabel, percentOfDay } from '@/lib/time';

interface TimelineProps {
  room: Room;
  candidateStart: number | null;
  candidateEnd: number | null;
  available: boolean;
}

const HOUR_MARKS = Array.from({ length: 25 }, (_, i) => i * 60);

export default function Timeline({
  room,
  candidateStart,
  candidateEnd,
  available,
}: TimelineProps) {
  const candidateWidth = useMemo(() => {
    if (candidateStart == null || candidateEnd == null) return 0;
    return candidateEnd - candidateStart;
  }, [candidateStart, candidateEnd]);

  const candidateLeft = candidateStart != null ? percentOfDay(candidateStart) : '0%';

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Daily schedule — {room.name}
        </h4>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-400" />
            Booked
          </span>
          {candidateStart != null && candidateEnd != null && (
            <span className="flex items-center gap-1">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-sm ${
                  available ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              Requested
            </span>
          )}
        </div>
      </div>

      <div className="relative h-14 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {/* Hour gridlines */}
        {HOUR_MARKS.map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 border-l border-slate-200/70"
            style={{ left: percentOfDay(m) }}
          />
        ))}

        {/* Existing bookings */}
        {room.bookings.map((b, i) => (
          <div
            key={i}
            className="absolute top-1 bottom-1 flex items-center justify-center overflow-hidden rounded bg-slate-400/80 px-1 text-[9px] font-medium text-white"
            style={{
              left: percentOfDay(b.start),
              width: percentOfDay(b.end - b.start),
            }}
            title={`${minutesToLabel(b.start)}–${minutesToLabel(b.end)}: ${b.purpose}`}
          >
            {b.end - b.start >= 40 ? b.purpose : ''}
          </div>
        ))}

        {/* Blocked overlay */}
        {room.blocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-100/60 text-xs font-semibold text-rose-600">
            Blocked
          </div>
        )}

        {/* Candidate interval */}
        {candidateStart != null && candidateEnd != null && candidateWidth > 0 && (
          <div
            className={`absolute top-0 bottom-0 rounded border-2 ${
              available
                ? 'border-emerald-500 bg-emerald-400/30'
                : 'border-rose-500 bg-rose-400/30'
            }`}
            style={{ left: candidateLeft, width: percentOfDay(candidateWidth) }}
          />
        )}
      </div>

      {/* Hour labels */}
      <div className="relative mt-1 h-4 w-full text-[9px] text-slate-400">
        {[0, 6, 12, 18, 24].map((h) => (
          <span
            key={h}
            className="absolute -translate-x-1/2"
            style={{ left: `${(h / 24) * 100}%` }}
          >
            {String(h).padStart(2, '0')}:00
          </span>
        ))}
      </div>
    </div>
  );
}
