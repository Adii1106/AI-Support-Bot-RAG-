'use client';

import { motion, useTransform } from 'framer-motion';
import { useCursorPosition } from '@/hooks/useCursorPosition';

export default function CursorEffects() {
  const { x, y } = useCursorPosition();

  const glowX = useTransform(x, (v) => v - 200);
  const glowY = useTransform(y, (v) => v - 200);
  const ringX = useTransform(x, (v) => v - 24);
  const ringY = useTransform(y, (v) => v - 24);
  const dotX = useTransform(x, (v) => v - 3);
  const dotY = useTransform(y, (v) => v - 3);

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none hidden md:block" aria-hidden>
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-cyan-400/[0.07] blur-[80px]"
        style={{ x: glowX, y: glowY }}
      />
      <motion.div
        className="absolute w-12 h-12 rounded-full border border-cyan-400/20"
        style={{ x: ringX, y: ringY }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/60"
        style={{ x: dotX, y: dotY }}
      />
    </div>
  );
}
