'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { FlipText } from '@/components/block/flip-text';
import { TextStream } from '@/components/block/text-stream';
import { RectangularTextReveal } from '@/components/block/rectangular-text-reveal';
import { ScrollStack, ScrollStackItem } from '@/components/block/scroll-stack';
import { RoundedAnimatedFillButton } from '@/components/block/rounded-animated-fill-button';
import { ShieldCheck, FileCheck, Layers, Cpu, ChevronRight } from 'lucide-react';

const flipWords = [
  'Functional Requirement Docs',
  'Software Quotation Specs',
  'Architecture Flow Diagrams',
  'Technical Implementation Plans',
];

const featureCards: ScrollStackItem[] = [
  {
    id: 'step-1',
    number: 'SPEC.01',
    title: 'Guided Catalog & Multi-Tiered Selection',
    description:
      'Navigate through 105+ pre-seeded enterprise product categories, main modules, sub-modules, and options. Clients can add custom sub-modules on the fly.',
    badge: 'Q&A WIZARD ENGINE',
    attributes: [
      { label: 'CATALOG DEPTH', value: '105+ CATEGORIES' },
      { label: 'CUSTOM OPTIONS', value: 'CLIENT EXTENSIBLE' },
      { label: 'SELECTION RULE', value: 'SELECTED-ONLY OUTPUT' },
      { label: 'DATA FORMAT', value: 'NESTED JSONB TREE' },
    ],
  },
  {
    id: 'step-2',
    number: 'SPEC.02',
    title: 'Automated Tech Stack Derivation',
    description:
      'Selected feature choices dynamically derive matching technology frameworks (Next.js, Node.js, Express, PostgreSQL, Tailwind, AWS, Stripe) matching exact quotation requirements.',
    badge: 'SYSTEM MAPPING',
    attributes: [
      { label: 'DERIVATION', value: 'DETERMINISTIC' },
      { label: 'ADMIN CONTROL', value: 'OVERRIDEABLE' },
      { label: 'TRANSPARENCY', value: 'FULL ARCHITECTURE' },
      { label: 'COMPATIBILITY', value: 'OPV TEMPLATE VERBATIM' },
    ],
  },
  {
    id: 'step-3',
    number: 'SPEC.03',
    title: 'NVIDIA AI Architecture & Phase Generator',
    description:
      'Backend-only NVIDIA AI NIM engine translates scope selections into text system flow diagrams and structured implementation phase tables with working day estimates.',
    badge: 'NVIDIA NIM INTEGRATION',
    attributes: [
      { label: 'AI ENGINE', value: 'NVIDIA API' },
      { label: 'SECURITY', value: 'BACKEND ISOLATED' },
      { label: 'CACHING', value: 'HASH-KEYED POSTGRES' },
      { label: 'TOKEN EFFICIENCY', value: 'ZERO TOKEN RE-SPEND' },
    ],
  },
  {
    id: 'step-4',
    number: 'SPEC.04',
    title: 'Row-Level Security & Deterministic PDF Export',
    description:
      'PostgreSQL Row-Level Security isolates client draft privacy. Server-side PDF generation outputs exact OPV quotation formatting ready for admin approval and download.',
    badge: 'ENTERPRISE RLS SECURITY',
    attributes: [
      { label: 'TENANT ISOLATION', value: 'POSTGRES RLS' },
      { label: 'SECURITY CLAUSE', value: 'EXCLUDED LOCKED' },
      { label: 'PDF GENERATOR', value: 'DETERMINISTIC PDF' },
      { label: 'APPROVAL STATUS', value: 'ADMIN VERIFIED' },
    ],
  },
];

export default function Home() {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-paper text-ink selection:bg-cobalt selection:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ink-border">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center bg-white p-1 rounded border border-ink-border">
                <Image
                  src="/logo.png"
                  alt="NUTZ Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-ink tracking-tight flex items-center gap-1.5">
                  NUTZ FRD
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-cobalt-light text-cobalt border border-cobalt/20 rounded uppercase">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] font-mono text-ink-muted">
                  Nutz Technovation Platform
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-medium text-ink-muted">
              <a href="#overview" className="hover:text-ink transition-colors">
                {"// OVERVIEW"}
              </a>
              <a href="#specifications" className="hover:text-ink transition-colors">
                {"// SPECIFICATIONS"}
              </a>
              <a href="#template" className="hover:text-ink transition-colors">
                {"// OPV TEMPLATE"}
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-xs font-mono font-semibold text-ink hover:text-cobalt transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <RoundedAnimatedFillButton text="Start your FRD" href="/register" />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section id="overview" className="relative py-24 md:py-32 px-6 border-b border-ink-border bg-white">
          <div className="max-w-6xl mx-auto text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-paper border border-ink-border text-xs font-mono text-ink-muted mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{"SECTION 0.0 // TECHNICAL SPECIFICATION ENGINE"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-ink leading-[1.08] tracking-tight max-w-5xl mb-8">
              Precision Engineering for <br className="hidden sm:inline" />
              <FlipText words={flipWords} className="min-w-[320px]" />
            </h1>

            <p className="text-base md:text-lg text-ink-muted max-w-3xl leading-relaxed mb-10 font-sans">
              Transform complex software requirements into complete, audit-ready Functional Requirement Documents matching exact OPV quotation standards. Powered by guided catalog wizards, AI system flows, and enterprise tenant security.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-16">
              <RoundedAnimatedFillButton text="Start your FRD" href="/register" />
              <a
                href="#specifications"
                className="px-6 py-3.5 rounded-full text-xs font-mono font-semibold text-ink bg-paper border border-ink-border hover:border-ink transition-colors inline-flex items-center gap-2"
              >
                View Spec Capabilities <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Live Terminal Stream Preview */}
            <div className="bg-ink text-slate-200 p-6 rounded-lg border border-slate-800 shadow-xl font-mono text-xs max-w-3xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-[11px]">nutz-frd-compiler --target opv-v1.spec</span>
                </div>
                <span className="text-[10px] text-slate-500">BUILD: VERIFIED</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <p className="text-emerald-400">&gt; Initializing NUTZ FRD Specification Compiler...</p>
                <p>&gt; Validating RLS session tenant policies... [OK]</p>
                <p className="text-slate-400">
                  &gt; <TextStream text="Executing multi-tiered selection tree query for selected modules..." speed={25} />
                </p>
                <p className="text-cobalt-light font-semibold pt-1">
                  &gt; COMPLETED: 100% OPV Quotation Template Compliance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rectangular Text Reveal Section */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <RectangularTextReveal
              tag="SPECIFICATION PROMISE"
              title="Design Less. Scope Precisely. Ship Better."
              subtitle="Only selected categories, modules, and custom sub-options ever render into the final FRD. Zero placeholder bloat, absolute precision."
            />
          </div>
        </section>

        {/* Specifications Stack Section */}
        <section id="specifications" className="py-16 px-6 max-w-6xl mx-auto">
          <div className="mb-12 border-b border-ink-border pb-6">
            <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-2">
              {"// CORE CAPABILITIES"}
            </span>
            <h2 className="text-3xl font-bold font-display text-ink">
              Architectural Engine Specifications
            </h2>
          </div>

          <ScrollStack items={featureCards} />
        </section>

        {/* OPV Template Compliance Section */}
        <section id="template" className="py-24 px-6 bg-white border-t border-b border-ink-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-2">
                  {"// TEMPLATE COMPLIANCE"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-ink mb-6">
                  100% Matching OPV Quotation Standard
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed mb-6 font-sans">
                  The generated Functional Requirement Document reproduces every section number and sequence from the official OPV housing specification, inserting custom selected categories seamlessly.
                </p>

                <div className="space-y-3 font-mono text-xs text-ink">
                  <div className="flex items-center gap-3 p-3 rounded bg-paper border border-ink-border">
                    <FileCheck className="w-4 h-4 text-cobalt" />
                    <span>Fixed Requirements & Deliverables (Admin-editable standard)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-paper border border-ink-border">
                    <Layers className="w-4 h-4 text-cobalt" />
                    <span>Selected Product Category → Sub-Module Selection Tree</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-paper border border-ink-border">
                    <Cpu className="w-4 h-4 text-cobalt" />
                    <span>AI-Generated Architecture Flow & Phase Timelines</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-paper border border-ink-border">
                    <ShieldCheck className="w-4 h-4 text-cobalt" />
                    <span>Admin-Locked Excluded Terms & Mandatory Agreements</span>
                  </div>
                </div>
              </div>

              <div className="bg-paper p-8 rounded-lg border border-ink-border font-mono text-xs space-y-4">
                <div className="flex justify-between items-center border-b border-ink-border pb-3">
                  <span className="font-bold text-ink text-sm">FRD STRUCTURE SUMMARY</span>
                  <span className="text-[10px] bg-cobalt-light text-cobalt px-2 py-0.5 rounded border border-cobalt/20">
                    VERIFIED
                  </span>
                </div>
                <div className="space-y-2 text-ink-muted text-[11px]">
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>1. Project Requirements</span>
                    <span className="text-ink">Fixed Content</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>2. Project Deliverables</span>
                    <span className="text-ink">Fixed Content</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>3. Technologies & Tools</span>
                    <span className="text-cobalt font-semibold">Auto-Derived</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>4. Selected Product Catalog</span>
                    <span className="text-cobalt font-semibold">Client Selected</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>5. Architecture & System Flow</span>
                    <span className="text-cobalt font-semibold">AI Generated</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>6. Implementation Phases</span>
                    <span className="text-cobalt font-semibold">AI Generated</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>7. Payments, Splitups & Duration</span>
                    <span className="text-ink">40-30-30 / 50-50 / Full</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-border/40">
                    <span>8. Excluded Terms</span>
                    <span className="text-rose-600 font-semibold">Admin Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-paper border-t border-ink-border text-xs font-mono text-ink-muted">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="NUTZ Logo" width={24} height={24} />
              <span>NUTZ FRD Engine — Nutz Technovation Private Limited</span>
            </div>
            <div>
              <span>© {new Date().getFullYear()} Nutz Technovation. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </LenisProvider>
  );
}
