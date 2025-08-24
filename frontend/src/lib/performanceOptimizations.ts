// Performance optimization utilities
import { useCallback, useRef, useEffect, useState } from 'react';

// Debounce hook for expensive operations
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// Throttle hook for high-frequency events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delay]) as T;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);
  
  return isIntersecting;
}

// Request animation frame hook for smooth animations
export function useRAF(callback: () => void) {
  const rafRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  useEffect(() => {
    const tick = () => {
      callbackRef.current();
      rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
}

// Memoized event handler
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// Performance monitoring
export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  
  static mark(name: string) {
    this.marks.set(name, performance.now());
  }
  
  static measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// Bundle size optimizer - dynamic imports
export const dynamicImports = {
  // Heavy libraries
  ConfettiAsync: () => import('react-confetti'),
  SyntaxHighlighterAsync: () => import('react-syntax-highlighter'),
  MotionAsync: () => import('framer-motion'),
};
