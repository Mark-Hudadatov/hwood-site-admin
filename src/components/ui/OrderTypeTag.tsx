import React from 'react';
import { getOrderTypeConfig, getHeroColors, ServiceOrderType, ServiceBrand, SKYLUM_BLUE, BRAND_NEUTRAL } from '../../lib/OrderTypes';

interface OrderTypeTagProps {
  orderType?: ServiceOrderType | string | null;
  brand?: ServiceBrand | string | null;
  /** 'surface' = opaque pill on hero; 'overlay' = semi-transparent on dark bg */
  variant?: 'surface' | 'overlay';
  style?: React.CSSProperties;
}

export const OrderTypeTag: React.FC<OrderTypeTagProps> = ({
  orderType,
  brand,
  variant = 'surface',
  style,
}) => {
  const t = getOrderTypeConfig(orderType);
  const dotColor = brand === 'skylum' ? SKYLUM_BLUE : BRAND_NEUTRAL;

  const overlayStyles: React.CSSProperties = {
    background: 'rgba(255,255,255,.12)',
    color: '#fff',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,.2)',
  };

  const surfaceStyles: React.CSSProperties = {
    background: t.tagBg,
    color: t.tagFg,
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 12px',
        borderRadius: 99,
        fontSize: 10.5,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        fontWeight: 700,
        ...(variant === 'overlay' ? overlayStyles : surfaceStyles),
        ...style,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          background: variant === 'overlay' ? t.accent : dotColor,
          flexShrink: 0,
        }}
      />
      {t.label}
      {brand === 'skylum' && (
        <span
          style={{
            fontSize: 9,
            color: variant === 'overlay' ? SKYLUM_BLUE : SKYLUM_BLUE,
            fontWeight: 800,
            letterSpacing: '.15em',
          }}
        >
          · SKYLUM
        </span>
      )}
    </span>
  );
};
