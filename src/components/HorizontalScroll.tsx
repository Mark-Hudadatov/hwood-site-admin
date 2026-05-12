import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollProps {
  children: React.ReactNode;
  title: string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft]   = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

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
  }, [children]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });
  };

  const arrowBase = 'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300';
  const arrowActive = 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white cursor-pointer';
  const arrowDisabled = 'border-neutral-300 text-neutral-300 cursor-not-allowed';

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-neutral-900 text-h1 font-medium tracking-tight">{title}</h2>
        <div className="flex gap-3">
          <button onClick={() => scroll('left')}  disabled={!showLeft}  className={`${arrowBase} ${showLeft  ? arrowActive : arrowDisabled}`}><ChevronLeft  className="w-5 h-5" /></button>
          <button onClick={() => scroll('right')} disabled={!showRight} className={`${arrowBase} ${showRight ? arrowActive : arrowDisabled}`}><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
        <div className="w-4 flex-shrink-0" />
      </div>
    </div>
  );
};
