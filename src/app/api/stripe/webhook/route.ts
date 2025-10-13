import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import pool from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('Payment successful for session:', session.id);
    console.log('Metadata:', session.metadata);

    const callRequestId = session.metadata?.call_request_id;

    if (callRequestId) {
      // Update call request to pending (ready for streamer to accept)
      await pool.query(
        `UPDATE call_requests 
         SET status = $1, payment_status = $2, payment_id = $3
         WHERE id = $4`,
        ['pending', 'completed', session.payment_intent, parseInt(callRequestId)]
      );

      console.log('Call request', callRequestId, 'updated to pending');
    }
  }

  return NextResponse.json({ received: true });
}