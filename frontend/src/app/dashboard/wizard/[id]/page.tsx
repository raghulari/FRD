'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useWizardStore } from '@/store/useWizardStore';
import { Step1CompanyDetails } from '@/components/wizard/Step1CompanyDetails';
import { Step2Requirements } from '@/components/wizard/Step2Requirements';
import { Step3Deliverables } from '@/components/wizard/Step3Deliverables';
import { Step4CatalogQA } from '@/components/wizard/Step4CatalogQA';
import { Step5TechStack } from '@/components/wizard/Step5TechStack';
import { Step6Communication } from '@/components/wizard/Step6Communication';
import { Step7AdditionalPricing } from '@/components/wizard/Step7AdditionalPricing';
import { Step8ArchitectureFlow } from '@/components/wizard/Step8ArchitectureFlow';
import { Step9ImplementationPhases } from '@/components/wizard/Step9ImplementationPhases';
import { Step10PaymentsDuration } from '@/components/wizard/Step10PaymentsDuration';
import { Step11ExcludedTerms } from '@/components/wizard/Step11ExcludedTerms';
import { Step12OtherAgreements } from '@/components/wizard/Step12OtherAgreements';
import { Step13FinalPreview } from '@/components/wizard/Step13FinalPreview';
import { ArrowLeft, ArrowRight, CheckCircle2, Cloud, AlertCircle, Save } from 'lucide-react';

const stepsList = [
  { step: 1, title: 'Company Details' },
  { step: 2, title: 'Requirements' },
  { step: 3, title: 'Deliverables' },
  { step: 4, title: 'Product Catalog' },
  { step: 5, title: 'Tech Stack' },
  { step: 6, title: 'Communication' },
  { step: 7, title: 'Additional Pricing' },
  { step: 8, title: 'Architecture Flow' },
  { step: 9, title: 'Implementation Phases' },
  { step: 10, title: 'Payments & Duration' },
  { step: 11, title: 'Excluded Terms' },
  { step: 12, title: 'Other Agreements' },
  { step: 13, title: 'Final Preview & Download' },
];

export default function WizardPage() {
  const params = useParams();
  const router = useRouter();
  const frdId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    initWizard,
    autosaveStatus,
    lastSavedAt,
    saveSelections,
  } = useWizardStore();

  useEffect(() => {
    async function loadWizardData() {
      setLoading(true);
      const res = await apiFetch(`/frds/${frdId}/wizard`);
      setLoading(false);

      if (res.error || !res.data?.wizard) {
        setError(res.message || res.error || 'Failed to load FRD wizard');
        return;
      }

      const wizardData = res.data.wizard;
      const initialSelection = wizardData.selections?.selection_tree || {};
      const templateSections = wizardData.template?.sections || {};

      initWizard(frdId, initialSelection, templateSections);
    }

    if (frdId) {
      loadWizardData();
    }
  }, [frdId, initWizard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-mono text-xs text-ink-muted">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cobalt animate-ping" />
          <span>Loading FRD Wizard specification payload...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono max-w-md w-full mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
        <Link href="/dashboard" className="text-xs font-mono text-cobalt hover:underline">
          Return to Client Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col text-ink font-sans selection:bg-cobalt selection:text-white">
      {/* Top Wizard Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-ink-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper rounded transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="NUTZ Logo" width={24} height={24} />
              <span className="font-display font-bold text-sm text-ink tracking-tight">
                NUTZ FRD Wizard
              </span>
            </div>
          </div>

          {/* Autosave Status Badge */}
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs flex items-center gap-2">
              {autosaveStatus === 'saving' && (
                <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  <Cloud className="w-3.5 h-3.5 animate-pulse" /> Autosaving...
                </span>
              )}
              {autosaveStatus === 'saved' && (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved {lastSavedAt ? `at ${lastSavedAt}` : ''}
                </span>
              )}
              {autosaveStatus === 'error' && (
                <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" /> Autosave Failed
                </span>
              )}
            </div>

            <button
              onClick={() => saveSelections()}
              className="px-3 py-1.5 bg-paper hover:bg-white text-ink border border-ink-border text-xs font-mono font-medium rounded transition-all inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* 12-Step Horizontal Progress Stepper */}
        <div className="bg-paper border-t border-ink-border px-6 py-3 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
            {stepsList.map((s) => {
              const isCurrent = s.step === currentStep;
              const isPassed = s.step < currentStep;

              return (
                <button
                  key={s.step}
                  onClick={() => setStep(s.step)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all ${
                    isCurrent
                      ? 'bg-cobalt text-white font-semibold shadow-sm'
                      : isPassed
                      ? 'bg-white text-ink border border-ink-border hover:border-cobalt'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-white text-cobalt font-bold' : isPassed ? 'bg-cobalt-light text-cobalt' : 'bg-paper text-ink-muted'
                  }`}>
                    {s.step}
                  </span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Active Step Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 my-6">
        {currentStep === 1 && <Step1CompanyDetails />}
        {currentStep === 2 && <Step2Requirements />}
        {currentStep === 3 && <Step3Deliverables />}
        {currentStep === 4 && <Step4CatalogQA />}
        {currentStep === 5 && <Step5TechStack />}
        {currentStep === 6 && <Step6Communication />}
        {currentStep === 7 && <Step7AdditionalPricing />}
        {currentStep === 8 && <Step8ArchitectureFlow />}
        {currentStep === 9 && <Step9ImplementationPhases />}
        {currentStep === 10 && <Step10PaymentsDuration />}
        {currentStep === 11 && <Step11ExcludedTerms />}
        {currentStep === 12 && <Step12OtherAgreements />}
        {currentStep === 13 && <Step13FinalPreview />}
      </main>

      {/* Footer Navigation Bar */}
      <footer className="sticky bottom-0 bg-white border-t border-ink-border py-4 px-6 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-5 py-2.5 bg-paper hover:bg-white text-ink border border-ink-border text-xs font-mono font-semibold rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-ink-muted">
            Step {currentStep} of {stepsList.length}
          </span>

          <button
            onClick={nextStep}
            disabled={currentStep === stepsList.length}
            className="px-6 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
