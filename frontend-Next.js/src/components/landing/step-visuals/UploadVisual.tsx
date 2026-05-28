'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText } from 'lucide-react';

const FILES = [
  { name: 'policy.pdf', delay: 0 },
  { name: 'faq.txt', delay: 0.4 },
  { name: 'guide.pdf', delay: 0.8 },
];

export default function UploadVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  return (
    <div
      ref={ref}
      className="relative h-36 rounded-xl bg-[var(--cleo-cream-dark)] border border-[var(--border-subtle)] overflow-hidden mb-5"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      <div className="absolute inset-x-4 bottom-3 h-14 rounded-lg border border-dashed border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/5 flex items-center justify-center">
        <motion.span
          className="text-[10px] font-semibold text-[var(--accent-cyan)]"
          animate={inView ? { opacity: [0.4, 1, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Drop zone
        </motion.span>
      </div>

      {FILES.map((file, i) => (
        <motion.div
          key={file.name}
          className="absolute left-1/2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[9px] text-[var(--text-primary)]"
          initial={{ x: '-50%', y: -20, opacity: 0 }}
          animate={
            inView
              ? { x: '-50%', y: [8, 52, 52, 8], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }
              : {}
          }
          transition={{ duration: 3.2, delay: file.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{ left: `${35 + i * 15}%` }}
        >
          <FileText className="w-3 h-3 text-[var(--accent-cyan)]" />
          {file.name}
        </motion.div>
      ))}
    </div>
  );
}
