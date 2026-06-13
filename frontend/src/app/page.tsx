'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecommendations, Recommendations, Product } from '@/lib/api';
import { RecommendationFeed } from '@/components/RecommendationFeed';
import { SpeedCheckout, CartItem } from '@/components/SpeedCheckout';
import { Order } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [recs, setRecs] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    getRecommendations()
      .then(setRecs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-blue-600 text-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold text-lg tracking-tight">Amazon Now</span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">Express delivery · 30 min</p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setShowCheckout(true)}
              className="bg-white text-blue-600 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm"
            >
              🛒 {cart.length} · ₹{cart.reduce((s, i) => s + i.product.price * i.quantity, 0).toFixed(0)}
            </button>
          )}
        </div>
      </header>

      {/* ── NowSpeak CTA ──────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto">
        <div
          className="mx-4 mt-4 rounded-2xl p-4 text-white cursor-pointer active:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)' }}
          onClick={() => router.push('/nowspeak')}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎙️</span>
            </div>
            <div>
              <p className="font-bold text-base">NowSpeak™</p>
              <p className="text-sm text-blue-100">
                Say what you need — we'll find it in seconds
              </p>
            </div>
            <div className="ml-auto">
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommendations ───────────────────────────────────────────── */}
      <div className="mt-5 pb-24 max-w-lg mx-auto">
        {loading ? (
          <div className="px-4 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : recs ? (
          <RecommendationFeed
            nowSuggestions={recs.now_suggestions}
            reorderNudges={recs.reorder_nudges}
            trending={recs.trending}
            timeContext={recs.time_context}
            onProductSelect={addToCart}
          />
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-gray-400 text-sm">Couldn't load recommendations — is the backend running?</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block text-gray-600">
              cd backend && uvicorn app.main:app --reload
            </code>
          </div>
        )}
      </div>

      {/* ── Bottom Nav ────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 flex justify-around py-3 px-6 shadow-lg">
        <button className="flex flex-col items-center gap-0.5 text-blue-600">
          <span className="text-xl">🏠</span>
          <span className="text-xs font-semibold">Home</span>
        </button>
        <button
          onClick={() => router.push('/nowspeak')}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <span className="text-xl">🎙️</span>
          <span className="text-xs">NowSpeak</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400">
          <span className="text-xl">📦</span>
          <span className="text-xs">Orders</span>
        </button>
      </nav>

      {/* ── Speed Checkout Modal ──────────────────────────────────────── */}
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
