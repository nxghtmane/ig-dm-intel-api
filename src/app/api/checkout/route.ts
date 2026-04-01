import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24-preview' as any,
});

export async function POST(request: Request) {
  try {
    const { priceId, email } = await request.json();

    if (!priceId || !email) {
      return NextResponse.json({ error: 'Missing priceId or email' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      success_url: `${request.headers.get('origin')}/?success=true`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
      metadata: {
        email: email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout Error:', err.message);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
