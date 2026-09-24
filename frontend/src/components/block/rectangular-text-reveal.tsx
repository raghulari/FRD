'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface RectangularTextRevealProps {
  title: string;
  subtitle?: string;
  tag?: string;
  className?: string;
}

export function RectangularTextReveal({
  title,
  subtitle,
  tag = 'SPECIFICATION STANDARD',
  className = '',
}: RectangularTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !rectRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rectRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`relative my-16 py-12 px-8 ${className}`}>
      <div
        ref={rectRef}
        className="absolute inset-0 border-2 border-ink bg-white shadow-sm transform origin-left"
      />
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <span className="text-[11px] font-mono uppercase tracking-widest text-cobalt bg-cobalt-light px-3 py-1 rounded border border-cobalt/20 mb-4 inline-block">
          {tag}
        </span>
        <h2 ref={textRef} className="text-2xl md:text-4xl font-bold font-display text-ink tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-sm md:text-base text-ink-muted max-w-xl mx-auto font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
