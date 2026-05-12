import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ComingSoonOverlay } from './ui/ComingSoonOverlay';
import type { Subservice } from '../domain/types';

const FALLBACK = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none"><rect width="800" height="1000" fill="#1a1a1a"/><g transform="translate(360, 460)" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.4"><rect x="0" y="0" width="80" height="50" rx="3"/><rect x="8" y="12" width="20" height="30" rx="2"/><rect x="33" y="12" width="20" height="30" rx="2"/><rect x="58" y="15" width="15" height="20" rx="2"/></g></svg>`)}`;

interface SubserviceCardProps {
  subservice: Subservice & { visibilityStatus?: string };
  onClick: () => void;
}

export const SubserviceCard: React.FC<SubserviceCardProps> = ({ subservice, onClick }) => {
  const isComingSoon = subservice.visibilityStatus === 'coming_soon';
  const [imgSrc, setImgSrc] = useState(subservice.imageUrl || FALLBACK);

  return (
    <div
      className={`relative w-[280px] md:w-[300px] flex-shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-lg ${
        isComingSoon ? '' : 'group cursor-pointer'
      }`}
      onClick={isComingSoon ? undefined : onClick}
    >
      <img
        src={imgSrc}
        alt={subservice.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
          isComingSoon ? 'grayscale brightness-50' : 'group-hover:scale-105'
        }`}
        onError={() => setImgSrc(FALLBACK)}
      />

      {isComingSoon && <ComingSoonOverlay />}

      <div className={`absolute inset-0 transition-all duration-300 ${
        isComingSoon
          ? 'bg-black/20'
          : 'bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-brand/80 group-hover:via-brand/40'
      }`} />

      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
        <h3 className={`text-white text-h2 mb-2 transition-transform duration-300 ${
          isComingSoon ? '' : 'group-hover:-translate-y-1'
        }`}>
          {subservice.title}
        </h3>
        <p className="text-white/80 text-meta leading-relaxed line-clamp-2">
          {subservice.description}
        </p>
        {!isComingSoon && (
          <div className="flex items-center gap-2 mt-3 text-white/70 text-meta opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>View Products</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {!isComingSoon && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/80 transition-all duration-300 w-0 group-hover:w-full" />
      )}
    </div>
  );
};
