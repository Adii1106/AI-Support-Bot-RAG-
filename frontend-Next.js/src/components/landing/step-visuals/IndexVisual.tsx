'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const NODES = [
  { x: 20, y: 30 }, { x: 50, y: 20 }, { x: 80, y: 35 },
  { x: 35, y: 65 }, { x: 65, y: 70 }, { x: 50, y: 48 },
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 5], [2, 4], [3, 5], [4, 5], [3, 4],
];

export default function IndexVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  return (
    <div ref={ref} className="relative h-36 rounded-xl bg-[#030305] border border-[var(--accent-violet)]/20 overflow-hidden mb-5">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a14] via-[#12101a] to-[#030305]" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
            stroke="rgba(168,85,247,0.4)"
            strokeWidth="0.5"
            animate={inView ? { opacity: [0.1, 0.6, 0.1] } : {}}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
      </svg>

      {NODES.map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--accent-violet)] shadow-[0_0_10px_var(--accent-violet)]"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          animate={inView ? { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
        />
      ))}

      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent"
        animate={inView ? { top: ['10%', '90%', '10%'] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />

      <p className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-mono text-[var(--accent-cyan)]/60 tracking-widest">
        EMBEDDING · PGVECTOR
      </p>
    </div>
  );
}
