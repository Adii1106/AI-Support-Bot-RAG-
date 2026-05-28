'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function AmbientBackground() {
  const { scrollYProgress } = useScroll();
  const beamY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#050508]" />
      <div className="absolute inset-0 opacity-[0.35] noise-overlay" />
      <div className="absolute inset-0 grid-lines opacity-50" />

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[2px] h-[40vh] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
        style={{ top: beamY }}
      />

      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[90vw] h-[55vh] rounded-full bg-cyan-500/[0.08] blur-[100px] animate-drift-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[40vh] rounded-full bg-violet-600/[0.07] blur-[90px] animate-drift-reverse" />
      <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[35vh] rounded-full bg-blue-500/[0.06] blur-[80px] animate-drift-slow" style={{ animationDelay: '-4s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(120,180,255,0.1),transparent_55%)]" />

      {/* Corner accents */}
      <div className="absolute top-24 left-8 w-32 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
      <div className="absolute top-24 right-8 w-32 h-px bg-gradient-to-l from-cyan-400/30 to-transparent" />
      <div className="absolute bottom-32 left-12 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-32 right-12 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
}
