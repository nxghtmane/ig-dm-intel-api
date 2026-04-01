import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  let browser;
  try {
    const body = await request.json();
    const targetUrl = body.url;

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400, headers: corsHeaders });
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    await browser.close();

    return new NextResponse(screenshotBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Content-Length': screenshotBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Screenshot render error:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json({ error: 'Render failure' }, { status: 500, headers: corsHeaders });
  }
}
