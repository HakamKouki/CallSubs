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

    if (!streamer.stripe_account_id) {
      return NextResponse.json({ error: 'No Stripe account connected' }, { status: 400 });
    }

    // Create login link to Stripe Express dashboard
    const loginLink = await stripe.accounts.createLoginLink(streamer.stripe_account_id);

    return NextResponse.json({ url: loginLink.url });

  } catch (error) {
    console.error('Stripe dashboard link error:', error);
    return NextResponse.json(
      { error: 'Failed to create dashboard link', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}