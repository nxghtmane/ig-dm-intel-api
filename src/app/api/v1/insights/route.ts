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
    const { bio_text, profile_url } = await request.json();

    if (!bio_text && !profile_url) {
      return NextResponse.json({ error: 'Missing bio_text or profile_url' }, { status: 400, headers: corsHeaders });
    }

    // Logic to detect niche based on bio_text
    const isAgency = bio_text?.toLowerCase().includes('agency');
    const isCoach = bio_text?.toLowerCase().includes('coach');
    const leadType = isAgency ? 'Agency Owner' : (isCoach ? 'High-Ticket Coach' : 'Enterprise Decision Maker');

    return NextResponse.json({
      lead_type: leadType,
      estimated_revenue: isAgency ? '7-figure' : '6-figure',
      consultant_tag: 'High-Value Lead',
      industry_specific_tagging: 'Scaling / SaaS / Consulting',
      recommendation: "Focus on operational scalability as the primary pain point."
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 500, headers: corsHeaders });
  }
}
