'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Bot, MessageSquare, Database, Sparkles } from 'lucide-react';

function MockChatCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200/80 bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.12)] overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/80">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Support Widget
        </span>
      </div>
      <div className="p-4 space-y-3 bg-gradient-to-b from-white to-neutral-50/50">
        <div className="flex gap-2 items-start">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="rounded-xl rounded-tl-sm bg-neutral-100 px-3 py-2 text-[11px] text-neutral-600 max-w-[85%] leading-relaxed">
            Hi! I&apos;m trained on your docs. Ask about refunds, shipping, or policies.
          </div>
        </div>
        <div className="flex gap-2 items-start justify-end">
          <div className="rounded-xl rounded-tr-sm bg-neutral-900 px-3 py-2 text-[11px] text-white max-w-[75%]">
            What&apos;s your return policy?
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="rounded-xl rounded-tl-sm bg-neutral-100 px-3 py-2 text-[11px] text-neutral-600 max-w-[90%] leading-relaxed">
            Returns are accepted within 30 days per your policy doc §4.2…
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-neutral-100 flex gap-2">
        <div className="flex-1 h-8 rounded-lg bg-neutral-100" />
        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
          <MessageSquare className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    </div>
  );
}

function MockAdminCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200/80 bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.1)] overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-900">Knowledge Base</span>
        <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
      </div>
      <div className="p-4 space-y-2">
        {['refund-policy.pdf', 'shipping-faq.txt', 'terms-v2.pdf'].map((file) => (
          <div
            key={file}
            className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 border border-neutral-100"
          >
            <Database className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[10px] font-medium text-neutral-600 truncate">{file}</span>
            <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              INDEXED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const yBack = useTransform(smoothProgress, [0, 1], [0, 80]);
  const yFront = useTransform(smoothProgress, [0, 1], [0, -40]);
  const rotateBack = useTransform(smoothProgress, [0, 1], [-8, -14]);
  const rotateFront = useTransform(smoothProgress, [0, 1], [6, 12]);
  const scaleHero = useTransform(smoothProgress, [0, 0.5], [1, 0.92]);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto h-[420px] sm:h-[480px] mt-16 sm:mt-20">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ scale: scaleHero, transformPerspective: 1400 }}
      >
        {/* Glow behind cards */}
        <div className="absolute w-[70%] h-[60%] bg-neutral-200/40 blur-[80px] rounded-full" />

        <motion.div
          className="absolute w-[55%] sm:w-[48%] -left-2 sm:left-4 top-8 z-10"
          style={{ y: yBack, rotate: rotateBack, rotateX: 8 }}
        >
          <MockAdminCard />
        </motion.div>

        <motion.div
          className="absolute w-[62%] sm:w-[52%] right-0 sm:right-4 top-0 z-20"
          style={{ y: yFront, rotate: rotateFront, rotateX: -6 }}
        >
          <MockChatCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
