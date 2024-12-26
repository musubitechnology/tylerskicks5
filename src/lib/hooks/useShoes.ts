import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Shoe } from '../types';

export function useShoes(refreshTrigger: number) {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShoes() {
      setLoading(true);
      const { data, error } = await supabase
        .from('shoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shoes:', error);
        return;
      }

      setShoes(data || []);
      setLoading(false);
    }

    fetchShoes();
  }, [refreshTrigger]);

  return { shoes, loading };
}