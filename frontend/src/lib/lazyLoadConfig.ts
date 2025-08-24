// Bundle splitting and lazy loading configuration
export const LazyLoadConfig = {
  // WebGL components (heavy)
  FaultyTerminal: () => import('@/components/FaultyTerminal/FaultyTerminal'),
  Prism: () => import('@/components/Prism/Prism'),
  Orb: () => import('@/components/Orb/Orb'),
  
  // Heavy libraries
  Confetti: () => import('react-confetti'),
  SyntaxHighlighter: () => import('react-syntax-highlighter'),
  
  // Motion components (split by usage)
  Motion: () => import('framer-motion'),
};

// Preload strategies
export class PreloadManager {
  private static preloaded = new Set<string>();
  
  // Preload components on user interaction
  static preloadOnHover(componentKey: keyof typeof LazyLoadConfig) {
    if (this.preloaded.has(componentKey)) return;
    
    LazyLoadConfig[componentKey]().then(() => {
      this.preloaded.add(componentKey);
    });
  }
  
  // Preload critical components after initial load
  static preloadCritical() {
    const critical = ['Motion', 'SyntaxHighlighter'];
    critical.forEach(key => {
      if (!this.preloaded.has(key)) {
        LazyLoadConfig[key as keyof typeof LazyLoadConfig]().then(() => {
          this.preloaded.add(key);
        });
      }
    });
  }
  
  // Preload on idle time
  static preloadOnIdle() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadCritical();
      });
    } else {
      setTimeout(() => {
        this.preloadCritical();
      }, 2000);
    }
  }
}

// Initialize preloading
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    PreloadManager.preloadOnIdle();
  });
}
