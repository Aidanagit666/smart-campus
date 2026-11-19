import type { ExplanationOutcome } from '@/lib/explainAvailability';

interface Props {
  loading: boolean;
  outcome: ExplanationOutcome | null;
  onExplain: () => void;
}

export default function ExplanationPanel({ loading, outcome, onExplain }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Availability explanation">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Generated explanation</h2>
          <p className="text-sm text-slate-500">Mock AI demonstration. The confirmed status is shown above.</p>
        </div>
        <button
          type="button"
          onClick={onExplain}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >{loading ? 'Explaining…' : 'Explain availability'}</button>
      </div>
      {outcome && <p role="status" className="mt-3 text-sm text-slate-700">{outcome.ok ? outcome.summary : outcome.message}</p>}
    </section>
  );
}
