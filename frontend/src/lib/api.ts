const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ── Shared types ──────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image_url: string;
  eta_min: number;
  category: string;
  reason?: string;
};

export type SSEEvent =
  | { type: 'text'; delta: string }
  | { type: 'products'; products: Product[] }
  | { type: 'done' }
  | { type: 'error'; error: string };

export type Recommendations = {
  time_context: string;
  now_suggestions: Product[];
  reorder_nudges: Product[];
  trending: Product[];
};

export type Order = {
  order_id: string;
  status: string;
  estimated_delivery: string;
  eta_minutes: number;
  total_amount: number;
};

// ── API calls ─────────────────────────────────────────────────────────────────

export async function getRecommendations(userId?: string): Promise<Recommendations> {
  const params = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${API_BASE}/api/v1/recommendations${params}`);
  if (!res.ok) throw new Error(`Recommendations fetch failed: ${res.status}`);
  return res.json();
}

export async function placeOrder(payload: {
  user_id: string;
  items: { product_id: string; quantity: number }[];
  delivery_address: string;
}): Promise<Order> {
  const res = await fetch(`${API_BASE}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Order failed: ${res.status}`);
  return res.json();
}

/**
 * Opens an SSE stream to the NowSpeak chat endpoint.
 * Returns the raw Response so callers can consume the ReadableStream.
 */
export function openChatStream(
  message: string,
  sessionId: string,
  userId?: string,
): Promise<Response> {
  return fetch(`${API_BASE}/api/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId, user_id: userId }),
  });
}
