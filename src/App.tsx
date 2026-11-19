import { useMemo, useState } from 'react';
import type { CheckResult, Equipment, Room } from '@/types';
import { SAMPLE_ROOMS } from '@/data/rooms';
import { checkAvailability, describeInterval } from '@/lib/availability';
import { filterRooms, parseAttendees } from '@/lib/roomFilters';
import {
  currentMinutesOfDay,
  quickSetTimes,
  timeToMinutes,
} from '@/lib/time';
import AppHeader from '@/components/AppHeader';
import BookingList from '@/components/BookingList';
import IntervalForm from '@/components/IntervalForm';
import Panel from '@/components/Panel';
import ResultPanel from '@/components/ResultPanel';
import RoomSelectionPanel from '@/components/RoomSelectionPanel';
import Timeline from '@/components/Timeline';

const DEFAULT_START_TIME = '10:00';
const DEFAULT_END_TIME = '11:00';

export default function App() {
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(SAMPLE_ROOMS[0].id);
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [currentTime, setCurrentTime] = useState(currentMinutesOfDay);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [attendeesInput, setAttendeesInput] = useState('1');
  const [requiredEquipment, setRequiredEquipment] = useState<Equipment[]>([]);

  const attendeeCount = parseAttendees(attendeesInput);
  const visibleRooms = useMemo(
    () => filterRooms(rooms, attendeeCount ?? 1, requiredEquipment),
    [rooms, attendeeCount, requiredEquipment],
  );
  const selectedRoom =
    visibleRooms.find((r) => r.id === selectedRoomId) ?? visibleRooms[0] ?? null;

  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const interval = describeInterval(startMin, endMin);

  const candidateStart = result && !Number.isNaN(startMin) ? startMin : null;
  const candidateEnd = result && !Number.isNaN(endMin) ? endMin : null;

  function handleCheck() {
    if (!selectedRoom) return;
    setResult(checkAvailability(selectedRoom, startMin, endMin, currentTime));
  }

  function handleReset() {
    setResult(null);
    setStartTime(DEFAULT_START_TIME);
    setEndTime(DEFAULT_END_TIME);
    setCurrentTime(currentMinutesOfDay());
  }

  function handleQuickSet(offsetMin: number) {
    const quick = quickSetTimes(currentTime, offsetMin);
    if (!quick) return;
    setStartTime(quick.start);
    setEndTime(quick.end);
    setResult(null);
  }

  function handleRefreshClock() {
    setCurrentTime(currentMinutesOfDay());
    setResult(null);
  }

  function handleCurrentTimeChange(value: string) {
    setCurrentTime(timeToMinutes(value));
    setResult(null);
  }

  function handleStartTimeChange(value: string) {
    setStartTime(value);
    setResult(null);
  }

  function handleEndTimeChange(value: string) {
    setEndTime(value);
    setResult(null);
  }

  function handleSelectRoom(roomId: string) {
    setSelectedRoomId(roomId);
    setResult(null);
  }

  function handleAttendeesChange(value: string) {
    setAttendeesInput(value);
    setResult(null);
  }

  function handleToggleEquipment(item: Equipment) {
    setRequiredEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <AppHeader currentTime={currentTime} onRefreshClock={handleRefreshClock} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-5">
          <RoomSelectionPanel
            visibleRooms={visibleRooms}
            selectedRoomId={selectedRoom?.id ?? null}
            attendeesInput={attendeesInput}
            attendeesValid={attendeeCount !== null}
            requiredEquipment={requiredEquipment}
            onAttendeesChange={handleAttendeesChange}
            onToggleEquipment={handleToggleEquipment}
            onSelectRoom={handleSelectRoom}
          />

          <section className="lg:col-span-3 space-y-6">
            <IntervalForm
              currentTime={currentTime}
              startTime={startTime}
              endTime={endTime}
              interval={interval}
              canCheck={selectedRoom !== null}
              onCurrentTimeChange={handleCurrentTimeChange}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              onQuickSet={handleQuickSet}
              onCheck={handleCheck}
              onReset={handleReset}
            />

            {selectedRoom && (
              <Panel>
                <Timeline
                  room={selectedRoom}
                  candidateStart={candidateStart}
                  candidateEnd={candidateEnd}
                  available={result?.available ?? false}
                />
              </Panel>
            )}

            <ResultPanel result={result} duration={interval.duration} />

            {selectedRoom && <BookingList room={selectedRoom} />}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Smart Campus Room Availability Checker — Sample data, no backend required.
      </footer>
    </div>
  );
}
