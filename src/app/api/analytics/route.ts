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
      'SELECT id, total_earned, calls_completed FROM streamers WHERE user_id = $1',
      [userId]
    );

    if (streamerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Streamer not found' }, { status: 404 });
    }

    const streamer = streamerResult.rows[0];

    // Get total call time
    const callTimeResult = await pool.query(
      `SELECT COALESCE(SUM(duration), 0) as total_time
       FROM call_requests
       WHERE streamer_id = $1 AND status = 'completed'`,
      [streamer.id]
    );

    const totalCallTime = parseInt(callTimeResult.rows[0].total_time) || 0;
    const averageCallDuration = streamer.calls_completed > 0 
      ? totalCallTime / streamer.calls_completed 
      : 0;

    // Get recent calls (last 10)
    const recentCallsResult = await pool.query(
      `SELECT id, viewer_username, amount, duration, created_at, viewer_tier
       FROM call_requests
       WHERE streamer_id = $1 AND status = 'completed'
       ORDER BY created_at DESC
       LIMIT 10`,
      [streamer.id]
    );

    // Get earnings by month (last 6 months)
    const earningsByMonthResult = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'Mon YYYY') as month,
         SUM(amount) as earnings
       FROM call_requests
       WHERE streamer_id = $1 AND status = 'completed'
         AND created_at >= NOW() - INTERVAL '6 months'
       GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
       ORDER BY DATE_TRUNC('month', created_at) ASC`,
      [streamer.id]
    );

    // Get calls by tier
    const callsByTierResult = await pool.query(
      `SELECT 
         viewer_tier,
         COUNT(*) as count
       FROM call_requests
       WHERE streamer_id = $1 AND status = 'completed'
       GROUP BY viewer_tier`,
      [streamer.id]
    );

    const callsByTier = {
      tier1: 0,
      tier2: 0,
      tier3: 0
    };

    callsByTierResult.rows.forEach(row => {
      if (row.viewer_tier in callsByTier) {
        callsByTier[row.viewer_tier as keyof typeof callsByTier] = parseInt(row.count);
      }
    });

    return NextResponse.json({
      totalEarned: parseFloat(streamer.total_earned) || 0,
      callsCompleted: streamer.calls_completed || 0,
      totalCallTime,
      averageCallDuration,
      topTier: 'tier3', // Could calculate this based on most calls
      recentCalls: recentCallsResult.rows,
      earningsByMonth: earningsByMonthResult.rows.map(row => ({
        month: row.month,
        earnings: parseFloat(row.earnings)
      })),
      callsByTier
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}