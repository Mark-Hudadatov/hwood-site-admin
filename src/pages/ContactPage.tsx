import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { getCompanyInfo, submitContactForm } from '../services/data/dataService';
import type { CompanyInfo } from '../domain/types';
import { supabase } from '../services/supabase';
import { BRAND_NEUTRAL } from '../lib/OrderTypes';
import { Stripes } from '../components/journey/stripes';
import { Eyebrow, formInput, formLabel } from '../components/ui/shared';

export const ContactPage: React.FC = () => {
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [waUrl, setWaUrl] = useState('https://wa.me/972549222804');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCompanyInfo().then(setInfo);
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const ok = await submitContactForm({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      subject: form.company ? `From: ${form.company}` : undefined,
      message: form.message,
    });
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
    } else {
      setError('Something went wrong. Please try again or contact us directly.');
    }
  };

  const details = [
    { Icon: MapPin, label: 'Location', value: info?.address || 'Netanya, Israel' },
    { Icon: Phone, label: 'Phone', value: info?.phone || '' },
    { Icon: Mail, label: 'Email', value: info?.email || '' },
    { Icon: Clock, label: 'Hours', value: 'Sun–Thu: 08:00 – 17:00' },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(150deg, #002828 0%, #001414 100%)',
          padding: '80px 0 64px',
          overflow: 'hidden',
        }}
      >
        <Stripes opacity={0.2} />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 48px',
          }}
        >
          <Eyebrow color="#00d4aa">Get in Touch</Eyebrow>
          <h1
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Contact
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', maxWidth: 480 }}>
            Production inquiries, project consultation, and support.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 64,
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left: info + map */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#111', marginBottom: 32 }}>
              Location & Hours
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 36 }}>
              {details.map(({ Icon, label, value }) =>
                value ? (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: 'rgba(0,95,95,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={BRAND_NEUTRAL} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 15, color: '#111' }}>{value}</div>
                    </div>
                  </div>
                ) : null
              )}
            </div>

            {/* WhatsApp quick link */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 24px',
                background: '#25D366',
                color: '#fff',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: 36,
              }}
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>

            {/* Map */}
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 240 }}>
              <iframe
                title="HWOOD Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(info?.address || 'המסגר 20, נתניה, ישראל')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: form */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#111', marginBottom: 32 }}>
              Send Inquiry
            </h2>

            {submitted ? (
              <div
                style={{
                  background: 'rgba(0,95,95,0.06)',
                  border: '1px solid rgba(0,95,95,0.2)',
                  borderRadius: 16,
                  padding: '48px 36px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(0,95,95,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Mail size={24} color={BRAND_NEUTRAL} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 8 }}>
                  Inquiry Sent
                </h3>
                <p style={{ fontSize: 14, color: '#666' }}>
                  We will respond within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                  className="contact-form-row"
                >
                  <div>
                    <label style={formLabel}>Name *</label>
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={onChange}
                      placeholder="Your name"
                      style={formInput}
                    />
                  </div>
                  <div>
                    <label style={formLabel}>Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={onChange}
                      placeholder="your@email.com"
                      style={formInput}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                  className="contact-form-row"
                >
                  <div>
                    <label style={formLabel}>Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="+972-XX-XXX-XXXX"
                      style={formInput}
                    />
                  </div>
                  <div>
                    <label style={formLabel}>Company</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={onChange}
                      placeholder="Your company"
                      style={formInput}
                    />
                  </div>
                </div>

                <div>
                  <label style={formLabel}>Project Details *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={onChange}
                    placeholder="Describe your project requirements…"
                    style={{ ...formInput, resize: 'none' }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px 28px',
                    background: BRAND_NEUTRAL,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.65 : 1,
                    fontFamily: 'inherit',
                    alignSelf: 'flex-start',
                  }}
                >
                  {submitting ? 'Sending…' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .contact-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
