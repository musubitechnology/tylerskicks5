import { supabase } from './supabase';
import toast from 'react-hot-toast';

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'tyler@example.com',
    password: '117'
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
    throw error;
  }
}