import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params; // ADD await here

    const userResult = await pool.query(
      'SELECT id, username, display_name, profile_image_url FROM users WHERE username = $1 OR display_name = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    const streamerResult = await pool.query(
      'SELECT call_price, call_duration, is_accepting_calls, min_sub_tier FROM streamers WHERE user_id = $1',
      [user.id]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer settings not found' }, { status: 404 });
    }

    const streamer = streamerResult.rows[0];

    return NextResponse.json({
      username: user.username,
      displayName: user.display_name,
      profileImage: user.profile_image_url,
      callPrice: parseFloat(streamer.call_price),
      callDuration: streamer.call_duration,
      isAcceptingCalls: streamer.is_accepting_calls,
      minSubTier: streamer.min_sub_tier,
      isLive: false
    });
  } catch (error) {
    console.error('Error fetching streamer data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}