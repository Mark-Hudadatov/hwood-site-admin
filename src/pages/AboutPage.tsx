import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanyInfo } from '../services/data/dataService';
import type { CompanyInfo } from '../domain/types';
import { BRAND_NEUTRAL, SKYLUM_BLUE, SKYLUM_DEEP } from '../lib/OrderTypes';
import { Stripes } from '../components/journey/stripes';
import { StatCard, Eyebrow } from '../components/ui/shared';
import { ROUTES } from '../router';

const STATS = [
  { value: '2000+', label: 'sqm Production Floor' },
  { value: '50+', label: 'Team Members' },
  { value: '15+', label: 'Years Operating' },
  { value: '1000+', label: 'Projects Completed' },
];

const STANDARDS = [
  {
    title: 'Precision',
    desc: 'CNC machining to ±0.1 mm tolerance. Verified measurement protocols at every stage.',
  },
  {
    title: 'Materials',
    desc: 'Grade-certified panels and components. Documented sourcing and full batch traceability.',
  },
  {
    title: 'Delivery',
    desc: 'Production scheduling aligned to project timelines. Coordinated site logistics.',
  },
];

export const AboutPage: React.FC = () => {
  const [info, setInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    getCompanyInfo().then(setInfo);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: `linear-gradient(150deg, #002828 0%, #001414 100%)`,
          padding: '88px 0 72px',
          overflow: 'hidden',
        }}
      >
        <Stripes opacity={0.22} />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 48px',
          }}
        >
          <Eyebrow color="#00d4aa">Industrial Carpentry</Eyebrow>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              maxWidth: 700,
              marginBottom: 20,
            }}
          >
            {info?.name || 'HWOOD'}
          </h1>
          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 560,
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            {info?.description ||
              'Industrial carpentry and CNC production facility — serving builders, designers, and manufacturers across Israel.'}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link
              to={ROUTES.QUOTE}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 28px',
                background: BRAND_NEUTRAL,
                color: '#fff',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Request Quote
            </Link>
            <Link
              to={ROUTES.CONTACT}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 28px',
                background: 'transparent',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a1a1a', padding: '56px 0' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20,
          }}
        >
          {STATS.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} accent="#00d4aa" />
          ))}
        </div>
      </section>

      {/* ── Production Capability ────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          className="about-factory-grid"
        >
          <div>
            <Eyebrow color={BRAND_NEUTRAL}>Facility</Eyebrow>
            <h2
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 600,
                color: '#111',
                marginBottom: 24,
              }}
            >
              Production Capability
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                '2000+ sqm production facility equipped with Biesse CNC machining centers for high-volume carpentry production.',
                'Capacity covers projects from modular kitchen systems to custom furniture components and architectural elements.',
                'Integrated quality control ensures consistent output meeting specified tolerances and finish requirements.',
              ].map((p, i) => (
                <p key={i} style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
            <img
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=900"
              alt="HWOOD Production Facility"
              style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ── Production Standards ─────────────────────────────────────────── */}
      <section style={{ background: '#f4f6f6', padding: '80px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <Eyebrow color={BRAND_NEUTRAL}>Standards</Eyebrow>
          <h2
            style={{
              fontSize: 'clamp(22px, 2.8vw, 34px)',
              fontWeight: 600,
              color: '#111',
              marginBottom: 40,
            }}
          >
            Production Standards
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {STANDARDS.map((s) => (
              <div
                key={s.title}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '32px 28px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  borderTop: `3px solid ${BRAND_NEUTRAL}`,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111', marginBottom: 12 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skylum Group ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, ${SKYLUM_DEEP} 0%, #0a1430 100%)`,
          padding: '80px 0',
          overflow: 'hidden',
        }}
      >
        <Stripes opacity={0.12} />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          className="about-skylum-grid"
        >
          <div>
            <Eyebrow color={SKYLUM_BLUE}>Technology Group</Eyebrow>
            <h2
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 600,
                color: '#fff',
                marginBottom: 20,
              }}
            >
              Part of Skylum Group
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 16 }}>
              HWOOD operates under the Skylum technology group, bringing advanced software integration
              and process automation to industrial woodworking.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              The partnership enables seamless digital workflows — from design file submission to
              production scheduling — giving clients a faster, more transparent experience.
            </p>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {[
              { label: 'Digital File Processing', desc: 'DXF / CAD / Excel upload with automatic quoting' },
              { label: 'Real-time Order Tracking', desc: 'Client portal for job status and delivery schedules' },
              { label: 'Integrated CNC Workflow', desc: 'Direct machine programming from approved designs' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: SKYLUM_BLUE,
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, #002828 0%, #001414 100%)`,
          padding: '72px 0',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Stripes opacity={0.14} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            Start a Project
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>
            Contact us for a production consultation and project quotation.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={ROUTES.QUOTE}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 30px',
                background: BRAND_NEUTRAL,
                color: '#fff',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Request Quote
            </Link>
            <Link
              to={ROUTES.CONTACT}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 30px',
                background: 'transparent',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-factory-grid,
          .about-skylum-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};
