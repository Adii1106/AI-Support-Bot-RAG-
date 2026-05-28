'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

type CleoHeroProps = {
  loaded: boolean;
  onTryDemo: () => void;
};

export default function CleoHero({ loaded, onTryDemo }: CleoHeroProps) {
  return (
    <section
      id="origin"
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
    >
      <div className="relative text-center max-w-4xl mx-auto z-10">
        <motion.p
          className="font-display text-[10px] font-bold tracking-[0.45em] text-[var(--accent-cyan)] mb-8"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
        >
          AI SUPPORT · RAG · YOUR DOCS ONLY
        </motion.p>

        <h1 className="font-display text-[clamp(2.5rem,9vw,5rem)] font-extrabold leading-[0.95] tracking-tighter text-[var(--text-primary)]">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={loaded ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Support that only
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-gradient-bright"
              initial={{ y: '110%' }}
              animate={loaded ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              knows your company.
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="font-serif italic text-lg sm:text-xl text-[var(--text-muted)] max-w-md mx-auto mt-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Upload FAQs and policies. Embed the widget. Real answers — not guesses.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
        >
          <button type="button" onClick={onTryDemo} className="cleo-btn-primary w-full sm:w-auto">
            Try the demo
          </button>
          <a href="/admin" className="cleo-btn-secondary w-full sm:w-auto">
            Upload documents
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#story"
        className="absolute bottom-10 flex flex-col items-center gap-2 font-display text-[10px] font-bold tracking-[0.35em] text-[var(--text-muted)] uppercase z-10"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
      >
        Scroll to continue
        <ArrowDown className="w-4 h-4 text-[var(--accent-cyan)] animate-scroll-hint" />
      </motion.a>
    </section>
  );
}
