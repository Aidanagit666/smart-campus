import { AlertCircle, X, CheckCircle2, Clock, Lock, CalendarX, type LucideIcon } from 'lucide-react';
import type { CheckResult, RejectReason } from '@/types';

interface ResultPanelProps {
  result: CheckResult | null;
  duration: number | null;
}

const REASON_ICONS: Record<RejectReason, LucideIcon> = {
  'invalid-interval': AlertCircle,
  'start-before-now': Clock,
  'too-long': Clock,
  'room-blocked': Lock,
  'overlapping-booking': CalendarX,
};

const AVAILABLE_TONE = {
  card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',
  badge: 'bg-emerald-500',
  title: 'text-emerald-700',
  subtitle: 'text-emerald-600',
};

const UNAVAILABLE_TONE = {
  card: 'border-rose-200 bg-gradient-to-br from-rose-50 to-white',
  badge: 'bg-rose-500',
  title: 'text-rose-700',
  subtitle: 'text-rose-600',
};

interface ResultHeaderProps {
  tone: typeof AVAILABLE_TONE;
  Icon: LucideIcon;
  title: string;
  message: string;
  duration: number | null;
}

function ResultHeader({ tone, Icon, title, message, duration }: ResultHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tone.badge}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <h3 className={`text-xl font-bold ${tone.title}`}>{title}</h3>
        <p className={`text-sm ${tone.subtitle}`}>
          {duration != null && `${duration} min — `}
          {message}
        </p>
      </div>
    </div>
  );
}

export default function ResultPanel({ result, duration }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
        <Clock className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-400">
          Select a room and enter a time interval to check availability.
        </p>
      </div>
    );
  }

  if (result.available) {
    return (
      <div className={`flex h-full flex-col rounded-2xl border p-6 ${AVAILABLE_TONE.card}`}>
        <ResultHeader
          tone={AVAILABLE_TONE}
          Icon={CheckCircle2}
          title="Available"
          message="This room can be booked for the requested interval."
          duration={duration}
        />
        <div className="mt-4 rounded-lg bg-emerald-100/60 p-3 text-sm text-emerald-700">
          No conflicts detected. The existing booking data has not been modified.
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col rounded-2xl border p-6 ${UNAVAILABLE_TONE.card}`}>
      <ResultHeader
        tone={UNAVAILABLE_TONE}
        Icon={X}
        title="Unavailable"
        message="This booking cannot be placed."
        duration={duration}
      />
      <ul className="mt-4 space-y-2">
        {result.messages.map((msg, i) => {
          const Icon = REASON_ICONS[result.reasons[i]] ?? AlertCircle;
          return (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-rose-100/50 p-3 text-sm text-rose-700">
              <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{msg}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
