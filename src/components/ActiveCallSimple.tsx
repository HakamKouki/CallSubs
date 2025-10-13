'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useServerClockOffset } from '@/hooks/useServerClockOffset';

// Declare Daily.co types
declare global {
  interface Window {
    DailyIframe: any;
  }
}

interface CallRequest {
  id: number;
  viewer_username: string;
  viewer_tier: string;
  amount: string;
  duration: number;
  status: string;
  created_at: string;
  profile_image_url: string;
  room_url?: string;
  room_name?: string;
  streamer_token?: string;
}

interface ActiveCallProps {
  callRequest: CallRequest;
  onEndCall: () => void;
  role: 'streamer' | 'viewer';
}

// Load Daily.co script
const loadDailyScript = () =>
  new Promise((resolve, reject) => {
    if (window.DailyIframe) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js@latest/dist/daily-iframe.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

export default function ActiveCallSimple({ callRequest, onEndCall, role }: ActiveCallProps) {
  const [permissionState, setPermissionState] = useState<'idle' | 'prompting' | 'granted' | 'denied'>('idle');
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'joined' | 'error'>('connecting');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(callRequest.duration);
  const [remoteParticipants, setRemoteParticipants] = useState(0);

  // Server time sync
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [callExpiresAt, setCallExpiresAt] = useState<string | null>(null);
  const serverClockOffset = useServerClockOffset(serverTime);

  const dailyCallRef = useRef<any>(null);
  const localMicStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const isCallEndedRef = useRef(false);

  // Centralized Daily cleanup
  const cleanupDailyInstance = useCallback(() => {
    if (dailyCallRef.current) {
      try {
        const meetingState = dailyCallRef.current.meetingState?.();
        if (meetingState && meetingState !== 'left-meeting') {
          dailyCallRef.current.leave?.().catch((e: any) => console.warn('Leave failed:', e));
        }
        dailyCallRef.current.destroy?.();
        console.log('[ActiveCall] Daily instance destroyed');
      } catch (error) {
        console.warn('[ActiveCall] Error during Daily cleanup:', error);
      } finally {
        dailyCallRef.current = null;
      }
    }
  }, []);

  // Initialize Daily call
  const initializeDailyCall = async (token: string) => {
    try {
      await loadDailyScript();

      // Clean any existing instance
      if (dailyCallRef.current) {
        console.log('[ActiveCall] Cleaning up existing Daily instance...');
        cleanupDailyInstance();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Clean global instances
      try {
        const instances = (window as any).DailyIframe?._instances;
        if (Array.isArray(instances) && instances.length > 0) {
          console.warn('[ActiveCall] Found existing global Daily instances, cleaning...');
          instances.forEach((i: any) => {
            try { i.destroy?.(); } catch (e) { console.warn('Failed to destroy global instance:', e); }
          });
          (window as any).DailyIframe._instances = [];
        }
      } catch {}

      dailyCallRef.current = (window as any).DailyIframe.createCallObject({
        showLeaveButton: false,
        showFullscreenButton: false,
        allowMultipleCallInstances: false
      });

      const dc = dailyCallRef.current;

      dc
        .on('loading', () => setConnectionState('connecting'))
        .on('loaded', () => setConnectionState('connected'))
        .on('joined-meeting', async () => {
          setConnectionState('joined');
          try {
            await dc.setLocalAudio(true);
          } catch (e) {
            console.warn('Failed to enable audio:', e);
          }
        })
        .on('participant-joined', () => {
          setRemoteParticipants(prev => prev + 1);
        })
        .on('participant-left', () => {
          setRemoteParticipants(prev => Math.max(0, prev - 1));
        })
        .on('track-started', (e: any) => {
          if (e.participant && !e.participant.local && e.track.kind === 'audio') {
            if (remoteAudioRef.current) {
              remoteAudioRef.current.srcObject = new MediaStream([e.track]);
              remoteAudioRef.current.muted = isSpeakerMuted;
              remoteAudioRef.current.play().catch(err => console.error('Audio autoplay prevented:', err));
            }
          }
        })
        .on('left-meeting', () => {
          console.log('[ActiveCall] Left meeting');
          handleCallEnd();
        })
        .on('error', (error: any) => {
          console.error('Daily call error:', error);
          setConnectionState('error');
        });

      await dc.join({
        url: callRequest.room_url,
        token,
        userName: role === 'streamer' ? 'Streamer' : callRequest.viewer_username || 'Viewer',
        startVideoOff: true,
        startAudioOff: false,
      });

    } catch (error) {
      console.error('Failed to initialize Daily call:', error);
      setConnectionState('error');
    }
  };

  // Request microphone permission
  const requestMicPermission = async () => {
    setPermissionState('prompting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localMicStreamRef.current = stream;
      setPermissionState('granted');

      // For streamer: use the token that was already created
      if (role === 'streamer') {
        const token = callRequest.streamer_token;
        
        if (!token) {
          console.error('No streamer token found in call request');
          setPermissionState('denied');
          alert('Failed to initialize call: No token available');
          return;
        }

        console.log('[ActiveCall] Using streamer token from call request');
        await initializeDailyCall(token);
      } else {
        // For viewer: fetch a new viewer token
        const tokenResponse = await fetch('/api/daily/viewer-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            callRequestId: callRequest.id
          })
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to get viewer token');
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.viewerToken;

        if (!token) {
          throw new Error('No viewer token in response');
        }

        console.log('[ActiveCall] Using viewer token from API');
        await initializeDailyCall(token);
      }

    } catch (error) {
      console.error('Microphone permission denied or token fetch failed:', error);
      setPermissionState('denied');
    }
  };

  // Handle call end
  const handleCallEnd = useCallback(async () => {
    if (isCallEndedRef.current) return;
    isCallEndedRef.current = true;

    console.log('[ActiveCall] Ending call...');

    // Stop mic
    if (localMicStreamRef.current) {
      localMicStreamRef.current.getTracks().forEach(track => track.stop());
      localMicStreamRef.current = null;
    }

    // Cleanup Daily
    if (dailyCallRef.current) {
      try {
        await dailyCallRef.current.leave();
        await dailyCallRef.current.destroy();
        dailyCallRef.current = null;
      } catch (e) {
        console.warn('Error leaving call:', e);
      }
    }

    cleanupDailyInstance();

    // Notify backend to complete the call (works for both streamer and viewer)
    try {
      await fetch('/api/call/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          callRequestId: callRequest.id, 
          action: 'complete' 
        })
      });
      console.log('[ActiveCall] Call marked as completed in backend');
    } catch (error) {
      console.error('[ActiveCall] Failed to mark call as completed:', error);
    }

    onEndCall();
  }, [cleanupDailyInstance, onEndCall, callRequest.id]);

  // Toggle mic
  const toggleMic = async () => {
    if (!dailyCallRef.current) return;
    const newMuted = !isMicMuted;
    await dailyCallRef.current.setLocalAudio(!newMuted);
    if (localMicStreamRef.current) {
      localMicStreamRef.current.getAudioTracks().forEach(t => t.enabled = !newMuted);
    }
    setIsMicMuted(newMuted);
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    const newMuted = !isSpeakerMuted;
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = newMuted;
    }
    setIsSpeakerMuted(newMuted);
  };

  // Server-synchronized timer countdown
  useEffect(() => {
    if (connectionState !== 'joined' || !callExpiresAt) return;

    const tick = () => {
      const now = Date.now() + serverClockOffset;
      const expiryTime = new Date(callExpiresAt).getTime();
      const remainingMs = expiryTime - now;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeRemaining(remainingSec);

      if (remainingSec === 0) {
        console.log('[ActiveCall] Timer expired (server time)');
        handleCallEnd();
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [connectionState, callExpiresAt, serverClockOffset, handleCallEnd]);

  // Poll for call status to detect remote end AND sync server time
  useEffect(() => {
    if (connectionState !== 'joined') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/call/check?id=${callRequest.id}`);
        if (response.ok) {
          const data = await response.json();
          
          // Update server time for clock sync
          if (data.server_now) {
            setServerTime(data.server_now);
          }

          // Update expiry time if not set
          if (data.call_expires_at && !callExpiresAt) {
            setCallExpiresAt(data.call_expires_at);
            console.log('[ActiveCall] Call expires at:', data.call_expires_at);
          }
          
          // If call status changed to completed, end the call
          if (data.status === 'completed' && !isCallEndedRef.current) {
            console.log('[ActiveCall] Call ended remotely');
            handleCallEnd();
          }
        }
      } catch (error) {
        console.error('Error polling call status:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [connectionState, callRequest.id, callExpiresAt, handleCallEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[ActiveCall] Component unmounting, cleaning up...');
      cleanupDailyInstance();
      if (localMicStreamRef.current) {
        localMicStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [cleanupDailyInstance]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Permission prompt UI
  if (permissionState !== 'granted') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-gray-600 mb-6">
            Your browser will ask for microphone access to start the call.
          </p>

          {permissionState === 'idle' && (
            <button
              onClick={requestMicPermission}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Join Voice Call
            </button>
          )}

          {permissionState === 'prompting' && (
            <p className="text-blue-600 font-semibold animate-pulse">Waiting for permission...</p>
          )}

          {permissionState === 'denied' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-600 mb-4">
                Microphone access is required. Please enable it in your browser settings.
              </p>
              <button
                onClick={() => handleCallEnd()}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Cancel Call
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active call UI
  return (
    <div className="fixed inset-0 bg-[#1e1f22] z-50 flex items-center justify-center">
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />
      
      <div className="bg-[#2b2d31] rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Avatar */}
        <div className="mb-6">
          <div className="w-32 h-32 rounded-full bg-purple-600 text-white text-4xl font-bold flex items-center justify-center mx-auto">
            {callRequest.viewer_username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {callRequest.viewer_username}
        </h2>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${connectionState === 'joined' ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-gray-400 text-sm capitalize">{connectionState}</span>
        </div>

        {/* Timer */}
        <div className="text-6xl font-bold text-white mb-8">
          {formatTime(timeRemaining)}
        </div>

        {/* Remote participants */}
        <p className="text-gray-400 text-sm mb-6">
          {remoteParticipants > 0 ? 'Connected' : 'Waiting for other participant...'}
        </p>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={toggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isMicMuted ? 'bg-red-500' : 'bg-gray-700'
            }`}
          >
            {isMicMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={handleCallEnd}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>

          <button
            onClick={toggleSpeaker}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isSpeakerMuted ? 'bg-red-500' : 'bg-gray-700'
            }`}
          >
            {isSpeakerMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}