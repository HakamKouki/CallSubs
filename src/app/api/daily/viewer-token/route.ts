import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { callRequestId } = await req.json();

    if (!callRequestId) {
      return NextResponse.json({ error: 'callRequestId is required' }, { status: 400 });
    }

    console.log('Looking for call with ID:', callRequestId);

    // Get call from database
    const result = await db.query(
      'SELECT * FROM call_requests WHERE id = $1',
      [callRequestId]
    );

    if (result.rows.length === 0) {
      console.log('Call not found:', callRequestId);
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    const callRequest = result.rows[0];
    console.log('Call found:', { status: callRequest.status, room: callRequest.room_name });

    if (callRequest.status !== 'active' || !callRequest.room_name) {
      console.log('Call not ready yet:', { 
        status: callRequest.status, 
        hasRoom: !!callRequest.room_name 
      });
      return NextResponse.json({ 
        error: 'Call is not ready yet',
        status: callRequest.status,
        shouldRetry: true
      }, { status: 409 });
    }

    const dailyApiKey = process.env.DAILY_API_KEY;
    const dailyDomain = process.env.DAILY_DOMAIN;

    if (!dailyApiKey || !dailyDomain) {
      console.error('Daily API key or Domain is missing');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    const expTimestamp = Math.floor((Date.now() + (callRequest.duration * 1000)) / 1000);

    console.log('Creating viewer token for room:', callRequest.room_name);

    const tokenResponse = await fetch('https://api.daily.co/v1/meeting-tokens', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${dailyApiKey}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        properties: {
          room_name: callRequest.room_name,
          exp: expTimestamp,
          is_owner: false,
          user_name: callRequest.viewer_username || 'Viewer',
          enable_screenshare: false,
          enable_recording: false,
          start_video_off: true,
          start_audio_off: false
        }
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Daily token creation failed:', errorText);
      return NextResponse.json({ 
        error: `Token creation failed: ${errorText}` 
      }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    console.log('Token created successfully');

    const roomUrl = `https://${dailyDomain}.daily.co/${callRequest.room_name}`;

    return NextResponse.json({
      roomUrl: roomUrl,
      viewerToken: tokenData.token,
      duration: callRequest.duration
    });

  } catch (error) {
    console.error('Error in getDailyViewerToken:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}