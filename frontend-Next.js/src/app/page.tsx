"use client";

import { useState, useCallback } from 'react';
import ChatWidget from '@/components/ChatWidget';
import LandingLoader from '@/components/landing/LandingLoader';
import CleoHero from '@/components/landing/CleoHero';
import ScrollChatStory from '@/components/landing/ScrollChatStory';
import ScrollProgress from '@/components/landing/ScrollProgress';
import ScrollChapterNav from '@/components/landing/ScrollChapterNav';
import SidewaveMenu from '@/components/landing/SidewaveMenu';
import ServiceTicker from '@/components/landing/ServiceTicker';
import HowItWorks from '@/components/landing/HowItWorks';
import WhoItsFor from '@/components/landing/WhoItsFor';
import SiteAmbience from '@/components/landing/SiteAmbience';
import CursorAmbience from '@/components/landing/CursorAmbience';
import BrandMarquee from '@/components/landing/BrandMarquee';
import ParallaxWrap from '@/components/landing/ParallaxWrap';
import ScrollReveal from '@/components/motion/ScrollReveal';
import TextReveal from '@/components/landing/TextReveal';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, Database, Bot, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: Database, title: 'Ingest', body: 'Upload PDFs and text. FastAPI chunks, embeds, and stores vectors in Supabase.' },
  { icon: Bot, title: 'Retrieve', body: 'Semantic search finds the right passage for each customer question.' },
  { icon: ShieldCheck, title: 'Guard', body: 'If the answer isn\'t in your docs, the bot says so — no fake policies.' },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openWidget = useCallback(() => {
    window.dispatchEvent(new Event('open-chat-widget'));
  }, []);

  const handleStarted = useCallback(() => setStarted(true), []);

  return (
    <div className="relative section-cream min-h-screen">
      <LandingLoader onDone={handleStarted} />

      {started && (
        <>
          <SiteAmbience />
          <CursorAmbience />
          <ScrollProgress />
          <ScrollChapterNav />

          <SidewaveMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onOpenChat={openWidget}
          />

          <header className="fixed top-0 left-0 right-0 z-layer-header flex items-center justify-between px-4 sm:px-6 py-4 bg-[color-mix(in_srgb,var(--background)_80%,transparent)] backdrop-blur-xl border-b border-[var(--border-subtle)]">
            <a href="/" className="font-display text-sm font-bold text-[var(--text-primary)] tracking-tight">
              Agentic<span className="text-[var(--accent-cyan)]">Support</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex items-center gap-2 font-display text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer px-3 py-2 rounded-full border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)]/40"
              >
                Menu <Menu className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="z-layer-content relative">
            <CleoHero loaded={started} onTryDemo={openWidget} />
            <BrandMarquee />
            <ScrollChatStory />
            <ServiceTicker />
            <HowItWorks />
            <WhoItsFor />

            <section id="pipeline" className="py-24 sm:py-32 px-6 section-cream">
              <ParallaxWrap className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <ScrollReveal>
                    <p className="font-display text-[10px] font-bold tracking-[0.45em] text-[var(--accent-pink)] mb-4">CHAPTER 04</p>
                    <TextReveal
                      as="h2"
                      lines={['Generic AI', 'guesses.']}
                      className="font-display text-3xl sm:text-5xl font-bold text-[var(--text-primary)] leading-[1.05]"
                    />
                  </ScrollReveal>
                  <ScrollReveal delay={0.15} className="mt-8 space-y-4 max-w-lg">
                    <p className="text-[var(--text-muted)] leading-relaxed font-body">
                      Normal chatbots invent refund rules, wrong shipping times, and features you don&apos;t offer.
                    </p>
                    <p className="text-[var(--text-primary)] font-medium border-l-4 border-[var(--accent-cyan)] pl-4 font-body">
                      AgenticSupport only reads your uploaded files — every reply traces to a real document.
                    </p>
                  </ScrollReveal>
                </div>
                <ScrollReveal direction="right" delay={0.1}>
                  <div className="cleo-panel p-6 space-y-4">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Example</p>
                    <p className="text-[var(--text-primary)] font-medium">&ldquo;Can I return after 45 days?&rdquo;</p>
                    <div className="h-px bg-[var(--border-subtle)]" />
                    <p className="text-xs text-red-400 font-semibold">Generic AI</p>
                    <p className="text-sm text-[var(--text-muted)] line-through">Sure, most companies allow 60 days…</p>
                    <p className="text-xs text-[var(--accent-cyan)] font-semibold pt-2">AgenticSupport</p>
                    <p className="text-sm text-[var(--text-primary)]">
                      Per <span className="font-semibold text-[var(--accent-cyan)]">refund-policy.pdf</span>: returns within 30 days only.
                    </p>
                  </div>
                </ScrollReveal>
              </ParallaxWrap>
            </section>

            <section id="features" className="py-24 sm:py-32 px-6 section-peach">
              <ParallaxWrap className="max-w-6xl mx-auto" speed={0.06}>
                <ScrollReveal className="mb-14 max-w-xl">
                  <p className="font-display text-[10px] font-bold tracking-[0.45em] text-[var(--accent-cyan)] mb-3">UNDER THE HOOD</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">Three steps in the pipeline</h2>
                </ScrollReveal>
                <div className="grid md:grid-cols-3 gap-6">
                  {FEATURES.map((f, i) => (
                    <ScrollReveal key={f.title} delay={i * 0.1}>
                      <article className="cleo-panel p-8 h-full group hover:border-[var(--accent-violet)]/40 spring-transition">
                        <f.icon className="w-6 h-6 text-[var(--accent-cyan)] mb-4" />
                        <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
                        <p className="text-sm text-[var(--text-muted)] font-body">{f.body}</p>
                      </article>
                    </ScrollReveal>
                  ))}
                </div>
              </ParallaxWrap>
            </section>

            <section id="stack" className="py-24 sm:py-32 px-6 section-ink overflow-hidden">
              <ParallaxWrap className="max-w-6xl mx-auto">
                <ScrollReveal>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                    Built with a <span className="text-gradient-bright">modern stack</span>
                  </h2>
                  <p className="text-[var(--text-muted)] max-w-lg mb-14 font-body">Next.js · FastAPI · Supabase pgvector · Llama 3.3</p>
                </ScrollReveal>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { value: '3', label: 'Steps to go live' },
                    { value: '24/7', label: 'Widget on your site' },
                    { value: '0', label: 'Hallucinated policies' },
                  ].map((s, i) => (
                    <ScrollReveal key={s.label} delay={i * 0.1}>
                      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8">
                        <p className="font-display text-4xl sm:text-5xl font-black text-gradient-bright">{s.value}</p>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">{s.label}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </ParallaxWrap>
            </section>

            <BrandMarquee />

            <section id="contact" className="py-24 sm:py-32 px-6 section-sand">
              <ParallaxWrap className="max-w-2xl mx-auto text-center">
                <ScrollReveal>
                  <p className="font-display text-[10px] font-bold tracking-[0.45em] text-[var(--accent-cyan)] mb-4">FINAL</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">Ready to try it?</h2>
                  <p className="text-[var(--text-muted)] mb-10 font-body">
                    Open the demo widget or upload documents in the admin dashboard.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button type="button" onClick={openWidget} className="cleo-btn-primary w-full sm:w-auto">
                      Try chat widget
                    </button>
                    <a href="/admin" className="cleo-btn-secondary w-full sm:w-auto">
                      Admin dashboard
                    </a>
                  </div>
                </ScrollReveal>
              </ParallaxWrap>
            </section>

            <footer className="py-10 px-6 border-t border-[var(--border-subtle)] section-cream">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)] font-body">
                <span>AgenticSupport — AI support from your documentation</span>
                <div className="flex gap-6">
                  <a href="/admin" className="hover:text-[var(--accent-cyan)] transition-colors">Dashboard</a>
                  <a href="#how-it-works" className="hover:text-[var(--accent-cyan)] transition-colors">How it works</a>
                </div>
              </div>
            </footer>
          </div>

          <ChatWidget />
        </>
      )}
    </div>
  );
}
