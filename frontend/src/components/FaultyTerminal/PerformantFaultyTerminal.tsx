import React, { memo, useMemo, useRef } from 'react';
import { useIntersectionObserver } from '../../lib/performanceOptimizations';
import FaultyTerminal, { FaultyTerminalProps } from './FaultyTerminal';

interface PerformantFaultyTerminalProps extends FaultyTerminalProps {
  enableIntersectionObserver?: boolean;
  fallbackComponent?: React.ComponentType;
  performanceMode?: 'auto' | 'high' | 'low';
}

const PerformantFaultyTerminal = memo<PerformantFaultyTerminalProps>(({
  enableIntersectionObserver = true,
  fallbackComponent: FallbackComponent,
  performanceMode = 'auto',
  ...props
}) => {
  // Use intersection observer to only render when visible
  const elementRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(elementRef, {
    threshold: 0.1,
    rootMargin: '50px',
  });

  // Determine if we should render based on performance mode and device capabilities
  const shouldRender = useMemo(() => {
    if (!enableIntersectionObserver) return true;
    if (!isVisible) return false;

    if (performanceMode === 'low') return false;
    if (performanceMode === 'high') return true;

    // Auto mode: check device capabilities
    const isMobile = window.innerWidth < 768;
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    return !(isMobile && isLowEndDevice);
  }, [enableIntersectionObserver, isVisible, performanceMode]);

  // Optimized props for performance
  const optimizedProps = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    
    if (performanceMode === 'low' || isMobile) {
      return {
        ...props,
        dpr: 1, // Lower DPR for performance
        timeScale: props.timeScale ? props.timeScale * 0.5 : 0.15, // Slower animations
        mouseReact: false, // Disable mouse interactions
        pageLoadAnimation: false, // Disable complex animations
        glitchAmount: (props.glitchAmount || 1) * 0.5, // Reduce effects
        flickerAmount: (props.flickerAmount || 1) * 0.5,
        scanlineIntensity: (props.scanlineIntensity || 0.3) * 0.5,
      };
    }

    return props;
  }, [props, performanceMode]);

  const containerStyle = useMemo(() => ({
    ...props.style,
    minHeight: props.style?.height || '200px', // Maintain layout
  }), [props.style]);

  if (!shouldRender) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    
    // Simple fallback with similar appearance
    return (
      <div 
        ref={elementRef}
        className={`w-full h-full bg-black relative overflow-hidden ${props.className || ''}`}
        style={containerStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-50">
          <div className="h-full w-full bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_50%)] bg-[length:100%_4px]"></div>
        </div>
        <div className="absolute top-4 left-4 text-green-400 font-mono text-sm opacity-60">
          Terminal Effect Loading...
        </div>
      </div>
    );
  }

  return (
    <div ref={elementRef} style={containerStyle}>
      <FaultyTerminal {...optimizedProps} />
    </div>
  );
});

PerformantFaultyTerminal.displayName = 'PerformantFaultyTerminal';

export default PerformantFaultyTerminal;
