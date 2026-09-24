'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface ScrollStackItem {
  id: string;
  number: string;
  title: string;
  description: string;
  badge?: string;
  attributes: { label: string; value: string }[];
}

interface ScrollStackProps {
  items: ScrollStackItem[];
  className?: string;
}

export function ScrollStack({ items, className = '' }: ScrollStackProps) {
  return (
    <div className={`space-y-8 my-16 ${className}`}>
      {items.map((item, idx) => (
        <Card key={item.id} item={item} index={idx} total={items.length} />
      ))}
    </div>
  );
}

function Card({ item, index, total }: { item: ScrollStackItem; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95 + index * 0.01, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale }}
      className="sticky top-24 border border-ink-border bg-white rounded-lg p-6 md:p-8 shadow-sm transition-all hover:border-cobalt/40"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-ink-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-cobalt bg-cobalt-light px-2.5 py-1 rounded border border-cobalt/20">
            {item.number}
          </span>
          <h3 className="text-xl font-bold font-display text-ink">{item.title}</h3>
        </div>
        {item.badge && (
          <span className="text-xs font-mono text-ink-muted mt-2 md:mt-0 uppercase tracking-wider">
            {item.badge}
          </span>
        )}
      </div>

      <p className="text-sm text-ink-muted leading-relaxed mb-6 font-sans">
        {item.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-paper p-4 rounded border border-ink-border font-mono text-xs">
        {item.attributes.map((attr, i) => (
          <div key={i} className="space-y-1">
            <span className="text-[11px] text-ink-muted block uppercase tracking-wider">{attr.label}</span>
            <span className="font-semibold text-ink block">{attr.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
