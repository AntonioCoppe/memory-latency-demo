import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'latencyStats';

/**
 * Maintains click counts per memory level in state,
 * initializes from localStorage, and writes back on updates.
 */
export function useLatencyStats(levels: string[]) {
  const [stats, setStats] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore parse errors */
    }
    // fallback: 0 for each level
    return Object.fromEntries(levels.map(l => [l, 0]));
  });

  // write to localStorage whenever stats change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      /* ignore quota errors */
    }
  }, [stats]);

  // increment handler
  const increment = useCallback((level: string) => {
    setStats(prev => ({ ...prev, [level]: (prev[level] || 0) + 1 }));
  }, []);

  return [stats, increment] as const;
}
