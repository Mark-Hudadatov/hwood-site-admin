/**
 * TOUCH FEEDBACK
 * ===============
 * Enhanced touch feedback for mobile devices with ripple effect.
 */

import React, { useState, useRef, useCallback } from 'react';

interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  className = '',
  rippleColor = 'rgba(0, 95, 95, 0.3)',
  disabled = false,
  onClick,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const createRipple = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let x: number, y: number;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const size = Math.max(rect.width, rect.height) * 2;
    const id = rippleIdRef.current++;

    setRipples(prev => [...prev, { id, x, y, size }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
  }, [disabled]);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    createRipple(e);
    if (onClick) onClick(e);
  }, [createRipple, onClick]);

  return (
    <div
      ref={containerRef}
      className={`
        relative overflow-hidden touch-manipulation
        active:scale-[0.98] transition-transform duration-100
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
    >
      {children}
      
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </div>
  );
};

// =============================================================================
// TouchButton - Pre-styled button with feedback
// =============================================================================

interface TouchButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  primary: 'bg-[#005f5f] text-white hover:bg-[#004d4d]',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border-2 border-[#005f5f] text-[#005f5f] hover:bg-[#005f5f]/5',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
}) => {
  return (
    <TouchFeedback
      disabled={disabled}
      onClick={onClick}
      rippleColor={variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'rgba(0,95,95,0.2)'}
      className={`
        rounded-xl font-bold transition-colors
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </TouchFeedback>
  );
};

export default TouchFeedback;
