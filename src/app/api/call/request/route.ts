import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { streamerUsername, amount, duration, tier } = await request.json();

    console.log('Processing call request from', session.user.name, 'to', streamerUsername);

    // Get viewer's user ID
    const viewerResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (viewerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Viewer not found' }, { status: 404 });
    }

    const viewerId = viewerResult.rows[0].id;

    // Get streamer's user ID and streamer settings ID
    const streamerUserResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [streamerUsername]
    );

    if (streamerUserResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerUserId = streamerUserResult.rows[0].id;

    // Get streamer settings
    const streamerResult = await pool.query(
      'SELECT id FROM streamers WHERE user_id = $1',
      [streamerUserId]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer settings not found' }, { status: 404 });
    }

    const streamerId = streamerResult.rows[0].id;

    // Check if viewer already has a pending request
    const existingRequest = await pool.query(
      'SELECT id FROM call_requests WHERE streamer_id = $1 AND viewer_id = $2 AND status = $3',
      [streamerId, viewerId, 'pending']
    );

    if (existingRequest.rows.length > 0) {
      return NextResponse.json({ 
        error: 'You already have a pending call request with this streamer' 
      }, { status: 400 });
    }

    // Create call request
    // TODO: In next step, we'll add payment processing here
    const result = await pool.query(
      `INSERT INTO call_requests 
        (streamer_id, viewer_id, status, amount, duration, viewer_username, viewer_tier, payment_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [streamerId, viewerId, 'pending', amount, duration, session.user.name, tier, 'completed']
      // Note: payment_status is 'completed' for now since we're not processing payments yet
    );

    console.log('Call request created:', result.rows[0]);

    return NextResponse.json({
      success: true,
      callRequest: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating call request:', error);
    return NextResponse.json({ error: 'Failed to create call request' }, { status: 500 });
  }
}