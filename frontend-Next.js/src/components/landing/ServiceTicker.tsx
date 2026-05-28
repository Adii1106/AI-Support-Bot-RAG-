'use client';

const ITEMS = ['INGEST', 'EMBED', 'RETRIEVE', 'STREAM', 'GUARDRAILS', 'PGVECTOR', 'FASTAPI', 'NEXT.JS'];

export default function ServiceTicker() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="border-y border-[var(--border-subtle)] py-4 overflow-hidden mask-fade-x relative z-10">
      <div className="flex animate-marquee-slow gap-12 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="font-display text-xs font-bold tracking-[0.25em] text-[var(--text-muted)]/40">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
