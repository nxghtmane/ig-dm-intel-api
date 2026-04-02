'use server';

import { supabaseAdmin } from '@/lib/supabase';

export async function generateApiKeyAction(email: string) {
  try {
    // Generate a random key
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Insert into api_keys table using supabaseAdmin (which has service_role)
    const { data, error } = await supabaseAdmin.from('api_keys').insert([
      { 
        email: email, 
        key: newKey,
        requests_limit: 100 // Default for Starter
      }
    ]).select();

    if (error) {
      console.error('Database Error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, key: newKey };
  } catch (err: any) {
    console.error('Server Action Error:', err.message);
    return { success: false, error: 'Failed to generate key. Please try again.' };
  }
}

export async function getApiKeyByEmailAction(email: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('key, requests_used, requests_limit')
      .eq('email', email)
      .single();

    if (error || !data) {
      return { success: false, error: 'Key not found' };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: 'Database error' };
  }
}
