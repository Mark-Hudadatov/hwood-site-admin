import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { BlockType } from '../../domain/types';
import { BLOCK_REGISTRY } from './blockRegistry';

interface Props { onAdd: (type: BlockType) => void; }

const CATEGORY_ORDER = ['layout', 'content', 'media', 'interactive'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  layout: 'Layout', content: 'Content', media: 'Media', interactive: 'Interactive',
};

export const BlockLibraryPanel: React.FC<Props> = ({ onAdd }) => {
  const byCategory = CATEGORY_ORDER.map(cat => ({
    cat,
    blocks: BLOCK_REGISTRY.filter(b => b.category === cat),
  })).filter(g => g.blocks.length > 0);

  return (
    <aside style={{
      width: 220, flexShrink: 0, borderRight: '1px solid var(--border-1)',
      background: 'var(--bg-1)', overflowY: 'auto', height: '100%',
    }}>
      <div style={{ padding: '12px 12px 0', borderBottom: '1px solid var(--border-1)', marginBottom: 8, paddingBottom: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          Blocks
        </p>
        <p style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>Click to add to page</p>
      </div>

      {byCategory.map(({ cat, blocks }) => (
        <div key={cat} style={{ padding: '6px 10px 10px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.08em',
                      textTransform: 'uppercase', padding: '4px 2px 6px' }}>
            {CATEGORY_LABELS[cat]}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {blocks.map(def => {
              const Icon = (LucideIcons as any)[def.icon] ?? LucideIcons.Box;
              return (
                <button key={def.type} onClick={() => onAdd(def.type)}
                        title={def.description}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 8px', border: 'none', borderRadius: 6,
                          background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                          color: 'var(--fg-1)', transition: 'background .15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                  <Icon size={14} style={{ color: 'var(--brand)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{def.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
};
