import { useEffect, useRef } from 'react';

export function useAutoScroll<T>(dependency: T) {
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dependency]); // Scroll when dependency changes

  return scrollRef; // Return the ref to be attached to the target element
}