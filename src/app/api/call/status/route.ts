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

    // Get viewer's user ID
    const viewerResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (viewerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Viewer not found' }, { status: 404 });
    }

    const viewerId = viewerResult.rows[0].id;

    // Get most recent ACTIVE or PENDING call request for this viewer
    // Only show calls from the last 2 hours to avoid showing old requests
    const callResult = await pool.query(
      `SELECT 
        cr.id,
        cr.status,
        cr.amount,
        cr.duration,
        cr.viewer_tier,
        cr.started_at,
        cr.created_at,
        cr.room_url,
        u.username as streamer_username,
        u.display_name as streamer_display_name,
        u.profile_image_url as streamer_profile_image
       FROM call_requests cr
       JOIN streamers s ON cr.streamer_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE cr.viewer_id = $1
       AND cr.status IN ('pending', 'active')
       AND cr.created_at > NOW() - INTERVAL '2 hours'
       ORDER BY cr.created_at DESC
       LIMIT 1`,
      [viewerId]
    );

    if (callResult.rows.length === 0) {
      return NextResponse.json({ hasActiveCall: false });
    }

    const call = callResult.rows[0];

    // If call is active but started more than duration + 2 minutes ago, mark as completed
    if (call.status === 'active' && call.started_at) {
      const startedAt = new Date(call.started_at);
      const now = new Date();
      const elapsedSeconds = (now.getTime() - startedAt.getTime()) / 1000;
      
      if (elapsedSeconds > (call.duration + 120)) {
        // Call should have ended, mark as completed
        await pool.query(
          'UPDATE call_requests SET status = $1, ended_at = NOW() WHERE id = $2',
          ['completed', call.id]
        );
        
        return NextResponse.json({ hasActiveCall: false });
      }
    }

    return NextResponse.json({
      hasActiveCall: true,
      call: {
        id: call.id,
        status: call.status,
        amount: call.amount,
        duration: call.duration,
        viewer_tier: call.viewer_tier,
        started_at: call.started_at,
        streamer_username: call.streamer_username,
        streamer_display_name: call.streamer_display_name,
        streamer_profile_image: call.streamer_profile_image,
        room_url: call.room_url
      }
    });

  } catch (error) {
    console.error('Error checking call status:', error);
    return NextResponse.json({ error: 'Failed to check call status' }, { status: 500 });
  }
}