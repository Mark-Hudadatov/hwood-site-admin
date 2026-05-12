import React, { useState } from 'react';
import type { Product } from '../domain/types';

const FALLBACK = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none"><rect width="600" height="600" fill="#1a1a1a"/><g transform="translate(260, 260)" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.4"><rect x="0" y="5" width="80" height="12" rx="2"/><rect x="0" y="22" width="80" height="12" rx="2"/><rect x="0" y="39" width="80" height="12" rx="2"/><rect x="0" y="56" width="80" height="12" rx="2"/></g></svg>`)}`;

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [imgError, setImgError]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const src = imgError || !product.imageUrl ? FALLBACK : product.imageUrl;

  return (
    <div
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-full aspect-square bg-neutral-100 overflow-hidden relative">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-brand rounded-full animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt={product.title}
          className={`w-full h-full object-cover p-4 transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-medium text-neutral-900 mb-1 group-hover:text-brand transition-colors">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="text-sm text-neutral-500">{product.subtitle}</p>
        )}
      </div>
    </div>
  );
};
