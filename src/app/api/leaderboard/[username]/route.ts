import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Get top 10 callers for this streamer
    const result = await pool.query(
      `SELECT 
        viewer_username,
        total_calls,
        total_spent,
        total_minutes,
        last_call_at
       FROM caller_stats
       WHERE streamer_username = $1
       ORDER BY total_spent DESC
       LIMIT 10`,
      [username.toLowerCase()]
    );

    return NextResponse.json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}