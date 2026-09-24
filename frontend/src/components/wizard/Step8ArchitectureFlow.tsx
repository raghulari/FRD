'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useWizardStore } from '@/store/useWizardStore';
import { Sparkles, RefreshCw, Cpu, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export function Step8ArchitectureFlow() {
  const params = useParams();
  const frdId = params.id as string;
  const { selectionTree, updateSelectionTree } = useWizardStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(
    selectionTree.step_8_architecture || null
  );
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>('');

  async function fetchArchitecture(forceRefresh = false) {
    setLoading(true);
    setError(null);

    const res = await apiFetch('/ai/generate-architecture', {
      method: 'POST',
      body: JSON.stringify({ frdId, forceRefresh }),
    });

    setLoading(false);

    if (res.data?.content) {
      setData(res.data.content);
      setFromCache(res.data.fromCache);
      setModelUsed(res.data.modelUsed || 'NVIDIA-NIM-Engine');
      updateSelectionTree('step_8_architecture', res.data.content);
    } else {
      setError(res.error || res.message || 'Failed to generate system architecture');
    }
  }

  useEffect(() => {
    if (!data && frdId) {
      fetchArchitecture(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frdId]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 8 OF 12 // NVIDIA AI ARCHITECTURE SYNTHESIS
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            System Architecture & Flow Diagram
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            AI-synthesized high-level architectural diagram and topology flow based on your catalog module selections.
          </p>
        </div>

        <button
          onClick={() => fetchArchitecture(true)}
          disabled={loading}
          className="px-4 py-2 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synthesizing Architecture...' : 'Re-generate with NVIDIA AI'}</span>
        </button>
      </div>

      {/* AI Cache & Model Badge */}
      {modelUsed && (
        <div className="flex items-center justify-between bg-paper border border-ink-border px-4 py-2 rounded text-xs font-mono">
          <div className="flex items-center gap-2 text-ink">
            <Cpu className="w-4 h-4 text-cobalt" />
            <span>AI Model: <strong className="text-cobalt">{modelUsed}</strong></span>
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
          <h3 className="font-display font-bold text-lg text-ink">NVIDIA NIM AI Processing...</h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto font-sans">
            Analyzing product categories, modules, multi-tenant RLS rules, and tech stack parameters to draft system topology.
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Overview text */}
          <div className="bg-white border border-ink-border rounded-lg p-6 space-y-3 shadow-sm">
            <h3 className="font-display font-bold text-sm text-ink uppercase tracking-wider font-mono text-cobalt">
              {"// Architectural System Overview"}
            </h3>
            <p className="text-xs text-ink leading-relaxed font-sans">
              {data.overview_text}
            </p>
          </div>

          {/* Mermaid / Topology Visual Box */}
          <div className="bg-ink text-white border border-ink-border rounded-lg p-6 space-y-3 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-cobalt-light font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Mermaid.js Topology Blueprint
              </span>
              <span className="text-[10px] text-white/50">RENDER: SYSTEM_FLOW</span>
            </div>

            <pre className="p-4 bg-black/40 rounded border border-white/10 overflow-x-auto text-emerald-400 leading-relaxed text-[11px]">
              {data.mermaid_code}
            </pre>
          </div>

          {/* Core Components Table */}
          <div className="bg-white border border-ink-border rounded-lg p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-ink">Core Component Mapping</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left font-sans">
                <thead>
                  <tr className="bg-paper border-b border-ink-border font-mono text-ink-muted">
                    <th className="p-3">Component / Subsystem</th>
                    <th className="p-3">Architectural Role & Responsibilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-border/60">
                  {data.components?.map((c: any, idx: number) => (
                    <tr key={idx} className="hover:bg-paper/50">
                      <td className="p-3 font-mono font-bold text-cobalt">{c.name}</td>
                      <td className="p-3 text-ink-muted">{c.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
