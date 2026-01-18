/**
 * ADMIN CONFIGURATION LIBRARY
 * ============================
 * Manage global configuration option types and their values.
 * These options can then be enabled/disabled per subservice and product.
 */

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, ChevronDown, ChevronRight, Palette, Settings } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { Modal, ConfirmDialog, BilingualInput } from '../components';

// Types
interface ConfigOptionType {
  id: string;
  slug: string;
  name_en: string;
  name_he?: string;
  description_en?: string;
  description_he?: string;
  input_type: 'button_group' | 'color_picker' | 'dropdown' | 'checkbox_group';
  unit?: string;
  sort_order: number;
  is_active: boolean;
  values?: ConfigOptionValue[];
}

interface ConfigOptionValue {
  id: string;
  option_type_id: string;
  slug: string;
  label_en: string;
  label_he?: string;
  value: string;
  color_hex?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export const AdminConfigLibrary: React.FC = () => {
  const [optionTypes, setOptionTypes] = useState<ConfigOptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  
  // Modal states
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ConfigOptionType | null>(null);
  const [editingValue, setEditingValue] = useState<ConfigOptionValue | null>(null);
  const [parentTypeId, setParentTypeId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'type' | 'value'; id: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Type form data
  const [typeFormData, setTypeFormData] = useState({
    slug: '',
    name_en: '',
    name_he: '',
    description_en: '',
    description_he: '',
    input_type: 'button_group' as ConfigOptionType['input_type'],
    unit: '',
    is_active: true,
  });

  // Value form data
  const [valueFormData, setValueFormData] = useState({
    slug: '',
    label_en: '',
    label_he: '',
    value: '',
    color_hex: '',
    image_url: '',
    is_active: true,
  });

  // Load data
  const loadData = async () => {
    try {
      // Get all option types
      const { data: types, error: typesError } = await supabase
        .from('config_option_types')
        .select('*')
        .order('sort_order', { ascending: true });

      if (typesError) throw typesError;

      // Get all values
      const { data: values, error: valuesError } = await supabase
        .from('config_option_values')
        .select('*')
        .order('sort_order', { ascending: true });

      if (valuesError) throw valuesError;

      // Combine types with their values
      const typesWithValues = (types || []).map(type => ({
        ...type,
        values: (values || []).filter(v => v.option_type_id === type.id),
      }));

      setOptionTypes(typesWithValues);
    } catch (error) {
      console.error('Failed to load config options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open modals
  const openNewTypeModal = () => {
    setEditingType(null);
    setTypeFormData({
      slug: '',
      name_en: '',
      name_he: '',
      description_en: '',
      description_he: '',
      input_type: 'button_group',
      unit: '',
      is_active: true,
    });
    setIsTypeModalOpen(true);
  };

  const openEditTypeModal = (type: ConfigOptionType) => {
    setEditingType(type);
    setTypeFormData({
      slug: type.slug,
      name_en: type.name_en,
      name_he: type.name_he || '',
      description_en: type.description_en || '',
      description_he: type.description_he || '',
      input_type: type.input_type,
      unit: type.unit || '',
      is_active: type.is_active,
    });
    setIsTypeModalOpen(true);
  };

  const openNewValueModal = (typeId: string) => {
    setParentTypeId(typeId);
    setEditingValue(null);
    setValueFormData({
      slug: '',
      label_en: '',
      label_he: '',
      value: '',
      color_hex: '',
      image_url: '',
      is_active: true,
    });
    setIsValueModalOpen(true);
  };

  const openEditValueModal = (value: ConfigOptionValue) => {
    setParentTypeId(value.option_type_id);
    setEditingValue(value);
    setValueFormData({
      slug: value.slug,
      label_en: value.label_en,
      label_he: value.label_he || '',
      value: value.value,
      color_hex: value.color_hex || '',
      image_url: value.image_url || '',
      is_active: value.is_active,
    });
    setIsValueModalOpen(true);
  };

  // Save type
  const handleSaveType = async () => {
    if (!typeFormData.name_en || !typeFormData.slug) {
      alert('Name (EN) and Slug are required');
      return;
    }

    setSaving(true);
    try {
      if (editingType) {
        const { error } = await supabase
          .from('config_option_types')
          .update({
            slug: typeFormData.slug,
            name_en: typeFormData.name_en,
            name_he: typeFormData.name_he || null,
            description_en: typeFormData.description_en || null,
            description_he: typeFormData.description_he || null,
            input_type: typeFormData.input_type,
            unit: typeFormData.unit || null,
            is_active: typeFormData.is_active,
          })
          .eq('id', editingType.id);

        if (error) throw error;
      } else {
        const maxOrder = Math.max(0, ...optionTypes.map(t => t.sort_order));
        const { error } = await supabase
          .from('config_option_types')
          .insert({
            slug: typeFormData.slug,
            name_en: typeFormData.name_en,
            name_he: typeFormData.name_he || null,
            description_en: typeFormData.description_en || null,
            description_he: typeFormData.description_he || null,
            input_type: typeFormData.input_type,
            unit: typeFormData.unit || null,
            is_active: typeFormData.is_active,
            sort_order: maxOrder + 1,
          });

        if (error) throw error;
      }

      await loadData();
      setIsTypeModalOpen(false);
    } catch (error) {
      console.error('Failed to save option type:', error);
      alert('Failed to save option type');
    } finally {
      setSaving(false);
    }
  };

  // Save value
  const handleSaveValue = async () => {
    if (!valueFormData.label_en || !valueFormData.slug || !parentTypeId) {
      alert('Label (EN) and Slug are required');
      return;
    }

    setSaving(true);
    try {
      const parentType = optionTypes.find(t => t.id === parentTypeId);
      const existingValues = parentType?.values || [];

      if (editingValue) {
        const { error } = await supabase
          .from('config_option_values')
          .update({
            slug: valueFormData.slug,
            label_en: valueFormData.label_en,
            label_he: valueFormData.label_he || null,
            value: valueFormData.value || valueFormData.slug,
            color_hex: valueFormData.color_hex || null,
            image_url: valueFormData.image_url || null,
            is_active: valueFormData.is_active,
          })
          .eq('id', editingValue.id);

        if (error) throw error;
      } else {
        const maxOrder = Math.max(0, ...existingValues.map(v => v.sort_order));
        const { error } = await supabase
          .from('config_option_values')
          .insert({
            option_type_id: parentTypeId,
            slug: valueFormData.slug,
            label_en: valueFormData.label_en,
            label_he: valueFormData.label_he || null,
            value: valueFormData.value || valueFormData.slug,
            color_hex: valueFormData.color_hex || null,
            image_url: valueFormData.image_url || null,
            is_active: valueFormData.is_active,
            sort_order: maxOrder + 1,
          });

        if (error) throw error;
      }

      await loadData();
      setIsValueModalOpen(false);
    } catch (error) {
      console.error('Failed to save option value:', error);
      alert('Failed to save option value');
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === 'type') {
        const { error } = await supabase
          .from('config_option_types')
          .delete()
          .eq('id', deleteConfirm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('config_option_values')
          .delete()
          .eq('id', deleteConfirm.id);
        if (error) throw error;
      }

      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete');
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  const getInputTypeIcon = (type: string) => {
    switch (type) {
      case 'color_picker':
        return <Palette className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration Library</h1>
          <p className="text-gray-500 mt-1">
            Manage global configuration options that can be enabled for different products.
          </p>
        </div>
        <button
          onClick={openNewTypeModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#005f5f] text-white rounded-lg hover:bg-[#004d4d] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Option Type
        </button>
      </div>

      {/* Option Types List */}
      <div className="space-y-4">
        {optionTypes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No configuration options defined yet.</p>
            <button
              onClick={openNewTypeModal}
              className="text-[#005f5f] font-medium hover:underline"
            >
              Create your first option type
            </button>
          </div>
        ) : (
          optionTypes.map((type) => (
            <div key={type.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Type Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedType(expandedType === type.id ? null : type.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedType === type.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  
                  <div className={`p-2 rounded-lg ${type.input_type === 'color_picker' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {getInputTypeIcon(type.input_type)}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {type.name_en}
                      {!type.is_active && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {type.input_type} {type.unit && `• ${type.unit}`} • {type.values?.length || 0} values
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEditTypeModal(type)}
                    className="p-2 text-gray-500 hover:text-[#005f5f] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'type', id: type.id })}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Values (expanded) */}
              {expandedType === type.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Values</h4>
                    <button
                      onClick={() => openNewValueModal(type.id)}
                      className="text-sm text-[#005f5f] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Value
                    </button>
                  </div>

                  {type.values && type.values.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {type.values.map((value) => (
                        <div
                          key={value.id}
                          className={`
                            flex items-center justify-between p-3 bg-white rounded-lg border
                            ${value.is_active ? 'border-gray-200' : 'border-gray-200 opacity-50'}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {value.color_hex && (
                              <span
                                className="w-5 h-5 rounded-full border border-gray-300"
                                style={{ backgroundColor: value.color_hex }}
                              />
                            )}
                            <span className="text-sm font-medium text-gray-800">
                              {value.label_en}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditValueModal(value)}
                              className="p-1 text-gray-400 hover:text-[#005f5f] transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'value', id: value.id })}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No values yet. Add some values to this option type.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Type Modal */}
      <Modal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        title={editingType ? 'Edit Option Type' : 'New Option Type'}
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveType(); }} className="space-y-6">
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={typeFormData.slug}
                onChange={(e) => setTypeFormData({ ...typeFormData, slug: e.target.value })}
                placeholder="option_slug"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setTypeFormData({ ...typeFormData, slug: generateSlug(typeFormData.name_en) })}
                className="px-4 py-2 text-sm text-[#005f5f] border border-[#005f5f] rounded-lg hover:bg-[#005f5f]/10"
              >
                Generate
              </button>
            </div>
          </div>

          <BilingualInput
            label="Name"
            nameEn="name_en"
            nameHe="name_he"
            valueEn={typeFormData.name_en}
            valueHe={typeFormData.name_he}
            onChangeEn={(v) => setTypeFormData({ ...typeFormData, name_en: v })}
            onChangeHe={(v) => setTypeFormData({ ...typeFormData, name_he: v })}
            required
            placeholder="e.g., Module Width"
          />

          <BilingualInput
            label="Description"
            nameEn="description_en"
            nameHe="description_he"
            valueEn={typeFormData.description_en}
            valueHe={typeFormData.description_he}
            onChangeEn={(v) => setTypeFormData({ ...typeFormData, description_en: v })}
            onChangeHe={(v) => setTypeFormData({ ...typeFormData, description_he: v })}
            type="textarea"
            placeholder="Help text for this option"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Input Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Type
              </label>
              <select
                value={typeFormData.input_type}
                onChange={(e) => setTypeFormData({ ...typeFormData, input_type: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              >
                <option value="button_group">Button Group</option>
                <option value="color_picker">Color Picker</option>
                <option value="dropdown">Dropdown</option>
                <option value="checkbox_group">Checkbox Group</option>
              </select>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit (optional)
              </label>
              <input
                type="text"
                value={typeFormData.unit}
                onChange={(e) => setTypeFormData({ ...typeFormData, unit: e.target.value })}
                placeholder="e.g., cm, mm, kg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="type_active"
              checked={typeFormData.is_active}
              onChange={(e) => setTypeFormData({ ...typeFormData, is_active: e.target.checked })}
              className="w-4 h-4 text-[#005f5f] rounded"
            />
            <label htmlFor="type_active" className="text-sm text-gray-700">
              Active (visible in configurator)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsTypeModalOpen(false)}
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
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Value Modal */}
      <Modal
        isOpen={isValueModalOpen}
        onClose={() => setIsValueModalOpen(false)}
        title={editingValue ? 'Edit Value' : 'New Value'}
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveValue(); }} className="space-y-6">
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={valueFormData.slug}
                onChange={(e) => setValueFormData({ ...valueFormData, slug: e.target.value })}
                placeholder="value_slug"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setValueFormData({ ...valueFormData, slug: generateSlug(valueFormData.label_en) })}
                className="px-4 py-2 text-sm text-[#005f5f] border border-[#005f5f] rounded-lg hover:bg-[#005f5f]/10"
              >
                Generate
              </button>
            </div>
          </div>

          <BilingualInput
            label="Label"
            nameEn="label_en"
            nameHe="label_he"
            valueEn={valueFormData.label_en}
            valueHe={valueFormData.label_he}
            onChangeEn={(v) => setValueFormData({ ...valueFormData, label_en: v })}
            onChangeHe={(v) => setValueFormData({ ...valueFormData, label_he: v })}
            required
            placeholder="e.g., 60 cm, White"
          />

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="text"
              value={valueFormData.value}
              onChange={(e) => setValueFormData({ ...valueFormData, value: e.target.value })}
              placeholder="e.g., 60, white, soft_close"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              The actual value stored. If empty, slug will be used.
            </p>
          </div>

          {/* Color Hex */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color (for color picker)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={valueFormData.color_hex || '#000000'}
                onChange={(e) => setValueFormData({ ...valueFormData, color_hex: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={valueFormData.color_hex}
                onChange={(e) => setValueFormData({ ...valueFormData, color_hex: e.target.value })}
                placeholder="#FFFFFF"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none"
              />
              {valueFormData.color_hex && (
                <button
                  type="button"
                  onClick={() => setValueFormData({ ...valueFormData, color_hex: '' })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="value_active"
              checked={valueFormData.is_active}
              onChange={(e) => setValueFormData({ ...valueFormData, is_active: e.target.checked })}
              className="w-4 h-4 text-[#005f5f] rounded"
            />
            <label htmlFor="value_active" className="text-sm text-gray-700">
              Active (available for selection)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsValueModalOpen(false)}
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
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title={deleteConfirm?.type === 'type' ? 'Delete Option Type' : 'Delete Value'}
        message={
          deleteConfirm?.type === 'type'
            ? 'This will also delete all values for this option type. Are you sure?'
            : 'Are you sure you want to delete this value?'
        }
        confirmText="Delete"
        danger
      />
    </div>
  );
};
