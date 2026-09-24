'use client';

import { ShieldAlert, Lock, CheckSquare, AlertTriangle } from 'lucide-react';

const EXCLUDED_TERMS_TEMPLATES = [
  {
    title: 'Third-Party Hardware & Infrastructure Procurement',
    description: 'Procurement or direct leasing fees for physical server hardware, cloud domain registration, or third-party SMS/payment gateway usage fees are outside NUTZ scope and borne by the client directly.',
  },
  {
    title: 'Legacy Data Migration & Cleaning',
    description: 'Manual data extraction, sanitization, or un-structured legacy database transformation is excluded unless explicitly budgeted under custom scope.',
  },
  {
    title: 'Third-Party API Outage SLA Guarantees',
    description: 'Service uptime and latency guarantees for external APIs (e.g. OpenAI, SMS gateways, Maps, Payment Gateways) are subject to third-party vendor SLAs.',
  },
  {
    title: 'Post-Deployment Out-of-Scope Customizations',
    description: 'Feature modification requests outside the signed Functional Requirement Document (FRD) require an official Change Request Order (CRO).',
  },
];

export function Step11ExcludedTerms() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 11 OF 12 // SCOPE BOUNDARIES & EXCLUDED TERMS
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            Explicitly Excluded Terms & Scope Boundaries
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Standard contractual scope boundaries preventing creep and ensuring project clarity. (Read-Only Template Clause)
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-mono font-semibold rounded border border-amber-200">
          <Lock className="w-3.5 h-3.5" /> Read-Only Policy Clause
        </span>
      </div>

      {/* Excluded Clauses Grid */}
      <div className="space-y-4">
        {EXCLUDED_TERMS_TEMPLATES.map((item, idx) => (
          <div key={idx} className="bg-white border border-ink-border rounded-lg p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <h3 className="font-display font-bold text-sm text-ink">{item.title}</h3>
            </div>
            <p className="text-xs text-ink-muted font-sans leading-relaxed pl-6">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
