import { createContext, useContext, useState, useCallback } from 'react';

const KEY = 'outlier_wl_v1';
const WatchlistCtx = createContext(null);

export function WatchlistProvider({ children }) {
  const [list, setList] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  });

  const toggle = useCallback(item => {
    setList(prev => {
      const next = prev.some(p => p.id === item.id)
        ? prev.filter(p => p.id !== item.id)
        : [{ ...item, savedAt: Date.now() }, ...prev].slice(0, 60);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const has = useCallback(id => list.some(p => p.id === id), [list]);

  return (
    <WatchlistCtx.Provider value={{ list, toggle, has, count: list.length }}>
      {children}
    </WatchlistCtx.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistCtx);
