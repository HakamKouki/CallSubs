import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { callRequestId, duration } = await req.json();

    if (!duration || isNaN(duration)) {
      return NextResponse.json({ error: 'Valid duration is required' }, { status: 400 });
    }

    const dailyApiKey = process.env.DAILY_API_KEY;
    const dailyDomain = process.env.DAILY_DOMAIN;

    if (!dailyApiKey || !dailyDomain) {
      console.error('Daily.co credentials missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const roomName = `call-${callRequestId}-${Date.now()}`;
    const expTimestamp = Math.floor((Date.now() + (duration * 1000)) / 1000);

    console.log(`Creating Daily room: ${roomName} with duration: ${duration} seconds`);

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
      return NextResponse.json({ 
        error: `Room creation failed: ${errorText}` 
      }, { status: 500 });
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
      return NextResponse.json({ 
        error: `Token creation failed: ${errorText}` 
      }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();

    console.log(`Successfully created Daily room and token for call ${callRequestId}`);

    return NextResponse.json({
      roomUrl: room.url,
      roomName: roomName,
      streamerToken: tokenData.token,
      duration: duration
    });

  } catch (error) {
    console.error('Error in createDailyRoom:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}