import React from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import type { Block, BlockData } from '../../domain/types';
import { BLOCK_BY_TYPE } from './blockRegistry';
import { FieldRenderer } from './FieldRenderer';

interface Props {
  block:    Block | null;
  onChange: (blockId: string, patch: Partial<BlockData>) => void;
  onToggleVisible: (blockId: string) => void;
  onDeselect: () => void;
}

export const SettingsPanel: React.FC<Props> = ({ block, onChange, onToggleVisible, onDeselect }) => {
  if (!block) return (
    <aside style={{
      width: 280, flexShrink: 0, borderLeft: '1px solid var(--border-1)',
      background: 'var(--bg-1)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'var(--fg-3)', fontSize: 13, padding: 24,
      textAlign: 'center', height: '100%',
    }}>
      Click a block on the canvas to edit its settings
    </aside>
  );

  const def    = BLOCK_BY_TYPE[block.type];
  const data   = block.data as Record<string, any>;
  const patch  = (p: Record<string, any>) => onChange(block.id, p as Partial<BlockData>);

  return (
    <aside style={{
      width: 280, flexShrink: 0, borderLeft: '1px solid var(--border-1)',
      background: 'var(--bg-1)', display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid var(--border-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{def?.label ?? block.type}</p>
          <p style={{ fontSize: 11, color: 'var(--fg-3)' }}>Block settings</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button title={block.visible ? 'Hide block' : 'Show block'}
                  onClick={() => onToggleVisible(block.id)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 4 }}>
            {block.visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button title="Deselect" onClick={onDeselect}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 4 }}>
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(def?.fields ?? []).map(field => (
          <FieldRenderer key={field.key} field={field} data={data} onChange={patch} />
        ))}
        {!def?.fields?.length && (
          <p style={{ fontSize: 12, color: 'var(--fg-3)' }}>No settings for this block.</p>
        )}
      </div>
    </aside>
  );
};
