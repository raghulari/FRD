'use client';

import { useWizardStore } from '@/store/useWizardStore';
import { Lock, FileCheck, Info } from 'lucide-react';

export function Step2Requirements() {
  const { templateSections } = useWizardStore();
  const requirements = templateSections.requirements || [
    { item: 'Functional Requirement Document (FRD)', timing: 'Before project commencement', responsibility: 'Client' },
    { item: 'User Stories & Business Workflows', timing: 'Before project commencement', responsibility: 'Client' },
    { item: 'UI/UX Design Approval', timing: 'Before project commencement', responsibility: 'Client' },
    { item: 'Brand Assets (Logo, Images, Icons & Content)', timing: 'Before project commencement', responsibility: 'Client' },
    { item: 'Domain & DNS Access', timing: 'Before deployment', responsibility: 'Client' },
    { item: 'Server / VPS Access', timing: 'Before deployment', responsibility: 'Client' },
    { item: 'WhatsApp Business API', timing: 'Before integration', responsibility: 'Client' },
    { item: 'SMS Gateway Credentials', timing: 'Before integration', responsibility: 'Client' },
    { item: 'Payment Gateway Credentials', timing: 'Before integration', responsibility: 'Client' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-ink-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 2 OF 12 // PROJECT REQUIREMENTS
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">Standard Project Prerequisites</h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Mandatory client inputs required before and during project commencement.
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
          These prerequisites match the official OPV Housing Quotation standard template verbatim. Client edit controls are disabled on this section. Admin users can customize template terms in the Admin Panel.
        </p>
      </div>

      {/* OPV Requirements Table */}
      <div className="bg-white border border-ink-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-paper border-b border-ink-border font-mono text-xs text-ink uppercase tracking-wider">
              <th className="py-3.5 px-6 font-semibold">Functional Requirement</th>
              <th className="py-3.5 px-4 font-semibold">Timing / Milestone</th>
              <th className="py-3.5 px-4 font-semibold text-right">Responsibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-border/60 text-xs font-sans">
            {requirements.map((req: any, index: number) => (
              <tr key={index} className="hover:bg-paper/50 transition-colors">
                <td className="py-3.5 px-6 font-medium text-ink flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-cobalt shrink-0" />
                  <span>{req.item}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-ink-muted text-[11px]">{req.timing}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-cobalt-light text-cobalt font-mono font-semibold text-[10px] border border-cobalt/20 uppercase">
                    {req.responsibility}
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
