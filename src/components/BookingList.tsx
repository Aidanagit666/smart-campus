import type { Room } from '@/types';
import { durationLabel, minutesToLabel } from '@/lib/time';
import Panel from '@/components/Panel';

interface BookingListProps {
  room: Room;
}

export default function BookingList({ room }: BookingListProps) {
  return (
    <Panel>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Existing Bookings — {room.name}
      </h3>
      {room.blocked ? (
        <p className="text-sm text-rose-600">This room is blocked and cannot be booked.</p>
      ) : room.bookings.length === 0 ? (
        <p className="text-sm text-emerald-600">No existing bookings for today.</p>
      ) : (
        <ul className="space-y-2">
          {room.bookings.map((b, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 text-sm"
            >
              <div>
                <span className="font-medium text-slate-700">
                  {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
                </span>
                <span className="ml-2 text-slate-400">({durationLabel(b.end - b.start)})</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-600">{b.purpose}</p>
                <p className="text-xs text-slate-400">{b.bookedBy}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
