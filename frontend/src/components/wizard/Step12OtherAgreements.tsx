'use client';

import { ShieldCheck, FileCheck, Key, Lock } from 'lucide-react';

const LEGAL_AGREEMENTS_TEMPLATES = [
  {
    title: 'Intellectual Property (IP) & Source Code Transfer',
    description: 'Upon 100% final commercial payment settlement, complete ownership rights of the custom application source code and deployment assets transfer exclusively to the client.',
  },
  {
    title: 'Confidentiality & Non-Disclosure (NDA)',
    description: 'NUTZ Technovation Private Limited agrees to hold all client proprietary data, business logic, user records, and credentials in strict confidence under binding NDA terms.',
  },
  {
    title: 'Warranty & Bug Fix Support Period',
    description: 'Includes a complimentary 90-day post-launch warranty covering resolution of critical system bugs or discrepancies against signed FRD specifications.',
  },
  {
    title: 'Code Quality & Security Compliance',
    description: 'Built adhering to OWASP Top-10 security guidelines, PostgreSQL Row-Level Security isolation, and clean TypeScript production standards.',
  },
];

export function Step12OtherAgreements() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 12 OF 12 // LEGAL TERMS & WARRANTY AGREEMENTS
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            IP Ownership, Confidentiality & Warranty Terms
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Legal agreements governing intellectual property transfer, NDA confidentiality, and warranty coverage.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold rounded border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" /> Enforceable Terms
        </span>
      </div>

      {/* Clauses Grid */}
      <div className="space-y-4">
        {LEGAL_AGREEMENTS_TEMPLATES.map((item, idx) => (
          <div key={idx} className="bg-white border border-ink-border rounded-lg p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cobalt shrink-0" />
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
