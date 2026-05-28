'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

const SPRING = { stiffness: 150, damping: 22, mass: 0.4 };

export function useCursorPosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          x.set(targetX);
          y.set(targetY);
          raf = 0;
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y]);

  return { x: springX, y: springY, rawX: x, rawY: y };
}
