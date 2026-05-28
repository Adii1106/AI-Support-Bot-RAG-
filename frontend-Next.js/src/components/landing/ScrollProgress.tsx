'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[80]"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink))',
        boxShadow: '0 0 12px var(--glow-cyan)',
      }}
    />
  );
}
