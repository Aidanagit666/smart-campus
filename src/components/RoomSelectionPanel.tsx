import type { Equipment, Room } from '@/types';
import RoomCard from '@/components/RoomCard';
import RoomFilters from '@/components/RoomFilters';

interface RoomSelectionPanelProps {
  visibleRooms: Room[];
  selectedRoomId: string | null;
  attendeesInput: string;
  attendeesValid: boolean;
  requiredEquipment: Equipment[];
  onAttendeesChange: (value: string) => void;
  onToggleEquipment: (item: Equipment) => void;
  onSelectRoom: (roomId: string) => void;
}

export default function RoomSelectionPanel({
  visibleRooms,
  selectedRoomId,
  attendeesInput,
  attendeesValid,
  requiredEquipment,
  onAttendeesChange,
  onToggleEquipment,
  onSelectRoom,
}: RoomSelectionPanelProps) {
  return (
    <section className="lg:col-span-2">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Select a Room
      </h2>
      <RoomFilters
        attendeesInput={attendeesInput}
        attendeesValid={attendeesValid}
        selectedEquipment={requiredEquipment}
        onAttendeesChange={onAttendeesChange}
        onToggleEquipment={onToggleEquipment}
      />
      {visibleRooms.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
          No rooms match these filters. Try fewer attendees or fewer required equipment items.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {visibleRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              selected={room.id === selectedRoomId}
              onSelect={() => onSelectRoom(room.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
