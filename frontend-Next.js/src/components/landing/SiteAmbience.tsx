'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function SiteAmbience() {
  const { scrollYProgress } = useScroll();
  const blob1Y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const lineRotate = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--background)]" />
      <div className="absolute inset-0 bg-grid-fine opacity-60" />

      <motion.div
        className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] rounded-full"
        style={{
          y: blob1Y,
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 65%)',
        }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[40vh] rounded-full"
        style={{
          y: blob2Y,
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 65%)',
        }}
      />
      <motion.div
        className="absolute top-[50%] left-[-15%] w-[40vw] h-[35vh] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(244,114,182,0.06) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          rotate: lineRotate,
          backgroundImage: 'repeating-linear-gradient(105deg, var(--text-primary) 0, var(--text-primary) 1px, transparent 1px, transparent 80px)',
        }}
      />

      <motion.div className="scene-3d absolute right-[6%] top-[20%] w-20 h-20 hidden md:block" style={{ y: blob2Y }}>
        <div className="cube-3d cube-3d-lg cube-3d-accent">
          <div className="cube-face cube-front" />
          <div className="cube-face cube-back" />
          <div className="cube-face cube-right" />
          <div className="cube-face cube-left" />
          <div className="cube-face cube-top" />
          <div className="cube-face cube-bottom" />
        </div>
      </motion.div>

      <motion.div className="scene-3d absolute left-[5%] bottom-[25%] w-14 h-14 hidden lg:block" style={{ y: blob1Y }}>
        <div className="cube-3d cube-3d-sm">
          <div className="cube-face cube-front" />
          <div className="cube-face cube-back" />
          <div className="cube-face cube-right" />
          <div className="cube-face cube-left" />
          <div className="cube-face cube-top" />
          <div className="cube-face cube-bottom" />
        </div>
      </motion.div>
    </div>
  );
}
