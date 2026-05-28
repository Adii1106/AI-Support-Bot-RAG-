'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import ScrollReveal from '@/components/motion/ScrollReveal';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, motionVal, value]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent =
          Math.round(v).toLocaleString() + suffix;
      }
    });
    return unsub;
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const STATS = [
  { value: 3, suffix: '', label: 'Core pipeline stages', sub: 'Ingest → Retrieve → Answer' },
  { value: 768, suffix: '', label: 'Embedding dimensions', sub: 'Supabase pgvector' },
  { value: 100, suffix: '%', label: 'Grounded responses', sub: 'Policy-aware guardrails' },
];

export default function StatsSection() {
  return (
    <section className="py-24 sm:py-32 border-y border-neutral-200/80 bg-neutral-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-3">
            Built for production
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
            A complete RAG support stack
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1} className="text-center">
              <motion.div
                className="text-5xl sm:text-6xl font-black tracking-tighter text-neutral-900 mb-2"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <p className="font-bold text-neutral-900 mb-1">{stat.label}</p>
              <p className="text-sm text-neutral-500">{stat.sub}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
