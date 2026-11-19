import { Lock, Users, MapPin } from 'lucide-react';
import type { Room } from '@/types';

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

export default function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full rounded-xl border p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/20'
          : room.blocked
            ? 'border-slate-200 bg-slate-50/80 hover:border-slate-300'
            : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-800">{room.name}</h3>
            {room.blocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                <Lock className="h-3 w-3" />
                Blocked
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {room.building}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {room.capacity} seats
            </span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {room.equipment.length > 0 ? room.equipment.join(' · ') : 'No listed equipment'}
      </p>

      {room.blocked && room.blockedReason && (
        <p className="mt-2 text-xs text-rose-500">{room.blockedReason}</p>
      )}

      {!room.blocked && room.bookings.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          {room.bookings.length} existing booking{room.bookings.length > 1 ? 's' : ''} today
        </p>
      )}
      {!room.blocked && room.bookings.length === 0 && (
        <p className="mt-2 text-xs text-emerald-500">No bookings today</p>
      )}
    </button>
  );
}
