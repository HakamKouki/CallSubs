import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { streamerUsername, amount, duration, tier } = await request.json();

    console.log('Creating Stripe checkout for', session.user.name, 'to call', streamerUsername);

    // Get viewer's info
    const viewerResult = await pool.query(
      'SELECT id, email FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (viewerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Viewer not found' }, { status: 404 });
    }

    const viewer = viewerResult.rows[0];

    // Get streamer's info including Stripe account
    const streamerUserResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [streamerUsername]
    );

    if (streamerUserResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerUserId = streamerUserResult.rows[0].id;

    const streamerResult = await pool.query(
      `SELECT id, stripe_account_id, stripe_onboarding_complete, stripe_charges_enabled 
       FROM streamers 
       WHERE user_id = $1`,
      [streamerUserId]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerData = streamerResult.rows[0];
    const streamerId = streamerData.id;
    const streamerStripeAccountId = streamerData.stripe_account_id;
    const streamerOnboardingComplete = streamerData.stripe_onboarding_complete;
    const streamerChargesEnabled = streamerData.stripe_charges_enabled;

    // Check if streamer has completed Stripe Connect onboarding
    if (!streamerStripeAccountId || !streamerOnboardingComplete || !streamerChargesEnabled) {
      return NextResponse.json(
        { 
          error: 'Streamer payment setup incomplete', 
          message: 'This streamer has not completed their payment setup yet. Please try again later.' 
        },
        { status: 400 }
      );
    }

    // Calculate platform fee (10%)
    const platformFeePercentage = 0.10;
    const platformFeeAmount = Math.round(amount * 100 * platformFeePercentage); // 10% in cents

    // Create pending call request (will be updated after payment)
    const callRequestResult = await pool.query(
      `INSERT INTO call_requests 
        (streamer_id, viewer_id, status, amount, duration, viewer_username, viewer_tier, payment_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id`,
      [streamerId, viewer.id, 'payment_pending', amount, duration, session.user.name, tier, 'pending']
    );

    const callRequestId = callRequestResult.rows[0].id;

    // Create Stripe Checkout Session with destination charge
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Call with ${streamerUsername}`,
              description: `${Math.floor(duration / 60)} minute voice call`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_intent_data: {
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: streamerStripeAccountId,
        },
      },
      success_url: `${process.env.NEXTAUTH_URL}/call/${streamerUsername}?success=true&call_request_id=${callRequestId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/call/${streamerUsername}?canceled=true`,
      customer_email: viewer.email || session.user.email,
      metadata: {
        call_request_id: callRequestId.toString(),
        streamer_username: streamerUsername,
        viewer_username: session.user.name || '',
        duration: duration.toString(),
        platform_fee: platformFeeAmount.toString(),
      },
    });

    console.log('Stripe checkout created:', checkoutSession.id);

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error('Error creating Stripe checkout:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { 
          error: 'Payment setup error', 
          message: error.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}