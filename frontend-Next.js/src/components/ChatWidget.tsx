'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, RotateCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-chat-widget', open);
    return () => window.removeEventListener('open-chat-widget', open);
  }, []);

  const handleClear = () => {
    setMessages([]);
    setInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const prompt = input;
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history: messages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      setIsLoading(false);
      setIsStreaming(true);
      let assistantContent = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const dataLine = line.slice(6);
            if (dataLine === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataLine);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { ...next[next.length - 1], content: assistantContent };
                  return next;
                });
              }
            } catch {
              /* partial json */
            }
          }
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${msg}` }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-layer-chat font-body antialiased pointer-events-none">
      <div className="pointer-events-auto relative">
        {isOpen && (
          <div
            role="dialog"
            aria-label="Support chat"
            className="absolute bottom-20 right-0 w-[min(100vw-3rem,420px)] h-[min(600px,calc(100vh-7rem))] rounded-2xl flex flex-col overflow-hidden cleo-panel border-[var(--accent-cyan)]/20 shadow-[0_0_40px_var(--glow-cyan)]"
          >
            <header className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-gradient-to-r from-[color-mix(in_srgb,var(--accent-cyan)_12%,transparent)] to-[color-mix(in_srgb,var(--accent-violet)_12%,transparent)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#06060a]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    Support AI
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] glow-pulse" />
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Grounded in your docs</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={handleClear} className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] cursor-pointer" title="Clear">
                  <RotateCw className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[color-mix(in_srgb,var(--background)_90%,transparent)]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <Bot className="w-10 h-10 text-[var(--accent-cyan)] mb-3 opacity-60" />
                  <h4 className="font-display font-bold text-[var(--text-primary)]">Ask anything</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-2 max-w-[260px]">
                    Answers come only from your uploaded documentation.
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)] text-[#06060a] rounded-br-md font-medium'
                        : 'bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-bl-md'
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-cyan)]" />}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-subtle)]">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="w-full bg-[var(--cleo-cream-dark)] border border-[var(--border-subtle)] rounded-xl py-3 pl-4 pr-12 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)] placeholder:text-[var(--text-muted)]"
                  disabled={isLoading || isStreaming}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isStreaming}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)] text-[#06060a] disabled:opacity-30 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          type="button"
          data-chat-trigger
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          className={cn(
            'p-5 rounded-full shadow-[0_0_30px_var(--glow-cyan)] spring-transition cursor-pointer border-0',
            isOpen
              ? 'bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
              : 'bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] text-[#06060a]'
          )}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
