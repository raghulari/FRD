'use client';

import { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import { MessageSquare, Calendar, Video, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

interface CommItem {
  id: string;
  channelName: string;
  frequency: string;
  description: string;
  included: boolean;
}

const DEFAULT_COMMUNICATION_STACK: CommItem[] = [
  {
    id: 'comm-slack',
    channelName: 'Dedicated Slack / Teams Channel',
    frequency: 'Daily Real-Time',
    description: 'Direct communication channel between NUTZ engineering team and client project leads.',
    included: true,
  },
  {
    id: 'comm-weekly-sync',
    channelName: 'Weekly Progress Review Meeting',
    frequency: 'Weekly (Google Meet / Zoom)',
    description: '30-minute weekly progress update, demo of completed features, and upcoming sprint goals.',
    included: true,
  },
  {
    id: 'comm-jira',
    channelName: 'JIRA / Trello Project Board Access',
    frequency: 'Continuous Access',
    description: 'Read-only access to project management board for real-time task tracking.',
    included: true,
  },
  {
    id: 'comm-demo',
    channelName: 'End-of-Sprint Live Demos',
    frequency: 'Bi-Weekly',
    description: 'Interactive live demo of working features deployed to staging environment.',
    included: true,
  },
];

export function Step6Communication() {
  const { selectionTree, updateSelectionTree } = useWizardStore();
  const savedData = selectionTree.step_6_communication || {};

  const [items, setItems] = useState<CommItem[]>(
    savedData.items || DEFAULT_COMMUNICATION_STACK
  );
  const [escalationPoint, setEscalationPoint] = useState<string>(
    savedData.escalation_point || 'support@nutz.in'
  );

  useEffect(() => {
    updateSelectionTree('step_6_communication', {
      items,
      escalation_point: escalationPoint,
    });
  }, [items, escalationPoint, updateSelectionTree]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, included: !i.included } : i))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 6 OF 12 // COMMUNICATION & PROJECT REPORTING PROTOCOLS
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            Project Communication & Governance Matrix
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Defines channels, meeting frequencies, progress reports, and escalation paths during development.
          </p>
        </div>
      </div>

      {/* Channels List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
              item.included
                ? 'bg-white border-cobalt shadow-sm ring-1 ring-cobalt/20'
                : 'bg-paper border-ink-border opacity-60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cobalt-light text-cobalt border border-cobalt/20">
                  {item.frequency}
                </span>
                <h3 className="font-display font-bold text-sm text-ink">{item.channelName}</h3>
              </div>
              <p className="text-xs text-ink-muted font-sans leading-relaxed">
                {item.description}
              </p>
            </div>

            <div
              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                item.included ? 'bg-cobalt border-cobalt text-white' : 'border-ink-border bg-white'
              }`}
            >
              {item.included && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </div>
        ))}
      </div>

      {/* Escalation Contact Box */}
      <div className="bg-paper border border-ink-border rounded-lg p-6 space-y-3">
        <h4 className="font-display font-bold text-sm text-ink flex items-center gap-2">
          <Mail className="w-4 h-4 text-cobalt" />
          Project Manager & Escalation Contact
        </h4>
        <div className="flex items-center gap-4">
          <input
            type="email"
            value={escalationPoint}
            onChange={(e) => setEscalationPoint(e.target.value)}
            placeholder="e.g. projectmanager@nutz.in"
            className="flex-1 px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-mono focus:outline-none focus:ring-1 focus:ring-cobalt"
          />
          <span className="text-xs text-ink-muted font-sans">Official escalation point for project milestones.</span>
        </div>
      </div>
    </div>
  );
}
