import React from 'react';
import type { FieldDef } from '../../domain/types';
import { ImageUpload } from '../components/index';
import { RepeaterField } from './RepeaterField';

interface Props {
  field: FieldDef;
  data:  Record<string, any>;
  onChange: (patch: Record<string, any>) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', border: '1px solid var(--border-1)',
  borderRadius: 6, fontSize: 12, color: 'var(--fg-1)', background: '#fff',
  fontFamily: 'inherit', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: 'var(--fg-3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em',
};

export const FieldRenderer: React.FC<Props> = ({ field, data, onChange }) => {
  const val = data[field.key] ?? '';

  const wrap = (child: React.ReactNode) => (
    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={labelStyle}>{field.label}</label>
      {child}
      {field.helpText && <span style={{ fontSize: 10, color: 'var(--fg-3)' }}>{field.helpText}</span>}
    </div>
  );

  switch (field.type) {
    case 'text':
    case 'url':
      return wrap(
        <input style={inputStyle} type="text" value={val}
               placeholder={field.placeholder}
               onChange={e => onChange({ [field.key]: e.target.value })} />
      );

    case 'textarea':
      return wrap(
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                  value={val} placeholder={field.placeholder}
                  onChange={e => onChange({ [field.key]: e.target.value })} />
      );

    case 'number':
      return wrap(
        <input style={inputStyle} type="number"
               value={val} min={field.min} max={field.max} step={field.step ?? 1}
               onChange={e => onChange({ [field.key]: Number(e.target.value) })} />
      );

    case 'color':
      return wrap(
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="color" value={val || '#ffffff'}
                 onChange={e => onChange({ [field.key]: e.target.value })}
                 style={{ width: 32, height: 32, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 0 }} />
          <input style={{ ...inputStyle, flex: 1 }} type="text" value={val}
                 onChange={e => onChange({ [field.key]: e.target.value })}
                 placeholder="#rrggbb" />
        </div>
      );

    case 'toggle':
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id={`f-${field.key}`} checked={!!val}
                 onChange={e => onChange({ [field.key]: e.target.checked })}
                 style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor={`f-${field.key}`} style={{ ...labelStyle, margin: 0, textTransform: 'none', cursor: 'pointer' }}>
            {field.label}
          </label>
        </div>
      );

    case 'select':
      return wrap(
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={val}
                onChange={e => onChange({ [field.key]: e.target.value })}>
          {(field.options || []).map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );

    case 'image':
      return wrap(
        <ImageUpload value={val} onChange={url => onChange({ [field.key]: url })} />
      );

    case 'bilingual_text':
      return (
        <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>{field.label}</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 10, color: 'var(--fg-3)' }}>EN</span>
              <input style={inputStyle} type="text" value={data[`${field.key}_en`] ?? ''}
                     placeholder={field.placeholder}
                     onChange={e => onChange({ [`${field.key}_en`]: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 10, color: 'var(--fg-3)' }}>HE</span>
              <input style={inputStyle} type="text" value={data[`${field.key}_he`] ?? ''}
                     placeholder={field.placeholder} dir="rtl"
                     onChange={e => onChange({ [`${field.key}_he`]: e.target.value })} />
            </div>
          </div>
        </div>
      );

    case 'bilingual_textarea':
      return (
        <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>{field.label}</label>
          <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }}
                    value={data[`${field.key}_en`] ?? ''} placeholder={`${field.label} (EN)`}
                    onChange={e => onChange({ [`${field.key}_en`]: e.target.value })} />
          <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }}
                    value={data[`${field.key}_he`] ?? ''} placeholder={`${field.label} (HE)`} dir="rtl"
                    onChange={e => onChange({ [`${field.key}_he`]: e.target.value })} />
        </div>
      );

    case 'repeater':
      return wrap(
        <RepeaterField field={field} data={data} onChange={onChange} />
      );

    default:
      return null;
  }
};
