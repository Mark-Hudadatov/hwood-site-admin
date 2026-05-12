import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Block } from '../../domain/types';
import { BLOCK_BY_TYPE } from './blockRegistry';
import { BlockRenderer } from '../../components/blocks/BlockRenderer';

// Lightweight text/colour block previews that avoid data-fetching
const PREVIEW_BG: Record<string, string> = {
  hero_banner:        '#001f1f',
  cta_band:           '#005f5f',
  spacer:             '#f0f0f0',
  video_embed:        '#0a0a0a',
  contact_form_embed: '#f5f5f5',
  stats_row:          '#fff',
  service_cards:      '#f5f5f5',
};

// Blocks that fetch data — show a static placeholder in the canvas instead of live render
const DATA_FETCHING = new Set(['service_cards']);

function StaticPlaceholder({ block }: { block: Block }) {
  const def = BLOCK_BY_TYPE[block.type];
  const Icon = def?.icon ? (LucideIcons as any)[def.icon] ?? LucideIcons.Box : LucideIcons.Box;
  const d = block.data as any;
  const bg = (d.bg_color && d.bg_color !== 'transparent' ? d.bg_color : PREVIEW_BG[block.type]) ?? '#fafafa';
  const isDark = bg === '#001f1f' || bg === '#005f5f' || bg === '#0a0a0a' || bg.startsWith('#0') || bg.startsWith('#1') || bg.startsWith('#2');
  const fg = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)';
  return (
    <div style={{
      background: bg, width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <Icon size={22} style={{ color: fg }} />
      <span style={{ fontSize: 12, color: fg, fontWeight: 500 }}>{def?.label}</span>
      {d.heading_en && <span style={{ fontSize: 11, color: fg, opacity: 0.7 }}>{d.heading_en}</span>}
    </div>
  );
}

interface Props {
  block:           Block;
  isSelected:      boolean;
  previewLang:     'en' | 'he';
  onSelect:        (id: string) => void;
  onToggleVisible: (id: string) => void;
  onDuplicate:     (id: string) => void;
  onDelete:        (id: string) => void;
}

const PREVIEW_H = 160; // px — height of visual preview area

export const CanvasBlock: React.FC<Props> = ({
  block, isSelected, previewLang, onSelect, onToggleVisible, onDuplicate, onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id, data: { type: 'canvas' } });

  const def  = BLOCK_BY_TYPE[block.type];
  const Icon = def?.icon ? (LucideIcons as any)[def.icon] ?? LucideIcons.Box : LucideIcons.Box;
  const containerRef = useRef<HTMLDivElement>(null);

  // Scale factor: render at 1200px conceptual width, show in ~760px container → 0.63
  const SCALE = 0.55;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        border: `2px solid ${isSelected ? 'var(--brand)' : 'var(--border-1)'}`,
        borderRadius: 10,
        background: 'var(--bg-1)',
        overflow: 'hidden',
        boxShadow: isSelected ? '0 0 0 3px rgba(0,95,95,0.15)' : 'none',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(block.id)}
    >
      {/* ── Visual Preview ── */}
      <div
        ref={containerRef}
        style={{
          height: PREVIEW_H,
          overflow: 'hidden',
          position: 'relative',
          pointerEvents: 'none',
          userSelect: 'none',
          background: '#f0f0f0',
        }}
      >
        {!block.visible && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '.06em' }}>HIDDEN</span>
          </div>
        )}
        {DATA_FETCHING.has(block.type) ? (
          <StaticPlaceholder block={block} />
        ) : (
          <div style={{
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            width: `${100 / SCALE}%`,
            position: 'absolute', top: 0, left: 0,
          }}>
            <BlockRenderer block={block} lang={previewLang} />
          </div>
        )}
      </div>

      {/* ── Controls Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderTop: '1px solid var(--border-1)',
        background: isSelected ? 'rgba(0,95,95,0.04)' : 'var(--bg-1)',
      }}>
        {/* Drag handle */}
        <div
          {...listeners} {...attributes}
          onClick={e => e.stopPropagation()}
          style={{ cursor: 'grab', color: 'var(--fg-3)', flexShrink: 0, display: 'flex', padding: '2px 0' }}
        >
          <GripVertical size={14} />
        </div>

        <Icon size={12} style={{ color: 'var(--brand)', flexShrink: 0 }} />

        <span style={{
          flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {def?.label ?? block.type}
        </span>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <ActionBtn title={block.visible ? 'Hide' : 'Show'} onClick={() => onToggleVisible(block.id)}>
            {block.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </ActionBtn>
          <ActionBtn title="Duplicate" onClick={() => onDuplicate(block.id)}>
            <Copy size={12} />
          </ActionBtn>
          <ActionBtn title="Delete" onClick={() => onDelete(block.id)} danger>
            <Trash2 size={12} />
          </ActionBtn>
        </div>
      </div>
    </div>
  );
};

const ActionBtn: React.FC<{
  title: string; onClick: () => void; danger?: boolean; children: React.ReactNode;
}> = ({ title, onClick, danger, children }) => (
  <button title={title} onClick={onClick} style={{
    border: 'none', background: 'none', cursor: 'pointer', padding: 4, borderRadius: 4,
    color: danger ? '#ef4444' : 'var(--fg-3)', display: 'flex', alignItems: 'center',
  }}>
    {children}
  </button>
);
