import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendApiKeyEmail } from '@/lib/email';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18' as any,
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    if (!webhookSecret || webhookSecret === 'whsec_placeholder') {
      console.warn('Webhook secret missing or placeholder. Verification skipped for testing.');
      event = JSON.parse(body);
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
      let tierName = 'Starter';
      if (priceId === process.env.STRIPE_PRICE_GROWTH) {
        newLimit = 10000;
        tierName = 'Growth';
      }
      if (priceId === process.env.STRIPE_PRICE_BUSINESS) {
        newLimit = 25000;
        tierName = 'Business';
      }

      console.log(`Upgrading ${userEmail} to ${newLimit} requests.`);

      // Check if user already has a key
      const { data: existingKey } = await supabaseAdmin
        .from('api_keys')
        .select('id, key')
        .eq('email', userEmail)
        .single();

      if (existingKey) {
        // Update existing key
        const { error } = await supabaseAdmin
          .from('api_keys')
          .update({ requests_limit: newLimit })
          .eq('email', userEmail);

        if (error) {
          console.error('Supabase Update Error:', error.message);
        } else {
          // Send notification email
          await sendApiKeyEmail(userEmail, existingKey.key, tierName, newLimit);
        }
      } else {
        // Generate new key for first-time buyer
        const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        const { error } = await supabaseAdmin
          .from('api_keys')
          .insert([{ 
            email: userEmail, 
            key: newKey, 
            requests_limit: newLimit,
            requests_used: 0
          }]);

        if (error) {
          console.error('Supabase Insert Error:', error.message);
        } else {
          // Send notification email
          await sendApiKeyEmail(userEmail, newKey, tierName, newLimit);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
