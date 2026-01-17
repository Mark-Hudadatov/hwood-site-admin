/**
 * ADMIN COMPANY INFO PAGE
 * ========================
 */

import React, { useEffect, useState } from 'react';
import { Save, Facebook, Linkedin, Instagram, Music2, MessageCircle, Send } from 'lucide-react';
import type { AdminCompanyInfo as AdminCompanyInfoType, AdminSocialLink } from '../adminStore';
import {
  getAdminCompanyInfo,
  updateCompanyInfo,
  getSocialLinks,
  updateSocialLink,
} from '../adminStore';
import { BilingualInput } from '../components';

export const AdminCompanyInfo: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<AdminCompanyInfoType | null>(null);
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
      const [infoData, linksData] = await Promise.all([
        getAdminCompanyInfo(),
        getSocialLinks(),
      ]);
      
      if (infoData) {
        setCompanyInfo(infoData);
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
      setSocialLinks(linksData);
    } catch (error) {
      console.error('Failed to load data:', error);
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

  const handleSocialChange = async (id: string, field: 'url' | 'is_visible', value: string | boolean) => {
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

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return Facebook;
      case 'linkedin': return Linkedin;
      case 'instagram': return Instagram;
      case 'tiktok': return Music2;
      case 'whatsapp': return MessageCircle;
      case 'telegram': return Send;
      default: return MessageCircle;
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Info</h2>
          <p className="text-gray-500">Edit your company details displayed on the website</p>
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
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Company Details</h3>
        
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
          helpText="Short description shown under logo"
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
          helpText="About section description"
        />
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Contact Information</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+972-54-000-0000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="office@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent"
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
        />
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Social Media Links</h3>
        <p className="text-sm text-gray-500">Add URLs for each platform. Toggle visibility to show/hide on website.</p>
        
        <div className="space-y-4">
          {socialLinks.map((link) => {
            const Icon = getSocialIcon(link.platform);
            return (
              <div key={link.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="w-24 text-sm font-medium text-gray-700 capitalize">
                  {link.platform}
                </span>
                <input
                  type="text"
                  value={link.url || ''}
                  onChange={(e) => handleSocialChange(link.id, 'url', e.target.value)}
                  placeholder={link.platform === 'whatsapp' ? 'Phone number' : 'https://...'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent text-sm"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.is_visible}
                    onChange={(e) => handleSocialChange(link.id, 'is_visible', e.target.checked)}
                    className="w-4 h-4 text-[#005f5f] rounded focus:ring-[#005f5f]"
                  />
                  <span className="text-sm text-gray-600">Show</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
