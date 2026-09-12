import { useEffect, useRef, useState } from 'react';

/** Animates from 0 up to `target` using requestAnimationFrame — no animation library needed. */
export function useCountUp(target: number, durationMs = 700, decimals = 0): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      setValue(Number(current.toFixed(decimals)));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs, decimals]);

  return value;
}
