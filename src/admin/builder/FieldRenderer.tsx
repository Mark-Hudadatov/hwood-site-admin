import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Image as ImageIcon } from 'lucide-react';
import type { FieldDef } from '../../domain/types';
import { ImageUpload } from '../components/index';
import { RepeaterField } from './RepeaterField';

export interface FieldRendererProps {
  field:    FieldDef;
  data:     Record<string, any>;
  lang:     'en' | 'he';               // active editing language
  onChange: (patch: Record<string, any>) => void;
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid var(--border-1)',
  borderRadius: 6, fontSize: 12, color: 'var(--fg-1)', background: '#fff',
  fontFamily: 'inherit', outline: 'none', lineHeight: 1.5,
};
const labelSt: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700,
  color: 'var(--fg-3)', marginBottom: 5,
  textTransform: 'uppercase', letterSpacing: '.06em',
};

function Wrap({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={labelSt}>{label}</label>
      {children}
      {help && <span style={{ fontSize: 10, color: 'var(--fg-3)', lineHeight: 1.4 }}>{help}</span>}
    </div>
  );
}

// ─── Visual button group (≤4 options) ────────────────────────────────────────
function BtnGroup({
  options, value, onChange, icons,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  icons?: Record<string, React.ReactNode>;
}) {
  return (
    <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-1)' }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} title={o.label}
                  style={{
                    flex: 1, padding: '7px 4px', border: 'none',
                    borderRight: '1px solid var(--border-1)',
                    background: active ? 'var(--brand)' : '#fff',
                    color: active ? '#fff' : 'var(--fg-2)',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    transition: 'background .15s',
                    fontFamily: 'inherit',
                  }}>
            {icons?.[o.value] ?? o.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Image side picker — visual left/right selector ──────────────────────────
function ImageSidePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opt = (side: 'left' | 'right') => {
    const active = value === side;
    return (
      <button key={side} onClick={() => onChange(side)}
              style={{
                flex: 1, padding: '10px 0', border: 'none',
                background: active ? 'var(--brand)' : '#fff',
                color: active ? '#fff' : 'var(--fg-3)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, transition: 'background .15s',
              }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'stretch', height: 32, width: 52 }}>
          {side === 'left' ? (
            <>
              <div style={{ flex: 2, background: active ? 'rgba(255,255,255,0.35)' : 'var(--border-1)', borderRadius: 2 }} />
              <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[0,1,2].map(i => <div key={i} style={{ flex: 1, background: active ? 'rgba(255,255,255,0.25)' : 'var(--bg-2)', borderRadius: 1 }} />)}
              </div>
            </>
          ) : (
            <>
              <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[0,1,2].map(i => <div key={i} style={{ flex: 1, background: active ? 'rgba(255,255,255,0.25)' : 'var(--bg-2)', borderRadius: 1 }} />)}
              </div>
              <div style={{ flex: 2, background: active ? 'rgba(255,255,255,0.35)' : 'var(--border-1)', borderRadius: 2 }} />
            </>
          )}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' }}>
          {side === 'left' ? '← Image' : 'Image →'}
        </span>
      </button>
    );
  };
  return (
    <div style={{ display: 'flex', borderRadius: 6, border: '1px solid var(--border-1)', overflow: 'hidden' }}>
      {opt('left')}{opt('right')}
    </div>
  );
}

// ─── Column count visual picker ───────────────────────────────────────────────
function ColPicker({ value, onChange, max = 3 }: { value: string; onChange: (v: string) => void; max?: number }) {
  const cols = Array.from({ length: max }, (_, i) => String(i + 1));
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {cols.map(n => {
        const active = value === n;
        return (
          <button key={n} onClick={() => onChange(n)}
                  style={{
                    flex: 1, padding: '8px 0', border: `2px solid ${active ? 'var(--brand)' : 'var(--border-1)'}`,
                    borderRadius: 6, background: active ? 'rgba(0,95,95,0.06)' : '#fff',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}>
            <div style={{ display: 'flex', gap: 2, width: 28 }}>
              {Array.from({ length: Number(n) }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 18, background: active ? 'var(--brand)' : 'var(--border-1)', borderRadius: 2 }} />
              ))}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--brand)' : 'var(--fg-3)' }}>{n}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main FieldRenderer ───────────────────────────────────────────────────────
export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, data, lang, onChange }) => {
  const isHe = lang === 'he';

  // Bilingual fields: show only the active language
  if (field.type === 'bilingual_text') {
    const key  = isHe ? `${field.key}_he` : `${field.key}_en`;
    const val  = data[key] ?? '';
    return (
      <Wrap label={field.label} help={field.helpText}>
        <input style={{ ...inputSt, direction: isHe ? 'rtl' : 'ltr' }}
               type="text" value={val} placeholder={field.placeholder}
               onChange={e => onChange({ [key]: e.target.value })} />
      </Wrap>
    );
  }

  if (field.type === 'bilingual_textarea') {
    const key = isHe ? `${field.key}_he` : `${field.key}_en`;
    const val = data[key] ?? '';
    return (
      <Wrap label={field.label} help={field.helpText}>
        <textarea style={{ ...inputSt, minHeight: 80, resize: 'vertical', direction: isHe ? 'rtl' : 'ltr' }}
                  value={val} placeholder={field.placeholder}
                  onChange={e => onChange({ [key]: e.target.value })} />
      </Wrap>
    );
  }

  // ─── Language-agnostic fields below ──────────────────────────────────────────

  const val = data[field.key] ?? '';

  if (field.type === 'text' || field.type === 'url') {
    return (
      <Wrap label={field.label} help={field.helpText}>
        <input style={inputSt} type="text" value={val}
               placeholder={field.placeholder}
               onChange={e => onChange({ [field.key]: e.target.value })} />
      </Wrap>
    );
  }

  if (field.type === 'textarea') {
    return (
      <Wrap label={field.label} help={field.helpText}>
        <textarea style={{ ...inputSt, minHeight: 80, resize: 'vertical' }}
                  value={val} placeholder={field.placeholder}
                  onChange={e => onChange({ [field.key]: e.target.value })} />
      </Wrap>
    );
  }

  if (field.type === 'number') {
    return (
      <Wrap label={field.label} help={field.helpText}>
        <input style={inputSt} type="number" value={val}
               min={field.min} max={field.max} step={field.step ?? 1}
               onChange={e => onChange({ [field.key]: Number(e.target.value) })} />
      </Wrap>
    );
  }

  if (field.type === 'color') {
    return (
      <Wrap label={field.label} help={field.helpText}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="color" value={val || '#ffffff'}
                 onChange={e => onChange({ [field.key]: e.target.value })}
                 style={{ width: 36, height: 36, border: '1px solid var(--border-1)', borderRadius: 6, cursor: 'pointer', padding: 2, flexShrink: 0 }} />
          <input style={{ ...inputSt, fontFamily: 'monospace', flex: 1 }} type="text"
                 value={val} placeholder="#rrggbb or transparent"
                 onChange={e => onChange({ [field.key]: e.target.value })} />
          <div style={{ width: 32, height: 32, borderRadius: 5, border: '1px solid var(--border-1)',
                        background: val || '#fff', flexShrink: 0 }} />
        </div>
      </Wrap>
    );
  }

  if (field.type === 'toggle') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onChange({ [field.key]: !val })}
          style={{
            width: 40, height: 22, borderRadius: 11, border: 'none',
            background: val ? 'var(--brand)' : 'var(--border-1)',
            position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0,
          }}>
          <span style={{
            position: 'absolute', top: 3, left: val ? 21 : 3, width: 16, height: 16,
            borderRadius: '50%', background: '#fff', transition: 'left .2s',
          }} />
        </button>
        <label style={{ ...labelSt, margin: 0, textTransform: 'none', cursor: 'pointer' }}
               onClick={() => onChange({ [field.key]: !val })}>
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === 'select') {
    const opts = field.options ?? [];

    // Special visual handling for known layout fields
    if (field.key === 'image_side') {
      return <Wrap label={field.label}><ImageSidePicker value={val} onChange={v => onChange({ [field.key]: v })} /></Wrap>;
    }

    if (field.key === 'content_align') {
      return (
        <Wrap label={field.label}>
          <BtnGroup
            options={opts} value={val} onChange={v => onChange({ [field.key]: v })}
            icons={{ left: <AlignLeft size={13} />, center: <AlignCenter size={13} />, right: <AlignRight size={13} /> }}
          />
        </Wrap>
      );
    }

    if (field.key === 'layout' || field.key === 'columns') {
      const maxCols = opts.length;
      return <Wrap label={field.label}><ColPicker value={String(val)} onChange={v => onChange({ [field.key]: v })} max={maxCols} /></Wrap>;
    }

    // Small option sets → visual button group
    if (opts.length <= 3) {
      return (
        <Wrap label={field.label} help={field.helpText}>
          <BtnGroup options={opts} value={val} onChange={v => onChange({ [field.key]: v })} />
        </Wrap>
      );
    }

    // Larger sets → dropdown
    return (
      <Wrap label={field.label} help={field.helpText}>
        <select style={{ ...inputSt, cursor: 'pointer' }} value={val}
                onChange={e => onChange({ [field.key]: e.target.value })}>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Wrap>
    );
  }

  if (field.type === 'image') {
    return (
      <Wrap label={field.label} help={field.helpText}>
        {val ? (
          <div style={{ position: 'relative' }}>
            <img src={val} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-1)' }} />
            <button onClick={() => onChange({ [field.key]: '' })}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,.6)', border: 'none', borderRadius: 4, color: '#fff', padding: '2px 6px', fontSize: 10, cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        ) : (
          <ImageUpload value={val} onChange={url => onChange({ [field.key]: url })} />
        )}
      </Wrap>
    );
  }

  if (field.type === 'repeater') {
    return (
      <Wrap label={field.label} help={field.helpText}>
        <RepeaterField field={field} data={data} lang={lang} onChange={onChange} />
      </Wrap>
    );
  }

  return null;
};
