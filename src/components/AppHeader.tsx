import { Clock, RefreshCw, Building2 } from 'lucide-react';
import { minutesToLabel } from '@/lib/time';

interface AppHeaderProps {
  currentTime: number;
  onRefreshClock: () => void;
}

export default function AppHeader({ currentTime, onRefreshClock }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
              Smart Campus Room Checker
            </h1>
            <p className="text-xs text-slate-500">
              Check room availability without affecting existing bookings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
          <Clock className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <span className="font-medium">Now: {minutesToLabel(currentTime)}</span>
          <button
            type="button"
            onClick={onRefreshClock}
            className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
            title="Reset to real system time"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
