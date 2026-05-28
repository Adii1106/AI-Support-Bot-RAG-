'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  offset?: ['start end', 'end start'];
};

export default function Parallax({
  children,
  className = '',
  speed = 0.3,
  offset = ['start end', 'end start'],
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -120, speed * 120]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, rotateX, scale, transformPerspective: 1200 }}>
        {children}
      </motion.div>
    </div>
  );
}
