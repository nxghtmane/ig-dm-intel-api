import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { profile_url, bio_text } = await request.json();

    if (!profile_url && !bio_text) {
      return NextResponse.json({ error: 'Missing profile_url or bio_text' }, { status: 400, headers: corsHeaders });
    }

    const leadScore = Math.floor(Math.random() * 50) + 50; // 50-100

    return NextResponse.json({
      lead_score: leadScore,
      follower_quality: leadScore > 80 ? 'high' : 'medium',
      content_sentiment: 'positive',
      avatar_status: leadScore > 90 ? 'Ideal Avatar' : 'General Prospect',
      detected_niche: 'High-Ticket Scaling',
      analysis_summary: "Strong bio with consistent scaling mentions. Follower base is predominantly entrepreneurs."
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 500, headers: corsHeaders });
  }
}
