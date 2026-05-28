'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Bot } from 'lucide-react';

const MESSAGES = [
  { role: 'bot' as const, text: 'Hi! I answer from your uploaded docs only. What can I help with?' },
  { role: 'user' as const, text: 'Can I return an item after 45 days?' },
  { role: 'bot' as const, text: 'Per refund-policy.pdf: returns are accepted within 30 days of purchase.', source: 'refund-policy.pdf' },
  { role: 'user' as const, text: 'Do you ship internationally?' },
  { role: 'bot' as const, text: 'Yes — shipping-faq.txt lists 40+ countries.', source: 'shipping-faq.txt' },
];

function ChatMessage({
  msg,
  index,
  scrollYProgress,
}: {
  msg: (typeof MESSAGES)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.12 + index * 0.14;
  const end = start + 0.12;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [32, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.94, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          msg.role === 'user'
            ? 'bg-[var(--accent-violet)]/25 text-[var(--text-primary)] border border-[var(--accent-violet)]/40 rounded-br-md'
            : 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-bl-md'
        }`}
      >
        {msg.role === 'bot' && 'source' in msg && msg.source && (
          <span className="block text-[10px] font-semibold text-[var(--accent-cyan)] mb-1">↳ {msg.source}</span>
        )}
        {msg.text}
      </div>
    </motion.div>
  );
}

export default function ScrollChatStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.08], [24, 0]);

  return (
    <section id="story" ref={containerRef} className="relative h-[280vh] section-peach z-10">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 py-20">
        <motion.div className="text-center mb-8 max-w-lg" style={{ opacity: headerOpacity, y: headerY }}>
          <p className="text-[10px] font-bold tracking-[0.4em] text-[var(--accent-cyan)] mb-2">CHAPTER 02</p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            Scroll the <span className="text-gradient-bright">conversation</span>
          </h2>
          <p className="mt-2 text-[var(--text-muted)] text-sm font-body">Each message unlocks as you explore</p>
        </motion.div>

        <div className="cleo-panel w-full max-w-md p-1 animate-float-soft border-[var(--accent-cyan)]/20">
          <div className="rounded-[1.1rem] overflow-hidden bg-[var(--cleo-cream-dark)]">
            <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--border-subtle)]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[var(--background)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Support Assistant</p>
                <p className="text-[11px] text-[var(--accent-cyan)]">Grounded mode</p>
              </div>
            </div>
            <div className="p-4 space-y-3 min-h-[280px]">
              {MESSAGES.map((msg, i) => (
                <ChatMessage key={i} msg={msg} index={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
