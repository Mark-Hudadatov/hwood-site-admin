import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Copy, Trash2, ExternalLink, Eye, EyeOff, Settings, LayoutTemplate } from 'lucide-react';
import type { AdminPage } from '../../domain/types';
import {
  getAdminPages, createAdminPage, duplicateAdminPage,
  deleteAdminPage, updateAdminPage, getOrCreateBuilderPage,
} from '../adminStore';

// ─── Site pages — each has a dedicated admin editor + optional builder slug ───
const SITE_PAGES = [
  {
    label: 'Home Page',
    description: 'Hero, services grid, stories, partners sections',
    adminPath: '/admin/main-page',
    publicPath: '/',
    builderSlug: '__home',
  },
  {
    label: 'Services',
    description: 'Service catalog listing',
    adminPath: '/admin/services',
    publicPath: '/services',
    builderSlug: '__services',
  },
  {
    label: 'Stories / Portfolio',
    description: 'Blog posts and project stories',
    adminPath: '/admin/stories',
    publicPath: '/portfolio',
    builderSlug: '__portfolio',
  },
  {
    label: 'Partners',
    description: 'Partner logos and company partnerships',
    adminPath: '/admin/partners',
    publicPath: '/#partners',
    builderSlug: '__partners',
  },
  {
    label: 'Company Info',
    description: 'Contact details, address, social links',
    adminPath: '/admin/company-info',
    publicPath: '/about',
    builderSlug: '__about',
  },
  {
    label: 'Products',
    description: 'Products and categories',
    adminPath: '/admin/products',
    publicPath: null,
    builderSlug: null,
  },
  {
    label: 'Submissions',
    description: 'Contact & quote form submissions',
    adminPath: '/admin/submissions',
    publicPath: null,
    builderSlug: null,
  },
];

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const StatusDot: React.FC<{ status: string }> = ({ status }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600,
                 color: status === 'published' ? '#16a34a' : 'var(--fg-3)' }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%',
                   background: status === 'published' ? '#4ade80' : 'var(--fg-3)' }} />
    {status === 'published' ? 'Published' : 'Draft'}
  </span>
);

const Btn: React.FC<{
  onClick: () => void; title?: string; danger?: boolean;
  disabled?: boolean; children: React.ReactNode;
}> = ({ onClick, title, danger, disabled, children }) => (
  <button onClick={onClick} title={title} disabled={disabled} style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, border: '1px solid var(--border-1)', borderRadius: 5,
    background: 'var(--bg-1)', color: danger ? '#ef4444' : 'var(--fg-2)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
  }}>
    {children}
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const AdminPageList: React.FC = () => {
  const navigate = useNavigate();
  const [pages,         setPages]         = useState<AdminPage[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [deleting,      setDeleting]      = useState<string | null>(null);
  const [openingBuilder,setOpeningBuilder]= useState<string | null>(null);
  const [error,         setError]         = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAdminPages()
      .then(setPages).catch(() => setError('Failed to load pages'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // ── Custom page actions ──────────────────────────────────────────────────────

  const handleCreate = async () => {
    try {
      const p = await createAdminPage({
        slug: `page-${Date.now().toString(36)}`,
        title_en: 'New Page', title_he: '', status: 'draft',
        blocks: [], sort_order: pages.length,
      });
      navigate('/admin/pages/' + p.id + '/edit');
    } catch { setError('Failed to create page'); }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateAdminPage(id);
      navigate('/admin/pages/' + copy.id + '/edit');
    } catch { setError('Failed to duplicate page'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteAdminPage(id);
      setPages(prev => prev.filter(p => p.id !== id));
    } catch { setError('Failed to delete page'); }
    finally { setDeleting(null); }
  };

  const handleToggleStatus = async (page: AdminPage) => {
    const next = page.status === 'published' ? 'draft' : 'published';
    try {
      await updateAdminPage(page.id, { status: next });
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, status: next } : p));
    } catch { setError('Failed to update status'); }
  };

  // ── Site page → builder ──────────────────────────────────────────────────────

  const handleEditInBuilder = async (slug: string, titleEn: string) => {
    setOpeningBuilder(slug);
    try {
      const page = await getOrCreateBuilderPage(slug, titleEn);
      navigate('/admin/pages/' + page.id + '/edit');
    } catch { setError('Failed to open builder for this page'); }
    finally { setOpeningBuilder(null); }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  // Filter out reserved slugs from the custom pages list
  const RESERVED = new Set(SITE_PAGES.map(sp => sp.builderSlug).filter(Boolean));
  const customPages = pages.filter(p => !RESERVED.has(p.slug));

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Pages</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>
            Manage site pages and custom builder pages
          </p>
        </div>
        <button onClick={handleCreate} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
          borderRadius: 6, border: 'none', background: 'var(--brand)', color: '#fff',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={14} /> New Page
        </button>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: 6,
                      fontSize: 12, color: '#dc2626', border: '1px solid #fecaca' }}>
          {error}
          <button onClick={() => setError(null)}
                  style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer',
                           color: '#dc2626', fontWeight: 700 }}>×</button>
        </div>
      )}

      {/* ── Existing site pages ─────────────────────────────────────────────── */}
      <section>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.06em',
                     textTransform: 'uppercase', margin: '0 0 10px' }}>
          Site Pages
        </h3>
        <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
          {SITE_PAGES.map((sp, i) => (
            <div key={sp.label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              borderBottom: i < SITE_PAGES.length - 1 ? '1px solid var(--border-1)' : 'none',
              background: 'var(--bg-1)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>{sp.label}</p>
                <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: 0 }}>{sp.description}</p>
              </div>
              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                <button
                  onClick={() => navigate(sp.adminPath)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                           padding: '5px 12px', border: '1px solid var(--border-1)', borderRadius: 5,
                           background: 'var(--bg-1)', color: 'var(--fg-1)', fontSize: 11,
                           fontWeight: 600, cursor: 'pointer' }}>
                  <Settings size={12} /> Configure
                </button>
                {sp.builderSlug && (
                  <button
                    onClick={() => handleEditInBuilder(sp.builderSlug!, sp.label)}
                    disabled={openingBuilder === sp.builderSlug}
                    title="Edit / prototype in visual builder"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                             padding: '5px 12px', border: '1px solid var(--brand)', borderRadius: 5,
                             background: 'transparent', color: 'var(--brand)', fontSize: 11,
                             fontWeight: 600, cursor: openingBuilder === sp.builderSlug ? 'not-allowed' : 'pointer',
                             opacity: openingBuilder === sp.builderSlug ? 0.6 : 1 }}>
                    <LayoutTemplate size={12} />
                    {openingBuilder === sp.builderSlug ? 'Opening…' : 'Edit in Builder'}
                  </button>
                )}
                {sp.publicPath && (
                  <Btn onClick={() => window.open(sp.publicPath!, '_blank')} title="View on site">
                    <ExternalLink size={13} />
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Custom builder pages ─────────────────────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.06em',
                       textTransform: 'uppercase', margin: 0 }}>
            Custom Pages (Builder)
          </h3>
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>
            {customPages.length} page{customPages.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>Loading…</p>
        ) : customPages.length === 0 ? (
          <div style={{ padding: 32, borderRadius: 10, border: '1px dashed var(--border-1)',
                        textAlign: 'center', color: 'var(--fg-3)', fontSize: 13 }}>
            No custom pages yet.{' '}
            <button onClick={handleCreate}
                    style={{ background: 'none', border: 'none', color: 'var(--brand)',
                             fontWeight: 600, cursor: 'pointer' }}>
              Create your first page →
            </button>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border-1)' }}>
                  {['Title', 'URL', 'Status', 'Blocks', 'Updated', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 10,
                                         fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.05em',
                                         textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customPages.map((page, i) => (
                  <tr
                    key={page.id}
                    onClick={() => navigate('/admin/pages/' + page.id + '/edit')}
                    style={{
                      borderBottom: i < customPages.length - 1 ? '1px solid var(--border-1)' : 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)' }}>
                      {page.title_en || '(Untitled)'}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--fg-3)', fontFamily: 'monospace' }}>
                      /p/{page.slug}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <StatusDot status={page.status} />
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--fg-3)' }}>
                      {(page as any).blocks?.length ?? '—'}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--fg-3)' }}>
                      {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '10px 12px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Btn onClick={() => navigate('/admin/pages/' + page.id + '/edit')} title="Edit">
                          <Edit2 size={12} />
                        </Btn>
                        <Btn onClick={() => window.open(`/p/${page.slug}?preview=1`, '_blank')} title="Preview">
                          <ExternalLink size={12} />
                        </Btn>
                        <Btn onClick={() => handleToggleStatus(page)}
                             title={page.status === 'published' ? 'Unpublish' : 'Publish'}>
                          {page.status === 'published' ? <EyeOff size={12} /> : <Eye size={12} />}
                        </Btn>
                        <Btn onClick={() => handleDuplicate(page.id)} title="Duplicate">
                          <Copy size={12} />
                        </Btn>
                        <Btn onClick={() => handleDelete(page.id)}
                             disabled={deleting === page.id} title="Delete" danger>
                          <Trash2 size={12} />
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
