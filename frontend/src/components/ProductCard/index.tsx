'use client';

import { Product } from '@/lib/api';

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  /** compact = horizontal layout, used in reorder nudges list */
  compact?: boolean;
}

export function ProductCard({ product, onAddToCart, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image_url} alt={product.name} className="w-12 h-12 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
          {product.reason && (
            <p className="text-xs text-blue-500 mt-0.5">{product.reason}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-gray-900 text-sm">₹{product.price}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {product.eta_min} min
            </span>
          </div>
        </div>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white text-xs px-3 py-2 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all flex-shrink-0"
          >
            Add
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="h-32 bg-gray-50 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url} alt={product.name} className="w-24 h-24 object-contain" />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-medium text-gray-900 leading-tight">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{product.unit}</p>
        {product.reason && (
          <p className="text-xs text-blue-500 mt-1">{product.reason}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900 text-sm">₹{product.price}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {product.eta_min} min
            </span>
          </div>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
