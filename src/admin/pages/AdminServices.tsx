/**
 * ADMIN SERVICES PAGE
 * ====================
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, GripVertical } from 'lucide-react';
import {
  AdminService,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from '../adminStore';
import {
  BilingualInput,
  VisibilitySelect,
  ImageUpload,
  Modal,
  ConfirmDialog,
} from '../components';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
const [formData, setFormData] = useState<{
    slug: string;
    title_en: string;
    title_he: string;
    description_en: string;
    description_he: string;
    image_url: string;
    hero_image_url: string;
    accent_color: string;
    visibility_status: VisibilityStatus;
  }>({
    slug: '',
    title_en: '',
    title_he: '',
    description_en: '',
    description_he: '',
    image_url: '',
    hero_image_url: '',
    accent_color: '#005f5f',
    visibility_status: 'visible',
  });

  const loadServices = async () => {
    try {
      const data = await getAdminServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openNewModal = () => {
    setEditingService(null);
    setFormData({
      slug: '',
      title_en: '',
      title_he: '',
      description_en: '',
      description_he: '',
      image_url: '',
      hero_image_url: '',
      accent_color: '#005f5f',
      visibility_status: 'visible',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: AdminService) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      title_en: service.title_en,
      title_he: service.title_he || '',
      description_en: service.description_en || '',
      description_he: service.description_he || '',
      image_url: service.image_url || '',
      hero_image_url: service.hero_image_url || '',
      accent_color: service.accent_color || '#005f5f',
      visibility_status: service.visibility_status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title_en || !formData.slug) {
      alert('Title (EN) and Slug are required');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService({
          ...formData,
          sort_order: services.length,
        });
      }
      await loadServices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      await loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service. It may have subservices.');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          <p className="text-gray-500">Manage your top-level service categories</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No services yet</p>
            <button
              onClick={openNewModal}
              className="text-[#005f5f] hover:underline"
            >
              Create your first service
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  service.visibility_status !== 'visible' ? 'opacity-60' : ''
                }`}
              >
                {/* Drag Handle */}
                <div className="cursor-grab text-gray-400">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No img
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {service.title_en}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    /{service.slug}
                  </p>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  service.visibility_status === 'visible' 
                    ? 'bg-green-100 text-green-700'
                    : service.visibility_status === 'coming_soon'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {service.visibility_status === 'visible' ? 'Visible' :
                   service.visibility_status === 'coming_soon' ? 'Coming Soon' : 'Hidden'}
                </div>

                {/* Accent Color */}
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: service.accent_color || '#005f5f' }}
                />

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 text-gray-500 hover:text-[#005f5f] hover:bg-[#005f5f]/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(service.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'New Service'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="service-slug"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, slug: generateSlug(formData.title_en) })}
                className="px-4 py-2 text-sm text-[#005f5f] border border-[#005f5f] rounded-lg hover:bg-[#005f5f]/10"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">URL: /services/{formData.slug || 'slug'}</p>
          </div>

          {/* Title */}
          <BilingualInput
            label="Title"
            nameEn="title_en"
            nameHe="title_he"
            valueEn={formData.title_en}
            valueHe={formData.title_he}
            onChangeEn={(v) => setFormData({ ...formData, title_en: v })}
            onChangeHe={(v) => setFormData({ ...formData, title_he: v })}
            required
            placeholder="Service title"
          />

          {/* Description */}
          <BilingualInput
            label="Description"
            nameEn="description_en"
            nameHe="description_he"
            valueEn={formData.description_en}
            valueHe={formData.description_he}
            onChangeEn={(v) => setFormData({ ...formData, description_en: v })}
            onChangeHe={(v) => setFormData({ ...formData, description_he: v })}
            type="textarea"
            placeholder="Brief description of the service"
          />

          {/* Images */}
          <div className="grid grid-cols-2 gap-6">
            <ImageUpload
              label="Card Image"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="services"
              helpText="Shown on service cards (800×600 recommended)"
            />
            <ImageUpload
              label="Hero Image"
              value={formData.hero_image_url}
              onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
              folder="services"
              helpText="Full-width banner (1920×600 recommended)"
            />
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={formData.accent_color}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={formData.accent_color}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="#005f5f"
              />
            </div>
          </div>

          {/* Visibility */}
          <VisibilitySelect
            value={formData.visibility_status}
            onChange={(v) => setFormData({ ...formData, visibility_status: v as any })}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Service"
        message="Are you sure you want to delete this service? This will also delete all subservices, categories, and products under it. This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
};
