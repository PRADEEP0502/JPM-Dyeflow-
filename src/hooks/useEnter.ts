import { useEffect, useState } from 'react';

/**
 * Flips to `true` two frames after mount, so an element that starts in a
 * "hidden"/zero CSS state and transitions to its final state on this flag
 * actually animates (the browser paints the initial state first) instead of
 * snapping straight to the end value.
 */
export function useEnter(delayMs = 0): boolean {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let secondFrameId: number | undefined;

    const firstFrameId = requestAnimationFrame(() => {
      secondFrameId = requestAnimationFrame(() => {
        timeoutId = setTimeout(() => setEntered(true), delayMs);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrameId);
      if (secondFrameId !== undefined) cancelAnimationFrame(secondFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delayMs]);

  return entered;
}
