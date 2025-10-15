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

    const { callRules, requireRulesAgreement } = await request.json();

    // Get user ID
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR display_name = $1',
      [session.user.name]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Get streamer ID
    const streamerResult = await pool.query(
      'SELECT id FROM streamers WHERE user_id = $1',
      [userId]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamerId = streamerResult.rows[0].id;

    // Update settings
    await pool.query(
      `UPDATE streamers 
       SET call_rules = $1, 
           require_rules_agreement = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [callRules, requireRulesAgreement, streamerId]
    );

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully' 
    });

  } catch (error) {
    console.error('Error updating rules settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}