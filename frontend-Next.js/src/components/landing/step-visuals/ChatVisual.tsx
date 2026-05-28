'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Bot } from 'lucide-react';

const MESSAGES = [
  { from: 'user', text: 'Return policy?' },
  { from: 'bot', text: '30 days per your docs.' },
];

export default function ChatVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  return (
    <div ref={ref} className="relative h-36 rounded-xl bg-[var(--cleo-cream-dark)] border border-[var(--border-subtle)] overflow-hidden mb-5">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-pink)] flex items-center justify-center">
          <Bot className="w-3 h-3 text-[var(--background)]" />
        </div>
        <span className="text-[10px] font-bold text-[var(--text-primary)]">Widget</span>
        <motion.span className="ml-auto flex gap-0.5" animate={inView ? { opacity: [0.3, 1, 0.3] } : {}} transition={{ duration: 1.2, repeat: Infinity }}>
          {[0, 1, 2].map((d) => (
            <span key={d} className="w-1 h-1 rounded-full bg-[var(--accent-cyan)]" />
          ))}
        </motion.span>
      </div>

      <div className="p-3 space-y-2 relative">
        {MESSAGES.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: [0, 1, 1, 0], y: [8, 0, 0, -4] } : {}}
            transition={{ duration: 4, delay: i * 1.2, repeat: Infinity, repeatDelay: 0.5 }}
          >
            <span
              className={`text-[10px] px-2.5 py-1.5 rounded-xl max-w-[85%] ${
                msg.from === 'user'
                  ? 'bg-[var(--accent-pink)]/25 text-[var(--text-primary)] border border-[var(--accent-pink)]/30 rounded-br-sm'
                  : 'bg-[var(--accent-cyan)]/10 text-[var(--text-primary)] border border-[var(--accent-cyan)]/20 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] shadow-[0_0_20px_var(--glow-cyan)] flex items-center justify-center"
        animate={inView ? { y: [0, -5, 0], rotateY: [0, 15, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--background)" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.div>
    </div>
  );
}
