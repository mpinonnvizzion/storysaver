/**
 * Process-local TTL cache. Resets on cold start and isn't shared across
 * serverless instances/regions — fine for smoothing bursty repeat lookups,
 * not a source of truth. Swap for Vercel KV if cross-instance hits matter.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export const CACHE_TTL = {
  STORIES: 5 * 60 * 1000,
  PROFILE: 60 * 60 * 1000,
  REELS: 5 * 60 * 1000,
  MEDIA: 5 * 60 * 1000,
} as const;

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export async function getOrSetCached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== undefined) return cached;

  const value = await fetcher();
  setCached(key, value, ttlMs);
  return value;
}
