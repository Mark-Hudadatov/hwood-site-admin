/**
 * ADMIN COMPANY INFO PAGE
 * ========================
 * Company details + social media links
 */

import React, { useEffect, useState } from 'react';
import { Save, Facebook, Linkedin, Instagram, MessageCircle, Send } from 'lucide-react';
import {
  AdminCompanyInfo,
  AdminSocialLink,
  getAdminCompanyInfo,
  getSocialLinks,
  updateCompanyInfo,
  updateSocialLink,
} from '../adminStore';
import { BilingualInput } from '../components';

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  tiktok: () => <span className="text-lg">📱</span>,
  whatsapp: MessageCircle,
  telegram: Send,
};

export const AdminCompanyInfo: React.FC = () => {
  const [info, setInfo] = useState<AdminCompanyInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<AdminSocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name_en: '',
    name_he: '',
    tagline_en: '',
    tagline_he: '',
    description_en: '',
    description_he: '',
    phone: '',
    email: '',
    address_en: '',
    address_he: '',
  });

  const loadData = async () => {
    try {
      const [infoData, socialData] = await Promise.all([
        getAdminCompanyInfo(),
        getSocialLinks(),
      ]);
      if (infoData) {
        setInfo(infoData);
        setFormData({
          name_en: infoData.name_en || '',
          name_he: infoData.name_he || '',
          tagline_en: infoData.tagline_en || '',
          tagline_he: infoData.tagline_he || '',
          description_en: infoData.description_en || '',
          description_he: infoData.description_he || '',
          phone: infoData.phone || '',
          email: infoData.email || '',
          address_en: infoData.address_en || '',
          address_he: infoData.address_he || '',
        });
      }
      setSocialLinks(socialData);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateCompanyInfo(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save company info');
    } finally {
      setSaving(false);
    }
  };

  const handleSocialUpdate = async (id: string, field: 'url' | 'is_visible', value: string | boolean) => {
    try {
      await updateSocialLink(id, { [field]: value });
      setSocialLinks(links => 
        links.map(link => 
          link.id === id ? { ...link, [field]: value } : link
        )
      );
    } catch (error) {
      console.error('Failed to update social link:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Info</h2>
          <p className="text-gray-500">Manage company details shown in footer & contact page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            saved 
              ? 'bg-green-500 text-white'
              : 'bg-[#005f5f] text-white hover:bg-[#004d4d]'
          } disabled:opacity-50`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Company Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">
          Company Details
        </h3>

        <BilingualInput
          label="Company Name"
          nameEn="name_en"
          nameHe="name_he"
          valueEn={formData.name_en}
          valueHe={formData.name_he}
          onChangeEn={(v) => setFormData({ ...formData, name_en: v })}
          onChangeHe={(v) => setFormData({ ...formData, name_he: v })}
          required
        />

        <BilingualInput
          label="Tagline"
          nameEn="tagline_en"
          nameHe="tagline_he"
          valueEn={formData.tagline_en}
          valueHe={formData.tagline_he}
          onChangeEn={(v) => setFormData({ ...formData, tagline_en: v })}
          onChangeHe={(v) => setFormData({ ...formData, tagline_he: v })}
          placeholder="Short company tagline"
        />

        <BilingualInput
          label="Description"
          nameEn="description_en"
          nameHe="description_he"
          valueEn={formData.description_en}
          valueHe={formData.description_he}
          onChangeEn={(v) => setFormData({ ...formData, description_en: v })}
          onChangeHe={(v) => setFormData({ ...formData, description_he: v })}
          type="textarea"
          placeholder="About the company"
        />
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">
          Contact Information
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+972-54-922-2804"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="office@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <BilingualInput
          label="Address"
          nameEn="address_en"
          nameHe="address_he"
          valueEn={formData.address_en}
          valueHe={formData.address_he}
          onChangeEn={(v) => setFormData({ ...formData, address_en: v })}
          onChangeHe={(v) => setFormData({ ...formData, address_he: v })}
          placeholder="Full street address"
        />
      </div>

      {/* Social Media Links */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">
          Social Media Links
        </h3>

        <div className="space-y-4">
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.platform] || (() => null);
            const isWhatsApp = link.platform === 'whatsapp';
            
            return (
              <div key={link.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {link.platform}
                  </label>
                  <input
                    type={isWhatsApp ? 'tel' : 'url'}
                    value={link.url || ''}
                    onChange={(e) => handleSocialUpdate(link.id, 'url', e.target.value)}
                    placeholder={isWhatsApp ? '+972544567890' : `https://${link.platform}.com/yourpage`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none text-sm"
                  />
                  {isWhatsApp && (
                    <p className="text-xs text-gray-500 mt-1">Phone number with country code, no spaces</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.is_visible}
                      onChange={(e) => handleSocialUpdate(link.id, 'is_visible', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#005f5f] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005f5f]"></div>
                    <span className="ml-2 text-sm text-gray-500">
                      {link.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-500">
          Social links will appear in the footer. Toggle visibility to show/hide each platform.
        </p>
      </div>
    </div>
  );
};
