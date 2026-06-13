'use client';

import { Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

interface Props {
  nowSuggestions: Product[];
  reorderNudges: Product[];
  trending: Product[];
  timeContext: string;
  onProductSelect: (product: Product) => void;
}

const GREETINGS: Record<string, string> = {
  morning:   "☀️ Good morning! Here's what you might need",
  midday:    "🍽️ Lunch time — running low on anything?",
  afternoon: "☕ Afternoon pick-me-up time",
  evening:   "🌆 Good evening! Evening essentials",
  night:     "🌙 Late night? We've got you",
};

export function RecommendationFeed({
  nowSuggestions,
  reorderNudges,
  trending,
  timeContext,
  onProductSelect,
}: Props) {
  const greeting = GREETINGS[timeContext] ?? '✨ What you need right now';

  return (
    <div className="space-y-6">
      {nowSuggestions.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-3">
            {greeting}
          </h2>
          <div className="px-4 grid grid-cols-2 gap-3">
            {nowSuggestions.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onProductSelect} />
            ))}
          </div>
        </section>
      )}

      {reorderNudges.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-3">
            🔁 Order Again
          </h2>
          <div className="px-4 space-y-2">
            {reorderNudges.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onProductSelect} compact />
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-3">
            🔥 Trending Near You
          </h2>
          <div className="px-4 grid grid-cols-2 gap-3">
            {trending.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onProductSelect} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
