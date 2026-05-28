'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { FileText, MessageCircle, Search, Zap, type LucideIcon } from 'lucide-react';

type FloaterProps = {
  Icon: LucideIcon;
  side: 'left' | 'right';
  top: string;
  scrollFactor: number;
  scrollYProgress: MotionValue<number>;
};

function FloaterItem({ Icon, side, top, scrollFactor, scrollYProgress }: FloaterProps) {
  const y = useTransform(scrollYProgress, [0, 1], [0, 400 * scrollFactor]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, scrollFactor > 0 ? 25 : -25]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.15, 0.35, 0.35, 0.1]);

  return (
    <motion.div
      className={`absolute ${side === 'left' ? 'left-[4%]' : 'right-[4%]'} sw-panel rounded-2xl p-4 w-14 h-14 flex items-center justify-center`}
      style={{ top, y, rotate, opacity }}
    >
      <Icon className="w-6 h-6 text-cyan-400/40" />
    </motion.div>
  );
}

const FLOATERS: Omit<FloaterProps, 'scrollYProgress'>[] = [
  { Icon: FileText, side: 'left', top: '18%', scrollFactor: 0.15 },
  { Icon: Search, side: 'right', top: '35%', scrollFactor: -0.12 },
  { Icon: MessageCircle, side: 'left', top: '55%', scrollFactor: 0.2 },
  { Icon: Zap, side: 'right', top: '72%', scrollFactor: -0.18 },
];

export default function ScrollDecorations() {
  const { scrollYProgress } = useScroll();
  const ringRotate1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const ringScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.1]);
  const ringRotate2 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden hidden lg:block" aria-hidden>
      {FLOATERS.map((f, i) => (
        <FloaterItem key={i} {...f} scrollYProgress={scrollYProgress} />
      ))}

      <motion.div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 w-[min(90vw,700px)] aspect-square rounded-full border border-white/[0.04]"
        style={{ rotate: ringRotate1, scale: ringScale }}
      />
      <motion.div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 w-[min(70vw,500px)] aspect-square rounded-full border border-cyan-400/[0.06]"
        style={{ rotate: ringRotate2 }}
      />
    </div>
  );
}
