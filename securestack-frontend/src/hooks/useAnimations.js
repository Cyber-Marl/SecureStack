import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — returns [ref, isRevealed] to animate elements when scrolled into view.
 * Usage: const [ref, isRevealed] = useScrollReveal();  →  <div ref={ref} className={isRevealed ? 'revealed' : ''}>
 */
export function useScrollReveal(options = {}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          obs.unobserve(el);
        }
      },
      { threshold: options.threshold || 0.05, rootMargin: options.rootMargin || '0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, isRevealed];
}


/**
 * useCountUp — animates a number from 0 to `target` when `active` becomes true.
 */
export function useCountUp(target, active, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const num = parseInt(target.replace(/\D/g, ''), 10);
    const suffix = target.replace(/[0-9]/g, '');
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num) + suffix);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

/**
 * useScrollProgress — returns a 0–100 scroll progress value.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}
