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
    const { message_text } = await request.json();

    if (!message_text) {
      return NextResponse.json({ error: 'Missing message_text' }, { status: 400, headers: corsHeaders });
    }

    // Mock Intent Detection Logic
    // In a real app, this would call an LLM with specific appointment setting prompts
    const intentScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const urgency = intentScore > 85 ? 'high' : 'medium';

    return NextResponse.json({
      intent_score: intentScore,
      urgency: urgency,
      budget_signals: intentScore > 75 ? 'detected' : 'neutral',
      technical_sophistication: 'advanced',
      recommended_response: "I've reviewed your current situation, and it sounds like we could really help. Are you free for a quick 15-minute sync this Tuesday?",
      lead_status: "Hot"
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 500, headers: corsHeaders });
  }
}
