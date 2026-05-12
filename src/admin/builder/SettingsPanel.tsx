import React, { useState } from 'react';
import { Eye, EyeOff, Copy, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Block, BlockData, FieldDef } from '../../domain/types';
import { BLOCK_BY_TYPE } from './blockRegistry';
import { FieldRenderer } from './FieldRenderer';

// Group fields by category so the sidebar is scannable
type FieldGroup = { label: string; fields: FieldDef[] };

function groupFields(fields: FieldDef[]): FieldGroup[] {
  const STYLE_KEYS  = new Set(['bg_color', 'text_color', 'padding', 'gap', 'style', 'base_radius']);
  const LAYOUT_KEYS = new Set(['height', 'content_align', 'image_side', 'image_aspect',
                                'layout', 'columns', 'max_width', 'source', 'service_ids', 'lightbox',
                                'default_open_index', 'height_px', 'form_type', 'autoplay', 'loop']);

  const content: FieldDef[] = [];
  const layout:  FieldDef[] = [];
  const style:   FieldDef[] = [];

  for (const f of fields) {
    if (STYLE_KEYS.has(f.key)  || f.type === 'color')             style.push(f);
    else if (LAYOUT_KEYS.has(f.key) || f.type === 'toggle')       layout.push(f);
    else                                                           content.push(f);
  }

  const groups: FieldGroup[] = [];
  if (content.length) groups.push({ label: 'Content',   fields: content });
  if (layout.length)  groups.push({ label: 'Layout',    fields: layout });
  if (style.length)   groups.push({ label: 'Style',     fields: style });
  return groups;
}

interface Props {
  block:           Block | null;
  onChange:        (blockId: string, patch: Partial<BlockData>) => void;
  onToggleVisible: (blockId: string) => void;
  onDuplicate:     (blockId: string) => void;
  onDeselect:      () => void;
}

export const SettingsPanel: React.FC<Props> = ({
  block, onChange, onToggleVisible, onDuplicate, onDeselect,
}) => {
  const [lang,     setLang]     = useState<'en' | 'he'>('en');
  const [openGrps, setOpenGrps] = useState<Set<string>>(new Set(['Content', 'Layout', 'Style']));

  const toggleGroup = (label: string) =>
    setOpenGrps(prev => { const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n; });

  if (!block) return (
    <aside style={{
      width: 300, flexShrink: 0, borderLeft: '1px solid var(--border-1)',
      background: 'var(--bg-1)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24,
      height: '100%', color: 'var(--fg-3)', textAlign: 'center',
    }}>
      <div style={{ fontSize: 32 }}>👆</div>
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-2)' }}>Click a block to edit</p>
      <p style={{ fontSize: 12 }}>Select any block on the canvas to change its content and settings</p>
    </aside>
  );

  const def    = BLOCK_BY_TYPE[block.type];
  const data   = block.data as Record<string, any>;
  const patch  = (p: Record<string, any>) => onChange(block.id, p as Partial<BlockData>);
  const groups = groupFields(def?.fields ?? []);
  const Icon   = def?.icon ? (LucideIcons as any)[def.icon] ?? LucideIcons.Box : LucideIcons.Box;

  return (
    <aside style={{
      width: 300, flexShrink: 0, borderLeft: '1px solid var(--border-1)',
      background: 'var(--bg-1)', display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border-1)',
        flexShrink: 0, background: 'var(--bg-2)',
      }}>
        {/* Block identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={13} style={{ color: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>{def?.label ?? block.type}</p>
            <p style={{ fontSize: 10, color: 'var(--fg-3)', margin: 0 }}>{def?.description ?? ''}</p>
          </div>
          <button onClick={onDeselect} title="Close"
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 4 }}>
            <X size={14} />
          </button>
        </div>

        {/* Language toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Editing language
          </span>
          <div style={{ display: 'flex', border: '1px solid var(--border-1)', borderRadius: 6, overflow: 'hidden' }}>
            {(['en', 'he'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                      style={{
                        padding: '4px 14px', border: 'none',
                        background: lang === l ? 'var(--brand)' : '#fff',
                        color: lang === l ? '#fff' : 'var(--fg-2)',
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'inherit', letterSpacing: '.04em',
                      }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <QuickBtn onClick={() => onToggleVisible(block.id)} title={block.visible ? 'Hide block' : 'Show block'}>
            {block.visible ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
          </QuickBtn>
          <QuickBtn onClick={() => onDuplicate(block.id)} title="Duplicate">
            <Copy size={12} /> Duplicate
          </QuickBtn>
        </div>
      </div>

      {/* ── Field groups ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {groups.length === 0 && (
          <p style={{ padding: 16, fontSize: 12, color: 'var(--fg-3)' }}>No settings for this block.</p>
        )}
        {groups.map(grp => (
          <div key={grp.label} style={{ borderBottom: '1px solid var(--border-1)' }}>
            {/* Group header */}
            <button
              onClick={() => toggleGroup(grp.label)}
              style={{
                width: '100%', padding: '9px 14px', border: 'none',
                background: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit',
              }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-2)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                {grp.label}
              </span>
              <span style={{ fontSize: 14, color: 'var(--fg-3)', lineHeight: 1 }}>
                {openGrps.has(grp.label) ? '−' : '+'}
              </span>
            </button>

            {/* Fields */}
            {openGrps.has(grp.label) && (
              <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {grp.fields.map(field => (
                  <FieldRenderer
                    key={field.key}
                    field={field}
                    data={data}
                    lang={lang}
                    onChange={patch}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

const QuickBtn: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
  <button onClick={onClick} title={title} style={{
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    padding: '5px 8px', border: '1px solid var(--border-1)', borderRadius: 5,
    background: '#fff', color: 'var(--fg-2)', fontSize: 11, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  }}>
    {children}
  </button>
);
