import React, { useState } from 'react';
import { Eye, EyeOff, Copy, X, AlignLeft, AlignCenter, AlignRight,
         Monitor, Smartphone, Globe2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Block, BlockData, BlockCommonStyle, FieldDef } from '../../domain/types';
import { BLOCK_BY_TYPE } from './blockRegistry';
import { FieldRenderer } from './FieldRenderer';
import { COLORS } from '../../tokens';

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  label: { display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--fg-3)',
           marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' },
  input: { width: '100%', padding: '7px 10px', border: '1px solid var(--border-1)',
           borderRadius: 6, fontSize: 12, color: 'var(--fg-1)', background: '#fff',
           fontFamily: 'inherit', outline: 'none' },
};

function Sect({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border-1)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '8px 14px', border: 'none', background: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-2)',
                       letterSpacing: '.04em', textTransform: 'uppercase' }}>{title}</span>
        <span style={{ fontSize: 14, color: 'var(--fg-3)', lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="color" value={value || '#ffffff'}
               onChange={e => onChange(e.target.value)}
               style={{ width: 34, height: 34, border: '1px solid var(--border-1)', borderRadius: 5,
                        cursor: 'pointer', padding: 2, flexShrink: 0 }} />
        <input type="text" value={value} placeholder="inherit / #rrggbb"
               onChange={e => onChange(e.target.value)}
               style={{ ...S.input, fontFamily: 'monospace', flex: 1, fontSize: 11 }} />
        <div style={{ width: 30, height: 30, borderRadius: 5, border: '1px solid var(--border-1)',
                      background: value || '#fff', flexShrink: 0 }} />
      </div>
    </div>
  );
}

function BtnGroup({ options, value, onChange, icons }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  icons?: Record<string, React.ReactNode>;
}) {
  return (
    <div style={{ display: 'flex', border: '1px solid var(--border-1)', borderRadius: 6, overflow: 'hidden' }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} title={o.label} style={{
          flex: 1, padding: '7px 4px', border: 'none',
          borderRight: '1px solid var(--border-1)',
          background: value === o.value ? 'var(--brand)' : '#fff',
          color: value === o.value ? '#fff' : 'var(--fg-2)',
          fontSize: 11, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          fontFamily: 'inherit',
        }}>
          {icons?.[o.value] ?? o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Common style section (all blocks) ───────────────────────────────────────

interface CommonStyleSectionProps {
  cs: BlockCommonStyle;
  onChange: (patch: Partial<BlockCommonStyle>) => void;
}

const CommonStyleSection: React.FC<CommonStyleSectionProps> = ({ cs, onChange }) => {
  const padVal = cs.customPaddingY !== undefined ? String(cs.customPaddingY) : '';

  return (
    <>
      {/* Style overrides */}
      <Sect title="Style" defaultOpen>
        <ColorRow label="Background override"
                  value={cs.wrapBg ?? ''}
                  onChange={v => onChange({ wrapBg: v })} />
        <ColorRow label="Text color override"
                  value={cs.wrapTextColor ?? ''}
                  onChange={v => onChange({ wrapTextColor: v })} />
        <div>
          <label style={S.label}>Padding</label>
          <BtnGroup
            options={[{ value: 'tight', label: 'Tight' }, { value: 'normal', label: 'Normal' }, { value: 'spacious', label: 'Spacious' }]}
            value={cs.paddingPreset ?? 'normal'}
            onChange={v => onChange({ paddingPreset: v as any, customPaddingY: undefined })}
          />
        </div>
        <div>
          <label style={S.label}>Custom padding Y (px) — overrides preset</label>
          <input type="number" min={0} max={400} step={8}
                 value={padVal} placeholder="leave blank to use preset"
                 onChange={e => onChange({ customPaddingY: e.target.value ? Number(e.target.value) : undefined })}
                 style={S.input} />
        </div>
      </Sect>

      {/* Layout overrides */}
      <Sect title="Layout" defaultOpen>
        <div>
          <label style={S.label}>Max width</label>
          <BtnGroup
            options={[{ value: 'full', label: 'Full' }, { value: 'normal', label: 'Normal' }, { value: 'narrow', label: 'Narrow' }]}
            value={cs.maxWidth ?? 'full'}
            onChange={v => onChange({ maxWidth: v as any })}
          />
        </div>
        <div>
          <label style={S.label}>Text alignment</label>
          <BtnGroup
            options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
            value={cs.textAlign ?? 'left'}
            onChange={v => onChange({ textAlign: v as any })}
            icons={{
              left:   <AlignLeft  size={13} />,
              center: <AlignCenter size={13} />,
              right:  <AlignRight  size={13} />,
            }}
          />
        </div>
      </Sect>

      {/* Advanced */}
      <Sect title="Advanced" defaultOpen={false}>
        <div>
          <label style={S.label}>Visibility</label>
          <BtnGroup
            options={[
              { value: 'always', label: 'Always' },
              { value: 'desktop-only', label: 'Desktop' },
              { value: 'mobile-only', label: 'Mobile' },
            ]}
            value={cs.visibility ?? 'always'}
            onChange={v => onChange({ visibility: v as any })}
            icons={{
              always:        <Globe2    size={12} />,
              'desktop-only': <Monitor  size={12} />,
              'mobile-only':  <Smartphone size={12} />,
            }}
          />
        </div>
        <div>
          <label style={S.label}>Custom CSS class</label>
          <input type="text" value={cs.customClass ?? ''} placeholder="e.g. my-section highlight"
                 onChange={e => onChange({ customClass: e.target.value })}
                 style={{ ...S.input, fontFamily: 'monospace' }} />
        </div>
      </Sect>
    </>
  );
};

// ─── Group block-specific fields by category ──────────────────────────────────

type FieldGroup = { label: string; fields: FieldDef[] };

const LAYOUT_KEYS = new Set([
  'height', 'content_align', 'image_side', 'image_aspect',
  'layout', 'columns', 'max_width', 'source', 'service_ids',
  'lightbox', 'default_open_index', 'height_px', 'form_type',
  'autoplay', 'loop',
]);

function groupFields(fields: FieldDef[]): FieldGroup[] {
  const content: FieldDef[] = [];
  const layout:  FieldDef[] = [];
  const style:   FieldDef[] = [];

  for (const f of fields) {
    if (f.type === 'color')               style.push(f);
    else if (LAYOUT_KEYS.has(f.key) || f.type === 'toggle') layout.push(f);
    else                                  content.push(f);
  }
  return [
    ...(content.length ? [{ label: 'Content', fields: content }] : []),
    ...(layout.length  ? [{ label: 'Layout',  fields: layout }]  : []),
    ...(style.length   ? [{ label: 'Style',   fields: style }]   : []),
  ];
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

interface Props {
  block:           Block | null;
  onChange:        (blockId: string, patch: Partial<BlockData>) => void;
  onCommonChange:  (blockId: string, patch: Partial<BlockCommonStyle>) => void;
  onToggleVisible: (blockId: string) => void;
  onDuplicate:     (blockId: string) => void;
  onDeselect:      () => void;
}

export const SettingsPanel: React.FC<Props> = ({
  block, onChange, onCommonChange, onToggleVisible, onDuplicate, onDeselect,
}) => {
  const [lang, setLang] = useState<'en' | 'he'>('en');

  if (!block) return (
    <aside style={{
      width: 320, flexShrink: 0, borderLeft: '1px solid var(--border-1)',
      background: 'var(--bg-1)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10, padding: 28,
      height: '100%', color: 'var(--fg-3)', textAlign: 'center',
    }}>
      <div style={{ fontSize: 36 }}>👆</div>
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-2)', margin: 0 }}>Select a block to edit</p>
      <p style={{ fontSize: 11, margin: 0, lineHeight: 1.5 }}>
        Click any block on the canvas to open its settings here
      </p>
    </aside>
  );

  const def    = BLOCK_BY_TYPE[block.type];
  const data   = block.data as Record<string, any>;
  const cs     = block.commonStyle ?? {};
  const groups = groupFields(def?.fields ?? []);
  const Icon   = def?.icon ? (LucideIcons as any)[def.icon] ?? LucideIcons.Box : LucideIcons.Box;

  const patchData   = (p: Record<string, any>) => onChange(block.id, p as Partial<BlockData>);
  const patchCommon = (p: Partial<BlockCommonStyle>) => onCommonChange(block.id, p);

  return (
    <aside style={{
      width: 320, flexShrink: 0, borderLeft: '1px solid var(--border-1)',
      background: 'var(--bg-1)', display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border-1)',
        flexShrink: 0, background: 'var(--bg-2)',
      }}>
        {/* Identity row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7, background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={14} style={{ color: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>{def?.label ?? block.type}</p>
            <p style={{ fontSize: 10, color: 'var(--fg-3)', margin: 0 }}>{def?.description ?? ''}</p>
          </div>
          <button onClick={onDeselect} title="Close panel"
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 4 }}>
            <X size={14} />
          </button>
        </div>

        {/* EN / HE toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Editing language
          </span>
          <div style={{ display: 'flex', border: '1px solid var(--border-1)', borderRadius: 6, overflow: 'hidden' }}>
            {(['en', 'he'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '4px 14px', border: 'none',
                background: lang === l ? 'var(--brand)' : '#fff',
                color: lang === l ? '#fff' : 'var(--fg-2)',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <QBtn onClick={() => onToggleVisible(block.id)}>
            {block.visible ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
          </QBtn>
          <QBtn onClick={() => onDuplicate(block.id)}><Copy size={12} /> Duplicate</QBtn>
        </div>
      </div>

      {/* ── Scrollable fields ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Block-specific field groups */}
        {groups.map(grp => (
          <Sect key={grp.label} title={grp.label} defaultOpen>
            {grp.fields.map(field => (
              <FieldRenderer key={field.key} field={field} data={data} lang={lang} onChange={patchData} />
            ))}
          </Sect>
        ))}

        {/* Divider */}
        <div style={{ padding: '10px 14px 4px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.08em',
                      textTransform: 'uppercase', borderTop: '2px solid var(--border-1)', paddingTop: 10, margin: 0 }}>
            Common overrides
          </p>
          <p style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 4 }}>
            These apply on top of the block's own styling
          </p>
        </div>

        {/* Common style controls (same for every block) */}
        <CommonStyleSection cs={cs} onChange={patchCommon} />
      </div>
    </aside>
  );
};

const QBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} style={{
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    padding: '5px 8px', border: '1px solid var(--border-1)', borderRadius: 5,
    background: '#fff', color: 'var(--fg-2)', fontSize: 11, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  }}>
    {children}
  </button>
);
