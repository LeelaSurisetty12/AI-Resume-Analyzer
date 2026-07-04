// Custom hook: reveals an element with a fade-up animation the first
// time it scrolls into view. Centralizing this in a hook (instead of
// copy-pasting IntersectionObserver setup into every section) means
// any section can opt in with one line: const [ref, visible] = useScrollReveal();

import { useEffect, useRef, useState } from "react";

export function useScrollReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Users who prefer reduced motion see content immediately, no animation delay.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
