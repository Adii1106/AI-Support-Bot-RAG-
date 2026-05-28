'use client';

import { motion, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCursorPosition } from '@/hooks/useCursorPosition';
import { useCursorTrail, type TrailPoint } from '@/hooks/useCursorTrail';

export default function CursorAmbience() {
  const { x, y } = useCursorPosition();
  const { subscribe } = useCursorTrail();
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  useEffect(() => subscribe(setTrail), [subscribe]);

  const spotX = useTransform(x, (v) => v - 200);
  const spotY = useTransform(y, (v) => v - 200);
  const ringX = useTransform(x, (v) => v - 28);
  const ringY = useTransform(y, (v) => v - 28);
  const dotX = useTransform(x, (v) => v - 4);
  const dotY = useTransform(y, (v) => v - 4);
  const lineX = useTransform(x, (v) => v);
  const lineY = useTransform(y, (v) => v);

  return (
    <div className="cursor-ambience fixed inset-0 z-[2] pointer-events-none hidden md:block" aria-hidden>
      {/* Crosshair lines — LOUD precision */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/25 to-transparent"
        style={{ top: lineY }}
      />
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--accent-violet)]/20 to-transparent"
        style={{ left: lineX }}
      />

      {/* Trail dots */}
      {trail.map((p, i) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[var(--accent-cyan)]"
          style={{
            left: p.x,
            top: p.y,
            width: Math.max(2, 8 - i * 0.6),
            height: Math.max(2, 8 - i * 0.6),
            opacity: Math.max(0.05, 0.5 - i * 0.04),
            transform: 'translate(-50%, -50%)',
            boxShadow: i < 3 ? '0 0 8px var(--glow-cyan)' : 'none',
          }}
        />
      ))}

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          x: spotX,
          y: spotY,
          background:
            'radial-gradient(circle, rgba(34,211,238,0.14) 0%, rgba(168,85,247,0.08) 35%, transparent 65%)',
        }}
      />

      <motion.div
        className="absolute w-14 h-14 rounded-full border-2 border-[var(--accent-cyan)]/40"
        style={{
          x: ringX,
          y: ringY,
          boxShadow: '0 0 24px var(--glow-cyan), inset 0 0 12px rgba(34,211,238,0.1)',
        }}
      />

      <motion.div
        className="absolute w-2 h-2 rounded-full bg-[var(--accent-cyan)]"
        style={{ x: dotX, y: dotY, boxShadow: '0 0 12px var(--accent-cyan)' }}
      />
    </div>
  );
}
