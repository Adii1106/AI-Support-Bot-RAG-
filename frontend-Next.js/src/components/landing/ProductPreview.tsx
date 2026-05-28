'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Bot, Send, FileText, CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';
import { useCursorPosition } from '@/hooks/useCursorPosition';

export default function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const { x, y } = useCursorPosition();

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rotateY = useTransform(x, [0, 1920], [6, -6]);
  const rotateX = useTransform(y, [0, 1080], [-5, 5]);

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-md mx-auto lg:mx-0"
      style={{ y: parallaxY, rotateY, rotateX, transformPerspective: 1000 }}
    >
      <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl rounded-3xl" />
      <div className="relative sw-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Support Assistant</p>
              <p className="text-[10px] text-emerald-400/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-pulse" />
                Answers from your docs
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 min-h-[220px] bg-[#08080c]">
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="rounded-xl rounded-tl-sm bg-white/5 border border-white/5 px-3 py-2 text-[11px] text-white/70 max-w-[85%]">
              Hi! Ask me about shipping, returns, or product specs — I only use your uploaded policies.
            </div>
          </div>
          <div className="flex justify-end">
            <div className="rounded-xl rounded-tr-sm bg-cyan-500/20 border border-cyan-400/30 px-3 py-2 text-[11px] text-cyan-100 max-w-[80%]">
              What&apos;s your return window?
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="rounded-xl rounded-tl-sm bg-white/5 border border-white/5 px-3 py-2 text-[11px] text-white/70 max-w-[90%]">
              <span className="text-cyan-400/80 text-[9px] font-mono block mb-1">↳ from refund-policy.pdf</span>
              Returns accepted within 30 days per your policy.
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-white/10 flex gap-2 items-center bg-white/[0.02]">
          <div className="flex-1 h-9 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/30 flex items-center px-3">
            Type a question…
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center">
            <Send className="w-3.5 h-3.5 text-[#050508]" />
          </div>
        </div>
      </div>

      {/* Floating doc badges */}
      <motion.div
        className="absolute -left-4 top-1/4 sw-panel rounded-xl px-3 py-2 flex items-center gap-2 text-[10px] font-medium text-white/60"
        style={{ x: useTransform(x, (v) => (v - 960) * 0.015) }}
      >
        <FileText className="w-3.5 h-3.5 text-cyan-400/70" />
        refund-policy.pdf
      </motion.div>
      <motion.div
        className="absolute -right-2 bottom-1/4 sw-panel rounded-xl px-3 py-2 flex items-center gap-2 text-[10px] font-medium text-emerald-400/80"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Grounded answer
      </motion.div>
    </motion.div>
  );
}
