'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useWizardStore } from '@/store/useWizardStore';
import { Sparkles, RefreshCw, Cpu, CheckCircle2, Calendar, Clock, AlertCircle } from 'lucide-react';

export function Step9ImplementationPhases() {
  const params = useParams();
  const frdId = params.id as string;
  const { selectionTree, updateSelectionTree } = useWizardStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(
    selectionTree.step_9_implementation_phases || null
  );
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>('');

  async function fetchPhases(forceRefresh = false) {
    setLoading(true);
    setError(null);

    const res = await apiFetch('/ai/generate-phases', {
      method: 'POST',
      body: JSON.stringify({ frdId, forceRefresh }),
    });

    setLoading(false);

    if (res.data?.content) {
      setData(res.data.content);
      setFromCache(res.data.fromCache);
      setModelUsed(res.data.modelUsed || 'NVIDIA-NIM-Engine');
      updateSelectionTree('step_9_implementation_phases', res.data.content);
    } else {
      setError(res.error || res.message || 'Failed to generate implementation phases');
    }
  }

  useEffect(() => {
    if (!data && frdId) {
      fetchPhases(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frdId]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 9 OF 12 // NVIDIA AI IMPLEMENTATION PHASES
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            Project Implementation Phases & Milestones
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            AI-synthesized 5-phase execution roadmap mapping key deliverables and sprint timelines.
          </p>
        </div>

        <button
          onClick={() => fetchPhases(true)}
          disabled={loading}
          className="px-4 py-2 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Generating Phases...' : 'Re-generate with NVIDIA AI'}</span>
        </button>
      </div>

      {/* AI Cache Badge */}
      {modelUsed && (
        <div className="flex items-center justify-between bg-paper border border-ink-border px-4 py-2 rounded text-xs font-mono">
          <div className="flex items-center gap-2 text-ink">
            <Cpu className="w-4 h-4 text-cobalt" />
            <span>AI Engine: <strong className="text-cobalt">{modelUsed}</strong></span>
          </div>
          {fromCache ? (
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 text-[10px] font-semibold">
              ⚡ Loaded from Postgres SHA-256 Cache
            </span>
          ) : (
            <span className="text-cobalt bg-cobalt-light px-2.5 py-0.5 rounded border border-cobalt/20 text-[10px] font-semibold">
              ✨ Fresh AI Generated Synthesis
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !data && (
        <div className="bg-white border border-ink-border rounded-lg p-16 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cobalt-light text-cobalt animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-ink">Generating Implementation Timeline...</h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto font-sans">
            Structuring deliverables into 5 sequential technical phases with target durations.
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="bg-paper border border-ink-border rounded-lg p-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink">TOTAL IMPLEMENTATION CYCLE:</span>
            <span className="font-mono text-sm font-bold text-cobalt bg-white px-3 py-1 rounded border border-ink-border">
              {data.total_duration_weeks || 10} Weeks (~{((data.total_duration_weeks || 10) / 4.33).toFixed(1)} Months)
            </span>
          </div>

          <div className="space-y-4">
            {data.phases?.map((p: any) => (
              <div key={p.phase_number} className="bg-white border border-ink-border rounded-lg p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-ink-border pb-3">
                  <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cobalt text-white text-xs font-mono font-bold flex items-center justify-center">
                      {p.phase_number}
                    </span>
                    {p.phase_name}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-cobalt bg-cobalt-light px-2.5 py-1 rounded border border-cobalt/20">
                    Duration: {p.duration_weeks} {p.duration_weeks === 1 ? 'Week' : 'Weeks'}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-ink-muted uppercase block mb-2">Key Engineering Deliverables:</span>
                  <ul className="space-y-2">
                    {p.deliverables?.map((d: string, idx: number) => (
                      <li key={idx} className="text-xs text-ink font-sans flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
