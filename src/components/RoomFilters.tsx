import { EQUIPMENT_OPTIONS, type Equipment } from '@/types';

interface RoomFiltersProps {
  attendeesInput: string;
  attendeesValid: boolean;
  selectedEquipment: Equipment[];
  onAttendeesChange: (value: string) => void;
  onToggleEquipment: (item: Equipment) => void;
}

export default function RoomFilters({
  attendeesInput,
  attendeesValid,
  selectedEquipment,
  onAttendeesChange,
  onToggleEquipment,
}: RoomFiltersProps) {
  return (
    <div className="mb-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label htmlFor="attendees" className="mb-1.5 block text-sm font-medium text-slate-700">
          Number of attendees
        </label>
        <input
          id="attendees"
          type="text"
          inputMode="numeric"
          value={attendeesInput}
          onChange={(e) => onAttendeesChange(e.target.value)}
          aria-invalid={!attendeesValid}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 transition focus:outline-none focus:ring-2 ${
            attendeesValid
              ? 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/20'
              : 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
          }`}
        />
        {!attendeesValid && (
          <p className="mt-1 text-xs text-rose-600">Enter a whole number of at least 1.</p>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">Required equipment</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {EQUIPMENT_OPTIONS.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-sky-300 hover:bg-sky-50/40"
            >
              <input
                type="checkbox"
                checked={selectedEquipment.includes(item)}
                onChange={() => onToggleEquipment(item)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500/30"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
