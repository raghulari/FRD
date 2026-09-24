'use client';

import { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import { Calculator, Calendar, Clock, DollarSign, Percent, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function Step10PaymentsDuration() {
  const { selectionTree, updateSelectionTree } = useWizardStore();
  const savedData = selectionTree.step_10_payments_duration || {};
  const additionalPricingItems = selectionTree.step_7_additional_pricing?.items || [];

  // Calculation inputs
  const [baseDevelopmentCost, setBaseDevelopmentCost] = useState<number>(
    savedData.base_development_cost ?? 250000
  );
  const [durationWeeks, setDurationWeeks] = useState<number>(
    savedData.duration_weeks ?? 10
  );
  const [splitModel, setSplitModel] = useState<'40-30-30' | '50-50' | '100-full'>(
    savedData.split_model || '40-30-30'
  );

  // Derive additional costs subtotal from Step 7 selections
  const additionalCostSubtotal = additionalPricingItems
    .filter((i: any) => i.included)
    .reduce((sum: number, i: any) => sum + (i.estimatedCost || 0), 0);

  const subtotalCost = baseDevelopmentCost + additionalCostSubtotal;
  const gstRate = 0.18; // 18% GST
  const gstAmount = Math.round(subtotalCost * gstRate);
  const grandTotalCost = subtotalCost + gstAmount;

  // Derive Milestone Splitup Amounts
  const milestones = (() => {
    if (splitModel === '50-50') {
      return [
        { percentage: 50, phase: 'Milestone 1: Project Kickoff & Requirements Signing', amount: Math.round(grandTotalCost * 0.5) },
        { percentage: 50, phase: 'Milestone 2: Final Production Delivery & Deployment', amount: Math.round(grandTotalCost * 0.5) },
      ];
    } else if (splitModel === '100-full') {
      return [
        { percentage: 100, phase: 'Full Payment on Project Agreement Signing', amount: grandTotalCost },
      ];
    }
    // Default 40-30-30
    return [
      { percentage: 40, phase: 'Milestone 1: Advance Commitment on Project Kickoff', amount: Math.round(grandTotalCost * 0.4) },
      { percentage: 30, phase: 'Milestone 2: Beta Version Release & QA Approval', amount: Math.round(grandTotalCost * 0.3) },
      { percentage: 30, phase: 'Milestone 3: Final Production Deployment & Sign-off', amount: Math.round(grandTotalCost * 0.3) },
    ];
  })();

  // Sync state to Zustand store
  useEffect(() => {
    updateSelectionTree('step_10_payments_duration', {
      base_development_cost: baseDevelopmentCost,
      additional_cost_subtotal: additionalCostSubtotal,
      subtotal_cost: subtotalCost,
      gst_amount: gstAmount,
      grand_total_cost: grandTotalCost,
      duration_weeks: durationWeeks,
      split_model: splitModel,
      milestones,
    });
  }, [baseDevelopmentCost, additionalCostSubtotal, subtotalCost, gstAmount, grandTotalCost, durationWeeks, splitModel, milestones, updateSelectionTree]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 10 OF 12 // COMMERCIAL TERMS & PROJECT DURATION
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            Payment Terms, Splitups & Project Duration
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Calculates project investment, GST (18%), milestone payment breakdown, and delivery schedule.
          </p>
        </div>

        <div className="bg-cobalt text-white p-4 rounded-lg text-right shadow-sm">
          <span className="text-[10px] font-mono text-white/70 uppercase block">Grand Total Investment (Incl. GST)</span>
          <span className="font-mono text-xl font-bold">
            ₹{grandTotalCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Main Grid: Base Inputs & Summary Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base Cost & Timeline Controls */}
        <div className="bg-white border border-ink-border rounded-lg p-6 space-y-5 shadow-sm">
          <h3 className="font-display font-bold text-base text-ink flex items-center gap-2 border-b border-ink-border pb-3">
            <Calculator className="w-4 h-4 text-cobalt" />
            Commercial Cost Baseline
          </h3>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink mb-1.5">
              Base Development Cost (₹)
            </label>
            <input
              type="number"
              value={baseDevelopmentCost}
              onChange={(e) => setBaseDevelopmentCost(Number(e.target.value))}
              className="w-full px-3 py-2 bg-paper border border-ink-border rounded text-sm text-ink font-mono font-bold focus:outline-none focus:ring-1 focus:ring-cobalt"
            />
            <span className="text-[11px] text-ink-muted font-sans mt-1 block">
              Covers core platform module architecture & implementation.
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink mb-1.5">
              Estimated Project Duration (Weeks)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="52"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-28 px-3 py-2 bg-paper border border-ink-border rounded text-sm text-ink font-mono font-bold focus:outline-none focus:ring-1 focus:ring-cobalt"
              />
              <span className="text-xs font-mono text-ink-muted">
                ~{(durationWeeks / 4.33).toFixed(1)} Months Development Cycle
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink mb-1.5">
              Milestone Payment Splitup Model
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: '40-30-30', label: '40% - 30% - 30%' },
                { key: '50-50', label: '50% - 50%' },
                { key: '100-full', label: '100% Full' },
              ].map((model) => (
                <button
                  key={model.key}
                  onClick={() => setSplitModel(model.key as any)}
                  className={`py-2 px-3 text-xs font-mono font-semibold rounded border transition-all ${
                    splitModel === model.key
                      ? 'bg-cobalt text-white border-cobalt'
                      : 'bg-paper text-ink border-ink-border hover:border-ink'
                  }`}
                >
                  {model.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="bg-paper border border-ink-border rounded-lg p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-ink flex items-center gap-2 border-b border-ink-border pb-3">
            <DollarSign className="w-4 h-4 text-cobalt" />
            Financial Breakdown Summary
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-ink-border/50">
              <span className="text-ink-muted">Base Development Scope:</span>
              <span className="font-semibold text-ink">₹{baseDevelopmentCost.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-ink-border/50">
              <span className="text-ink-muted">Additional Infrastructure / Services (Step 7):</span>
              <span className="font-semibold text-ink">₹{additionalCostSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-ink-border/50 bg-white p-2 rounded">
              <span className="font-semibold text-ink">Net Commercial Subtotal:</span>
              <span className="font-bold text-cobalt">₹{subtotalCost.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-ink-border/50">
              <span className="text-ink-muted">GST Tax (18%):</span>
              <span className="font-semibold text-ink">₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 bg-cobalt-light text-cobalt p-3 rounded border border-cobalt/20">
              <span className="font-bold">Total Project Cost:</span>
              <span className="font-bold text-sm">₹{grandTotalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Breakdown Table (Verbatim OPV Template Format) */}
      <div className="bg-white border border-ink-border rounded-lg p-6 space-y-4 shadow-sm">
        <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
          <Clock className="w-4 h-4 text-cobalt" />
          Milestone Payment Schedule ({splitModel})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-xs text-left">
            <thead>
              <tr className="bg-paper border-b border-ink-border font-mono text-ink-muted">
                <th className="p-3">Milestone Split</th>
                <th className="p-3">Project Deliverable Phase</th>
                <th className="p-3 text-right">Payment Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-border/60">
              {milestones.map((m, idx) => (
                <tr key={idx} className="hover:bg-paper/50">
                  <td className="p-3 font-mono font-bold text-cobalt">
                    {m.percentage}%
                  </td>
                  <td className="p-3 font-medium text-ink">
                    {m.phase}
                  </td>
                  <td className="p-3 font-mono font-bold text-ink text-right">
                    ₹{m.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
