import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const username = session.user.name;
    
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    let streamerResult = await pool.query(
      'SELECT * FROM streamers WHERE user_id = $1',
      [userId]
    );

    if (streamerResult.rows.length === 0) {
      streamerResult = await pool.query(
        'INSERT INTO streamers (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
    }

    return NextResponse.json(streamerResult.rows[0]);
  } catch (error) {
    console.error('Error fetching streamer settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { callPrice, callDuration, minSubTier, isAcceptingCalls } = body;

    const username = session.user.name;
    
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO streamers (user_id, call_price, call_duration, min_sub_tier, is_accepting_calls, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         call_price = EXCLUDED.call_price,
         call_duration = EXCLUDED.call_duration,
         min_sub_tier = EXCLUDED.min_sub_tier,
         is_accepting_calls = EXCLUDED.is_accepting_calls,
         updated_at = NOW()
       RETURNING *`,
      [userId, callPrice, callDuration, minSubTier, isAcceptingCalls]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating streamer settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}