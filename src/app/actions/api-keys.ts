'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { sendApiKeyEmail } from '@/lib/email';

export async function generateApiKeyAction(email: string) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase client not initialized. Check environment variables.');
      return { success: false, error: 'Database connection not configured.' };
    }

    // 1. Check if user already exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('api_keys')
      .select('key, requests_limit')
      .eq('email', email)
      .single();

    if (existing && !fetchError) {
      // 2. Already exists - Re-send their current key!
      console.log(`Email exists for ${email}. Re-sending key.`);
      const emailResult = await sendApiKeyEmail(email, existing.key, 'Starter', existing.requests_limit);
      console.log('RE-SEND_EMAIL_RESULT:', JSON.stringify(emailResult, null, 2));
      return { 
        success: true, 
        key: existing.key, 
        isExisting: true,
        message: 'You already have a key! We have re-sent it to your inbox.' 
      };
    }

    // 3. New user - Generate a random key
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Insert into api_keys table using supabaseAdmin (which has service_role)
    const { error: insertError } = await supabaseAdmin.from('api_keys').insert([
      { 
        email: email, 
        key: newKey,
        requests_limit: 100 // Default for Starter
      }
    ]);

    if (insertError) {
      console.error('Database Error:', insertError.message);
      return { success: false, error: insertError.message };
    }

    // 4. Send the new key via email
    const emailResult = await sendApiKeyEmail(email, newKey, 'Starter', 100);
    console.log('NEW_KEY_EMAIL_RESULT:', JSON.stringify(emailResult, null, 2));

    return { success: true, key: newKey, isExisting: false };
  } catch (err: any) {
    console.error('Server Action Error:', err.message);
    return { success: false, error: 'Failed to generate key. Please try again.' };
  }
}

export async function getApiKeyByEmailAction(email: string) {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Database connection not configured.' };
    }

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
