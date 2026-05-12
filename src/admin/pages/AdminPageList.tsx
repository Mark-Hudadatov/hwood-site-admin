import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Copy, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import type { AdminPage } from '../../domain/types';
import {
  getAdminPages, createAdminPage, duplicateAdminPage,
  deleteAdminPage, updateAdminPage,
} from '../adminStore';
import { ROUTES } from '../../router';

export const AdminPageList: React.FC = () => {
  const navigate = useNavigate();
  const [pages,    setPages]    = useState<AdminPage[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAdminPages()
      .then(setPages)
      .catch(() => setError('Failed to load pages'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    try {
      const p = await createAdminPage({
        slug: `page-${Date.now().toString(36)}`,
        title_en: 'New Page',
        title_he: '',
        status: 'draft',
        blocks: [],
        sort_order: pages.length,
      });
      navigate(ROUTES.ADMIN_PAGE_BUILDER(p.id));
    } catch {
      setError('Failed to create page');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateAdminPage(id);
      navigate(ROUTES.ADMIN_PAGE_BUILDER(copy.id));
    } catch {
      setError('Failed to duplicate page');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteAdminPage(id);
      setPages(prev => prev.filter(p => p.id !== id));
    } catch {
      setError('Failed to delete page');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (page: AdminPage) => {
    const next = page.status === 'published' ? 'draft' : 'published';
    try {
      await updateAdminPage(page.id, { status: next });
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, status: next } : p));
    } catch {
      setError('Failed to update status');
    }
  };

  const statusDot = (s: string) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600,
      color: s === 'published' ? '#16a34a' : 'var(--fg-3)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: s === 'published' ? '#4ade80' : 'var(--fg-3)',
      }} />
      {s === 'published' ? 'Published' : 'Draft'}
    </span>
  );

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', margin: 0, letterSpacing: '-0.01em' }}>Pages</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Create and manage custom pages for the public site</p>
        </div>
        <button onClick={handleCreate} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 6, border: 'none',
          background: 'var(--brand)', color: '#fff',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={14} /> New Page
        </button>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: 6, fontSize: 12, color: '#dc2626', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>Loading…</p>
      ) : pages.length === 0 ? (
        <div style={{
          padding: 40, borderRadius: 10, border: '1px dashed var(--border-1)',
          textAlign: 'center', color: 'var(--fg-3)', fontSize: 13,
        }}>
          No pages yet. Click "New Page" to create one.
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border-1)' }}>
                {['Title', 'Slug', 'Status', 'Blocks', 'Updated', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => (
                <tr key={page.id}
                    style={{ borderBottom: i < pages.length - 1 ? '1px solid var(--border-1)' : 'none' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)' }}>
                    {page.title_en || '(Untitled)'}
                    {page.title_he && <span style={{ fontSize: 11, color: 'var(--fg-3)', marginLeft: 6 }}>/ {page.title_he}</span>}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--fg-3)', fontFamily: 'monospace' }}>
                    /p/{page.slug}
                  </td>
                  <td style={{ padding: '10px 14px' }}>{statusDot(page.status)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--fg-3)' }}>
                    {(page as any).blocks?.length ?? '—'}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--fg-3)' }}>
                    {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => navigate(ROUTES.ADMIN_PAGE_BUILDER(page.id))}
                              title="Edit" style={btnStyle}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => window.open(`${ROUTES.PAGE(page.slug)}?preview=1`, '_blank')}
                              title="Preview" style={btnStyle}>
                        <ExternalLink size={13} />
                      </button>
                      <button onClick={() => handleToggleStatus(page)}
                              title={page.status === 'published' ? 'Unpublish' : 'Publish'} style={btnStyle}>
                        {page.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button onClick={() => handleDuplicate(page.id)}
                              title="Duplicate" style={btnStyle}>
                        <Copy size={13} />
                      </button>
                      <button onClick={() => handleDelete(page.id)}
                              disabled={deleting === page.id}
                              title="Delete"
                              style={{ ...btnStyle, color: '#ef4444' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ fontSize: 12, color: 'var(--fg-3)' }}>
        Pages are published to <code style={{ fontSize: 11, background: 'var(--bg-2)', padding: '1px 4px', borderRadius: 3 }}>/p/slug</code> on the public site.
      </p>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 28, border: '1px solid var(--border-1)', borderRadius: 5,
  background: 'var(--bg-1)', color: 'var(--fg-2)', cursor: 'pointer',
};
