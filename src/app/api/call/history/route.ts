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

    // Get user and streamer info
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    const streamerResult = await pool.query(
      'SELECT id FROM streamers WHERE user_id = $1',
      [userId]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerId = streamerResult.rows[0].id;

    // Get all call history (completed, rejected, cancelled, expired)
    const historyResult = await pool.query(
      `SELECT 
        id,
        viewer_username,
        viewer_tier,
        amount,
        duration,
        status,
        created_at,
        started_at,
        completed_at,
        profile_image_url
       FROM call_requests
       WHERE streamer_id = $1
         AND status IN ('completed', 'rejected', 'cancelled', 'expired')
       ORDER BY created_at DESC`,
      [streamerId]
    );

    return NextResponse.json({
      history: historyResult.rows
    });

  } catch (error) {
    console.error('Error fetching call history:', error);
    return NextResponse.json({ error: 'Failed to fetch call history' }, { status: 500 });
  }
}