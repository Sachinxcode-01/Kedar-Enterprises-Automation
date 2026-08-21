// Server-Side Sliding Window Rate Limiter & Brute-Force Abuse Prevention
// Protects authentication endpoints, webhooks, and sensitive administrative APIs

interface RateLimitRecord {
  timestamps: number[];
  failedAttempts?: number;
  lockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      const valid = record.timestamps.filter((t) => now - t < 900000); // 15 mins
      const isLocked = record.lockedUntil && record.lockedUntil > now;
      if (valid.length === 0 && !isLocked) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, { ...record, timestamps: valid });
      }
    });
  }, 300000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  isLocked?: boolean;
}

/**
 * Standard sliding window rate limit check.
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Check if currently locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const reset = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
      isLocked: true,
    };
  }

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
  rateLimitStore.set(identifier, { ...record, timestamps: recentTimestamps });

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - recentTimestamps.length),
    reset: Math.ceil(windowMs / 1000),
  };
}

/**
 * Brute force tracker for failed login attempts with progressive delay and temporary lockouts.
 */
export function registerAuthAttempt(
  identifier: string,
  success: boolean
): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(`auth_${identifier}`) || {
    timestamps: [],
    failedAttempts: 0,
  };

  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      allowed: false,
      waitSeconds: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  if (success) {
    // Reset failed counter on successful authentication
    rateLimitStore.delete(`auth_${identifier}`);
    return { allowed: true };
  }

  const failedAttempts = (record.failedAttempts || 0) + 1;

  // Progressive penalties:
  // >= 10 failed attempts -> 15-minute temporary lockout
  // >= 5 failed attempts -> 30-second delay
  if (failedAttempts >= 10) {
    const lockDuration = 15 * 60 * 1000; // 15 mins
    rateLimitStore.set(`auth_${identifier}`, {
      ...record,
      failedAttempts,
      lockedUntil: now + lockDuration,
    });
    return { allowed: false, waitSeconds: 900 };
  } else if (failedAttempts >= 5) {
    const delayDuration = 30 * 1000; // 30s
    rateLimitStore.set(`auth_${identifier}`, {
      ...record,
      failedAttempts,
      lockedUntil: now + delayDuration,
    });
    return { allowed: false, waitSeconds: 30 };
  }

  rateLimitStore.set(`auth_${identifier}`, {
    ...record,
    failedAttempts,
  });

  return { allowed: true };
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
