import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// SET THIS TO true FOR TESTING, false FOR PRODUCTION
const TEST_MODE = true;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { streamerUsername } = await request.json();

    console.log('Checking subscription for viewer:', session.user.name, 'to streamer:', streamerUsername);

    // Get viewer's Twitch ID
    const viewerResult = await pool.query(
      'SELECT twitch_id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (viewerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Viewer not found' }, { status: 404 });
    }

    const viewerTwitchId = viewerResult.rows[0].twitch_id;

    // Get streamer's settings
    const streamerUserResult = await pool.query(
      'SELECT id, twitch_id FROM users WHERE username = $1 OR display_name = $1',
      [streamerUsername]
    );

    if (streamerUserResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerUser = streamerUserResult.rows[0];

    const streamerSettingsResult = await pool.query(
      'SELECT min_sub_tier FROM streamers WHERE user_id = $1',
      [streamerUser.id]
    );

    if (streamerSettingsResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer settings not found' }, { status: 404 });
    }

    const minSubTier = streamerSettingsResult.rows[0].min_sub_tier || 'tier1';
    const broadcasterTwitchId = streamerUser.twitch_id;

    console.log('Viewer ID:', viewerTwitchId, 'Broadcaster ID:', broadcasterTwitchId);

    // ========== TEST MODE ==========
    if (TEST_MODE) {
      console.log('⚠️  TEST MODE ENABLED - Simulating subscription status');
      
      // If viewer = streamer, simulate Tier 3 subscription
      if (viewerTwitchId === broadcasterTwitchId) {
        console.log('TEST: Viewer is the streamer, simulating Tier 3 subscription');
        
        return NextResponse.json({
          isSubscribed: true,
          tier: 'tier3',
          meetsRequirement: true,
          message: '✓ [TEST MODE] You are subscribed at TIER3 and can request a call!'
        });
      }

      // For different users, also simulate subscribed (for testing)
      console.log('TEST: Simulating Tier 1 subscription for testing');
      return NextResponse.json({
        isSubscribed: true,
        tier: 'tier1',
        meetsRequirement: true,
        message: '✓ [TEST MODE] You are subscribed at TIER1 and can request a call!'
      });
    }
    // ========== END TEST MODE ==========

    // PRODUCTION CODE (only runs when TEST_MODE = false)
    // Real Twitch API call would go here...
    return NextResponse.json({ 
      isSubscribed: false, 
      tier: null,
      meetsRequirement: false,
      message: 'Subscription verification is not yet active.'
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ 
      isSubscribed: false,
      tier: null,
      meetsRequirement: false,
      message: 'Unable to verify subscription status'
    }, { status: 500 });
  }
}