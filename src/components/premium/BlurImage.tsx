/**
 * BLUR IMAGE
 * ===========
 * Progressive image loading with blur-up effect.
 */

import React, { useState, useEffect, useRef } from 'react';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  blurAmount?: number;
  duration?: number;
  lazy?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f3f4f6',
  blurAmount = 20,
  duration = 500,
  lazy = true,
  objectFit = 'cover',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    
    if (img.complete) {
      setIsLoaded(true);
    }
  }, [src, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      {/* Shimmer placeholder */}
      <div
        className={`
          absolute inset-0 transition-opacity
          ${isLoaded ? 'opacity-0' : 'opacity-100'}
        `}
        style={{
          backgroundColor: placeholderColor,
          transitionDuration: `${duration}ms`,
        }}
      >
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`
            w-full h-full transition-all
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            objectFit,
            filter: isLoaded ? 'blur(0px)' : `blur(${blurAmount}px)`,
            transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
            transitionDuration: `${duration}ms`,
          }}
          loading={lazy ? 'lazy' : 'eager'}
        />
      )}
    </div>
  );
};

export default BlurImage;
