import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Block } from '../../domain/types';
import { BLOCK_BY_TYPE } from './blockRegistry';

interface Props {
  block:       Block;
  isSelected:  boolean;
  onSelect:    (id: string) => void;
  onToggleVisible: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete:    (id: string) => void;
}

export const CanvasBlock: React.FC<Props> = ({
  block, isSelected, onSelect, onToggleVisible, onDuplicate, onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const def  = BLOCK_BY_TYPE[block.type];
  const Icon = def?.icon ? (LucideIcons as any)[def.icon] ?? LucideIcons.Box : LucideIcons.Box;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        border: `2px solid ${isSelected ? 'var(--brand)' : 'var(--border-1)'}`,
        borderRadius: 8, background: 'var(--bg-1)',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => onSelect(block.id)}
    >
      {/* Drag handle */}
      <div {...listeners} {...attributes}
           onClick={e => e.stopPropagation()}
           style={{ cursor: 'grab', color: 'var(--fg-3)', flexShrink: 0, display: 'flex' }}>
        <GripVertical size={16} />
      </div>

      {/* Icon + name */}
      <Icon size={14} style={{ color: 'var(--brand)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {def?.label ?? block.type}
        </p>
        {!block.visible && (
          <p style={{ fontSize: 10, color: 'var(--fg-3)' }}>Hidden</p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}
           onClick={e => e.stopPropagation()}>
        <button title={block.visible ? 'Hide' : 'Show'} onClick={() => onToggleVisible(block.id)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 3 }}>
          {block.visible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        <button title="Duplicate" onClick={() => onDuplicate(block.id)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 3 }}>
          <Copy size={13} />
        </button>
        <button title="Delete" onClick={() => onDelete(block.id)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: 3 }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
