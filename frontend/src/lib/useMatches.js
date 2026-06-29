import { useState, useEffect, useCallback } from 'react';
import api from './api';

export function useMatches(league, date) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { league };
      if (date) params.date = date;
      const res = await api.get('/matches', { params });
      setMatches(res.data.matches || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [league, date]);

  useEffect(() => { load(); }, [load]);

  return { matches, loading, reload: load };
}
