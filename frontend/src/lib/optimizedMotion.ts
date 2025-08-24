// Optimized motion components with reduced animations
import { Variants } from 'framer-motion';

// Reduced motion variants for better performance
export const optimizedVariants: Record<string, Variants> = {
  // Faster, simpler fade in
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 } // Reduced from 0.6
    }
  },
  
  // Simpler slide up
  slideUp: {
    hidden: { opacity: 0, y: 20 }, // Reduced from y: 30
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },
  
  // Staggered children with reduced delays
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Reduced from 0.2
        delayChildren: 0.1
      }
    }
  },
  
  // Scale animation for buttons
  scale: {
    hover: { scale: 1.02 }, // Reduced from 1.05
    tap: { scale: 0.98 }
  }
};

// Performance-focused motion presets
export const motionPresets = {
  // For page transitions
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  // For card hover effects
  card: {
    whileHover: { y: -2 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // For button interactions
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 }
  },
  
  // For modal/dialog animations
  modal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  }
};

// Hook for conditional motion
export function useOptimizedMotion() {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
    
  return {
    shouldAnimate: !prefersReducedMotion,
    variants: optimizedVariants,
    presets: motionPresets
  };
}
