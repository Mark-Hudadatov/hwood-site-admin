import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import { getPageBySlug } from '../services/data/dataService';
import { isAdminLoggedIn } from '../admin/adminStore';
import type { Page } from '../domain/types';

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('i18nextLng') || 'en').startsWith('he') ? 'he' : 'en';
};

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [params]  = useSearchParams();
  const isPreview = params.get('preview') === '1' && isAdminLoggedIn();

  const [page,     setPage]     = useState<Page | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const lang = getCurrentLang();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPageBySlug(slug, isPreview).then(p => {
      if (!p) setNotFound(true);
      else    setPage(p);
      setLoading(false);
    });
  }, [slug, isPreview]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
      <h1 className="text-4xl font-bold text-neutral-900">Page not found</h1>
      <p className="text-neutral-500">This page doesn't exist or isn't published yet.</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-brand text-white hover:bg-brand-hover transition-colors">
        Back to Home
      </Link>
    </div>
  );

  const visible = (page!.blocks || []).filter(b => b.visible !== false);

  return (
    <div className="w-full">
      {isPreview && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-3 py-2 px-4 text-sm font-medium text-white bg-amber-500">
          Preview mode — this page is not published
        </div>
      )}
      {visible.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center text-neutral-400">
          No content on this page yet.
        </div>
      ) : (
        visible.map(block => <BlockRenderer key={block.id} block={block} lang={lang} />)
      )}
    </div>
  );
};
