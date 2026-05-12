import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import type { ConfigOptionType } from '../../domain/types';

interface ConfiguratorOptionProps {
  option: ConfigOptionType;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const ConfiguratorOption: React.FC<ConfiguratorOptionProps> = ({
  option,
  selectedValue,
  onSelect,
}) => {
  const selectedLabel = option.values.find(v => v.slug === selectedValue)?.label || '';

  if (option.inputType === 'color_picker') {
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-meta font-medium text-neutral-900 uppercase tracking-wide">{option.name}</span>
          <span className="text-meta-sm text-neutral-400 capitalize">{selectedLabel}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {option.values.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v.slug)}
              className={`w-10 h-10 rounded-full ring-2 ring-offset-2 transition-all ${
                selectedValue === v.slug ? 'ring-brand' : 'ring-transparent hover:ring-neutral-200'
              }`}
              style={{ backgroundColor: v.colorHex || '#ccc' }}
              title={v.label}
            />
          ))}
        </div>
      </div>
    );
  }

  if (option.inputType === 'dropdown') {
    return (
      <div>
        <label className="block text-meta font-medium text-neutral-900 uppercase tracking-wide mb-2">
          {option.name}
        </label>
        <div className="relative">
          <select
            value={selectedValue}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full appearance-none px-4 py-3 pr-10 border border-neutral-200 rounded-lg text-body text-neutral-700 bg-white focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-all cursor-pointer"
          >
            {option.values.map((v) => (
              <option key={v.id} value={v.slug}>{v.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>
    );
  }

  if (option.inputType === 'checkbox_group') {
    return (
      <div>
        <span className="block text-meta font-medium text-neutral-900 uppercase tracking-wide mb-3">
          {option.name}
        </span>
        <div className="space-y-2">
          {option.values.map((v) => (
            <label key={v.id} className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={selectedValue === v.slug}
                onChange={() => onSelect(v.slug)}
                className="w-4 h-4 text-brand rounded border-neutral-300 focus:ring-brand"
              />
              <span className="text-body text-neutral-600">{v.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // button_group (default)
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-meta font-medium text-neutral-900 uppercase tracking-wide">{option.name}</span>
        {option.description && <Info className="w-4 h-4 text-neutral-300 cursor-pointer hover:text-brand" />}
      </div>
      <div className="flex flex-wrap gap-3">
        {option.values.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.slug)}
            className={`px-5 py-3 rounded-lg border text-meta font-medium transition-all ${
              selectedValue === v.slug
                ? 'border-brand bg-brand/5 text-brand'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
};
