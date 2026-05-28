'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const CHAPTERS = [
  { id: 'origin', label: 'Start' },
  { id: 'story', label: 'Demo' },
  { id: 'how-it-works', label: 'Flow' },
  { id: 'pipeline', label: 'Why' },
  { id: 'features', label: 'Stack' },
  { id: 'contact', label: 'Go' },
];

function ChapterCounter() {
  const { scrollYProgress } = useScroll();
  const current = useTransform(scrollYProgress, (v) =>
    String(Math.min(CHAPTERS.length, Math.floor(v * CHAPTERS.length) + 1)).padStart(2, '0')
  );

  return (
    <motion.span className="text-[var(--accent-cyan)]">{current}</motion.span>
  );
}

export default function ScrollChapterNav() {
  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-layer-chrome hidden lg:flex flex-col items-end gap-3 pointer-events-none">
      <div className="text-[10px] font-mono text-[var(--cleo-cocoa-muted)] tabular-nums">
        <ChapterCounter />
        <span className="opacity-40"> / {String(CHAPTERS.length).padStart(2, '0')}</span>
      </div>

      {CHAPTERS.map((ch) => (
        <a
          key={ch.id}
          href={`#${ch.id}`}
          className="pointer-events-auto group flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
        >
          <span className="w-1 h-1 rounded-full bg-current opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_8px_var(--accent-cyan)] transition-all" />
          {ch.label}
        </a>
      ))}

      <p className="text-[9px] font-bold tracking-[0.3em] text-[var(--text-muted)] mt-2 [writing-mode:vertical-rl] rotate-180 pointer-events-none">
        SCROLL
      </p>
    </div>
  );
}
