'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Plus, FileText, Trash2, ArrowRight, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface FRDItem {
  id: string;
  filename: string;
  status: 'draft' | 'pending_approval' | 'approved';
  template?: { version: number };
  updated_at: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [frds, setFrds] = useState<FRDItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFrds = async () => {
    setLoading(true);
    const res = await apiFetch('/frds');
    setLoading(false);

    if (res.error) {
      setError(res.message || res.error);
      return;
    }

    if (res.data?.frds) {
      setFrds(res.data.frds);
    }
  };

  useEffect(() => {
    fetchFrds();
  }, []);

  const handleStartNewFrd = async () => {
    const res = await apiFetch('/frds', {
      method: 'POST',
      body: JSON.stringify({ company_name: 'New Quotation Draft' }),
    });

    if (res.data?.frd) {
      router.push(`/dashboard/wizard/${res.data.frd.id}`);
    } else {
      alert(res.message || 'Failed to initialize new FRD draft');
    }
  };

  const handleDeleteFrd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FRD draft?')) return;

    const res = await apiFetch(`/frds/${id}`, { method: 'DELETE' });
    if (res.error) {
      alert(res.message || 'Failed to delete FRD draft');
      return;
    }
    fetchFrds();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-border pb-6">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            {"// DOCUMENT SPECIFICATIONS"}
          </span>
          <h1 className="text-2xl font-bold font-display text-ink">Functional Requirement Documents</h1>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Manage your FRD drafts, view approval status, or initialize a new specification proposal.
          </p>
        </div>

        <button
          onClick={handleStartNewFrd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Start New FRD</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-ink-muted border border-ink-border rounded-lg bg-white">
          <span>Loading client FRD documents under PostgreSQL RLS policy...</span>
        </div>
      ) : frds.length === 0 ? (
        <div className="py-16 px-6 text-center border-2 border-dashed border-ink-border rounded-lg bg-white space-y-4 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-cobalt-light text-cobalt flex items-center justify-center mx-auto border border-cobalt/20">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-ink">No FRD Drafts Yet</h3>
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            Initialize your first guided quotation specification. Select products, modules, auto-derive your tech stack, and generate AI architecture flows.
          </p>
          <button
            onClick={handleStartNewFrd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Start Your First FRD</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frds.map((frd) => (
            <div
              key={frd.id}
              className="bg-white border border-ink-border rounded-lg p-6 shadow-sm hover:border-cobalt/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-ink-border/60 pb-3 mb-4">
                  <span className="text-[10px] font-mono text-ink-muted">
                    TEMPLATE V{frd.template?.version || 1}
                  </span>
                  {frd.status === 'draft' && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                      ● Draft
                    </span>
                  )}
                  {frd.status === 'pending_approval' && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cobalt-light text-cobalt border border-cobalt/20 uppercase">
                      ● Pending Approval
                    </span>
                  )}
                  {frd.status === 'approved' && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      ✓ Approved
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-ink line-clamp-1 mb-2">
                  {frd.filename}
                </h3>
                <p className="text-xs font-mono text-ink-muted flex items-center gap-1.5 mb-6">
                  <Clock className="w-3.5 h-3.5 text-cobalt" />
                  <span>Updated: {new Date(frd.updated_at).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-ink-border/60 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteFrd(frd.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Delete Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  href={`/dashboard/wizard/${frd.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-paper hover:bg-white text-ink border border-ink-border hover:border-ink text-xs font-mono font-semibold rounded transition-all"
                >
                  <span>Continue Wizard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
