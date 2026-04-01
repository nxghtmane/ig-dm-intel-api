import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from './src/lib/supabase';

export async function middleware(request: NextRequest) {
  // Only apply to the API routes
  if (!request.nextUrl.pathname.startsWith('/api/v1/')) {
    return NextResponse.next();
  }

  const apiKey = request.headers.get('x-api-key');

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 });
  }

  // Verify the key in Supabase
  const { data: keyData, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, requests_used, requests_limit')
    .eq('key', apiKey)
    .single();

  if (error || !keyData) {
    return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
  }

  if (keyData.requests_used >= keyData.requests_limit) {
    return NextResponse.json({ error: 'Usage Limit Exceeded' }, { status: 429 });
  }

  // Increment usage count 
  await supabaseAdmin
    .from('api_keys')
    .update({ requests_used: keyData.requests_used + 1 })
    .eq('id', keyData.id);

  // Log the specific request
  await supabaseAdmin
    .from('usage_logs')
    .insert({ api_key_id: keyData.id, endpoint: request.nextUrl.pathname });

  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};
