'use client';

import ScrollReveal from '@/components/motion/ScrollReveal';
import { Building2, ShoppingBag, Headphones } from 'lucide-react';

const USE_CASES = [
  { icon: ShoppingBag, title: 'E-commerce', example: '"Where\'s my order?" · "Can I return this?"' },
  { icon: Building2, title: 'SaaS teams', example: '"How do I reset API keys?" · "What\'s in Pro?"' },
  { icon: Headphones, title: 'Support teams', example: 'Deflect repetitive tickets with doc-grounded replies.' },
];

export default function WhoItsFor() {
  return (
    <section className="relative z-10 py-20 px-6 section-peach">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Built for teams who need <span className="text-gradient-bright">trustworthy</span> answers
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-6">
          {USE_CASES.map((u, i) => (
            <ScrollReveal key={u.title} delay={i * 0.08}>
              <div className="cleo-panel p-6 h-full hover:border-[var(--accent-violet)]/30 transition-colors">
                <u.icon className="w-5 h-5 text-[var(--accent-violet)] mb-4" />
                <h3 className="font-display font-bold text-[var(--text-primary)] mb-2">{u.title}</h3>
                <p className="text-sm text-[var(--text-muted)] italic leading-relaxed font-body">{u.example}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
