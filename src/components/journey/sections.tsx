import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getOrderTypeConfig, getHeroColors, BRAND_NEUTRAL } from '../../lib/OrderTypes';
import type { ServiceOrderType, ServiceBrand } from '../../lib/OrderTypes';
import { Stripes } from './stripes';
import { Eyebrow } from '../ui/shared';

// ─── SectionEyebrow ──────────────────────────────────────────────────────────

export const SectionEyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = BRAND_NEUTRAL,
}) => (
  <p
    style={{
      fontSize: 10,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      color,
      marginBottom: 12,
    }}
  >
    {children}
  </p>
);

// ─── HowItWorks ──────────────────────────────────────────────────────────────

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface HowItWorksProps {
  steps: Step[];
  title?: string;
  orderType?: ServiceOrderType | string | null;
  brand?: ServiceBrand | string | null;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  steps,
  title = 'How It Works',
  orderType,
  brand,
}) => {
  const colors = getHeroColors(orderType, brand);

  return (
    <section
      style={{
        position: 'relative',
        background: `linear-gradient(160deg, ${colors.heroFrom} 0%, ${colors.heroTo} 100%)`,
        padding: '72px 0',
        overflow: 'hidden',
      }}
    >
      <Stripes opacity={0.18} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <Eyebrow color={colors.accent}>Process</Eyebrow>
        <h2
          style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 600,
            color: '#fff',
            marginBottom: 48,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 16,
                padding: '28px 24px',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: colors.accent,
                  opacity: 0.5,
                  marginBottom: 12,
                  lineHeight: 1,
                }}
              >
                {step.num}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── WhoWeWorkWith ───────────────────────────────────────────────────────────

interface WhoItem {
  title: string;
  desc: string;
}

interface WhoWeWorkWithProps {
  items: WhoItem[];
  title?: string;
  orderType?: ServiceOrderType | string | null;
  brand?: ServiceBrand | string | null;
}

export const WhoWeWorkWith: React.FC<WhoWeWorkWithProps> = ({
  items,
  title = 'Who This Is For',
  orderType,
  brand,
}) => {
  const colors = getOrderTypeConfig(orderType as ServiceOrderType);
  void brand;

  return (
    <section
      style={{
        background: colors.surface,
        padding: '72px 0',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <SectionEyebrow color={colors.accentDark}>Audience</SectionEyebrow>
        <h2
          style={{
            fontSize: 'clamp(22px, 2.5vw, 32px)',
            fontWeight: 600,
            color: '#111',
            marginBottom: 40,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: '24px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                borderLeft: `3px solid ${colors.accent}`,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 6 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.55 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTABanner ───────────────────────────────────────────────────────────────

interface CTABannerProps {
  headline: string;
  sub?: string;
  primaryLabel: string;
  primaryHref?: string;
  onPrimary?: () => void;
  ghostLabel?: string;
  ghostHref?: string;
  orderType?: ServiceOrderType | string | null;
  brand?: ServiceBrand | string | null;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  headline,
  sub,
  primaryLabel,
  primaryHref,
  onPrimary,
  ghostLabel,
  ghostHref,
  orderType,
  brand,
}) => {
  const colors = getHeroColors(orderType, brand);

  return (
    <section
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${colors.heroFrom} 0%, ${colors.heroTo} 100%)`,
        padding: '80px 0',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <Stripes opacity={0.15} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '0 32px' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
          {headline}
        </h2>
        {sub && (
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', marginBottom: 36 }}>{sub}</p>
        )}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {onPrimary ? (
            <button
              onClick={onPrimary}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                background: colors.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {primaryLabel}
              <ArrowRight size={16} />
            </button>
          ) : primaryHref ? (
            <a
              href={primaryHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                background: colors.accent,
                color: '#fff',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {primaryLabel}
              <ArrowRight size={16} />
            </a>
          ) : null}

          {ghostLabel && ghostHref && (
            <a
              href={ghostHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                background: 'transparent',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.35)',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {ghostLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
