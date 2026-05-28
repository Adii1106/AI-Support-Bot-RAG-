'use client';

import ScrollReveal from '@/components/motion/ScrollReveal';
import UploadVisual from '@/components/landing/step-visuals/UploadVisual';
import IndexVisual from '@/components/landing/step-visuals/IndexVisual';
import ChatVisual from '@/components/landing/step-visuals/ChatVisual';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  { step: '1', title: 'Upload your documents', plain: 'Add PDFs or text in the admin dashboard — FAQs, policies, product guides.', Visual: UploadVisual },
  { step: '2', title: 'We index them', plain: 'Content is chunked and stored as vectors so the AI finds the right passage by meaning.', Visual: IndexVisual },
  { step: '3', title: 'Customers chat on your site', plain: 'A floating widget answers using only your docs — no invented policies.', Visual: ChatVisual },
] as const;

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-24 sm:py-32 px-6 section-sand overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-bold tracking-[0.45em] text-[var(--accent-violet)] mb-3">CHAPTER 03</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">What is AgenticSupport?</h2>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed font-body">
            An <strong className="text-[var(--text-primary)]">AI support chat widget</strong> for your website — answers from{' '}
            <strong className="text-[var(--accent-cyan)]">your knowledge only</strong>.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 0.1}>
              <article className="cleo-panel p-6 sm:p-8 h-full flex flex-col hover:border-[var(--accent-cyan)]/30 transition-colors duration-500">
                <span className="inline-flex w-9 h-9 rounded-full bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] text-sm font-bold items-center justify-center mb-3 border border-[var(--accent-cyan)]/20">
                  {s.step}
                </span>
                <s.Visual />
                <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-grow font-body">{s.plain}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.15} className="mt-12 flex justify-center">
          <div className="cleo-panel px-6 py-4 flex flex-wrap items-center justify-center gap-2 text-sm text-[var(--text-muted)] font-body">
            <span className="font-semibold text-[var(--text-primary)]">In short:</span>
            <span>Docs in</span>
            <ArrowRight className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span>Indexed</span>
            <ArrowRight className="w-4 h-4 text-[var(--accent-violet)]" />
            <span>Widget answers</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
