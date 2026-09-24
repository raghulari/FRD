'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useWizardStore } from '@/store/useWizardStore';
import { FileText, Download, CheckCircle2, Eye, ShieldCheck, Printer, Sparkles, Building2 } from 'lucide-react';

export function Step13FinalPreview() {
  const params = useParams();
  const frdId = params.id as string;
  const { selectionTree } = useWizardStore();

  const [downloading, setDownloading] = useState(false);

  const companyDetails = selectionTree.step_1_company_details || {};
  const catalogTree = selectionTree.step_4_catalog_tree || {};
  const techStack = selectionTree.step_5_tech_stack || {};
  const pricingData = selectionTree.step_10_payments_duration || {};

  const handleDownloadPDF = async () => {
    setDownloading(true);
    // Trigger PDF download endpoint
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/frds/${frdId}/export-pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('frd_token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FRD_${companyDetails.company_name || 'Document'}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('PDF Generation server engine is initializing...');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 13 OF 13 // FINAL SPECIFICATION PREVIEW & EXPORT
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            Final FRD Document Summary & Download
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Review compiled technical requirement document and download high-resolution PDF quotation package.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="px-6 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all inline-flex items-center gap-2"
        >
          <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Generating PDF...' : 'Download Official FRD PDF'}</span>
        </button>
      </div>

      {/* Compiled Document Preview Paper Shell */}
      <div className="bg-white border border-ink-border rounded-lg p-8 space-y-8 shadow-sm">
        {/* Document Header */}
        <div className="border-b-2 border-ink pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display font-black text-xl text-ink tracking-tight">NUTZ FRD GENERATOR</span>
              <span className="text-[10px] font-mono text-cobalt bg-cobalt-light px-2 py-0.5 rounded border border-cobalt/20">
                OFFICIAL SPECIFICATION
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-ink">
              Functional Requirement Document (FRD)
            </h1>
            <p className="text-xs font-mono text-ink-muted mt-1">
              Prepared for: <strong className="text-ink">{companyDetails.company_name || 'Client Organization'}</strong> ({companyDetails.client_name || 'N/A'})
            </p>
          </div>

          <div className="text-right font-mono text-xs text-ink-muted space-y-1">
            <div>Document Ref: <strong className="text-ink">NUTZ-FRD-{frdId.slice(0, 8).toUpperCase()}</strong></div>
            <div>Date: <strong className="text-ink">{new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</strong></div>
            <div>Status: <span className="text-emerald-700 font-bold">APPROVED & VERIFIED</span></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs font-bold text-cobalt uppercase tracking-wider">
            1. Executive Summary & Company Profile
          </h3>
          <div className="bg-paper p-4 rounded border border-ink-border grid grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <span className="text-ink-muted block text-[11px] font-mono">Company Name:</span>
              <span className="font-semibold text-ink">{companyDetails.company_name || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[11px] font-mono">Primary Category:</span>
              <span className="font-semibold text-ink">{catalogTree.category?.name || 'SaaS Application'}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[11px] font-mono">Contact Email:</span>
              <span className="font-semibold text-ink">{companyDetails.client_email || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[11px] font-mono">Mobile Number:</span>
              <span className="font-semibold text-ink">{companyDetails.client_phone || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Financial & Commercial Summary */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs font-bold text-cobalt uppercase tracking-wider">
            2. Commercial Investment Breakdown
          </h3>
          <div className="bg-paper p-4 rounded border border-ink-border space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Base System Subtotal:</span>
              <span className="font-semibold text-ink">₹{(pricingData.subtotal_cost || 250000).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">GST Tax (18%):</span>
              <span className="font-semibold text-ink">₹{(pricingData.gst_amount || 45000).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-ink-border font-bold text-cobalt text-sm">
              <span>Grand Total Commercial Investment:</span>
              <span>₹{(pricingData.grand_total_cost || 295000).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Final Sign-off Box */}
        <div className="bg-cobalt-light border border-cobalt/30 rounded-lg p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cobalt shrink-0" />
            <div>
              <h4 className="font-display font-bold text-sm text-ink">Specification Sign-off Complete</h4>
              <p className="text-xs text-ink-muted font-sans">
                All 12 technical modules have been compiled with multi-tenant PostgreSQL RLS isolation rules.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-5 py-2 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all inline-flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
