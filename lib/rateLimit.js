// Simple in-memory sliding-window rate limiter (per server instance).
// Not distributed-safe across multiple serverless instances, but stops
// basic single-source abuse/looping without adding external infra.
const buckets = new Map();

export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    const retryAfterMs = windowMs - (now - entry.start);
    return { ok: false, remaining: 0, retryAfterMs };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
