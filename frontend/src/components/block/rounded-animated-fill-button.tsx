'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface RoundedAnimatedFillButtonProps {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function RoundedAnimatedFillButton({
  text,
  href,
  variant = 'primary',
  className = '',
}: RoundedAnimatedFillButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Link href={href} className="inline-block">
      <motion.div
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 flex items-center gap-2 group cursor-pointer border ${
          isPrimary
            ? 'bg-cobalt text-white border-cobalt shadow-sm hover:shadow-md'
            : 'bg-white text-ink border-ink-border hover:border-ink'
        } ${className}`}
      >
        {/* Fill effect background */}
        <motion.div
          variants={{
            hover: { scale: 1.5, opacity: 1 },
          }}
          initial={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`absolute inset-0 rounded-full ${
            isPrimary ? 'bg-cobalt-hover' : 'bg-paper'
          } z-0 pointer-events-none`}
        />

        <span className="relative z-10 font-display font-medium tracking-tight flex items-center gap-2">
          {text}
        </span>

        <motion.span
          variants={{
            hover: { x: 4 },
          }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      </motion.div>
    </Link>
  );
}
