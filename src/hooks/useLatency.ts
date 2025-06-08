import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'latencyStats';

export function useLatencyStats(levels: string[]) {
  const [stats, setStats] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return Object.fromEntries(levels.map(l => [l, 0]));
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch { /* ignore */ }
  }, [stats]);

  const increment = useCallback((level: string) => {
    setStats(prev => ({ ...prev, [level]: (prev[level] || 0) + 1 }));
  }, []);

  const reset = useCallback(() => {
    const zeroed = Object.fromEntries(levels.map(l => [l, 0]));
    setStats(zeroed);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, [levels]);

  return [stats, increment, reset] as const;
}
