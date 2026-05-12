import React from 'react';
import { COLORS } from '../../tokens';
import type { ServiceBrand } from '../../lib/OrderTypes';

interface BrandBadgeProps {
  brand?: ServiceBrand | string | null;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({ brand = 'hwood', size = 'sm', style }) => {
  const isSkylum = brand === 'skylum';
  const padding  = size === 'md' ? '5px 12px' : '3px 8px';
  const fontSize = size === 'md' ? 11 : 9;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding,
      borderRadius: 4,
      background: isSkylum
        ? `linear-gradient(135deg, ${COLORS.skylum}, ${COLORS.skylumDeepest})`
        : COLORS.brand,
      color: '#fff',
      fontSize,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      fontWeight: 800,
      lineHeight: 1,
      ...style,
    }}>
      {isSkylum ? 'Skylum' : 'HWOOD'}
    </span>
  );
};
