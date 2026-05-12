import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import * as LucideIcons from 'lucide-react';
import type { BlockType } from '../../domain/types';
import { BLOCK_REGISTRY } from './blockRegistry';

interface LibraryItemProps {
  type:    BlockType;
  label:   string;
  icon:    string;
  desc:    string;
}

const LibraryItem: React.FC<LibraryItemProps> = ({ type, label, icon, desc }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library:${type}`,
    data: { type: 'library', blockType: type },
  });

  const Icon = (LucideIcons as any)[icon] ?? LucideIcons.Box;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={`Drag onto canvas or click to add · ${desc}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 7,
        border: '1px solid var(--border-1)',
        background: isDragging ? 'rgba(0,95,95,0.08)' : '#fff',
        cursor: 'grab', userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transition: 'box-shadow .15s, background .15s',
        boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,.15)' : 'none',
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
        background: 'rgba(0,95,95,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={14} style={{ color: 'var(--brand)' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 10, color: 'var(--fg-3)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</p>
      </div>
    </div>
  );
};

const CATEGORY_ORDER = ['layout', 'content', 'media', 'interactive'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  layout: 'Layout', content: 'Content', media: 'Media', interactive: 'Interactive',
};

interface Props { onAdd: (type: BlockType) => void; }

export const BlockLibraryPanel: React.FC<Props> = ({ onAdd }) => {
  const byCategory = CATEGORY_ORDER.map(cat => ({
    cat, blocks: BLOCK_REGISTRY.filter(b => b.category === cat),
  })).filter(g => g.blocks.length > 0);

  return (
    <aside style={{
      width: 230, flexShrink: 0, borderRight: '1px solid var(--border-1)',
      background: 'var(--bg-1)', overflowY: 'auto', height: '100%',
    }}>
      <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--border-1)', marginBottom: 4 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-1)', margin: 0 }}>Block Library</p>
        <p style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>Drag onto canvas or click ↓</p>
      </div>

      {byCategory.map(({ cat, blocks }) => (
        <div key={cat} style={{ padding: '6px 10px 10px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.08em',
                      textTransform: 'uppercase', margin: '4px 0 6px' }}>
            {CATEGORY_LABELS[cat]}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {blocks.map(def => (
              <div key={def.type} onClick={() => onAdd(def.type)} style={{ cursor: 'pointer' }}>
                <LibraryItem type={def.type} label={def.label} icon={def.icon} desc={def.description} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};
