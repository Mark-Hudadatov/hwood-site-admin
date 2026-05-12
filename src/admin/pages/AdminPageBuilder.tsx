import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext, DragEndEvent, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { Save, ExternalLink, ArrowLeft, Plus } from 'lucide-react';
import type { Block, BlockData, BlockType, PageStatus } from '../../domain/types';
import { getAdminPage, createAdminPage, updateAdminPage } from '../adminStore';
import { ROUTES } from '../../router';
import { BlockLibraryPanel } from '../builder/BlockLibraryPanel';
import { CanvasBlock }       from '../builder/CanvasBlock';
import { SettingsPanel }     from '../builder/SettingsPanel';
import { BLOCK_BY_TYPE, makeBlockId } from '../builder/blockRegistry';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newBlock(type: BlockType): Block {
  const def = BLOCK_BY_TYPE[type];
  return { id: makeBlockId(), type, data: { ...def.defaultData }, visible: true };
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

interface TopBarProps {
  titleEn:    string;
  slug:       string;
  status:     PageStatus;
  saving:     boolean;
  lastSaved:  Date | null;
  isNew:      boolean;
  onTitleChange:  (v: string) => void;
  onSlugChange:   (v: string) => void;
  onStatusToggle: () => void;
  onSave:     () => void;
  onPreview:  () => void;
  onBack:     () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  titleEn, slug, status, saving, lastSaved, isNew,
  onTitleChange, onSlugChange, onStatusToggle, onSave, onPreview, onBack,
}) => (
  <div style={{
    height: 52, flexShrink: 0, borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-1)', display: 'flex', alignItems: 'center',
    gap: 10, padding: '0 14px',
  }}>
    <button onClick={onBack} title="Back to pages"
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-2)', display: 'flex', padding: 4 }}>
      <ArrowLeft size={16} />
    </button>

    <div style={{ width: 1, height: 20, background: 'var(--border-1)' }} />

    <input value={titleEn} onChange={e => onTitleChange(e.target.value)}
           placeholder="Page title"
           style={{
             border: 'none', background: 'none', fontSize: 14, fontWeight: 600,
             color: 'var(--fg-1)', outline: 'none', fontFamily: 'inherit', width: 200,
           }} />

    <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>/</span>

    <input value={slug} onChange={e => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
           placeholder="page-slug"
           style={{
             border: '1px solid var(--border-1)', borderRadius: 6,
             padding: '4px 8px', fontSize: 12, color: 'var(--fg-2)',
             background: 'var(--bg-2)', outline: 'none', fontFamily: 'monospace', width: 180,
           }} />

    <div style={{ flex: 1 }} />

    {lastSaved && (
      <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>
        Saved {lastSaved.toLocaleTimeString()}
      </span>
    )}

    {/* Status toggle */}
    <button onClick={onStatusToggle} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border-1)',
      background: status === 'published' ? 'var(--brand)' : 'var(--bg-2)',
      color: status === 'published' ? '#fff' : 'var(--fg-2)',
      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: status === 'published' ? '#4ade80' : 'var(--fg-3)',
      }} />
      {status === 'published' ? 'Published' : 'Draft'}
    </button>

    <button onClick={onPreview} disabled={isNew} title="Preview in new tab"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border-1)',
              background: 'var(--bg-2)', color: 'var(--fg-2)',
              fontSize: 12, cursor: isNew ? 'not-allowed' : 'pointer', opacity: isNew ? 0.4 : 1,
              fontFamily: 'inherit',
            }}>
      <ExternalLink size={13} /> Preview
    </button>

    <button onClick={onSave} disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 6, border: 'none',
              background: 'var(--brand)', color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1, fontFamily: 'inherit',
            }}>
      <Save size={13} /> {saving ? 'Saving…' : 'Save'}
    </button>
  </div>
);

// ─── Empty Canvas ─────────────────────────────────────────────────────────────

const EmptyCanvas: React.FC<{ onAdd: (type: BlockType) => void }> = ({ onAdd }) => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 16, color: 'var(--fg-3)',
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16, background: 'var(--bg-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Plus size={24} style={{ color: 'var(--brand)' }} />
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg-2)' }}>No blocks yet</p>
      <p style={{ fontSize: 12, marginTop: 4 }}>Click a block in the left panel to add it</p>
    </div>
    <button onClick={() => onAdd('hero_banner')}
            style={{
              padding: '8px 16px', border: '1px solid var(--border-1)', borderRadius: 8,
              background: 'var(--bg-2)', color: 'var(--fg-1)', fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
      + Add Hero Banner
    </button>
  </div>
);

// ─── Main Page Builder ────────────────────────────────────────────────────────

export const AdminPageBuilder: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate   = useNavigate();
  const isNew      = !pageId;

  const [titleEn,  setTitleEn]  = useState('New Page');
  const [titleHe,  setTitleHe]  = useState('');
  const [slug,     setSlug]     = useState('new-page');
  const [status,   setStatus]   = useState<PageStatus>('draft');
  const [blocks,   setBlocks]   = useState<Block[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [lastSaved,setLastSaved]= useState<Date | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  // Load existing page
  useEffect(() => {
    if (!pageId) return;
    getAdminPage(pageId).then(p => {
      setTitleEn(p.title_en);
      setTitleHe(p.title_he ?? '');
      setSlug(p.slug);
      setStatus(p.status);
      setBlocks(p.blocks ?? []);
    }).catch(() => setError('Failed to load page'));
  }, [pageId]);

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setBlocks(prev => {
      const oi = prev.findIndex(b => b.id === active.id);
      const ni = prev.findIndex(b => b.id === over.id);
      return arrayMove(prev, oi, ni);
    });
  };

  // Block operations
  const appendBlock = useCallback((type: BlockType) => {
    const b = newBlock(type);
    setBlocks(prev => [...prev, b]);
    setSelected(b.id);
  }, []);

  const updateBlock = useCallback((id: string, patch: Partial<BlockData>) => {
    setBlocks(prev => prev.map(b =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      b.id === id ? { ...b, data: { ...(b.data as any), ...(patch as any) } as BlockData } : b
    ));
  }, []);

  const toggleVisible = useCallback((id: string) =>
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, visible: !b.visible } : b)), []);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const copy = { ...prev[idx], id: makeBlockId() };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setSelected(s => s === id ? null : s);
  }, []);

  // Save
  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { slug, title_en: titleEn, title_he: titleHe, status, blocks };
      if (isNew) {
        const created = await createAdminPage(payload);
        setLastSaved(new Date());
        navigate(ROUTES.ADMIN_PAGE_BUILDER(created.id), { replace: true });
      } else {
        await updateAdminPage(pageId!, payload);
        setLastSaved(new Date());
      }
    } catch {
      setError('Save failed — check slug uniqueness');
    } finally {
      setSaving(false);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selected) ?? null;

  return (
    <div data-fullbleed style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        titleEn={titleEn} slug={slug} status={status}
        saving={saving} lastSaved={lastSaved} isNew={isNew}
        onTitleChange={setTitleEn}
        onSlugChange={setSlug}
        onStatusToggle={() => setStatus(s => s === 'published' ? 'draft' : 'published')}
        onSave={save}
        onPreview={() => window.open(`${ROUTES.PAGE(slug)}?preview=1`, '_blank')}
        onBack={() => navigate(ROUTES.ADMIN_PAGES)}
      />

      {error && (
        <div style={{ padding: '6px 14px', background: '#fef2f2', borderBottom: '1px solid #fecaca', fontSize: 12, color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* 3-panel body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BlockLibraryPanel onAdd={appendBlock} />

        {/* Canvas */}
        <main style={{
          flex: 1, overflowY: 'auto', background: 'var(--bg-2)',
          display: 'flex', flexDirection: 'column',
        }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.length === 0 ? (
                <EmptyCanvas onAdd={appendBlock} />
              ) : (
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {blocks.map(b => (
                    <CanvasBlock key={b.id} block={b}
                                 isSelected={b.id === selected}
                                 onSelect={setSelected}
                                 onToggleVisible={toggleVisible}
                                 onDuplicate={duplicateBlock}
                                 onDelete={deleteBlock} />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>

          {/* Add block button at bottom */}
          {blocks.length > 0 && (
            <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => appendBlock('rich_text')}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '6px 14px', border: '1px dashed var(--border-1)',
                        borderRadius: 6, background: 'none', color: 'var(--fg-3)',
                        fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                <Plus size={13} /> Add block
              </button>
            </div>
          )}
        </main>

        <SettingsPanel
          block={selectedBlock}
          onChange={updateBlock}
          onToggleVisible={toggleVisible}
          onDeselect={() => setSelected(null)}
        />
      </div>
    </div>
  );
};
