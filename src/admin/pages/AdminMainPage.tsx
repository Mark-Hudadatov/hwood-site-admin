/**
 * ADMIN MAIN PAGE SETTINGS
 * ========================
 * Control all aspects of the homepage:
 * - Hero section (images, text, links)
 * - Services section (title, spacing)
 * - Stories section (title, buttons)
 * - About section (content, styling)
 * - Layout (colors, spacing)
 */

import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, Eye, Layout, Image, Type, Palette, Sliders } from 'lucide-react';
import { COLORS } from '../../tokens';
import { supabase } from '../../services/supabase';
import { BilingualInput, ImageUpload } from '../components';

// Types for homepage settings
interface HeroSettings {
  left_image_url: string;
  left_title_en: string;
  left_title_he: string;
  right_image_url: string;
  right_title_en: string;
  right_title_he: string;
  right_link: string;
  hero_height: string;
  show_pagination: boolean;
}

interface ServicesSectionSettings {
  title_en: string;
  title_he: string;
  subtitle_en: string;
  subtitle_he: string;
  padding_y: string;
  card_gap: string;
  card_aspect_ratio: string;
  show_descriptions: boolean;
}

interface StoriesSectionSettings {
  title_en: string;
  title_he: string;
  button_text_en: string;
  button_text_he: string;
  button_link: string;
  padding_y: string;
  card_gap: string;
  show_generate_button: boolean;
}

interface AboutSectionSettings {
  title_en: string;
  title_he: string;
  description_en: string;
  description_he: string;
  button_text_en: string;
  button_text_he: string;
  button_link: string;
  background_color: string;
  text_color: string;
}

interface LayoutSettings {
  primary_color: string;
  secondary_color: string;
  background_dark: string;
  section_spacing: string;
  border_radius: string;
}

interface WhoWeWorkWithBox {
  title_en: string;
  title_he: string;
  subtitle_en: string;
  subtitle_he: string;
  description_en: string;
  description_he: string;
  image_url: string;
  overlay_opacity: number; // 0-100
}

interface WhoWeWorkWithSettings {
  section_title_en: string;
  section_title_he: string;
  section_description_en: string;
  section_description_he: string;
  boxes: [WhoWeWorkWithBox, WhoWeWorkWithBox, WhoWeWorkWithBox];
}

type TabType = 'hero' | 'services' | 'stories' | 'about' | 'partners' | 'layout';

export const AdminMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings state
  const [hero, setHero] = useState<HeroSettings>({
    left_image_url: '',
    left_title_en: '',
    left_title_he: '',
    right_image_url: '',
    right_title_en: '',
    right_title_he: '',
    right_link: '',
    hero_height: '80vh',
    show_pagination: true,
  });

  const [servicesSection, setServicesSection] = useState<ServicesSectionSettings>({
    title_en: 'What We Do',
    title_he: 'מה אנחנו עושים',
    subtitle_en: 'CNC Manufacturing Services',
    subtitle_he: 'שירותי ייצור CNC',
    padding_y: '24',
    card_gap: '8',
    card_aspect_ratio: '3/4',
    show_descriptions: true,
  });

  const [storiesSection, setStoriesSection] = useState<StoriesSectionSettings>({
    title_en: 'Recent Projects and News',
    title_he: 'פרויקטים וחדשות אחרונים',
    button_text_en: 'See all',
    button_text_he: 'ראה הכל',
    button_link: '/portfolio',
    padding_y: '24',
    card_gap: '12',
    show_generate_button: true,
  });

  const [aboutSection, setAboutSection] = useState<AboutSectionSettings>({
    title_en: 'About HWOOD',
    title_he: 'אודות HWOOD',
    description_en: '',
    description_he: '',
    button_text_en: 'Discover HWOOD',
    button_text_he: 'גלה את HWOOD',
    button_link: '/about',
    background_color: COLORS.surfaceChrome,
    text_color: COLORS.brand,
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    primary_color: COLORS.brand,
    secondary_color: COLORS.brandHover,
    background_dark: COLORS.surfaceDark,
    section_spacing: '0',
    border_radius: '2xl',
  });

  const defaultBox: WhoWeWorkWithBox = {
    title_en: '', title_he: '', subtitle_en: '', subtitle_he: '',
    description_en: '', description_he: '', image_url: '', overlay_opacity: 70,
  };

  const [partnersSection, setPartnersSection] = useState<WhoWeWorkWithSettings>({
    section_title_en: 'Who We Work With',
    section_title_he: 'עם מי אנחנו עובדים',
    section_description_en: 'If you produce cabinets for real clients — not concepts — we speak the same language.',
    section_description_he: 'אם אתם מייצרים ארונות עבור לקוחות אמיתיים — לא קונספטים — אנחנו מדברים באותה שפה.',
    boxes: [
      { ...defaultBox, title_en: 'Kitchen & Cabinet Manufacturers', title_he: 'יצרני מטבחים וארונות', subtitle_en: 'Series & Project-based Production', subtitle_he: 'ייצור סדרתי ופרויקטאלי', description_en: 'Focused on repeatable manufacturing, dimensional consistency, and CNC-based workflows.', description_he: 'התמקדות בייצור חוזר, עקביות מידות ותהליכי עבודה מבוססי CNC.', overlay_opacity: 70 },
      { ...defaultBox, title_en: 'Professional Carpentry & Joinery', title_he: 'נגרות מקצועית', subtitle_en: 'Custom Interior Fabrication', subtitle_he: 'ייצור פנים מותאם אישית', description_en: 'Using CNC machining to improve accuracy and stabilize non-standard production.', description_he: 'שימוש בעיבוד CNC לשיפור דיוק וייצוב ייצור לא סטנדרטי.', overlay_opacity: 75 },
      { ...defaultBox, title_en: 'Interior & Fit-Out Contractors', title_he: 'קבלני פנים והתאמות', subtitle_en: 'Residential & Commercial Delivery', subtitle_he: 'אספקה למגורים ומסחר', description_en: 'Requiring predictable production, system-compatible cabinetry, and reliable integration.', description_he: 'דורשים ייצור צפוי, ארונות תואמי מערכת ואינטגרציה אמינה.', overlay_opacity: 80 },
    ],
  });

  // Load all settings
  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        data.forEach((row: { section: string; settings: any }) => {
          switch (row.section) {
            case 'hero':
              setHero({ ...hero, ...row.settings });
              break;
            case 'services_section':
              setServicesSection({ ...servicesSection, ...row.settings });
              break;
            case 'stories_section':
              setStoriesSection({ ...storiesSection, ...row.settings });
              break;
            case 'about_section':
              setAboutSection({ ...aboutSection, ...row.settings });
              break;
            case 'layout':
              setLayoutSettings({ ...layoutSettings, ...row.settings });
              break;
            case 'partners_section': {
              const dbSettings = row.settings;
              const defaultBoxes = [
                { title_he: 'יצרני מטבחים וארונות', subtitle_he: 'ייצור סדרתי ופרויקטאלי', description_he: 'התמקדות בייצור חוזר, עקביות מידות ותהליכי עבודה מבוססי CNC.' },
                { title_he: 'נגרות מקצועית', subtitle_he: 'ייצור פנים מותאם אישית', description_he: 'שימוש בעיבוד CNC לשיפור דיוק וייצוב ייצור לא סטנדרטי.' },
                { title_he: 'קבלני פנים והתאמות', subtitle_he: 'אספקה למגורים ומסחר', description_he: 'דורשים ייצור צפוי, ארונות תואמי מערכת ואינטגרציה אמינה.' },
              ];
              const mergedBoxes = (dbSettings.boxes || []).map((box: any, i: number) => ({
                ...partnersSection.boxes[i],
                ...box,
                // Fill empty Hebrew from defaults
                title_he: box.title_he || defaultBoxes[i]?.title_he || '',
                subtitle_he: box.subtitle_he || defaultBoxes[i]?.subtitle_he || '',
                description_he: box.description_he || defaultBoxes[i]?.description_he || '',
              }));
              setPartnersSection({ ...partnersSection, ...dbSettings, boxes: mergedBoxes });
              break;
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings. Make sure to run the SQL migration.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings for a specific section
  const saveSection = async (section: string, settings: any) => {
    setSaving(true);
    setMessage(null);
    
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .upsert({ 
          section, 
          settings,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'section' 
        });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: Image },
    { id: 'services' as TabType, label: 'Services', icon: Layout },
    { id: 'stories' as TabType, label: 'Stories', icon: Type },
    { id: 'about' as TabType, label: 'About', icon: Type },
    { id: 'partners' as TabType, label: 'Who We Work With', icon: Sliders },
    { id: 'layout' as TabType, label: 'Layout & Colors', icon: Palette },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Main Page Settings</h2>
          <p className="text-gray-500">Customize every aspect of your homepage</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-brand border border-brand rounded-lg hover:bg-brand/10"
        >
          <Eye className="w-4 h-4" />
          Preview Site
        </a>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* HERO TAB */}
          {activeTab === 'hero' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side */}
                <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-lg text-gray-900">Left Side (Dark)</h3>
                  
                  <ImageUpload
                    label="Background Image"
                    value={hero.left_image_url}
                    onChange={(url) => setHero({ ...hero, left_image_url: url })}
                    folder="hero"
                    helpText="Industrial/dark mood (1600×900 recommended)"
                  />

                  <BilingualInput
                    label="Title Text"
                    nameEn="left_title_en"
                    nameHe="left_title_he"
                    valueEn={hero.left_title_en}
                    valueHe={hero.left_title_he}
                    onChangeEn={(v) => setHero({ ...hero, left_title_en: v })}
                    onChangeHe={(v) => setHero({ ...hero, left_title_he: v })}
                    type="textarea"
                    placeholder="Headline text for left side"
                  />
                </div>

                {/* Right Side */}
                <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-lg text-gray-900">Right Side (Featured)</h3>
                  
                  <ImageUpload
                    label="Background Image"
                    value={hero.right_image_url}
                    onChange={(url) => setHero({ ...hero, right_image_url: url })}
                    folder="hero"
                    helpText="Colorful/abstract (1600×900 recommended)"
                  />

                  <BilingualInput
                    label="Title Text"
                    nameEn="right_title_en"
                    nameHe="right_title_he"
                    valueEn={hero.right_title_en}
                    valueHe={hero.right_title_he}
                    onChangeEn={(v) => setHero({ ...hero, right_title_en: v })}
                    onChangeHe={(v) => setHero({ ...hero, right_title_he: v })}
                    placeholder="Main headline"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={hero.right_link}
                      onChange={(e) => setHero({ ...hero, right_link: e.target.value })}
                      placeholder="/services/modular-cabinet-systems"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Where the arrow button links to</p>
                  </div>
                </div>
              </div>

              {/* Hero Options */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Height
                  </label>
                  <select
                    value={hero.hero_height}
                    onChange={(e) => setHero({ ...hero, hero_height: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  >
                    <option value="60vh">60% viewport (shorter)</option>
                    <option value="70vh">70% viewport</option>
                    <option value="80vh">80% viewport (default)</option>
                    <option value="90vh">90% viewport</option>
                    <option value="100vh">Full screen</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="show_pagination"
                    checked={hero.show_pagination}
                    onChange={(e) => setHero({ ...hero, show_pagination: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <label htmlFor="show_pagination" className="text-sm text-gray-700">
                    Show pagination dots
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('hero', hero)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Hero Settings'}
                </button>
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <BilingualInput
                label="Section Title"
                nameEn="title_en"
                nameHe="title_he"
                valueEn={servicesSection.title_en}
                valueHe={servicesSection.title_he}
                onChangeEn={(v) => setServicesSection({ ...servicesSection, title_en: v })}
                onChangeHe={(v) => setServicesSection({ ...servicesSection, title_he: v })}
                placeholder="Our Services"
                helpText="Main heading for the services section"
              />

              <BilingualInput
                label="Section Subtitle"
                nameEn="subtitle_en"
                nameHe="subtitle_he"
                valueEn={servicesSection.subtitle_en}
                valueHe={servicesSection.subtitle_he}
                onChangeEn={(v) => setServicesSection({ ...servicesSection, subtitle_en: v })}
                onChangeHe={(v) => setServicesSection({ ...servicesSection, subtitle_he: v })}
                placeholder="Precision services designed for the modern industrial workflow."
                helpText="Descriptive text shown below the main title"
              />

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vertical Padding (rem)
                  </label>
                  <select
                    value={servicesSection.padding_y}
                    onChange={(e) => setServicesSection({ ...servicesSection, padding_y: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="16">16 (compact)</option>
                    <option value="20">20 (normal)</option>
                    <option value="24">24 (spacious)</option>
                    <option value="32">32 (very spacious)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Gap (rem)
                  </label>
                  <select
                    value={servicesSection.card_gap}
                    onChange={(e) => setServicesSection({ ...servicesSection, card_gap: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="4">4 (tight)</option>
                    <option value="6">6 (normal)</option>
                    <option value="8">8 (spacious)</option>
                    <option value="12">12 (very spacious)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Aspect Ratio
                  </label>
                  <select
                    value={servicesSection.card_aspect_ratio}
                    onChange={(e) => setServicesSection({ ...servicesSection, card_aspect_ratio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="3/4">3:4 (portrait)</option>
                    <option value="3/5">3:5 (tall)</option>
                    <option value="1/1">1:1 (square)</option>
                    <option value="4/3">4:3 (landscape)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="show_descriptions"
                  checked={servicesSection.show_descriptions}
                  onChange={(e) => setServicesSection({ ...servicesSection, show_descriptions: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <label htmlFor="show_descriptions" className="text-sm text-gray-700">
                  Show descriptions on service cards
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('services_section', servicesSection)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Services Settings'}
                </button>
              </div>
            </div>
          )}

          {/* STORIES TAB */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <BilingualInput
                label="Section Title"
                nameEn="title_en"
                nameHe="title_he"
                valueEn={storiesSection.title_en}
                valueHe={storiesSection.title_he}
                onChangeEn={(v) => setStoriesSection({ ...storiesSection, title_en: v })}
                onChangeHe={(v) => setStoriesSection({ ...storiesSection, title_he: v })}
                placeholder="Recent Projects and News"
              />

              <BilingualInput
                label="'See All' Button Text"
                nameEn="button_text_en"
                nameHe="button_text_he"
                valueEn={storiesSection.button_text_en}
                valueHe={storiesSection.button_text_he}
                onChangeEn={(v) => setStoriesSection({ ...storiesSection, button_text_en: v })}
                onChangeHe={(v) => setStoriesSection({ ...storiesSection, button_text_he: v })}
                placeholder="See all"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={storiesSection.button_link}
                  onChange={(e) => setStoriesSection({ ...storiesSection, button_link: e.target.value })}
                  placeholder="/portfolio"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vertical Padding
                  </label>
                  <select
                    value={storiesSection.padding_y}
                    onChange={(e) => setStoriesSection({ ...storiesSection, padding_y: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="16">16 (compact)</option>
                    <option value="20">20 (normal)</option>
                    <option value="24">24 (spacious)</option>
                    <option value="32">32 (very spacious)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Gap
                  </label>
                  <select
                    value={storiesSection.card_gap}
                    onChange={(e) => setStoriesSection({ ...storiesSection, card_gap: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="8">8 (tight)</option>
                    <option value="12">12 (normal)</option>
                    <option value="16">16 (spacious)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="show_generate_button"
                  checked={storiesSection.show_generate_button}
                  onChange={(e) => setStoriesSection({ ...storiesSection, show_generate_button: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <label htmlFor="show_generate_button" className="text-sm text-gray-700">
                  Show "See more" button
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('stories_section', storiesSection)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Stories Settings'}
                </button>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <BilingualInput
                label="Section Title"
                nameEn="title_en"
                nameHe="title_he"
                valueEn={aboutSection.title_en}
                valueHe={aboutSection.title_he}
                onChangeEn={(v) => setAboutSection({ ...aboutSection, title_en: v })}
                onChangeHe={(v) => setAboutSection({ ...aboutSection, title_he: v })}
                placeholder="About HWOOD"
              />

              <BilingualInput
                label="Description"
                nameEn="description_en"
                nameHe="description_he"
                valueEn={aboutSection.description_en}
                valueHe={aboutSection.description_he}
                onChangeEn={(v) => setAboutSection({ ...aboutSection, description_en: v })}
                onChangeHe={(v) => setAboutSection({ ...aboutSection, description_he: v })}
                type="textarea"
                placeholder="About your company..."
              />

              <BilingualInput
                label="Button Text"
                nameEn="button_text_en"
                nameHe="button_text_he"
                valueEn={aboutSection.button_text_en}
                valueHe={aboutSection.button_text_he}
                onChangeEn={(v) => setAboutSection({ ...aboutSection, button_text_en: v })}
                onChangeHe={(v) => setAboutSection({ ...aboutSection, button_text_he: v })}
                placeholder="Discover HWOOD"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={aboutSection.button_link}
                    onChange={(e) => setAboutSection({ ...aboutSection, button_link: e.target.value })}
                    placeholder="/about"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={aboutSection.background_color}
                      onChange={(e) => setAboutSection({ ...aboutSection, background_color: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={aboutSection.background_color}
                      onChange={(e) => setAboutSection({ ...aboutSection, background_color: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('about_section', aboutSection)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save About Settings'}
                </button>
              </div>
            </div>
          )}

          {/* WHO WE WORK WITH TAB */}
          {activeTab === 'partners' && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="p-6 bg-gray-50 rounded-xl space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Section Header</h3>
                <BilingualInput
                  label="Section Title"
                  nameEn="section_title_en"
                  nameHe="section_title_he"
                  valueEn={partnersSection.section_title_en}
                  valueHe={partnersSection.section_title_he}
                  onChangeEn={(v) => setPartnersSection({ ...partnersSection, section_title_en: v })}
                  onChangeHe={(v) => setPartnersSection({ ...partnersSection, section_title_he: v })}
                />
                <BilingualInput
                  label="Section Description"
                  nameEn="section_description_en"
                  nameHe="section_description_he"
                  valueEn={partnersSection.section_description_en}
                  valueHe={partnersSection.section_description_he}
                  onChangeEn={(v) => setPartnersSection({ ...partnersSection, section_description_en: v })}
                  onChangeHe={(v) => setPartnersSection({ ...partnersSection, section_description_he: v })}
                  type="textarea"
                />
              </div>

              {/* 3 Boxes */}
              {partnersSection.boxes.map((box, idx) => {
                const updateBox = (updates: Partial<WhoWeWorkWithBox>) => {
                  const newBoxes = [...partnersSection.boxes] as [WhoWeWorkWithBox, WhoWeWorkWithBox, WhoWeWorkWithBox];
                  newBoxes[idx] = { ...newBoxes[idx], ...updates };
                  setPartnersSection({ ...partnersSection, boxes: newBoxes });
                };
                return (
                  <div key={idx} className="p-6 bg-gray-50 rounded-xl space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">Box {idx + 1}</h3>
                    
                    <ImageUpload
                      label="Background Image"
                      value={box.image_url}
                      onChange={(v) => updateBox({ image_url: v })}
                      folder="homepage"
                    />

                    {/* Preview */}
                    {box.image_url && (
                      <div className="relative h-40 rounded-lg overflow-hidden">
                        <img src={box.image_url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black" style={{ opacity: box.overlay_opacity / 100 }} />
                        <div className="absolute bottom-3 left-3 text-white text-sm font-medium z-10">
                          {box.title_en || 'Box title preview'}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dark Overlay: {box.overlay_opacity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={box.overlay_opacity}
                        onChange={(e) => updateBox({ overlay_opacity: parseInt(e.target.value) })}
                        className="w-full accent-brand"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Transparent</span>
                        <span>Fully dark</span>
                      </div>
                    </div>

                    <BilingualInput
                      label="Title"
                      nameEn={`box_${idx}_title_en`}
                      nameHe={`box_${idx}_title_he`}
                      valueEn={box.title_en}
                      valueHe={box.title_he}
                      onChangeEn={(v) => updateBox({ title_en: v })}
                      onChangeHe={(v) => updateBox({ title_he: v })}
                    />

                    <BilingualInput
                      label="Subtitle"
                      nameEn={`box_${idx}_subtitle_en`}
                      nameHe={`box_${idx}_subtitle_he`}
                      valueEn={box.subtitle_en}
                      valueHe={box.subtitle_he}
                      onChangeEn={(v) => updateBox({ subtitle_en: v })}
                      onChangeHe={(v) => updateBox({ subtitle_he: v })}
                    />

                    <BilingualInput
                      label="Description"
                      nameEn={`box_${idx}_description_en`}
                      nameHe={`box_${idx}_description_he`}
                      valueEn={box.description_en}
                      valueHe={box.description_he}
                      onChangeEn={(v) => updateBox({ description_en: v })}
                      onChangeHe={(v) => updateBox({ description_he: v })}
                      type="textarea"
                    />
                  </div>
                );
              })}

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('partners_section', partnersSection)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Who We Work With'}
                </button>
              </div>
            </div>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={layoutSettings.primary_color}
                      onChange={(e) => setLayoutSettings({ ...layoutSettings, primary_color: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={layoutSettings.primary_color}
                      onChange={(e) => setLayoutSettings({ ...layoutSettings, primary_color: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={layoutSettings.secondary_color}
                      onChange={(e) => setLayoutSettings({ ...layoutSettings, secondary_color: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={layoutSettings.secondary_color}
                      onChange={(e) => setLayoutSettings({ ...layoutSettings, secondary_color: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dark Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={layoutSettings.background_dark}
                      onChange={(e) => setLayoutSettings({ ...layoutSettings, background_dark: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={layoutSettings.background_dark}
                      onChange={(e) => setLayoutSettings({ ...layoutSettings, background_dark: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Spacing
                  </label>
                  <select
                    value={layoutSettings.section_spacing}
                    onChange={(e) => setLayoutSettings({ ...layoutSettings, section_spacing: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="0">No gap (seamless)</option>
                    <option value="4">Small (1rem)</option>
                    <option value="8">Medium (2rem)</option>
                    <option value="16">Large (4rem)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Radius Style
                  </label>
                  <select
                    value={layoutSettings.border_radius}
                    onChange={(e) => setLayoutSettings({ ...layoutSettings, border_radius: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="none">Sharp corners</option>
                    <option value="lg">Slightly rounded</option>
                    <option value="xl">Rounded</option>
                    <option value="2xl">Very rounded</option>
                    <option value="3xl">Highly rounded</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('layout', layoutSettings)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Layout Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
