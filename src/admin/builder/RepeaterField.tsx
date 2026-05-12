import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { FieldDef } from '../../domain/types';
import { FieldRenderer } from './FieldRenderer';

interface Props {
  field:    FieldDef;
  data:     Record<string, any>;
  onChange: (patch: Record<string, any>) => void;
}

export const RepeaterField: React.FC<Props> = ({ field, data, onChange }) => {
  const items: any[] = data[field.key] ?? [];
  const subFields    = field.subFields ?? [];

  const updateItem = (i: number, patch: Record<string, any>) => {
    const next = items.map((item, idx) => idx === i ? { ...item, ...patch } : item);
    onChange({ [field.key]: next });
  };

  const addItem = () => {
    const pairs: [string, any][] = [];
    for (const f of subFields) {
      if (f.type === 'bilingual_text' || f.type === 'bilingual_textarea') {
        pairs.push([`${f.key}_en`, ''], [`${f.key}_he`, '']);
      } else {
        pairs.push([f.key, f.type === 'toggle' ? false : f.type === 'number' ? 0 : '']);
      }
    }
    onChange({ [field.key]: [...items, Object.fromEntries(pairs)] });
  };

  const removeItem = (i: number) =>
    onChange({ [field.key]: items.filter((_, idx) => idx !== i) });

  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange({ [field.key]: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          border: '1px solid var(--border-1)', borderRadius: 8, padding: 10,
          background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)' }}>Item {i + 1}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => moveItem(i, -1)} title="Move up"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 2 }}>
                <ChevronUp size={14} />
              </button>
              <button onClick={() => moveItem(i, 1)} title="Move down"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 2 }}>
                <ChevronDown size={14} />
              </button>
              <button onClick={() => removeItem(i)} title="Remove"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: 2 }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {subFields.map(sf => (
            <FieldRenderer key={sf.key} field={sf} data={item}
                           onChange={patch => updateItem(i, patch)} />
          ))}
        </div>
      ))}
      <button onClick={addItem} style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px',
        border: '1px dashed var(--border-1)', borderRadius: 6, background: 'none',
        color: 'var(--fg-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <Plus size={13} /> Add item
      </button>
    </div>
  );
};
