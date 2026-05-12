import React from 'react';
import { COLORS } from '../../tokens';

interface StripesProps {
  opacity?: number;
}

export const Stripes: React.FC<StripesProps> = ({ opacity = 1 }) => (
  <div
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity }}
    aria-hidden="true"
  >
    <div style={{ position: 'absolute', top: '-40%', left: '-4rem', width: '16rem', height: '200%', transform: 'skewX(-20deg)', background: COLORS.brand }} />
    <div style={{ position: 'absolute', top: '-40%', left: '8rem',  width: '10rem', height: '200%', transform: 'skewX(-20deg)', background: COLORS.brandHover, opacity: 0.7 }} />
  </div>
);
