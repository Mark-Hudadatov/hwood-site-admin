/**
 * Stripes — signature industrial decoration
 * Two skewed teal panels behind hero sections.
 * CSS-var driven so Tweaks can override.
 */
import React from 'react';

interface StripesProps {
  opacity?: number;
}

export const Stripes: React.FC<StripesProps> = ({ opacity = 1 }) => (
  <div
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity }}
    aria-hidden="true"
  >
    <div
      style={{
        position: 'absolute',
        top: '-40%',
        left: '-4rem',
        width: 'var(--hw-stripe-width-base, 16rem)',
        height: '200%',
        transform: 'skewX(var(--hw-stripe-skew, -20deg))',
        background: 'var(--hw-stripe-1, #005f5f)',
        opacity: 'var(--hw-stripe-opacity, 1)' as unknown as number,
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '-40%',
        left: '8rem',
        width: 'var(--hw-stripe-width-thin, 10rem)',
        height: '200%',
        transform: 'skewX(var(--hw-stripe-skew, -20deg))',
        background: 'var(--hw-stripe-2, #004d4d)',
        opacity: 0.7,
      }}
    />
  </div>
);
