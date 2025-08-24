import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import ProfileCard from './ProfileCard';

// Define the interface locally
interface ProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

interface OptimizedProfileCardProps extends ProfileCardProps {
  performanceMode?: 'auto' | 'high' | 'low';
  simplifiedMobile?: boolean;
}

const OptimizedProfileCard = memo<OptimizedProfileCardProps>(({
  performanceMode = 'auto',
  simplifiedMobile = true,
  ...props
}) => {
  // Determine performance optimizations based on device and mode
  const optimizedProps = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isLowEndDevice = typeof navigator !== 'undefined' && 
      navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Always disable complex animations on low-end devices
    if (performanceMode === 'low' || (isLowEndDevice && performanceMode === 'auto')) {
      return {
        ...props,
        enableTilt: false,
        enableMobileTilt: false,
        showBehindGradient: false,
      };
    }
    
    // Simplify on mobile for better performance
    if (isMobile && (simplifiedMobile || performanceMode === 'auto')) {
      return {
        ...props,
        enableTilt: false,
        enableMobileTilt: false,
        mobileTiltSensitivity: 0, // Disable mobile tilt sensitivity
        showBehindGradient: false, // Disable complex gradients on mobile
      };
    }
    
    return props;
  }, [props, performanceMode, simplifiedMobile]);

  // Fallback for when we want a simple version
  if (optimizedProps.enableTilt === false && !optimizedProps.showBehindGradient) {
    return (
      <div className={`rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-lg transition-transform hover:scale-105 ${props.className || ''}`}>
        {props.showUserInfo && (
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Image
                src={props.avatarUrl}
                alt={props.name || 'Profile'}
                width={144}
                height={144}
                className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover border-2 border-slate-600"
              />
              {props.miniAvatarUrl && (
                <Image
                  src={props.miniAvatarUrl}
                  alt="Mini avatar"
                  width={32}
                  height={32}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-white"
                />
              )}
            </div>
            
            {props.name && (
              <h3 className="text-lg font-semibold text-white text-center">{props.name}</h3>
            )}
            
            {props.title && (
              <p className="text-sm text-slate-300 text-center">{props.title}</p>
            )}
            
            {props.handle && (
              <p className="text-xs text-slate-400 text-center">@{props.handle}</p>
            )}
            
            {props.status && (
              <div className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                {props.status}
              </div>
            )}
            
            {props.contactText && props.onContactClick && (
              <button
                onClick={props.onContactClick}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                {props.contactText}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return <ProfileCard {...optimizedProps} />;
});

OptimizedProfileCard.displayName = 'OptimizedProfileCard';

export default OptimizedProfileCard;
