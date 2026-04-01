import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  let browser = null;
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400, headers: corsHeaders });
    }

    // Determine executable path based on environment
    const isProd = process.env.NODE_ENV === 'production';
    
    // For Local, set a default Chrome path for Windows (most common for the user)
    // For Production, use the @sparticuz/chromium helper
    const executablePath = isProd 
      ? await chromium.executablePath() 
      : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

    browser = await puppeteer.launch({
      args: isProd ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 },
      executablePath: executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const screenshot = await page.screenshot({ type: 'png' });

    await browser.close();

    return new NextResponse(Buffer.from(screenshot), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Screenshot Error:', error);
    if (browser) await browser.close();
    return NextResponse.json({ error: 'Render failure or invalid request' }, { status: 500, headers: corsHeaders });
  }
}
