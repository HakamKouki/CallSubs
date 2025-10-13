import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('id');

    if (!callId) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        id, 
        status, 
        room_url, 
        room_name, 
        duration, 
        viewer_username,
        created_at,
        started_at,
        call_expires_at,
        NOW() as server_now
       FROM call_requests 
       WHERE id = $1`,
      [callId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    const callRequest = result.rows[0];

    return NextResponse.json({
      id: callRequest.id,
      status: callRequest.status,
      room_url: callRequest.room_url,
      room_name: callRequest.room_name,
      duration: callRequest.duration,
      viewer_username: callRequest.viewer_username,
      created_at: callRequest.created_at,
      started_at: callRequest.started_at,
      call_expires_at: callRequest.call_expires_at,
      server_now: callRequest.server_now // Current server time
    });

  } catch (error) {
    console.error('Error fetching call status:', error);
    return NextResponse.json({ error: 'Failed to fetch call status' }, { status: 500 });
  }
}