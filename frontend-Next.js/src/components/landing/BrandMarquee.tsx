'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const PHRASE = 'INGEST · RETRIEVE · GUARD · GROUNDED · ZERO HALLUCINATION · ';

export default function BrandMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <div
      ref={ref}
      className="relative py-5 overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--cleo-cream-dark)]"
    >
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {[PHRASE, PHRASE, PHRASE].map((text, i) => (
          <span
            key={i}
            className="font-display text-[clamp(1.25rem,3vw,2rem)] font-black tracking-tight text-[var(--text-primary)]/[0.06] px-6 uppercase"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
