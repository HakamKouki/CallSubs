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

    console.log('Fetching call queue for streamer:', session.user.name);

    // Get streamer's user ID
    const streamerUserResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (streamerUserResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerUserId = streamerUserResult.rows[0].id;

    // Get streamer ID
    const streamerResult = await pool.query(
      'SELECT id FROM streamers WHERE user_id = $1',
      [streamerUserId]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer settings not found' }, { status: 404 });
    }

    const streamerId = streamerResult.rows[0].id;

    // Get all pending call requests
    const queueResult = await pool.query(
      `SELECT 
        cr.id,
        cr.viewer_username,
        cr.viewer_tier,
        cr.amount,
        cr.duration,
        cr.status,
        cr.created_at,
        cr.room_url,
        u.profile_image_url
       FROM call_requests cr
       JOIN users u ON cr.viewer_id = u.id
       WHERE cr.streamer_id = $1 AND cr.status = $2
       ORDER BY cr.created_at ASC`,
      [streamerId, 'pending']
    );

    console.log('Found', queueResult.rows.length, 'pending calls');

    return NextResponse.json({
      queue: queueResult.rows
    });

  } catch (error) {
    console.error('Error fetching call queue:', error);
    return NextResponse.json({ error: 'Failed to fetch call queue' }, { status: 500 });
  }
}