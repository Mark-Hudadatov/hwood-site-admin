/**
 * LOADING SCREEN
 * ===============
 * Premium branded splash screen shown on initial page load.
 */

import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  minDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ minDuration = 1200 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hwood-loaded');
    
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('hwood-loaded', 'true');
      }, 500);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-gradient-to-br from-[#001f1f] via-[#002828] to-[#003333]
        transition-opacity duration-500
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#005f5f]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#005f5f]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/logo.png"
          alt="HWOOD"
          className="h-16 md:h-20 w-auto brightness-0 invert mb-8 animate-fade-in-up"
        />

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#005f5f] rounded-full animate-loading-bar" />
        </div>

        <p className="mt-6 text-white/60 text-sm tracking-widest uppercase animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Industrial Carpentry
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
