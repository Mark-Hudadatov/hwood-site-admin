import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Copy, Trash2, ExternalLink, Eye, EyeOff, Settings } from 'lucide-react';
import type { AdminPage } from '../../domain/types';
import {
  getAdminPages, createAdminPage, duplicateAdminPage,
  deleteAdminPage, updateAdminPage,
} from '../adminStore';
import { ROUTES } from '../../router';

// ─── Existing site pages — link to their dedicated editors ────────────────────
const SITE_PAGES = [
  { label: 'Home Page',       description: 'Hero, services grid, stories, partners, about section', adminPath: ROUTES.ADMIN_MAIN_PAGE, publicPath: '/' },
  { label: 'Services',        description: 'Service catalog listing',                                adminPath: ROUTES.ADMIN_SERVICES,  publicPath: '/services' },
  { label: 'Products',        description: 'Products and categories',                                adminPath: ROUTES.ADMIN_PRODUCTS,  publicPath: '/products' },
  { label: 'Stories',         description: 'Blog posts and project stories',                         adminPath: ROUTES.ADMIN_STORIES,   publicPath: '/portfolio' },
  { label: 'Partners',        description: 'Partner logos and company partnerships',                 adminPath: ROUTES.ADMIN_PARTNERS,  publicPath: '/#partners' },
  { label: 'Company Info',    description: 'Contact details, address, social links',                adminPath: ROUTES.ADMIN_COMPANY_INFO, publicPath: '/about' },
  { label: 'Submissions',     description: 'Contact & quote form submissions',                       adminPath: ROUTES.ADMIN_SUBMISSIONS, publicPath: null },
];

// ─── Status dot ──────────────────────────────────────────────────────────────
const StatusDot: React.FC<{ status: string }> = ({ status }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600,
                 color: status === 'published' ? '#16a34a' : 'var(--fg-3)' }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%',
                   background: status === 'published' ? '#4ade80' : 'var(--fg-3)' }} />
    {status === 'published' ? 'Published' : 'Draft'}
  </span>
);

const Btn: React.FC<{ onClick: () => void; title?: string; danger?: boolean; disabled?: boolean; children: React.ReactNode }> =
  ({ onClick, title, danger, disabled, children }) => (
    <button onClick={onClick} title={title} style={{
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
  const [pages,    setPages]    = useState<AdminPage[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAdminPages()
      .then(setPages).catch(() => setError('Failed to load pages'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    try {
      const p = await createAdminPage({
        slug: `page-${Date.now().toString(36)}`,
        title_en: 'New Page', title_he: '', status: 'draft',
        blocks: [], sort_order: pages.length,
      });
      navigate(ROUTES.ADMIN_PAGE_BUILDER(p.id));
    } catch { setError('Failed to create page'); }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateAdminPage(id);
      navigate(ROUTES.ADMIN_PAGE_BUILDER(copy.id));
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

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Pages</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>
            Manage all pages — site pages link to their editors, custom pages use the visual builder
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
        <div style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: 6, fontSize: 12,
                      color: '#dc2626', border: '1px solid #fecaca' }}>
          {error}
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
                <button onClick={() => navigate(sp.adminPath)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                                 padding: '5px 12px', border: '1px solid var(--border-1)', borderRadius: 5,
                                 background: 'var(--bg-1)', color: 'var(--fg-1)', fontSize: 11,
                                 fontWeight: 600, cursor: 'pointer' }}>
                  <Settings size={12} /> Configure
                </button>
                {sp.publicPath && sp.publicPath !== '/products' && sp.publicPath !== '/services' && (
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
        <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '.06em',
                     textTransform: 'uppercase', margin: '0 0 10px' }}>
          Custom Pages (Builder)
        </h3>

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>Loading…</p>
        ) : pages.length === 0 ? (
          <div style={{ padding: 32, borderRadius: 10, border: '1px dashed var(--border-1)',
                        textAlign: 'center', color: 'var(--fg-3)', fontSize: 13 }}>
            No custom pages yet.{' '}
            <button onClick={handleCreate}
                    style={{ background: 'none', border: 'none', color: 'var(--brand)', fontWeight: 600, cursor: 'pointer' }}>
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
                {pages.map((page, i) => (
                  <tr key={page.id} style={{ borderBottom: i < pages.length - 1 ? '1px solid var(--border-1)' : 'none' }}>
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
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Btn onClick={() => navigate(ROUTES.ADMIN_PAGE_BUILDER(page.id))} title="Edit in builder">
                          <Edit2 size={12} />
                        </Btn>
                        <Btn onClick={() => window.open(`${ROUTES.PAGE(page.slug)}?preview=1`, '_blank')} title="Preview">
                          <ExternalLink size={12} />
                        </Btn>
                        <Btn onClick={() => handleToggleStatus(page)} title={page.status === 'published' ? 'Unpublish' : 'Publish'}>
                          {page.status === 'published' ? <EyeOff size={12} /> : <Eye size={12} />}
                        </Btn>
                        <Btn onClick={() => handleDuplicate(page.id)} title="Duplicate">
                          <Copy size={12} />
                        </Btn>
                        <Btn onClick={() => handleDelete(page.id)} disabled={deleting === page.id} title="Delete" danger>
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
