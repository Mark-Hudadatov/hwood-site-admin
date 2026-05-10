import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { getOrderTypeConfig, getHeroColors, BRAND_NEUTRAL } from '../lib/OrderTypes';
import type { ServiceOrderType } from '../lib/OrderTypes';
import { supabase } from '../services/supabase';
import { Stripes } from '../components/journey/stripes';
import { ROUTES } from '../router';

function generateRef(): string {
  return 'HW-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

const VALID_ORDER_TYPES: ServiceOrderType[] = [
  'browse-and-order',
  'send-file-and-process',
  'describe-and-request',
  'informational',
];

export const ThankYouPage: React.FC = () => {
  const { orderType: rawType } = useParams<{ orderType: string }>();
  const [waUrl, setWaUrl] = useState('https://wa.me/972549222804');
  const [ref] = useState(generateRef);

  const orderType: ServiceOrderType = VALID_ORDER_TYPES.includes(rawType as ServiceOrderType)
    ? (rawType as ServiceOrderType)
    : 'browse-and-order';

  const config = getOrderTypeConfig(orderType);
  const colors = getHeroColors(orderType);

  useEffect(() => {
    supabase
      .from('company_info')
      .select('whatsapp')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.whatsapp) {
          const digits = (data.whatsapp as string).replace(/\D/g, '');
          setWaUrl(`https://wa.me/${digits}`);
        }
      });

    window.scrollTo(0, 0);
  }, []);

  const nextSteps = [
    {
      num: '01',
      title: 'We reviewed your request',
      desc: 'Your submission is in our system and assigned to the relevant team.',
    },
    {
      num: '02',
      title: 'We will be in touch',
      desc: 'Expect a call or message within 1–2 business days.',
    },
    {
      num: '03',
      title: 'Project kick-off',
      desc: 'Once details are confirmed, we schedule production or site visit.',
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          background: `linear-gradient(150deg, ${colors.heroFrom} 0%, ${colors.heroTo} 100%)`,
          padding: '80px 0 72px',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <Stripes opacity={0.18} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '0 32px' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(0,212,170,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '1.5px solid rgba(0,212,170,0.35)',
            }}
          >
            <CheckCircle size={36} color="#00d4aa" />
          </div>

          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: colors.accent,
              marginBottom: 12,
            }}
          >
            {config.label}
          </p>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Request Received
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.6 }}>
            Thank you for reaching out. We have received your submission and will get back to you shortly.
          </p>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              fontSize: 13,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.05em',
            }}
          >
            Reference: <strong style={{ color: '#fff' }}>{ref}</strong>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section style={{ background: '#f8f9fa', padding: '72px 0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px' }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: BRAND_NEUTRAL,
              marginBottom: 12,
            }}
          >
            What's next
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: '#111', marginBottom: 40 }}>Next Steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {nextSteps.map((step) => (
              <div
                key={step.num}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '28px 24px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: BRAND_NEUTRAL,
                    opacity: 0.3,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, #002828 0%, #001a1a 100%)`,
          padding: '64px 0',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Stripes opacity={0.12} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Need faster assistance?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>
            Reach us directly on WhatsApp for quick answers.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                background: '#25D366',
                color: '#fff',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
            <Link
              to={ROUTES.HOME}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                background: 'transparent',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back to Home
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
