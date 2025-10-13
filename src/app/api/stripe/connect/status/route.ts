import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
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

    if (!streamer.stripe_account_id) {
      return NextResponse.json({
        connected: false,
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      });
    }

    // Fetch account details from Stripe
    const account = await stripe.accounts.retrieve(streamer.stripe_account_id);

    // Update database with latest status
    await pool.query(
      `UPDATE streamers 
       SET stripe_onboarding_complete = $1,
           stripe_charges_enabled = $2,
           stripe_payouts_enabled = $3,
           stripe_details_submitted = $4
       WHERE id = $5`,
      [
        account.details_submitted || false,
        account.charges_enabled || false,
        account.payouts_enabled || false,
        account.details_submitted || false,
        streamer.id,
      ]
    );

    return NextResponse.json({
      connected: true,
      onboardingComplete: account.details_submitted || false,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
      detailsSubmitted: account.details_submitted || false,
      accountId: account.id,
    });

  } catch (error) {
    console.error('Stripe Connect status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}