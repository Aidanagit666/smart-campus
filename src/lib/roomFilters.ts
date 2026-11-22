import type { Equipment, Room } from '@/types';

export function parseAttendees(input: string): number | null {
  const trimmed = input.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isSafeInteger(value) && value >= 1 ? value : null;
}

export function filterRooms(
  rooms: Room[],
  minCapacity: number,
  requiredEquipment: Equipment[],
): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= minCapacity &&
      requiredEquipment.every((item) => room.equipment.includes(item)),
  );
}
