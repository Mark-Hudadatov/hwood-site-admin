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

type TabType = 'hero' | 'services' | 'stories' | 'about' | 'layout';

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
    title_en: 'Our Services',
    title_he: 'השירותים שלנו',
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
    background_color: '#EAEAEA',
    text_color: '#005f5f',
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    primary_color: '#005f5f',
    secondary_color: '#004d4d',
    background_dark: '#002828',
    section_spacing: '0',
    border_radius: '2xl',
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
    { id: 'layout' as TabType, label: 'Layout & Colors', icon: Palette },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005f5f]" />
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
          className="flex items-center gap-2 px-4 py-2 text-[#005f5f] border border-[#005f5f] rounded-lg hover:bg-[#005f5f]/10"
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
                    ? 'border-[#005f5f] text-[#005f5f]'
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] outline-none"
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
                    className="w-5 h-5 rounded border-gray-300 text-[#005f5f] focus:ring-[#005f5f]"
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
                  className="flex items-center gap-2 px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] disabled:opacity-50"
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
                  className="w-5 h-5 rounded border-gray-300 text-[#005f5f] focus:ring-[#005f5f]"
                />
                <label htmlFor="show_descriptions" className="text-sm text-gray-700">
                  Show descriptions on service cards
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('services_section', servicesSection)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] disabled:opacity-50"
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
                  className="w-5 h-5 rounded border-gray-300 text-[#005f5f] focus:ring-[#005f5f]"
                />
                <label htmlFor="show_generate_button" className="text-sm text-gray-700">
                  Show "See more" button
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => saveSection('stories_section', storiesSection)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] disabled:opacity-50"
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
                  className="flex items-center gap-2 px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save About Settings'}
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
                  className="flex items-center gap-2 px-6 py-3 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] disabled:opacity-50"
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
