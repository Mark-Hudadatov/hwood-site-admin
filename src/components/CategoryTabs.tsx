import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProductCategory } from '../domain/types';

interface CategoryTabsProps {
  categories: ProductCategory[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeTab, setActiveTab }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft]   = useState(false);
  const [showRight, setShowRight] = useState(true);
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith('he') || document.documentElement.dir === 'rtl';

  const [isDragging, setIsDragging]   = useState(false);
  const [startX, setStartX]           = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasDragged, setHasDragged]   = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const hasOverflow = scrollWidth > clientWidth + 10;
    setShowLeft(hasOverflow);
    setShowRight(hasOverflow);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories, checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX);
    setScrollStart(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    scrollRef.current.scrollLeft = scrollStart - dx;
    if (Math.abs(dx) > 5) setHasDragged(true);
  };
  const handleMouseUp    = () => { setIsDragging(false); if (scrollRef.current) scrollRef.current.style.cursor = 'grab'; };
  const handleMouseLeave = () => { setIsDragging(false); if (scrollRef.current) scrollRef.current.style.cursor = 'grab'; };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.touches[0].pageX);
    setScrollStart(scrollRef.current.scrollLeft);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.touches[0].pageX - startX;
    scrollRef.current.scrollLeft = scrollStart - dx;
    if (Math.abs(dx) > 5) setHasDragged(true);
  };
  const handleTouchEnd = () => setIsDragging(false);

  if (categories.length === 0) return null;

  const LeftIcon  = isRTL ? ChevronRight : ChevronLeft;
  const RightIcon = isRTL ? ChevronLeft  : ChevronRight;
  const arrowBase = 'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200';
  const arrowOn   = 'bg-white/20 hover:bg-white/40 text-white cursor-pointer';
  const arrowOff  = 'bg-white/10 text-white/30 cursor-not-allowed';

  return (
    <div>
      {(showLeft || showRight) && (
        <div className="flex justify-end gap-2 mb-2">
          <button onClick={() => scroll('left')}  disabled={!showLeft}  className={`${arrowBase} ${showLeft  ? arrowOn : arrowOff}`}><LeftIcon  className="w-5 h-5" /></button>
          <button onClick={() => scroll('right')} disabled={!showRight} className={`${arrowBase} ${showRight ? arrowOn : arrowOff}`}><RightIcon className="w-5 h-5" /></button>
        </div>
      )}

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex flex-row gap-3 md:gap-4 overflow-x-auto no-scrollbar items-end -mb-px scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { if (!hasDragged) setActiveTab(cat.id); }}
            className={`group text-left px-5 md:px-8 py-4 md:py-6 rounded-t-2xl min-w-[180px] md:min-w-[260px] flex-shrink-0 transition-all duration-200 relative ${
              activeTab === cat.id
                ? 'bg-neutral-50 shadow-lg text-black z-10'
                : 'bg-white/10 hover:bg-white/20 text-white z-0'
            }`}
          >
            <h3 className={`text-base md:text-xl font-medium mb-1 ${activeTab === cat.id ? 'text-black' : 'text-white'}`}>
              {cat.title}
            </h3>
            <p className={`text-xs md:text-sm leading-snug line-clamp-2 ${activeTab === cat.id ? 'text-neutral-600' : 'text-white/70'}`}>
              {cat.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
