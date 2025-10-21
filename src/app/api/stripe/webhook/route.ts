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
    const viewerUsername = session.metadata?.viewer_username;
    const streamerUsername = session.metadata?.streamer_username;
    const duration = parseInt(session.metadata?.duration || '0');
    const amount = session.amount_total ? session.amount_total / 100 : 0; // Convert cents to dollars

    if (callRequestId) {
      // Update call request to pending (ready for streamer to accept)
      await pool.query(
        `UPDATE call_requests 
         SET status = $1, payment_status = $2, payment_id = $3
         WHERE id = $4`,
        ['pending', 'completed', session.payment_intent, parseInt(callRequestId)]
      );

      console.log('Call request', callRequestId, 'updated to pending');

      // Update leaderboard stats
      if (viewerUsername && streamerUsername) {
        await pool.query(
          `INSERT INTO caller_stats (viewer_username, streamer_username, total_calls, total_spent, total_minutes, last_call_at)
           VALUES ($1, $2, 1, $3, $4, CURRENT_TIMESTAMP)
           ON CONFLICT (viewer_username, streamer_username)
           DO UPDATE SET
             total_calls = caller_stats.total_calls + 1,
             total_spent = caller_stats.total_spent + $3,
             total_minutes = caller_stats.total_minutes + $4,
             last_call_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP`,
          [viewerUsername.toLowerCase(), streamerUsername.toLowerCase(), amount, Math.floor(duration / 60)]
        );

        console.log('Leaderboard stats updated for', viewerUsername);
      }
    }
  }

  return NextResponse.json({ received: true });
}