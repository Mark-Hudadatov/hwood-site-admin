/**
 * ADMIN SHARED COMPONENTS
 * ========================
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, GripVertical, Eye, EyeOff, Clock } from 'lucide-react';
import { uploadImage } from '../adminStore';

// ============================================================================
// BILINGUAL INPUT (EN/HE Tabs)
// ============================================================================

interface BilingualInputProps {
  label: string;
  nameEn: string;
  nameHe: string;
  valueEn: string;
  valueHe: string;
  onChangeEn: (value: string) => void;
  onChangeHe: (value: string) => void;
  type?: 'input' | 'textarea';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

export const BilingualInput: React.FC<BilingualInputProps> = ({
  label,
  valueEn,
  valueHe,
  onChangeEn,
  onChangeHe,
  type = 'input',
  required = false,
  placeholder,
  helpText,
}) => {
  const [activeTab, setActiveTab] = useState<'en' | 'he'>('en');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'en' 
                ? 'bg-white text-[#005f5f] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('he')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'he' 
                ? 'bg-white text-[#005f5f] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            HE
          </button>
        </div>
      </div>
      
      {type === 'textarea' ? (
        <textarea
          value={activeTab === 'en' ? valueEn : valueHe}
          onChange={(e) => activeTab === 'en' ? onChangeEn(e.target.value) : onChangeHe(e.target.value)}
          placeholder={placeholder}
          dir={activeTab === 'he' ? 'rtl' : 'ltr'}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={activeTab === 'en' ? valueEn : valueHe}
          onChange={(e) => activeTab === 'en' ? onChangeEn(e.target.value) : onChangeHe(e.target.value)}
          placeholder={placeholder}
          dir={activeTab === 'he' ? 'rtl' : 'ltr'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none transition-all"
        />
      )}
      
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

// ============================================================================
// VISIBILITY SELECT
// ============================================================================

interface VisibilitySelectProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'service' | 'product';
}

export const VisibilitySelect: React.FC<VisibilitySelectProps> = ({ 
  value, 
  onChange, 
  type = 'service' 
}) => {
  const options = type === 'product' 
    ? [
        { value: 'visible', label: 'Visible', icon: Eye, color: 'text-green-600' },
        { value: 'hidden', label: 'Hidden', icon: EyeOff, color: 'text-gray-500' },
        { value: 'not_in_stock', label: 'Not in Stock', icon: Clock, color: 'text-orange-500' },
      ]
    : [
        { value: 'visible', label: 'Visible', icon: Eye, color: 'text-green-600' },
        { value: 'hidden', label: 'Hidden', icon: EyeOff, color: 'text-gray-500' },
        { value: 'coming_soon', label: 'Coming Soon', icon: Clock, color: 'text-blue-500' },
      ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Visibility</label>
      <div className="flex gap-2">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                ${isActive 
                  ? 'border-[#005f5f] bg-[#005f5f]/10' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? option.color : 'text-gray-400'}`} />
              <span className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// IMAGE UPLOAD
// ============================================================================

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helpText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'general',
  label = 'Image',
  helpText = 'Max 5MB. JPG, PNG, WebP, or GIF.',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Use JPG, PNG, WebP, or GIF.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum 5MB.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [folder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${dragActive 
              ? 'border-[#005f5f] bg-[#005f5f]/5' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleChange}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005f5f] mb-2" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-gray-400">{helpText}</p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// FEATURES LIST EDITOR
// ============================================================================

interface FeaturesEditorProps {
  label: string;
  featuresEn: string[];
  featuresHe: string[];
  onChangeFeaturesEn: (features: string[]) => void;
  onChangeFeaturesHe: (features: string[]) => void;
}

export const FeaturesEditor: React.FC<FeaturesEditorProps> = ({
  label,
  featuresEn,
  featuresHe,
  onChangeFeaturesEn,
  onChangeFeaturesHe,
}) => {
  const [activeTab, setActiveTab] = useState<'en' | 'he'>('en');
  const features = activeTab === 'en' ? featuresEn : featuresHe;
  const setFeatures = activeTab === 'en' ? onChangeFeaturesEn : onChangeFeaturesHe;

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'en' 
                ? 'bg-white text-[#005f5f] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            EN ({featuresEn.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('he')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'he' 
                ? 'bg-white text-[#005f5f] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            HE ({featuresHe.length})
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              placeholder={`Feature ${index + 1}`}
              dir={activeTab === 'he' ? 'rtl' : 'ltr'}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="text-sm text-[#005f5f] hover:underline"
        >
          + Add Feature
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SPECIFICATIONS EDITOR
// ============================================================================

interface Specification {
  label: string;
  value: string;
  unit?: string;
}

interface SpecificationsEditorProps {
  specifications: Specification[];
  onChange: (specs: Specification[]) => void;
}

export const SpecificationsEditor: React.FC<SpecificationsEditorProps> = ({
  specifications,
  onChange,
}) => {
  const predefinedSpecs = [
    { label: 'Width', unit: 'cm' },
    { label: 'Height', unit: 'cm' },
    { label: 'Depth', unit: 'cm' },
    { label: 'Weight', unit: 'kg' },
    { label: 'Material', unit: '' },
    { label: 'Color', unit: '' },
    { label: 'Finish', unit: '' },
  ];

  const addSpec = (label: string, unit: string) => {
    if (specifications.find(s => s.label === label)) return;
    onChange([...specifications, { label, value: '', unit }]);
  };

  const updateSpec = (index: number, value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], value };
    onChange(newSpecs);
  };

  const removeSpec = (index: number) => {
    onChange(specifications.filter((_, i) => i !== index));
  };

  const availableSpecs = predefinedSpecs.filter(
    ps => !specifications.find(s => s.label === ps.label)
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Specifications</label>
      
      {/* Current specs */}
      <div className="space-y-2">
        {specifications.map((spec, index) => (
          <div key={spec.label} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-700 w-24">{spec.label}</span>
            <input
              type="text"
              value={spec.value}
              onChange={(e) => updateSpec(index, e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none text-sm"
            />
            {spec.unit && (
              <span className="text-sm text-gray-500 w-12">{spec.unit}</span>
            )}
            <button
              type="button"
              onClick={() => removeSpec(index)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add spec buttons */}
      {availableSpecs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Add:</span>
          {availableSpecs.map((spec) => (
            <button
              key={spec.label}
              type="button"
              onClick={() => addSpec(spec.label, spec.unit)}
              className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:border-[#005f5f] hover:text-[#005f5f] transition-colors"
            >
              + {spec.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SIMPLE RICH TEXT EDITOR
// ============================================================================

interface RichTextEditorProps {
  label: string;
  valueEn: string;
  valueHe: string;
  onChangeEn: (value: string) => void;
  onChangeHe: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  valueEn,
  valueHe,
  onChangeEn,
  onChangeHe,
}) => {
  const [activeTab, setActiveTab] = useState<'en' | 'he'>('en');
  const value = activeTab === 'en' ? valueEn : valueHe;
  const onChange = activeTab === 'en' ? onChangeEn : onChangeHe;

  const insertFormatting = (before: string, after: string) => {
    const textarea = document.getElementById('richtext-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'en' 
                ? 'bg-white text-[#005f5f] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('he')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'he' 
                ? 'bg-white text-[#005f5f] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            HE
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-1 p-2 bg-gray-50 rounded-t-lg border border-b-0 border-gray-300">
        <button
          type="button"
          onClick={() => insertFormatting('**', '**')}
          className="p-2 hover:bg-gray-200 rounded font-bold text-sm"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="p-2 hover:bg-gray-200 rounded italic text-sm"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('\n## ', '\n')}
          className="p-2 hover:bg-gray-200 rounded text-sm"
          title="Heading"
        >
          H
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('\n- ', '')}
          className="p-2 hover:bg-gray-200 rounded text-sm"
          title="List item"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('[', '](url)')}
          className="p-2 hover:bg-gray-200 rounded text-sm"
          title="Link"
        >
          🔗
        </button>
      </div>

      <textarea
        id="richtext-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={activeTab === 'he' ? 'rtl' : 'ltr'}
        rows={10}
        className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-[#005f5f] focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
        placeholder="Write your content here. Use **bold**, *italic*, ## Heading, - List items, [link](url)"
      />

      <p className="text-xs text-gray-500">
        Supports Markdown: **bold**, *italic*, ## Heading, - List items, [link](url)
      </p>
    </div>
  );
};

// ============================================================================
// SORTABLE LIST ITEM (for drag & drop)
// ============================================================================

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

// ============================================================================
// MODAL
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CONFIRM DIALOG
// ============================================================================

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              danger 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-[#005f5f] hover:bg-[#004d4d]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
