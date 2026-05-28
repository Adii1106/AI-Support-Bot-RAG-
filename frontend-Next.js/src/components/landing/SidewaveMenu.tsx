'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const LINKS = [
  { label: 'Start', href: '#origin' },
  { label: 'Live demo', href: '#story' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why RAG', href: '#pipeline' },
  { label: 'Features', href: '#features' },
  { label: 'Get started', href: '#contact' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenChat?: () => void;
};

export default function SidewaveMenu({ open, onClose, onOpenChat }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNav = (href: string) => {
    onClose();
    if (href.startsWith('#')) {
      requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-layer-menu bg-black/60 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[260] bg-[var(--surface-elevated)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)]">
              <span className="font-display font-bold text-[var(--text-primary)] tracking-tight">Menu</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-8">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.href);
                  }}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="font-display block py-4 text-2xl sm:text-3xl font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] hover:text-[var(--accent-cyan)] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="p-6 border-t border-[var(--border-subtle)] space-y-3">
              {onOpenChat && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat();
                  }}
                  className="cleo-btn-primary w-full text-sm"
                >
                  Open chat widget
                </button>
              )}
              <a href="/admin" onClick={onClose} className="cleo-btn-secondary w-full text-sm text-center">
                Admin dashboard
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
