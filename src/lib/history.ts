import { supabase } from './supabase';
import type { ShoeHistoryEntry } from './types';

export async function getShoeHistory(shoeId: string): Promise<ShoeHistoryEntry[]> {
  const { data, error } = await supabase
    .from('shoe_history')
    .select('*')
    .eq('shoe_id', shoeId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteHistoryEntry(entryId: string) {
  const { error } = await supabase
    .from('shoe_history')
    .delete()
    .eq('id', entryId);

  if (error) throw error;
}

export async function updateHistoryEntry(entryId: string, timestamp: string) {
  const { error } = await supabase
    .from('shoe_history')
    .update({ timestamp })
    .eq('id', entryId);

  if (error) throw error;
}

export async function addHistoryEntry(shoeId: string, type: 'worn' | 'cleaned', timestamp: string) {
  const { error } = await supabase
    .from('shoe_history')
    .insert([{ shoe_id: shoeId, type, timestamp }]);

  if (error) throw error;
}