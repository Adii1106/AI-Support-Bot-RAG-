'use client';

const BRANDS = [
  'Next.js',
  'FastAPI',
  'Supabase',
  'Groq',
  'Llama 3.3',
  'pgvector',
  'Vercel',
  'Python',
];

export default function LogoMarquee() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="relative w-full overflow-hidden py-6 mask-fade-x">
      <div className="flex animate-marquee gap-16 whitespace-nowrap">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-sm font-semibold tracking-tight text-neutral-400 select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
