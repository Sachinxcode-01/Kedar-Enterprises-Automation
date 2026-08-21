// Server-Side Sliding Window Rate Limiter
// Prevents request flooding, brute force, and abuse across API and Auth endpoints

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      const valid = record.timestamps.filter((t) => now - t < 60000);
      if (valid.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, { timestamps: valid });
      }
    });
  }, 300000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if an IP or identifier exceeds rate limits within a sliding window.
 * @param identifier IP or client key
 * @param limit Max requests allowed in the window (default: 60)
 * @param windowMs Window duration in milliseconds (default: 60000ms / 1 min)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitStore.get(identifier) || { timestamps: [] };
  const recentTimestamps = record.timestamps.filter((t) => t > windowStart);

  if (recentTimestamps.length >= limit) {
    const oldest = recentTimestamps[0];
    const resetTime = Math.ceil((oldest + windowMs - now) / 1000);

    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.max(resetTime, 1),
    };
  }

  recentTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: recentTimestamps });

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - recentTimestamps.length),
    reset: Math.ceil(windowMs / 1000),
  };
}

/**
 * Build standard rate limiting HTTP headers
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
    ...(result.success ? {} : { 'Retry-After': result.reset.toString() }),
  };
}
