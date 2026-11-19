import { ArrowRight, Info, RefreshCw } from 'lucide-react';
import { MAX_BOOKING_MINUTES, type IntervalDetails } from '@/lib/availability';
import { durationLabel, minutesToTime, quickSetTimes } from '@/lib/time';
import Panel from '@/components/Panel';

const QUICK_SETS = [
  { label: 'Next 15 min', offsetMin: 0 },
  { label: 'In 1 hour', offsetMin: 60 },
  { label: 'In 3 hours', offsetMin: 180 },
];

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20';
const QUICK_SET_CLASS =
  'rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-100';

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  tinted?: boolean;
  hint?: string;
}

function TimeField({ id, label, value, onChange, tinted = false, hint }: TimeFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLASS} ${tinted ? 'bg-sky-50/40' : ''}`}
      />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

interface IntervalFormProps {
  currentTime: number;
  startTime: string;
  endTime: string;
  interval: IntervalDetails;
  canCheck: boolean;
  onCurrentTimeChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onQuickSet: (offsetMin: number) => void;
  onCheck: () => void;
  onReset: () => void;
}

export default function IntervalForm({
  currentTime,
  startTime,
  endTime,
  interval,
  canCheck,
  onCurrentTimeChange,
  onStartTimeChange,
  onEndTimeChange,
  onQuickSet,
  onCheck,
  onReset,
}: IntervalFormProps) {
  return (
    <Panel>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Requested Interval
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <TimeField
          id="current-time"
          label="Current time"
          value={minutesToTime(currentTime)}
          onChange={onCurrentTimeChange}
          tinted
          hint="Used for AC1 validation (start must be after this)"
        />
        <TimeField
          id="start-time"
          label="Start time"
          value={startTime}
          onChange={onStartTimeChange}
        />
        <TimeField
          id="end-time"
          label="End time"
          value={endTime}
          onChange={onEndTimeChange}
        />
      </div>

      {interval.duration != null && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-slate-500">Duration:</span>
          <span
            className={`font-semibold ${
              interval.durationOverLimit ? 'text-rose-600' : 'text-slate-700'
            }`}
          >
            {durationLabel(interval.duration)}
          </span>
          {interval.durationOverLimit && (
            <span className="text-xs text-rose-500">
              (exceeds {MAX_BOOKING_MINUTES} min max)
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_SETS.map((quick) => {
          const endsAfterMidnight = quickSetTimes(currentTime, quick.offsetMin) === null;
          return (
            <button
              key={quick.label}
              type="button"
              onClick={() => onQuickSet(quick.offsetMin)}
              disabled={endsAfterMidnight}
              title={endsAfterMidnight ? 'This interval would end after midnight' : undefined}
              className={QUICK_SET_CLASS}
            >
              {quick.label}
            </button>
          );
        })}
      </div>

      {(interval.startNotBeforeEnd || interval.outsideDay) && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            {interval.startNotBeforeEnd && 'Start time must be earlier than end time. '}
            {interval.outsideDay && 'Times must be within 00:00–24:00.'}
          </span>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCheck}
          disabled={!canCheck}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-600 disabled:active:scale-100"
        >
          Check Availability
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </Panel>
  );
}
