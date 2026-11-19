import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
}

export default function Panel({ children }: PanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {children}
    </div>
  );
}
