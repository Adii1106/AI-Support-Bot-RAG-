'use client';

import { useEffect, useRef } from 'react';

export type TrailPoint = { x: number; y: number; id: number };

const MAX_TRAIL = 12;

export function useCursorTrail() {
  const trailRef = useRef<TrailPoint[]>([]);
  const idRef = useRef(0);
  const listenersRef = useRef<((points: TrailPoint[]) => void)[]>([]);

  const subscribe = (fn: (points: TrailPoint[]) => void) => {
    listenersRef.current.push(fn);
    return () => {
      listenersRef.current = listenersRef.current.filter((l) => l !== fn);
    };
  };

  const notify = () => {
    listenersRef.current.forEach((fn) => fn([...trailRef.current]));
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0;
    let mx = 0;
    let my = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          idRef.current += 1;
          trailRef.current = [{ x: mx, y: my, id: idRef.current }, ...trailRef.current].slice(0, MAX_TRAIL);
          notify();
          raf = 0;
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { subscribe };
}
