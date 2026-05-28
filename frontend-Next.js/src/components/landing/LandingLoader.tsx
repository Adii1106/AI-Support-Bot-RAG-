'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import LoaderIntroScene from '@/components/landing/LoaderIntroScene';

export default function LandingLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'ready' | 'exit'>('idle');
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setSkipped(true);
      onDone();
      return;
    }
    const t = window.setTimeout(() => setPhase('ready'), 400);
    return () => window.clearTimeout(t);
  }, [onDone]);

  if (skipped) return null;

  const handleStart = () => {
    setPhase('exit');
    setTimeout(onDone, 550);
  };

  return (
    <AnimatePresence mode="wait">
      {phase !== 'exit' && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-layer-loader flex flex-col items-center justify-center"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <LoaderIntroScene />

          <div className="relative z-10 text-center px-6 max-w-lg">
            <motion.p
              className="font-display text-[10px] font-bold tracking-[0.55em] text-[var(--accent-cyan)] mb-6"
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.55em' }}
              transition={{ duration: 1 }}
            >
              AGENTIC SUPPORT
            </motion.p>

            <motion.h1
              className="font-display text-5xl sm:text-7xl font-extrabold tracking-tighter text-[var(--text-primary)] mb-4"
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-gradient-bright">Grounded</span>
              <br />
              <span className="font-serif italic font-normal text-[var(--text-muted)]">support</span>
            </motion.h1>

            <motion.p
              className="font-body text-sm text-[var(--text-muted)] mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Tap to begin — answers woven only from your documentation
            </motion.p>

            {phase === 'ready' && (
              <motion.button
                type="button"
                onClick={handleStart}
                className="cleo-btn-primary tracking-[0.2em] text-xs uppercase relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Tap to begin</span>
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.button>
            )}
          </div>

          <motion.p
            className="absolute bottom-8 font-display text-[9px] font-bold tracking-[0.4em] text-[var(--text-muted)]"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SCROLL TO CONTINUE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
