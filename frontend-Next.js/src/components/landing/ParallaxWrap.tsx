'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type ParallaxWrapProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

/** Subtle section parallax on scroll — Noomo / FIND style depth */
export default function ParallaxWrap({ children, className = '', speed = 0.08 }: ParallaxWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40 * speed, -40 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.9]);

  return (
    <motion.div ref={ref} className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}
