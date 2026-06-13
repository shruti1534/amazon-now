'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NowSpeak } from '@/components/NowSpeak';
import { SpeedCheckout, CartItem } from '@/components/SpeedCheckout';
import { Product, Order } from '@/lib/api';

export default function NowSpeakPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleOrderComplete = (_order: Order) => {
    setCart([]);
    setTimeout(() => setShowCheckout(false), 3200);
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="flex flex-col h-screen">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900 flex items-center gap-1.5 text-base">
            <span>🎙️</span> NowSpeak™
          </h1>
          <p className="text-xs text-gray-400">Voice + AI · 30-min delivery</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={() => setShowCheckout(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5"
          >
            🛒 {cart.length} · ₹{cartTotal.toFixed(0)}
          </button>
        )}
      </header>

      {/* ── NowSpeak Chat ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <NowSpeak onProductSelect={addToCart} />
      </div>

      {/* ── Speed Checkout Modal ─────────────────────────────────── */}
      {showCheckout && cart.length > 0 && (
        <SpeedCheckout
          cart={cart}
          onOrderComplete={handleOrderComplete}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
