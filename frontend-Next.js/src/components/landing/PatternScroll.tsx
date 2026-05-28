'use client';

import { motion } from 'framer-motion';

const PATTERNS = [
  'Document Upload',
  'Vector Search',
  'Semantic Retrieval',
  'Streaming Answers',
  'Admin Console',
  'Zero Hallucination',
  'Policy Guardrails',
  'Chat Widget',
  'pgvector',
  'FastAPI',
  'Next.js API',
  'Supabase',
];

const row1 = PATTERNS;
const row2 = [...PATTERNS].reverse();

function PatternChip({ label }: { label: string }) {
  return (
    <div className="shrink-0 px-5 py-3 rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
      <span className="text-sm font-semibold text-neutral-800 whitespace-nowrap">{label}</span>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = 'left',
  duration = 35,
}: {
  items: string[];
  direction?: 'left' | 'right';
  duration?: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="flex overflow-hidden mask-fade-x py-2">
      <motion.div
        className="flex gap-3"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((label, i) => (
          <PatternChip key={`${label}-${i}`} label={label} />
        ))}
      </motion.div>
    </div>
  );
}

export default function PatternScroll() {
  return (
    <div className="space-y-3 w-full">
      <MarqueeRow items={row1} direction="left" duration={40} />
      <MarqueeRow items={row2} direction="right" duration={45} />
    </div>
  );
}
