import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import * as LucideIcons from 'lucide-react';
import { Save, ExternalLink, ArrowLeft, Plus, Globe } from 'lucide-react';
import type { Block, BlockData, BlockType, PageStatus } from '../../domain/types';
import { getAdminPage, createAdminPage, updateAdminPage } from '../adminStore';
import { ROUTES } from '../../router';
import { BlockLibraryPanel } from '../builder/BlockLibraryPanel';
import { CanvasBlock }       from '../builder/CanvasBlock';
import { SettingsPanel }     from '../builder/SettingsPanel';
import { BLOCK_BY_TYPE, makeBlockId } from '../builder/blockRegistry';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newBlock(type: BlockType): Block {
  const def = BLOCK_BY_TYPE[type];
  return { id: makeBlockId(), type, data: { ...(def?.defaultData ?? {}) } as BlockData, visible: true };
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

interface TopBarProps {
  titleEn: string; slug: string; status: PageStatus;
  saving: boolean; lastSaved: Date | null; isNew: boolean;
  previewLang: 'en' | 'he';
  onTitleChange: (v: string) => void; onSlugChange: (v: string) => void;
  onStatusToggle: () => void; onSave: () => void; onPreview: () => void;
  onBack: () => void; onToggleLang: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  titleEn, slug, status, saving, lastSaved, isNew, previewLang,
  onTitleChange, onSlugChange, onStatusToggle, onSave, onPreview, onBack, onToggleLang,
}) => (
  <div style={{
    height: 52, flexShrink: 0, borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-1)', display: 'flex', alignItems: 'center',
    gap: 8, padding: '0 12px',
  }}>
    <button onClick={onBack} title="Back to pages"
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-2)', padding: 5 }}>
      <ArrowLeft size={16} />
    </button>
    <div style={{ width: 1, height: 20, background: 'var(--border-1)' }} />

    <input value={titleEn} onChange={e => onTitleChange(e.target.value)}
           placeholder="Page title"
           style={{ border: 'none', background: 'none', fontSize: 14, fontWeight: 600,
                    color: 'var(--fg-1)', outline: 'none', fontFamily: 'inherit', width: 180 }} />

    <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>/</span>
    <input value={slug}
           onChange={e => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
           placeholder="page-slug"
           style={{ border: '1px solid var(--border-1)', borderRadius: 6, padding: '3px 8px',
                    fontSize: 12, color: 'var(--fg-2)', background: 'var(--bg-2)', outline: 'none',
                    fontFamily: 'monospace', width: 160 }} />

    <div style={{ flex: 1 }} />

    {lastSaved && (
      <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>
        Saved {lastSaved.toLocaleTimeString()}
      </span>
    )}

    {/* Preview language toggle */}
    <button onClick={onToggleLang} title="Toggle canvas preview language"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                     padding: '4px 10px', border: '1px solid var(--border-1)', borderRadius: 6,
                     background: 'var(--bg-2)', color: 'var(--fg-2)', fontSize: 11, fontWeight: 700,
                     cursor: 'pointer', fontFamily: 'inherit' }}>
      <Globe size={12} /> {previewLang.toUpperCase()}
    </button>

    {/* Published/Draft */}
    <button onClick={onStatusToggle} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px',
      borderRadius: 6, border: '1px solid var(--border-1)',
      background: status === 'published' ? 'var(--brand)' : 'var(--bg-2)',
      color: status === 'published' ? '#fff' : 'var(--fg-2)',
      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%',
                     background: status === 'published' ? '#4ade80' : 'var(--fg-3)' }} />
      {status === 'published' ? 'Published' : 'Draft'}
    </button>

    <button onClick={onPreview} disabled={isNew} title="Preview in new tab"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                     borderRadius: 6, border: '1px solid var(--border-1)', background: 'var(--bg-2)',
                     color: 'var(--fg-2)', fontSize: 12, cursor: isNew ? 'not-allowed' : 'pointer',
                     opacity: isNew ? 0.4 : 1, fontFamily: 'inherit' }}>
      <ExternalLink size={13} /> Preview
    </button>

    <button onClick={onSave} disabled={saving} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px',
      borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff',
      fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
      opacity: saving ? 0.7 : 1, fontFamily: 'inherit',
    }}>
      <Save size={13} /> {saving ? 'Saving…' : 'Save'}
    </button>
  </div>
);

// ─── Drop zone between blocks ─────────────────────────────────────────────────
const DropHint: React.FC<{ active: boolean }> = ({ active }) => (
  <div style={{
    height: active ? 36 : 0, background: 'rgba(0,95,95,0.08)',
    border: active ? '2px dashed var(--brand)' : 'none',
    borderRadius: 8, transition: 'height .15s, border .15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  }}>
    {active && <span style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600 }}>Drop here</span>}
  </div>
);

// ─── Drag overlay ghost ───────────────────────────────────────────────────────
const DragGhost: React.FC<{ blockType: BlockType | null }> = ({ blockType }) => {
  if (!blockType) return null;
  const def  = blockType ? BLOCK_BY_TYPE[blockType] : null;
  const Icon = def?.icon ? (LucideIcons as any)[def.icon] ?? LucideIcons.Box : LucideIcons.Box;
  return (
    <div style={{
      background: 'var(--bg-1)', border: '2px solid var(--brand)', borderRadius: 8,
      padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.2)',
      display: 'flex', alignItems: 'center', gap: 8, opacity: 0.9,
    }}>
      <Icon size={14} style={{ color: 'var(--brand)' }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)' }}>{def?.label ?? blockType}</span>
    </div>
  );
};

// ─── Main Page Builder ────────────────────────────────────────────────────────

export const AdminPageBuilder: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate   = useNavigate();
  const isNew      = !pageId;

  const [titleEn,    setTitleEn]    = useState('New Page');
  const [titleHe,    setTitleHe]    = useState('');
  const [slug,       setSlug]       = useState('new-page');
  const [status,     setStatus]     = useState<PageStatus>('draft');
  const [blocks,     setBlocks]     = useState<Block[]>([]);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [lastSaved,  setLastSaved]  = useState<Date | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [previewLang, setPreviewLang] = useState<'en' | 'he'>('en');

  // DnD state
  const [draggingLibType, setDraggingLibType] = useState<BlockType | null>(null);
  const [overCanvasId,    setOverCanvasId]    = useState<string | null>(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'library') {
      setDraggingLibType(e.active.data.current.blockType as BlockType);
    }
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { over } = e;
    if (draggingLibType && over) setOverCanvasId(over.id as string);
    else setOverCanvasId(null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    const aType = active.data.current?.type;

    if (aType === 'library' && draggingLibType) {
      // Insert from library at the drop position
      if (over) {
        const b = newBlock(draggingLibType);
        const overId = over.id as string;
        setBlocks(prev => {
          const idx = prev.findIndex(bl => bl.id === overId);
          const next = [...prev];
          next.splice(idx >= 0 ? idx + 1 : prev.length, 0, b);
          return next;
        });
        setSelected(b.id);
      }
    } else if (aType === 'canvas' && over && active.id !== over.id) {
      setBlocks(prev => {
        const oi = prev.findIndex(b => b.id === active.id);
        const ni = prev.findIndex(b => b.id === over.id);
        return arrayMove(prev, oi, ni);
      });
    }

    setDraggingLibType(null);
    setOverCanvasId(null);
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

  const toggleVisible  = useCallback((id: string) =>
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
        saving={saving} lastSaved={lastSaved} isNew={isNew} previewLang={previewLang}
        onTitleChange={setTitleEn} onSlugChange={setSlug}
        onStatusToggle={() => setStatus(s => s === 'published' ? 'draft' : 'published')}
        onSave={save}
        onPreview={() => window.open(`${ROUTES.PAGE(slug)}?preview=1`, '_blank')}
        onBack={() => navigate(ROUTES.ADMIN_PAGES)}
        onToggleLang={() => setPreviewLang(l => l === 'en' ? 'he' : 'en')}
      />

      {error && (
        <div style={{ padding: '6px 14px', background: '#fef2f2', borderBottom: '1px solid #fecaca',
                      fontSize: 12, color: '#dc2626', flexShrink: 0 }}>
          {error}
        </div>
      )}

      {/* 3-panel body */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <BlockLibraryPanel onAdd={appendBlock} />

          {/* Canvas */}
          <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column' }}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                              justifyContent: 'center', gap: 14, color: 'var(--fg-3)', padding: 40 }}>
                  <div style={{ fontSize: 40 }}>📄</div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg-2)' }}>Empty page</p>
                  <p style={{ fontSize: 12, textAlign: 'center' }}>
                    Drag blocks from the left panel onto the canvas,<br />or click a block to add it to the bottom.
                  </p>
                </div>
              ) : (
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {blocks.map(b => (
                    <React.Fragment key={b.id}>
                      <DropHint active={overCanvasId === b.id && !!draggingLibType} />
                      <CanvasBlock
                        block={b}
                        isSelected={b.id === selected}
                        previewLang={previewLang}
                        onSelect={setSelected}
                        onToggleVisible={toggleVisible}
                        onDuplicate={duplicateBlock}
                        onDelete={deleteBlock}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </SortableContext>

            {blocks.length > 0 && (
              <div style={{ padding: '4px 16px 16px', display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => appendBlock('rich_text')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                                 padding: '6px 16px', border: '1px dashed var(--border-1)',
                                 borderRadius: 6, background: 'none', color: 'var(--fg-3)',
                                 fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Plus size={13} /> Add block
                </button>
              </div>
            )}
          </main>

          <SettingsPanel
            block={selectedBlock}
            onChange={updateBlock}
            onToggleVisible={toggleVisible}
            onDuplicate={duplicateBlock}
            onDeselect={() => setSelected(null)}
          />
        </div>

        {/* Drag overlay — shows while dragging from library */}
        <DragOverlay>
          {draggingLibType && <DragGhost blockType={draggingLibType} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
