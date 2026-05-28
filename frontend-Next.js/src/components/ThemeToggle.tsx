'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-11 h-11 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-cyan)] hover:shadow-[0_0_20px_var(--glow-cyan)] transition-all cursor-pointer ${className}`}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
