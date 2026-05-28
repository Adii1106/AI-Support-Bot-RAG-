'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type TextRevealProps = {
  lines: string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
};

export default function TextReveal({
  lines,
  className = '',
  as: Tag = 'h2',
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div ref={ref} className={className}>
      <Tag className="sr-only">{lines.join(' ')}</Tag>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
