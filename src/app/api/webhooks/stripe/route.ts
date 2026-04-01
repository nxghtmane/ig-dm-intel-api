import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24-preview' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      console.warn('Webhook secret missing. Verification skipped for testing.');
      event = JSON.parse(body); // Only if you are testing locally without whsec
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userEmail = session.metadata?.email;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    if (userEmail && priceId) {
      // Logic for upgrading tiers
      let newLimit = 100; // Default
      if (priceId === process.env.STRIPE_PRICE_GROWTH) newLimit = 10000;
      if (priceId === process.env.STRIPE_PRICE_BUSINESS) newLimit = 25000;

      console.log(`Upgrading ${userEmail} to ${newLimit} requests.`);

      const { error } = await supabaseAdmin
        .from('api_keys')
        .update({ requests_limit: newLimit })
        .eq('email', userEmail);

      if (error) {
        console.error('Supabase Error:', error.message);
      }
    }
  }

  return NextResponse.json({ received: true });
}
