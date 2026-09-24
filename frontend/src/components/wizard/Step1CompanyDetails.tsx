'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWizardStore } from '@/store/useWizardStore';
import { Building2, User, Mail, Phone, FileText, Calendar } from 'lucide-react';

interface Step1FormValues {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  project_name: string;
  project_description: string;
  timeline_notes: string;
}

export function Step1CompanyDetails() {
  const { selectionTree, updateSelectionTree } = useWizardStore();
  const initialData = selectionTree.step_1_company_details || {};

  const { register, watch } = useForm<Step1FormValues>({
    defaultValues: {
      company_name: initialData.company_name || '',
      contact_person: initialData.contact_person || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      project_name: initialData.project_name || '',
      project_description: initialData.project_description || '',
      timeline_notes: initialData.timeline_notes || '',
    },
  });

  const formValues = watch();

  useEffect(() => {
    updateSelectionTree('step_1_company_details', formValues);
  }, [formValues, updateSelectionTree]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-ink-border pb-4">
        <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
          {"STEP 1 OF 12 // CLIENT & PROJECT IDENTITY"}
        </span>
        <h2 className="text-2xl font-bold font-display text-ink">Company & Project Details</h2>
        <p className="text-xs text-ink-muted mt-1 font-sans">
          Provide your organization information and core project parameters. Changes are automatically saved every ~10s.
        </p>
      </div>

      <div className="bg-white border border-ink-border rounded-lg p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cobalt" /> Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Nutz Technovation Pvt Ltd"
              {...register('company_name')}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cobalt" /> Primary Contact Person
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan (VP Engineering)"
              {...register('contact_person')}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cobalt" /> Contact Email Address
            </label>
            <input
              type="email"
              placeholder="alex@company.com"
              {...register('email')}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cobalt" /> Phone / WhatsApp
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              {...register('phone')}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
            />
          </div>
        </div>

        <div className="border-t border-ink-border/60 pt-6 grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cobalt" /> Project Name / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Enterprise Real Estate CRM & Property Portal"
              {...register('project_name')}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cobalt" /> Freeform Project Description & Goals
            </label>
            <textarea
              rows={4}
              placeholder="Provide a high-level summary of your business objectives, target audience, and key operational requirements..."
              {...register('project_description')}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cobalt" /> Preferred Schedule & Budget Constraints (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Target launch in 60 working days, milestone-based budget"
              {...register('timeline_notes')}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
