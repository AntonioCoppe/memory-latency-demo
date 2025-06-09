import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'latencyStats';

export type LatencyEntry = {
  count: number;
  totalExpected: number;
  totalActual: number;
};

export type LatencyStats = Record<string, LatencyEntry>;

/**
 * Hook to track both expected and actual latency per memory level.
 * Returns [stats, recordLatency, reset]
 * - stats: mapping level → { count, totalExpected, totalActual }
 * - recordLatency: (level, expectedMs, actualMs) => void
 * - reset: () => void
 */
export function useLatencyStats(levels: string[]) {
  const [stats, setStats] = useState<LatencyStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as LatencyStats;
    } catch { /* ignore parse errors */ }
    // initialize zeroed stats
    return Object.fromEntries(
      levels.map(l => [l, { count: 0, totalExpected: 0, totalActual: 0 }])
    ) as LatencyStats;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch { /* ignore */ }
  }, [stats]);

  const recordLatency = useCallback((level: string, expectedMs: number, actualMs: number) => {
    setStats(prev => {
      const prevEntry = prev[level] || { count: 0, totalExpected: 0, totalActual: 0 };
      const updated: LatencyEntry = {
        count: prevEntry.count + 1,
        totalExpected: prevEntry.totalExpected + expectedMs,
        totalActual: prevEntry.totalActual + actualMs
      };
      return { ...prev, [level]: updated };
    });
  }, []);

  const reset = useCallback(() => {
    const zeroed = Object.fromEntries(
      levels.map(l => [l, { count: 0, totalExpected: 0, totalActual: 0 }])
    ) as LatencyStats;
    setStats(zeroed);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, [levels]);

  return [stats, recordLatency, reset] as const;
}
