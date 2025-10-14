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

    // Get streamer from database
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const streamerResult = await pool.query(
      'SELECT * FROM streamers WHERE user_id = $1',
      [userResult.rows[0].id]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer profile not found' }, { status: 404 });
    }

    const streamer = streamerResult.rows[0];

    let accountId = streamer.stripe_account_id;

    // Create Stripe Connect account if it doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: session.user.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
      });

      accountId = account.id;

      // Save account ID to database
      await pool.query(
        'UPDATE streamers SET stripe_account_id = $1 WHERE id = $2',
        [accountId, streamer.id]
      );
    }

    // Create account link for onboarding
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard/payouts?refresh=true`,
      return_url: `${origin}/dashboard/payouts?success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });

  } catch (error) {
    console.error('Stripe Connect onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to create onboarding link', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}