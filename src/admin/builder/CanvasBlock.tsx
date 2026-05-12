import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Copy, Trash2, ChevronUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Block } from '../../domain/types';
import { BLOCK_BY_TYPE } from './blockRegistry';
import { BlockRenderer } from '../../components/blocks/BlockRenderer';

interface Props {
  block:           Block;
  isSelected:      boolean;
  previewLang:     'en' | 'he';
  onSelect:        (id: string) => void;
  onToggleVisible: (id: string) => void;
  onDuplicate:     (id: string) => void;
  onDelete:        (id: string) => void;
}

export const CanvasBlock: React.FC<Props> = ({
  block, isSelected, previewLang, onSelect, onToggleVisible, onDuplicate, onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id, data: { type: 'canvas' } });

  const def  = BLOCK_BY_TYPE[block.type];
  const Icon = def?.icon ? (LucideIcons as any)[def.icon] ?? LucideIcons.Box : LucideIcons.Box;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity:   isDragging ? 0.35 : 1,
        borderRadius: 8,
        overflow: 'hidden',
        border: `2px solid ${isSelected ? 'var(--brand)' : 'transparent'}`,
        boxShadow: isSelected
          ? '0 0 0 4px rgba(0,95,95,0.12)'
          : '0 1px 4px rgba(0,0,0,0.08)',
        background: '#fff',
        position: 'relative',
      }}
    >
      {/* ── Top action bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 8px',
        background: isSelected ? 'var(--brand)' : 'var(--bg-2)',
        borderBottom: `1px solid ${isSelected ? 'rgba(255,255,255,0.15)' : 'var(--border-1)'}`,
        userSelect: 'none',
      }}>
        {/* Drag handle */}
        <div
          {...listeners} {...attributes}
          style={{ cursor: 'grab', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--fg-3)',
                   display: 'flex', padding: '2px 0', flexShrink: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>

        <Icon size={12} style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--brand)', flexShrink: 0 }} />

        <span style={{
          flex: 1, fontSize: 11, fontWeight: 600,
          color: isSelected ? '#fff' : 'var(--fg-1)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {def?.label ?? block.type}
          {!block.visible && (
            <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.6, letterSpacing: '.05em',
                           textTransform: 'uppercase' }}>hidden</span>
          )}
        </span>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <BarBtn title="Move up / Drag to reorder" onClick={() => {}} color={isSelected ? 'rgba(255,255,255,0.6)' : 'var(--fg-3)'}>
            <ChevronUp size={12} />
          </BarBtn>
          <BarBtn title={block.visible ? 'Hide block' : 'Show block'}
                  onClick={() => onToggleVisible(block.id)}
                  color={isSelected ? 'rgba(255,255,255,0.7)' : 'var(--fg-3)'}>
            {block.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </BarBtn>
          <BarBtn title="Duplicate" onClick={() => onDuplicate(block.id)}
                  color={isSelected ? 'rgba(255,255,255,0.7)' : 'var(--fg-3)'}>
            <Copy size={12} />
          </BarBtn>
          <BarBtn title="Delete" onClick={() => onDelete(block.id)} color="#f87171">
            <Trash2 size={12} />
          </BarBtn>
        </div>
      </div>

      {/* ── Block content at full canvas width ── */}
      <div style={{ position: 'relative' }}>
        {/* Click-to-select overlay (non-interactive passthrough for previewing) */}
        <div
          onClick={() => onSelect(block.id)}
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            cursor: 'pointer',
            // Subtle hover ring hint (CSS :hover not available inline — handled via border on outer)
          }}
        />

        {/* Hidden block dimmer */}
        {!block.visible && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 11,
            background: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)',
                           letterSpacing: '.1em', textTransform: 'uppercase',
                           background: '#fff', padding: '3px 8px', borderRadius: 4 }}>
              Hidden
            </span>
          </div>
        )}

        {/* The EXACT same component used on the live public site */}
        <div style={{ pointerEvents: 'none' }}>
          <BlockRenderer block={block} lang={previewLang} />
        </div>
      </div>
    </div>
  );
};

const BarBtn: React.FC<{
  title: string; onClick: () => void; color: string; children: React.ReactNode;
}> = ({ title, onClick, color, children }) => (
  <button title={title} onClick={onClick} style={{
    border: 'none', background: 'none', cursor: 'pointer',
    padding: '3px 4px', borderRadius: 4, color,
    display: 'flex', alignItems: 'center',
  }}>
    {children}
  </button>
);
