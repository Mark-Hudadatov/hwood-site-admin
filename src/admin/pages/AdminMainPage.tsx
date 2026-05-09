/**
 * ADMIN HOMEPAGE EDITOR — split view
 * ====================================
 * Left: tab-based editor forms (existing logic kept)
 * Right: block map — shows which section is being edited
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { BilingualInput, ImageUpload } from '../components';

// ── Types (keep identical to original) ────────────────────────────────────────
interface HeroSettings {
  left_image_url: string; left_title_en: string; left_title_he: string;
  right_image_url: string; right_title_en: string; right_title_he: string;
  right_link: string; hero_height: string; show_pagination: boolean;
  left_video_url?: string; left_subtitle_en?: string; left_subtitle_he?: string;
}
interface ServicesSectionSettings {
  title_en: string; title_he: string; subtitle_en: string; subtitle_he: string;
  padding_y: string; card_gap: string; card_aspect_ratio: string; show_descriptions: boolean;
}
interface StoriesSectionSettings {
  title_en: string; title_he: string; button_text_en: string; button_text_he: string;
  button_link: string; padding_y: string; card_gap: string; show_generate_button: boolean;
}
interface AboutSectionSettings {
  title_en: string; title_he: string; description_en: string; description_he: string;
  button_text_en: string; button_text_he: string; button_link: string;
  background_color: string; text_color: string;
}
interface LayoutSettings {
  primary_color: string; secondary_color: string;
  background_dark: string; section_spacing: string; border_radius: string;
}
interface WhoWeWorkWithBox {
  title_en: string; title_he: string; subtitle_en: string; subtitle_he: string;
  description_en: string; description_he: string; image_url: string; overlay_opacity: number;
}
interface WhoWeWorkWithSettings {
  section_title_en: string; section_title_he: string;
  section_description_en: string; section_description_he: string;
  boxes: [WhoWeWorkWithBox, WhoWeWorkWithBox, WhoWeWorkWithBox];
}

type TabType = 'hero' | 'services' | 'stories' | 'about' | 'partners' | 'layout';

const DEFAULT_BOX: WhoWeWorkWithBox = {
  title_en: '', title_he: '', subtitle_en: '', subtitle_he: '',
  description_en: '', description_he: '', image_url: '', overlay_opacity: 70,
};

// ── Block map — shows page structure ─────────────────────────────────────────
const BLOCKS: { id: TabType | 'how-it-works' | 'footer'; label: string; height: number; tab?: TabType }[] = [
  { id: 'hero',         label: 'Hero',              height: 56,  tab: 'hero' },
  { id: 'services',     label: 'Services',           height: 36,  tab: 'services' },
  { id: 'how-it-works', label: 'How It Works',       height: 28 },
  { id: 'partners',     label: 'Who We Work With',   height: 40,  tab: 'partners' },
  { id: 'stories',      label: 'Stories & About',    height: 36,  tab: 'stories' },
  { id: 'about',        label: 'About',              height: 24,  tab: 'about' },
  { id: 'footer',       label: 'Footer',             height: 24 },
];

const BlockMap: React.FC<{ activeTab: TabType }> = ({ activeTab }) => (
  <div style={{
    width: '100%', display: 'flex', flexDirection: 'column', gap: 3,
    padding: '20px 24px', overflowY: 'auto',
  }}>
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
      color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 12,
    }}>
      Page structure
    </div>
    {BLOCKS.map(block => {
      const isActive = block.tab === activeTab;
      return (
        <div key={block.id} style={{
          height: block.height,
          border: `1.5px solid ${isActive ? 'var(--brand)' : 'var(--border-1)'}`,
          borderRadius: 6,
          background: isActive ? 'var(--brand-light)' : 'var(--bg-2)',
          display: 'flex', alignItems: 'center', paddingLeft: 12,
          transition: 'all .15s ease',
          position: 'relative', overflow: 'hidden',
        }}>
          {isActive && (
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
              background: 'var(--brand)', borderRadius: '6px 0 0 6px',
            }} />
          )}
          <span style={{
            fontSize: 11, fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--brand-text)' : 'var(--fg-2)',
          }}>
            {block.label}
          </span>
          {isActive && (
            <span style={{
              marginLeft: 'auto', marginRight: 12,
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--brand)',
            }}>
              editing
            </span>
          )}
        </div>
      );
    })}
    <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-3)', borderRadius: 6 }}>
      <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: 0, lineHeight: 1.5 }}>
        Select a tab on the left to edit that section. Changes are saved per-section.
      </p>
    </div>
  </div>
);

// ── Shared form field components ──────────────────────────────────────────────
const FieldRow: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 6, letterSpacing: '0.02em' }}>
      {label}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{hint}</div>}
  </div>
);

const Input: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }> = ({ value, onChange, placeholder, mono }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: '100%', padding: '7px 10px', border: '1px solid var(--border-1)', borderRadius: 6,
      fontSize: 13, fontFamily: mono ? 'ui-monospace, monospace' : 'inherit',
      background: '#fff', color: 'var(--fg-1)', boxSizing: 'border-box',
    }}
  />
);

const Select: React.FC<{ value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      width: '100%', padding: '7px 10px', border: '1px solid var(--border-1)', borderRadius: 6,
      fontSize: 13, background: '#fff', color: 'var(--fg-1)', boxSizing: 'border-box',
    }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const SaveBtn: React.FC<{ onClick: () => void; saving: boolean }> = ({ onClick, saving }) => (
  <button
    onClick={onClick}
    disabled={saving}
    style={{
      padding: '8px 16px', borderRadius: 6, border: 'none',
      background: saving ? 'var(--bg-3)' : '#0a0a0a',
      color: saving ? 'var(--fg-3)' : '#fff',
      fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}
  >
    {saving ? 'Saving…' : 'Save section'}
  </button>
);

// ── Main component ────────────────────────────────────────────────────────────
export const AdminMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  // State (identical to original)
  const [hero, setHero] = useState<HeroSettings>({
    left_image_url: '', left_title_en: '', left_title_he: '',
    right_image_url: '', right_title_en: '', right_title_he: '',
    right_link: '', hero_height: '80vh', show_pagination: true,
    left_video_url: '', left_subtitle_en: '', left_subtitle_he: '',
  });
  const [servicesSection, setServicesSection] = useState<ServicesSectionSettings>({
    title_en: 'Our Services', title_he: 'השירותים שלנו',
    subtitle_en: 'Precision services.', subtitle_he: '',
    padding_y: '24', card_gap: '8', card_aspect_ratio: '3/4', show_descriptions: true,
  });
  const [storiesSection, setStoriesSection] = useState<StoriesSectionSettings>({
    title_en: 'Recent Projects', title_he: '',
    button_text_en: 'See all', button_text_he: '',
    button_link: '/portfolio', padding_y: '24', card_gap: '12', show_generate_button: true,
  });
  const [aboutSection, setAboutSection] = useState<AboutSectionSettings>({
    title_en: 'About HWOOD', title_he: '',
    description_en: '', description_he: '',
    button_text_en: 'Discover', button_text_he: '',
    button_link: '/about', background_color: '#EAEAEA', text_color: '#005f5f',
  });
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    primary_color: '#005f5f', secondary_color: '#004d4d',
    background_dark: '#002828', section_spacing: '0', border_radius: '2xl',
  });
  const [partnersSection, setPartnersSection] = useState<WhoWeWorkWithSettings>({
    section_title_en: 'Who We Work With', section_title_he: 'עם מי אנחנו עובדים',
    section_description_en: 'If you produce cabinets for real clients, we speak the same language.',
    section_description_he: '',
    boxes: [
      { ...DEFAULT_BOX, title_en: 'Kitchen & Cabinet Manufacturers' },
      { ...DEFAULT_BOX, title_en: 'Professional Carpentry & Joinery' },
      { ...DEFAULT_BOX, title_en: 'Interior & Fit-Out Contractors' },
    ],
  });

  // Load settings (identical to original)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await supabase.from('homepage_settings').select('*');
        if (data) {
          data.forEach((row: { section: string; settings: any }) => {
            if (row.section === 'hero') setHero(h => ({ ...h, ...row.settings }));
            if (row.section === 'services_section') setServicesSection(s => ({ ...s, ...row.settings }));
            if (row.section === 'stories_section') setStoriesSection(s => ({ ...s, ...row.settings }));
            if (row.section === 'about_section') setAboutSection(s => ({ ...s, ...row.settings }));
            if (row.section === 'layout') setLayoutSettings(s => ({ ...s, ...row.settings }));
            if (row.section === 'partners_section') setPartnersSection(s => ({ ...s, ...row.settings }));
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadSettings();
  }, []);

  // Save (identical to original)
  const saveSection = async (section: string, settings: any) => {
    setSaving(true);
    try {
      await supabase.from('homepage_settings').upsert(
        { section, settings, updated_at: new Date().toISOString() },
        { onConflict: 'section' }
      );
      setSavedMsg('Saved');
      setTimeout(() => setSavedMsg(''), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 32, color: 'var(--fg-3)', fontSize: 13 }}>Loading…</div>;

  const TABS: { id: TabType; label: string }[] = [
    { id: 'hero', label: 'Hero' },
    { id: 'services', label: 'Services' },
    { id: 'stories', label: 'Stories' },
    { id: 'about', label: 'About' },
    { id: 'partners', label: 'Who We Work With' },
    { id: 'layout', label: 'Layout' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Left editor panel ── */}
      <div style={{ width: 460, borderRight: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-1)', overflowX: 'auto', flexShrink: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 14px', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? 'var(--brand)' : 'transparent'}`,
                background: 'transparent', fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? 'var(--brand)' : 'var(--fg-2)',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Save feedback */}
        {savedMsg && (
          <div style={{ padding: '6px 16px', background: 'var(--brand-light)', color: 'var(--brand-text)', fontSize: 11, fontWeight: 600 }}>
            ✓ {savedMsg}
          </div>
        )}

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* HERO TAB */}
          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>Left side (video / image)</div>
              <FieldRow label="Video URL" hint="Direct MP4 link — autoplay, loop, muted">
                <Input value={hero.left_video_url || ''} onChange={v => setHero({ ...hero, left_video_url: v })} placeholder="https://..." />
              </FieldRow>
              <FieldRow label="Fallback image">
                <ImageUpload label="" value={hero.left_image_url} onChange={url => setHero({ ...hero, left_image_url: url })} folder="hero" />
              </FieldRow>
              <FieldRow label="Headline (EN)">
                <Input value={hero.left_title_en} onChange={v => setHero({ ...hero, left_title_en: v })} placeholder="CNC Production Systems" />
              </FieldRow>
              <FieldRow label="Headline (HE)">
                <Input value={hero.left_title_he} onChange={v => setHero({ ...hero, left_title_he: v })} />
              </FieldRow>
              <FieldRow label="Subtitle (EN)">
                <Input value={hero.left_subtitle_en || ''} onChange={v => setHero({ ...hero, left_subtitle_en: v })} placeholder="Modular systems and CNC…" />
              </FieldRow>
              <div style={{ height: 1, background: 'var(--border-1)', margin: '8px 0 18px' }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>Right panel (order picker)</div>
              <FieldRow label="CTA link" hint="Where 'View catalog' button goes">
                <Input value={hero.right_link} onChange={v => setHero({ ...hero, right_link: v })} placeholder="/services/..." mono />
              </FieldRow>
              <FieldRow label="Hero height">
                <Select value={hero.hero_height} onChange={v => setHero({ ...hero, hero_height: v })} options={[
                  { value: '70vh', label: '70% viewport' },
                  { value: '80vh', label: '80% viewport (default)' },
                  { value: '90vh', label: '90% viewport' },
                  { value: '100vh', label: 'Full screen' },
                ]} />
              </FieldRow>
              <SaveBtn onClick={() => saveSection('hero', hero)} saving={saving} />
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div>
              <FieldRow label="Section title (EN)">
                <Input value={servicesSection.title_en} onChange={v => setServicesSection({ ...servicesSection, title_en: v })} />
              </FieldRow>
              <FieldRow label="Section title (HE)">
                <Input value={servicesSection.title_he} onChange={v => setServicesSection({ ...servicesSection, title_he: v })} />
              </FieldRow>
              <FieldRow label="Subtitle (EN)">
                <Input value={servicesSection.subtitle_en} onChange={v => setServicesSection({ ...servicesSection, subtitle_en: v })} />
              </FieldRow>
              <FieldRow label="Show descriptions on cards">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={servicesSection.show_descriptions}
                    onChange={e => setServicesSection({ ...servicesSection, show_descriptions: e.target.checked })} />
                  Show card descriptions
                </label>
              </FieldRow>
              <SaveBtn onClick={() => saveSection('services_section', servicesSection)} saving={saving} />
            </div>
          )}

          {/* STORIES TAB */}
          {activeTab === 'stories' && (
            <div>
              <FieldRow label="Section title (EN)">
                <Input value={storiesSection.title_en} onChange={v => setStoriesSection({ ...storiesSection, title_en: v })} />
              </FieldRow>
              <FieldRow label="Section title (HE)">
                <Input value={storiesSection.title_he} onChange={v => setStoriesSection({ ...storiesSection, title_he: v })} />
              </FieldRow>
              <FieldRow label='"See all" button text (EN)'>
                <Input value={storiesSection.button_text_en} onChange={v => setStoriesSection({ ...storiesSection, button_text_en: v })} />
              </FieldRow>
              <FieldRow label="Button link">
                <Input value={storiesSection.button_link} onChange={v => setStoriesSection({ ...storiesSection, button_link: v })} mono />
              </FieldRow>
              <SaveBtn onClick={() => saveSection('stories_section', storiesSection)} saving={saving} />
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div>
              <FieldRow label="Section title (EN)">
                <Input value={aboutSection.title_en} onChange={v => setAboutSection({ ...aboutSection, title_en: v })} />
              </FieldRow>
              <FieldRow label="Section title (HE)">
                <Input value={aboutSection.title_he} onChange={v => setAboutSection({ ...aboutSection, title_he: v })} />
              </FieldRow>
              <FieldRow label="Description (EN)">
                <Input value={aboutSection.description_en} onChange={v => setAboutSection({ ...aboutSection, description_en: v })} />
              </FieldRow>
              <FieldRow label="Button text (EN)">
                <Input value={aboutSection.button_text_en} onChange={v => setAboutSection({ ...aboutSection, button_text_en: v })} />
              </FieldRow>
              <FieldRow label="Button link">
                <Input value={aboutSection.button_link} onChange={v => setAboutSection({ ...aboutSection, button_link: v })} mono />
              </FieldRow>
              <SaveBtn onClick={() => saveSection('about_section', aboutSection)} saving={saving} />
            </div>
          )}

          {/* WHO WE WORK WITH TAB */}
          {activeTab === 'partners' && (
            <div>
              <FieldRow label="Section title (EN)">
                <Input value={partnersSection.section_title_en} onChange={v => setPartnersSection({ ...partnersSection, section_title_en: v })} />
              </FieldRow>
              <FieldRow label="Section title (HE)">
                <Input value={partnersSection.section_title_he} onChange={v => setPartnersSection({ ...partnersSection, section_title_he: v })} />
              </FieldRow>
              <FieldRow label="Section description (EN)">
                <Input value={partnersSection.section_description_en} onChange={v => setPartnersSection({ ...partnersSection, section_description_en: v })} />
              </FieldRow>
              {partnersSection.boxes.map((box, idx) => {
                const updateBox = (updates: Partial<WhoWeWorkWithBox>) => {
                  const newBoxes = [...partnersSection.boxes] as [WhoWeWorkWithBox, WhoWeWorkWithBox, WhoWeWorkWithBox];
                  newBoxes[idx] = { ...newBoxes[idx], ...updates };
                  setPartnersSection({ ...partnersSection, boxes: newBoxes });
                };
                return (
                  <div key={idx} style={{ padding: '14px', border: '1px solid var(--border-1)', borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 10 }}>Box {idx + 1}</div>
                    <FieldRow label="Title (EN)">
                      <Input value={box.title_en} onChange={v => updateBox({ title_en: v })} />
                    </FieldRow>
                    <FieldRow label="Description (EN)">
                      <Input value={box.description_en} onChange={v => updateBox({ description_en: v })} />
                    </FieldRow>
                  </div>
                );
              })}
              <SaveBtn onClick={() => saveSection('partners_section', partnersSection)} saving={saving} />
            </div>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div>
              <FieldRow label="Primary color">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="color" value={layoutSettings.primary_color}
                    onChange={e => setLayoutSettings({ ...layoutSettings, primary_color: e.target.value })}
                    style={{ width: 40, height: 36, borderRadius: 6, border: '1px solid var(--border-1)', cursor: 'pointer' }} />
                  <Input value={layoutSettings.primary_color} onChange={v => setLayoutSettings({ ...layoutSettings, primary_color: v })} mono />
                </div>
              </FieldRow>
              <FieldRow label="Dark background color">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="color" value={layoutSettings.background_dark}
                    onChange={e => setLayoutSettings({ ...layoutSettings, background_dark: e.target.value })}
                    style={{ width: 40, height: 36, borderRadius: 6, border: '1px solid var(--border-1)', cursor: 'pointer' }} />
                  <Input value={layoutSettings.background_dark} onChange={v => setLayoutSettings({ ...layoutSettings, background_dark: v })} mono />
                </div>
              </FieldRow>
              <SaveBtn onClick={() => saveSection('layout', layoutSettings)} saving={saving} />
            </div>
          )}
        </div>
      </div>

      {/* ── Right: block map ── */}
      <div style={{ flex: 1, background: 'var(--bg-2)', overflow: 'hidden' }}>
        <BlockMap activeTab={activeTab} />
      </div>
    </div>
  );
};
