import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper function to delete Daily.co room
async function deleteDailyRoom(roomName: string) {
  const dailyApiKey = process.env.DAILY_API_KEY;
  
  if (!dailyApiKey || !roomName) return;

  try {
    await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${dailyApiKey}`,
      }
    });
    console.log(`Daily room ${roomName} deleted successfully`);
  } catch (error) {
    console.error('Failed to delete Daily room:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { callRequestId, action } = await request.json();

    console.log('Managing call request:', callRequestId, 'action:', action);

    // Verify this call request belongs to this streamer
    const streamerUserResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (streamerUserResult.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const streamerUserId = streamerUserResult.rows[0].id;

    const streamerResult = await pool.query(
      'SELECT id FROM streamers WHERE user_id = $1',
      [streamerUserId]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerId = streamerResult.rows[0].id;

    // Verify call request belongs to this streamer
    const callResult = await pool.query(
      'SELECT * FROM call_requests WHERE id = $1 AND streamer_id = $2',
      [callRequestId, streamerId]
    );

    if (callResult.rows.length === 0) {
      return NextResponse.json({ error: 'Call request not found' }, { status: 404 });
    }

    const callRequest = callResult.rows[0];

    switch (action) {
      case 'accept':
        // Create Daily.co room directly (no HTTP call)
        const dailyApiKey = process.env.DAILY_API_KEY;
        const dailyDomain = process.env.DAILY_DOMAIN;

        if (!dailyApiKey || !dailyDomain) {
          console.error('Daily.co credentials missing');
          return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const roomName = `call-${callRequestId}-${Date.now()}`;
        const expTimestamp = Math.floor((Date.now() + (callRequest.duration * 1000)) / 1000);

        console.log(`Creating Daily room: ${roomName} with duration: ${callRequest.duration} seconds`);

        // Create room
        const roomResponse = await fetch('https://api.daily.co/v1/rooms', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${dailyApiKey}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            name: roomName,
            properties: { 
              max_participants: 2,
              exp: expTimestamp,
              eject_at_room_exp: true,
              enable_chat: false,
              enable_screenshare: false,
              enable_recording: false,
              start_video_off: true,
              start_audio_off: false
            }
          })
        });

        if (!roomResponse.ok) {
          const errorText = await roomResponse.text();
          console.error('Daily room creation failed:', errorText);
          return NextResponse.json({ error: 'Failed to create Daily room' }, { status: 500 });
        }

        const room = await roomResponse.json();

        // Create streamer token
        const tokenResponse = await fetch('https://api.daily.co/v1/meeting-tokens', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${dailyApiKey}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            properties: { 
              room_name: roomName,
              exp: expTimestamp,
              is_owner: true
            }
          })
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Daily token creation failed:', errorText);
          return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
        }

        const tokenData = await tokenResponse.json();
        console.log('Daily.co room created:', roomName);

        // Calculate call expiry time (server-authoritative)
        const acceptResult = await pool.query(
          `UPDATE call_requests 
           SET status = $1, 
               started_at = NOW(),
               call_expires_at = NOW() + ($2 || ' seconds')::interval,
               room_url = $3,
               room_name = $4
           WHERE id = $5
           RETURNING *`,
          ['active', callRequest.duration, room.url, roomName, callRequestId]
        );

        return NextResponse.json({
          success: true,
          callRequest: {
            ...acceptResult.rows[0],
            streamer_token: tokenData.token
          }
        });

      case 'reject':
        const rejectResult = await pool.query(
          `UPDATE call_requests 
           SET status = $1
           WHERE id = $2
           RETURNING *`,
          ['rejected', callRequestId]
        );

        return NextResponse.json({
          success: true,
          callRequest: rejectResult.rows[0]
        });

      case 'complete':
        // Delete the Daily.co room if it exists
        if (callRequest.room_name) {
          await deleteDailyRoom(callRequest.room_name);
        }

        // Update streamer metrics
        const callAmount = parseFloat(callRequest.amount);
        await pool.query(
          `UPDATE streamers 
           SET total_earned = total_earned + $1,
               calls_completed = calls_completed + 1
           WHERE id = $2`,
          [callAmount, streamerId]
        );

        // Update call request status
        const completeResult = await pool.query(
          `UPDATE call_requests 
           SET status = $1,
               ended_at = NOW()
           WHERE id = $2
           RETURNING *`,
          ['completed', callRequestId]
        );

        return NextResponse.json({
          success: true,
          callRequest: completeResult.rows[0]
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error managing call request:', error);
    return NextResponse.json({ 
      error: 'Failed to manage call request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}