'use client';

import { useWizardStore } from '@/store/useWizardStore';
import { Lock, PackageCheck, Info } from 'lucide-react';

export function Step3Deliverables() {
  const { templateSections } = useWizardStore();
  const deliverables = templateSections.deliverables || [
    { item: 'Complete Source Code', timing: 'Maintenance', responsibility: 'Nutz' },
    { item: 'Deployment & Production Rollout', timing: 'Maintenance', responsibility: 'Nutz' },
    { item: 'Knowledge Transfer', timing: 'Maintenance', responsibility: 'Nutz' },
    { item: '30 Days Support & Maintenance', timing: 'Maintenance', responsibility: 'Nutz' },
    { item: 'Server Credentials, User Manuals, Configuration Documents & Deployment Guides', timing: 'Maintenance', responsibility: 'Nutz' },
    { item: 'Architecture Documents, API Documentation, Database Design, UI/UX Assets & Technical Guides', timing: 'Maintenance', responsibility: 'Nutz' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-ink-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 3 OF 12 // PROJECT DELIVERABLES
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">Scope Deliverables & Handover Items</h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Guaranteed project deliverables, deployment rollout, documentation, and support commitments.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono shrink-0">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <span>Admin-Authored Standard (Read-Only)</span>
        </div>
      </div>

      <div className="bg-paper p-4 rounded border border-ink-border text-xs font-mono text-ink-muted flex items-start gap-3">
        <Info className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          These deliverables match the official OPV Housing Quotation standard template verbatim. Client edit controls are disabled on this section. Admin users can customize template terms in the Admin Panel.
        </p>
      </div>

      {/* OPV Deliverables Table */}
      <div className="bg-white border border-ink-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-paper border-b border-ink-border font-mono text-xs text-ink uppercase tracking-wider">
              <th className="py-3.5 px-6 font-semibold">Stage & Deliverable Item</th>
              <th className="py-3.5 px-4 font-semibold">Milestone / Stage</th>
              <th className="py-3.5 px-4 font-semibold text-right">Responsibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-border/60 text-xs font-sans">
            {deliverables.map((item: any, index: number) => (
              <tr key={index} className="hover:bg-paper/50 transition-colors">
                <td className="py-3.5 px-6 font-medium text-ink flex items-start gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.item}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-ink-muted text-[11px] align-top">{item.timing}</td>
                <td className="py-3.5 px-4 text-right align-top">
                  <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold text-[10px] border border-emerald-200 uppercase">
                    {item.responsibility}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
