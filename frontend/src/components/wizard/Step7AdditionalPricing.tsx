'use client';

import { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import { Tag, Plus, Trash2, ShieldCheck, Server, Key, DollarSign } from 'lucide-react';

interface PricingItem {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  description: string;
  included: boolean;
  isCustom?: boolean;
}

const DEFAULT_ADDITIONAL_PRICING: PricingItem[] = [
  {
    id: 'price-devops',
    name: 'Dedicated AWS Container Deployment & CI/CD Pipeline',
    category: 'Infrastructure Setup',
    estimatedCost: 35000,
    description: 'Automated GitHub Actions deployment to AWS ECS / EC2 with SSL configuration.',
    included: true,
  },
  {
    id: 'price-ssl-domain',
    name: 'SSL Certificate & Enterprise Domain Mapping',
    category: 'Security & Network',
    estimatedCost: 8000,
    description: 'Custom domain setup with wild-card SSL encryption and DNS management.',
    included: true,
  },
  {
    id: 'price-sms-gateway',
    name: 'Third-Party SMS & OTP Gateway Integration (Twilio/Kaleyra)',
    category: 'Integrations',
    estimatedCost: 15000,
    description: 'API wiring for phone OTP authentication and transactional alert notifications.',
    included: false,
  },
  {
    id: 'price-sla',
    name: 'Post-Deployment Support & Maintenance (3 Months SLA)',
    category: 'Support & SLA',
    estimatedCost: 45000,
    description: 'Includes bug fixes, security patch updates, DB backups, and 99.9% uptime monitoring.',
    included: true,
  },
];

export function Step7AdditionalPricing() {
  const { selectionTree, updateSelectionTree } = useWizardStore();
  const savedPricing = selectionTree.step_7_additional_pricing || {};

  const [items, setItems] = useState<PricingItem[]>(
    savedPricing.items || DEFAULT_ADDITIONAL_PRICING
  );

  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Custom Service');
  const [customCost, setCustomCost] = useState<number>(10000);
  const [customDesc, setCustomDesc] = useState('');

  useEffect(() => {
    updateSelectionTree('step_7_additional_pricing', {
      items,
    });
  }, [items, updateSelectionTree]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, included: !item.included } : item))
    );
  };

  const handleAddCustomItem = () => {
    if (!customName.trim()) return;

    const newItem: PricingItem = {
      id: `custom-price-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      estimatedCost: customCost || 0,
      description: customDesc.trim() || 'Custom service item.',
      included: true,
      isCustom: true,
    };

    setItems((prev) => [...prev, newItem]);
    setCustomName('');
    setCustomDesc('');
    setCustomCost(10000);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalAdditionalCost = items
    .filter((i) => i.included)
    .reduce((sum, i) => sum + i.estimatedCost, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
            STEP 7 OF 12 // ADDITIONAL PRICING & DEPLOYMENT SERVICES
          </span>
          <h2 className="text-2xl font-bold font-display text-ink">
            Additional Infrastructure & Service Pricing
          </h2>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Configure optional deployment, SLA, and third-party API integration estimates for the quotation breakdown.
          </p>
        </div>

        <div className="bg-white border border-ink-border p-3 rounded-lg text-right">
          <span className="text-[10px] font-mono text-ink-muted uppercase block">Additional Cost Subtotal</span>
          <span className="font-mono text-lg font-bold text-cobalt">
            ₹{totalAdditionalCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Pricing Cards List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-lg border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              item.included
                ? 'bg-white border-cobalt shadow-sm ring-1 ring-cobalt/10'
                : 'bg-paper border-ink-border opacity-60'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-paper text-ink-muted border border-ink-border">
                  {item.category}
                </span>
                <h3 className="font-display font-bold text-sm text-ink">{item.name}</h3>
                {item.isCustom && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-1.5 font-sans leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-6 self-end md:self-center shrink-0">
              <span className="font-mono text-sm font-bold text-ink">
                ₹{item.estimatedCost.toLocaleString('en-IN')}
              </span>

              <button
                onClick={() => toggleItem(item.id)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded border transition-all ${
                  item.included
                    ? 'bg-cobalt text-white border-cobalt'
                    : 'bg-paper text-ink border-ink-border hover:border-ink'
                }`}
              >
                {item.included ? 'Included' : 'Exclude'}
              </button>

              {item.isCustom && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-ink-muted hover:text-rose-600 rounded transition-colors"
                  title="Remove Custom Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Service Input */}
      <div className="bg-paper border border-ink-border rounded-lg p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-ink flex items-center gap-2">
          <Plus className="w-4 h-4 text-cobalt" />
          Add Custom Service / API Integration Line Item
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-ink mb-1">Service / Item Name</label>
            <input
              type="text"
              placeholder="e.g. Payment Gateway Integration (Razorpay)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-ink mb-1">Category</label>
            <input
              type="text"
              placeholder="e.g. Integrations / Infrastructure"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-ink mb-1">Estimated Cost (₹)</label>
            <input
              type="number"
              placeholder="10000"
              value={customCost}
              onChange={(e) => setCustomCost(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-ink mb-1">Item Description</label>
          <input
            type="text"
            placeholder="Brief scope explanation..."
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-ink-border rounded text-xs text-ink font-sans focus:outline-none focus:ring-1 focus:ring-cobalt"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleAddCustomItem}
            disabled={!customName.trim()}
            className="px-5 py-2 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm disabled:opacity-40 transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Additional Line Item</span>
          </button>
        </div>
      </div>
    </div>
  );
}
