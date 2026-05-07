import { useEffect, useRef, useCallback } from 'react';

/**
 * useIdleTimer
 * Fires `onIdle` after `timeoutMs` of no user interaction.
 * Resets on any touch, mouse move, keypress, or click event.
 */
export function useIdleTimer(
  onIdle: () => void,
  timeoutMs: number = 60_000,
  enabled: boolean = true
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);

  // Keep onIdle reference up-to-date without resetting the timer
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onIdleRef.current();
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keypress',
      'touchstart',
      'touchmove',
      'scroll',
      'click',
    ];

    const handleActivity = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    resetTimer(); // Start the initial timer

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, resetTimer]);

  return { resetTimer };
}
