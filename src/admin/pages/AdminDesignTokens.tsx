import React, { useEffect, useState } from 'react';
import { Palette, RefreshCw, Save } from 'lucide-react';
import type { DesignTokens } from '../../domain/types';
import { getAdminDesignTokens, updateAdminDesignTokens } from '../adminStore';

const DEFAULTS: DesignTokens = {
  brand: '#005f5f', brand_hover: '#004d4d', brand_dark: '#003d3d',
  surface_dark: '#002828', neutral_900: '#171717',
  font_sans: 'Inter', base_radius: '8px', section_gap: '0px',
};

interface TokenField {
  key: keyof DesignTokens;
  label: string;
  type: 'color' | 'text';
  helpText?: string;
}

const FIELDS: TokenField[] = [
  { key: 'brand',        label: 'Brand color',       type: 'color', helpText: 'Primary teal — used for buttons, links, badges' },
  { key: 'brand_hover',  label: 'Brand hover',       type: 'color', helpText: 'Slightly darker version for hover states' },
  { key: 'brand_dark',   label: 'Brand dark',        type: 'color', helpText: 'Used for active/pressed states' },
  { key: 'surface_dark', label: 'Surface dark',      type: 'color', helpText: 'Footer and dark overlay backgrounds' },
  { key: 'neutral_900',  label: 'Text dark',         type: 'color', helpText: 'Primary body text color' },
  { key: 'font_sans',    label: 'Font family',        type: 'text',  helpText: 'CSS font-family value (must be loaded via @import or system)' },
  { key: 'base_radius',  label: 'Border radius',     type: 'text',  helpText: 'e.g. 8px, 12px, 0px' },
  { key: 'section_gap',  label: 'Section gap',       type: 'text',  helpText: 'Vertical gap between page builder blocks (e.g. 0px, 16px)' },
];

export const AdminDesignTokens: React.FC = () => {
  const [tokens,  setTokens]  = useState<DesignTokens>(DEFAULTS);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    getAdminDesignTokens()
      .then(t => setTokens({ ...DEFAULTS, ...t }))
      .catch(() => setError('Could not load tokens — using defaults'));
  }, []);

  const set = (key: keyof DesignTokens, val: string) =>
    setTokens(prev => ({ ...prev, [key]: val }));

  const reset = () => setTokens(DEFAULTS);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateAdminDesignTokens(tokens);
      // Apply immediately as CSS vars
      const root = document.documentElement;
      root.style.setProperty('--brand-runtime', tokens.brand);
      root.style.setProperty('--brand',         tokens.brand);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', margin: 0, letterSpacing: '-0.01em' }}>
            Design Tokens
          </h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>
            Global CSS variables applied site-wide. Restart public pages to see all changes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ ...secBtn }}>
            <RefreshCw size={13} /> Reset to defaults
          </button>
          <button onClick={save} disabled={saving} style={{ ...primBtn, opacity: saving ? 0.7 : 1 }}>
            <Save size={13} /> {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: 6, fontSize: 12, color: '#dc2626', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Token sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {FIELDS.map(f => (
          <div key={f.key} style={{
            border: '1px solid var(--border-1)', borderRadius: 10,
            padding: '14px 16px', background: 'var(--bg-1)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>{f.label}</p>
              {f.helpText && <p style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{f.helpText}</p>}
            </div>
            {f.type === 'color' ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={tokens[f.key]} onChange={e => set(f.key, e.target.value)}
                       style={{ width: 44, height: 36, border: '1px solid var(--border-1)', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                <input type="text" value={tokens[f.key]} onChange={e => set(f.key, e.target.value)}
                       style={{ ...inputSt, flex: 1, fontFamily: 'monospace', fontSize: 12 }} />
                {/* Preview swatch */}
                <div style={{ width: 36, height: 36, borderRadius: 6, background: tokens[f.key], border: '1px solid var(--border-1)', flexShrink: 0 }} />
              </div>
            ) : (
              <input type="text" value={tokens[f.key]} onChange={e => set(f.key, e.target.value)}
                     style={{ ...inputSt }} />
            )}
          </div>
        ))}
      </div>

      {/* Live preview strip */}
      <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Palette size={14} style={{ color: 'var(--fg-3)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>Preview</span>
        </div>
        <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button style={{ padding: '8px 18px', borderRadius: tokens.base_radius, background: tokens.brand, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'default', fontFamily: tokens.font_sans }}>
            Primary Button
          </button>
          <button style={{ padding: '8px 18px', borderRadius: tokens.base_radius, background: tokens.brand_hover, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'default', fontFamily: tokens.font_sans }}>
            Hover State
          </button>
          <span style={{ fontSize: 13, fontFamily: tokens.font_sans, color: tokens.neutral_900, fontWeight: 500 }}>
            Body text in {tokens.font_sans}
          </span>
          <div style={{ width: 40, height: 40, borderRadius: tokens.base_radius, background: tokens.surface_dark }} />
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: 'var(--bg-2)', borderRadius: 8, fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--fg-2)' }}>Note:</strong> Design tokens are loaded from Supabase at startup.
        After saving, the admin panel updates immediately.
        The public site picks up changes on next page load.
        Color tokens that use inline style with <code>var(--brand-runtime)</code> update instantly; Tailwind utility classes (<code>bg-brand</code>) are compiled and require a rebuild to change permanently.
      </div>
    </div>
  );
};

const inputSt: React.CSSProperties = {
  width: '100%', padding: '7px 10px', border: '1px solid var(--border-1)',
  borderRadius: 6, fontSize: 13, color: 'var(--fg-1)', background: '#fff',
  fontFamily: 'inherit', outline: 'none',
};
const primBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6, border: 'none',
  background: 'var(--brand)', color: '#fff',
  fontSize: 12, fontWeight: 600, cursor: 'pointer',
};
const secBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6,
  border: '1px solid var(--border-1)', background: 'var(--bg-1)',
  color: 'var(--fg-1)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
};
