'use client';

import { motion } from 'framer-motion';

/** Floema-inspired wireframe + LOUD energy — loader background only */
export default function LoaderIntroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[var(--loader-bg)]" />

      {/* Aurora washes */}
      <motion.div
        className="absolute top-[-30%] left-[-20%] w-[80vw] h-[80vw] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, var(--glow-cyan) 0%, transparent 55%)' }}
        animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-15%] w-[70vw] h-[70vw] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, var(--glow-violet) 0%, transparent 60%)' }}
        animate={{ x: [0, -60, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Floema-style wireframe silhouettes */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 1200 800" fill="none">
        <motion.ellipse
          cx="200" cy="400" rx="120" ry="180"
          stroke="var(--accent-cyan)"
          strokeWidth="1"
          strokeDasharray="8 12"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 400px' }}
        />
        <motion.rect
          x="850" y="150" width="200" height="320" rx="24"
          stroke="var(--accent-violet)"
          strokeWidth="1"
          strokeDasharray="6 10"
          animate={{ y: [150, 170, 150] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.path
          d="M600 100 Q700 300 500 500 T600 700"
          stroke="var(--accent-pink)"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ pathLength: [0.3, 1, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </svg>

      {/* Orbiting rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent-cyan)]/20"
          style={{ width: 280 + i * 120, height: 280 + i * 120 }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[var(--accent-cyan)]"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.5, 1.5, 0.5],
            y: [0, -30 - (i % 5) * 10, 0],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-60"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
