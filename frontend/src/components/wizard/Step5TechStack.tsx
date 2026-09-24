'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import { apiFetch } from '@/lib/api';
import { Cpu, Check, Plus, ShieldCheck, Sparkles, Server, Database, Cloud, Layers, Terminal } from 'lucide-react';

interface TechItem {
  id: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & Infrastructure' | 'Security & Auth' | 'Integrations & AI';
  name: string;
  description: string;
  recommended: boolean;
  reason: string;
  isCustom?: boolean;
}

const DEFAULT_STACK_RULES: TechItem[] = [
  // Frontend
  {
    id: 'fe-nextjs',
    category: 'Frontend',
    name: 'Next.js 14 (App Router)',
    description: 'React Framework with Server-Side Rendering (SSR), Server Components, and optimized routing.',
    recommended: true,
    reason: 'Standard high-performance React framework for enterprise web platforms.',
  },
  {
    id: 'fe-react',
    category: 'Frontend',
    name: 'React 18 & TypeScript',
    description: 'Type-safe component architecture for interactive UI components.',
    recommended: true,
    reason: 'Core UI library ensuring modern code quality and maintainability.',
  },
  {
    id: 'fe-tailwind',
    category: 'Frontend',
    name: 'Tailwind CSS & shadcn/ui',
    description: 'Utility-first styling system paired with accessible, reusable UI primitives.',
    recommended: true,
    reason: 'Standard UI design system for technical drafting aesthetic.',
  },

  // Backend
  {
    id: 'be-node',
    category: 'Backend',
    name: 'Node.js & Express (TypeScript)',
    description: 'Asynchronous event-driven backend service runtime with strongly-typed API controllers.',
    recommended: true,
    reason: 'High throughput API layer for web and mobile client requests.',
  },
  {
    id: 'be-sequelize',
    category: 'Backend',
    name: 'Sequelize ORM',
    description: 'Object-Relational Mapping library managing relational schemas and transactions.',
    recommended: true,
    reason: 'Handles database models, migrations, and transactional isolation.',
  },

  // Database
  {
    id: 'db-postgres',
    category: 'Database',
    name: 'PostgreSQL 16 (Multi-Tenant RLS)',
    description: 'Enterprise relational DB with strict Row-Level Security policies for multi-tenancy.',
    recommended: true,
    reason: 'Ensures strict tenant data separation and ACID compliance.',
  },
  {
    id: 'db-redis',
    category: 'Database',
    name: 'Redis 7 (Caching & Rate Limiting)',
    description: 'In-memory key-value store for session caching and rate limiter hit counters.',
    recommended: true,
    reason: 'High-performance cache layer reducing DB load.',
  },

  // Cloud & Infrastructure
  {
    id: 'cloud-docker',
    category: 'Cloud & Infrastructure',
    name: 'Docker Containerization',
    description: 'Isolated container image packaging for reproducible deployments across environments.',
    recommended: true,
    reason: 'Guarantees identical execution between local dev and cloud production.',
  },
  {
    id: 'cloud-nginx',
    category: 'Cloud & Infrastructure',
    name: 'Nginx Reverse Proxy & SSL',
    description: 'Edge reverse proxy handling SSL/TLS termination, rate limiting, and static assets.',
    recommended: true,
    reason: 'Standard web application firewall and ingress controller.',
  },

  // Security & Auth
  {
    id: 'sec-jwt',
    category: 'Security & Auth',
    name: 'JWT Auth & Bcrypt Hashing',
    description: 'Stateless bearer tokens with HTTP-only refresh cookies and salted bcrypt password encryption.',
    recommended: true,
    reason: 'Industry-standard authentication and session verification.',
  },
  {
    id: 'sec-rls',
    category: 'Security & Auth',
    name: 'Postgres Row-Level Security (RLS)',
    description: 'Database-level isolation setting tenant context per SQL transaction.',
    recommended: true,
    reason: 'Zero cross-tenant data leak guarantee.',
  },

  // Integrations & AI
  {
    id: 'ai-nvidia',
    category: 'Integrations & AI',
    name: 'NVIDIA NIM AI Microservices',
    description: 'High-performance AI model inference for automated architecture generation.',
    recommended: true,
    reason: 'Powers AI-driven document synthesis and diagram generation.',
  },
];

export function Step5TechStack() {
  const { selectionTree, updateSelectionTree } = useWizardStore();
  const savedStack = selectionTree.step_5_tech_stack || {};

  // User selections & custom stack items
  const [selectedIds, setSelectedIds] = useState<string[]>(
    savedStack.selected_ids || DEFAULT_STACK_RULES.map((t) => t.id)
  );

  const [customItems, setCustomItems] = useState<TechItem[]>(savedStack.custom_items || []);
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomCategory, setNewCustomCategory] = useState<TechItem['category']>('Backend');
  const [newCustomDesc, setNewCustomDesc] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Sync with Zustand store
  useEffect(() => {
    updateSelectionTree('step_5_tech_stack', {
      selected_ids: selectedIds,
      custom_items: customItems,
    });
  }, [selectedIds, customItems, updateSelectionTree]);

  const toggleTech = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAddCustomTech = () => {
    if (!newCustomName.trim()) return;

    const newItem: TechItem = {
      id: `custom-${Date.now()}`,
      category: newCustomCategory,
      name: newCustomName.trim(),
      description: newCustomDesc.trim() || 'Custom technology specified by client.',
      recommended: false,
      reason: 'Specified during FRD specification setup.',
      isCustom: true,
    };

    setCustomItems((prev) => [...prev, newItem]);
    setSelectedIds((prev) => [...prev, newItem.id]);
    setNewCustomName('');
    setNewCustomDesc('');
    setShowAddCustom(false);
  };

  const allItems = useMemo(() => [...DEFAULT_STACK_RULES, ...customItems], [customItems]);

  const categories: TechItem['category'][] = [
    'Frontend',
    'Backend',
    'Database',
    'Cloud & Infrastructure',
    'Security & Auth',
    'Integrations & AI',
  ];

  const getCategoryIcon = (cat: TechItem['category']) => {
    switch (cat) {
      case 'Frontend':
        return <Layers className="w-4 h-4 text-cobalt" />;
      case 'Backend':
        return <Server className="w-4 h-4 text-cobalt" />;
      case 'Database':
        return <Database className="w-4 h-4 text-cobalt" />;
      case 'Cloud & Infrastructure':
        return <Cloud className="w-4 h-4 text-cobalt" />;
      case 'Security & Auth':
        return <ShieldCheck className="w-4 h-4 text-cobalt" />;
      case 'Integrations & AI':
        return <Cpu className="w-4 h-4 text-cobalt" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 5 OF 12 // RECOMMENDED TECHNICAL ARCHITECTURE STACK
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            Technology Stack & Core Specifications
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Auto-derived recommendation based on your Product Catalog choices in Step 4. Review, customize, or append stack components.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cobalt-light text-cobalt text-xs font-mono font-semibold rounded border border-cobalt/20">
            <Sparkles className="w-3.5 h-3.5" /> Auto-Derived Stack
          </span>
        </div>
      </div>

      {/* Stack Categories */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catItems = allItems.filter((item) => item.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-ink-border pb-2">
                {getCategoryIcon(cat)}
                <h3 className="font-display font-bold text-base text-ink tracking-tight">{cat}</h3>
                <span className="text-xs font-mono text-ink-muted ml-auto">
                  {catItems.filter((i) => selectedIds.includes(i.id)).length} / {catItems.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleTech(item.id)}
                      className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-cobalt shadow-sm ring-1 ring-cobalt/20'
                          : 'bg-paper border-ink-border hover:border-ink opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-ink">{item.name}</span>
                            {item.isCustom && (
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Custom
                              </span>
                            )}
                          </div>
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'bg-cobalt border-cobalt text-white' : 'border-ink-border bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>

                        <p className="text-xs text-ink-muted mt-2 font-sans leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-ink-border/50 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                        <span className="truncate pr-2">Rationale: {item.reason}</span>
                        {item.recommended && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Tech Modal / Section */}
      <div className="bg-paper border border-ink-border rounded-lg p-6 space-y-4">
        {!showAddCustom ? (
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-sm text-ink">Need custom tech stack specifications?</h4>
              <p className="text-xs text-ink-muted font-sans mt-0.5">
                Add specialized framework, DB, or third-party service specs to this FRD.
              </p>
            </div>
            <button
              onClick={() => setShowAddCustom(true)}
              className="px-4 py-2 bg-white hover:bg-paper text-ink border border-ink-border text-xs font-mono font-semibold rounded transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-cobalt" />
              <span>Add Custom Tech Item</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-2">
              <span className="font-mono text-xs font-bold text-ink uppercase">Add Custom Technology Specification</span>
              <button
                onClick={() => setShowAddCustom(false)}
                className="text-xs font-mono text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-ink mb-1">Technology Name</label>
                <input
                  type="text"
                  placeholder="e.g. ClickHouse / GraphQL / Apache Kafka"
                  value={newCustomName}
                  onChange={(e) => setNewCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-ink mb-1">Category</label>
                <select
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value as TechItem['category'])}
                  className="w-full px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-ink mb-1">Description / Usage Purpose</label>
              <input
                type="text"
                placeholder="Brief explanation of architectural purpose in this project..."
                value={newCustomDesc}
                onChange={(e) => setNewCustomDesc(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleAddCustomTech}
                disabled={!newCustomName.trim()}
                className="px-5 py-2 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Tech Item</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
