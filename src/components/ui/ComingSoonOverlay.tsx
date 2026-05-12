import React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ComingSoonOverlayProps {
  className?: string;
}

export const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const isHe = i18n.language?.startsWith('he');

  return (
    <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 ${className}`}>
      <Clock className="w-10 h-10 text-white mb-3" />
      <span className="text-white text-body-lg font-medium uppercase tracking-wider">
        {isHe ? 'בקרוב' : 'Coming Soon'}
      </span>
    </div>
  );
};
