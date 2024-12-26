import { supabase } from './supabase';
import { addHistoryEntry } from './history';

export async function markShoeAsWorn(shoeId: string) {
  const now = new Date().toISOString();
  
  // First get the current wear count
  const { data: shoe } = await supabase
    .from('shoes')
    .select('wear_count')
    .eq('id', shoeId)
    .single();

  // Then increment it and update last worn
  const { error } = await supabase
    .from('shoes')
    .update({
      last_worn: now,
      wear_count: (shoe?.wear_count || 0) + 1,
      updated_at: now,
    })
    .eq('id', shoeId);

  if (error) throw error;

  // Add history entry
  await addHistoryEntry(shoeId, 'worn', now);
}

export async function markShoeMaintained(shoeId: string) {
  const now = new Date().toISOString();
  
  // Update last cleaned
  const { error } = await supabase
    .from('shoes')
    .update({
      last_cleaned: now,
      updated_at: now,
    })
    .eq('id', shoeId);

  if (error) throw error;

  // Add history entry
  await addHistoryEntry(shoeId, 'cleaned', now);
}