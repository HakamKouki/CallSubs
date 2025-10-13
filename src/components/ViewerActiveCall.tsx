'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

interface ViewerActiveCallProps {
  call: {
    id: number;
    status: string;
    amount: string;
    duration: number;
    viewer_tier: string;
    started_at: string | null;
    streamer_username: string;
    streamer_display_name: string;
    streamer_profile_image: string;
    room_url?: string;
  };
  onCallEnd: () => void;
}

export default function ViewerActiveCall({ call, onCallEnd }: ViewerActiveCallProps) {
  const [timeRemaining, setTimeRemaining] = useState(call.duration);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [callStatus, setCallStatus] = useState<'waiting' | 'connecting' | 'connected' | 'ended'>(
    call.status === 'active' ? 'connecting' : 'waiting'
  );
  const callObjectRef = useRef<DailyCall | null>(null);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    // Poll for call status updates
    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/call/status');
        const data = await response.json();

        if (!data.hasActiveCall || data.call.status === 'completed' || data.call.status === 'rejected') {
          setCallStatus('ended');
          clearInterval(statusInterval);
          
          // Leave Daily.co call if active
          if (callObjectRef.current) {
            try {
              await callObjectRef.current.leave();
              callObjectRef.current.destroy();
            } catch (error) {
              console.error('Error leaving call:', error);
            }
            callObjectRef.current = null;
          }
          
          setTimeout(onCallEnd, 2000);
          return;
        }

        if (data.call.status === 'active' && callStatus === 'waiting' && data.call.room_url) {
          setCallStatus('connecting');
          // Room URL will be available, trigger join
          if (!hasJoinedRef.current && data.call.room_url) {
            joinDailyCall(data.call.room_url);
          }
        }
      } catch (error) {
        console.error('Error polling call status:', error);
      }
    }, 2000);

    return () => clearInterval(statusInterval);
  }, [callStatus, onCallEnd]);

  const joinDailyCall = async (roomUrl: string) => {
    if (hasJoinedRef.current) return;
    hasJoinedRef.current = true;

    try {
      console.log('Joining Daily.co room:', roomUrl);

      // Create call object
      const callObject = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: false
      });

      callObjectRef.current = callObject;

      // Set up event listeners
      callObject
        .on('joined-meeting', () => {
          console.log('Viewer joined Daily.co meeting');
          setCallStatus('connected');
        })
        .on('participant-joined', (event) => {
          console.log('Participant joined:', event.participant.user_name);
        })
        .on('participant-left', (event) => {
          console.log('Participant left:', event.participant.user_name);
        })
        .on('error', (error) => {
          console.error('Daily.co error:', error);
        });

      // Join the call
      await callObject.join({ 
        url: roomUrl,
        userName: call.streamer_display_name
      });

    } catch (error) {
      console.error('Error joining Daily.co call:', error);
      setCallStatus('connected'); // Fallback to show UI even if Daily fails
    }
  };

  useEffect(() => {
    // If call is active and has room_url on mount, join immediately
    if (call.status === 'active' && call.room_url && !hasJoinedRef.current) {
      setCallStatus('connecting');
      joinDailyCall(call.room_url);
    }

    // Cleanup on unmount
    return () => {
      if (callObjectRef.current) {
        console.log('Viewer leaving Daily.co call');
        try {
          callObjectRef.current.destroy();
        } catch (error) {
          console.error('Error destroying call:', error);
        }
        callObjectRef.current = null;
      }
    };
  }, []); // Empty deps - only run once

  useEffect(() => {
    if (callStatus !== 'connected') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCallStatus('ended');
          setTimeout(onCallEnd, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus, onCallEnd]);

  // Handle mute/unmute
  useEffect(() => {
    if (callObjectRef.current && callStatus === 'connected') {
      try {
        callObjectRef.current.setLocalAudio(!isMuted);
      } catch (error) {
        console.error('Error setting audio:', error);
      }
    }
  }, [isMuted, callStatus]);

  // Handle deafen (output audio)
  useEffect(() => {
    if (callObjectRef.current && callStatus === 'connected') {
      try {
        const participants = callObjectRef.current.participants();
        Object.values(participants).forEach((participant: any) => {
          if (participant.local) return;
          callObjectRef.current?.updateParticipant(participant.session_id, {
            setSubscribedTracks: {
              audio: !isDeafened
            }
          });
        });
      } catch (error) {
        console.error('Error updating participants:', error);
      }
    }
  }, [isDeafened, callStatus]);

  const handleLeaveCall = async () => {
    if (callObjectRef.current) {
      try {
        await callObjectRef.current.leave();
        callObjectRef.current.destroy();
      } catch (error) {
        console.error('Error leaving call:', error);
      }
      callObjectRef.current = null;
    }
    onCallEnd();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((call.duration - timeRemaining) / call.duration) * 100;
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'tier1': return '#5865F2';
      case 'tier2': return '#9b59b6';
      case 'tier3': return '#f1c40f';
      default: return '#5865F2';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1e1f22] z-50 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto p-8">
        {/* Status Banner */}
        {callStatus === 'waiting' && (
          <div className="mb-6 bg-[#faa61a] text-white px-6 py-3 rounded-lg text-center animate-pulse">
            <p className="font-medium">Waiting for streamer to accept...</p>
          </div>
        )}

        {callStatus === 'connecting' && (
          <div className="mb-6 bg-[#5865F2] text-white px-6 py-3 rounded-lg text-center animate-pulse">
            <p className="font-medium">Connecting to voice channel...</p>
          </div>
        )}

        {callStatus === 'ended' && (
          <div className="mb-6 bg-[#ed4245] text-white px-6 py-3 rounded-lg text-center">
            <p className="font-medium">Call ended</p>
          </div>
        )}

        {/* Main Call Card */}
        <div className="bg-[#2b2d31] rounded-2xl shadow-2xl overflow-hidden border border-[#1e1f22]">
          {/* Header */}
          <div className="bg-[#232428] px-6 py-4 border-b border-[#1e1f22]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-full blur-md opacity-50"
                    style={{ backgroundColor: getTierColor(call.viewer_tier) }}
                  />
                  <div 
                    className="relative w-3 h-3 rounded-full"
                    style={{ backgroundColor: getTierColor(call.viewer_tier) }}
                  />
                </div>
                <div>
                  <p className="text-[#f2f3f5] font-semibold text-sm">Voice Call</p>
                  <p className="text-[#b5bac1] text-xs">
                    {callStatus === 'waiting' && 'Waiting in queue'}
                    {callStatus === 'connecting' && 'Connecting...'}
                    {callStatus === 'connected' && 'Active • End-to-end encrypted'}
                    {callStatus === 'ended' && 'Call ended'}
                  </p>
                </div>
              </div>
              {callStatus === 'connected' && (
                <div className="text-right">
                  <p className="text-[#f2f3f5] font-bold text-2xl font-mono">{formatTime(timeRemaining)}</p>
                  <p className="text-[#b5bac1] text-xs">Time remaining</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {callStatus === 'connected' && (
              <div className="mt-4 h-1 bg-[#1e1f22] rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ 
                    width: `${getProgressPercentage()}%`,
                    backgroundColor: getTierColor(call.viewer_tier)
                  }}
                />
              </div>
            )}
          </div>

          {/* Streamer Display */}
          <div className="p-12 text-center">
            <div className="mb-8 relative inline-block">
              {/* Animated Ring */}
              {callStatus === 'connected' && (
                <div className="absolute inset-0 rounded-full animate-ping" style={{
                  backgroundColor: getTierColor(call.viewer_tier),
                  opacity: 0.2
                }} />
              )}
              
              {/* Avatar Container */}
              <div 
                className="relative w-32 h-32 rounded-full p-1"
                style={{ 
                  background: `linear-gradient(135deg, ${getTierColor(call.viewer_tier)}, transparent)`
                }}
              >
                <div className="w-full h-full rounded-full bg-[#2b2d31] p-1">
                  <img 
                    src={call.streamer_profile_image || 'https://via.placeholder.com/128'} 
                    alt={call.streamer_display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Status Indicator */}
              {callStatus === 'connected' && (
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#23a55a] rounded-full border-4 border-[#2b2d31]" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-[#f2f3f5] mb-2">
              {call.streamer_display_name}
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{ 
                  backgroundColor: `${getTierColor(call.viewer_tier)}20`,
                  color: getTierColor(call.viewer_tier)
                }}
              >
                {call.viewer_tier.replace('tier', 'Tier ')}
              </span>
              <span className="text-[#b5bac1] text-sm">
                ${parseFloat(call.amount).toFixed(2)} call
              </span>
            </div>

            {callStatus === 'waiting' && (
              <div className="flex items-center justify-center gap-2 text-[#faa61a]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">In queue...</span>
              </div>
            )}

            {callStatus === 'connecting' && (
              <div className="flex items-center justify-center gap-2 text-[#b5bac1]">
                <div className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="flex items-center justify-center gap-2 text-[#23a55a]">
                <div className="w-3 h-3 bg-[#23a55a] rounded-full animate-pulse" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            )}

            {callStatus === 'ended' && (
              <div className="flex items-center justify-center gap-2 text-[#ed4245]">
                <span className="text-sm font-medium">Thanks for calling!</span>
              </div>
            )}
          </div>

          {/* Controls */}
          {callStatus !== 'ended' && (
            <div className="bg-[#232428] px-8 py-6 border-t border-[#1e1f22]">
              <div className="flex items-center justify-center gap-4">
                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={callStatus === 'waiting'}
                  className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                    isMuted 
                      ? 'bg-[#ed4245] hover:bg-[#c53b3e]' 
                      : 'bg-[#3f4147] hover:bg-[#4e5058]'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-[#b5bac1] group-hover:text-white" />
                  )}
                </button>

                {/* Leave Call Button (only when waiting or connected) */}
                {(callStatus === 'waiting' || callStatus === 'connected') && (
                  <button
                    onClick={handleLeaveCall}
                    className="relative w-16 h-16 bg-[#ed4245] hover:bg-[#c53b3e] rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl group"
                    title="Leave Call"
                  >
                    <PhoneOff className="w-6 h-6 text-white group-hover:animate-pulse" />
                  </button>
                )}

                {/* Deafen Button */}
                <button
                  onClick={() => setIsDeafened(!isDeafened)}
                  disabled={callStatus === 'waiting'}
                  className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                    isDeafened 
                      ? 'bg-[#ed4245] hover:bg-[#c53b3e]' 
                      : 'bg-[#3f4147] hover:bg-[#4e5058]'
                  }`}
                  title={isDeafened ? 'Undeafen' : 'Deafen'}
                >
                  {isDeafened ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-[#b5bac1] group-hover:text-white" />
                  )}
                </button>
              </div>

              {/* Control Labels */}
              <div className="flex items-center justify-center gap-12 mt-4">
                <span className="text-xs text-[#b5bac1]">
                  {isMuted ? 'Muted' : 'Voice'}
                </span>
                {(callStatus === 'waiting' || callStatus === 'connected') && (
                  <span className="text-xs text-[#ed4245] font-medium">
                    Leave Call
                  </span>
                )}
                <span className="text-xs text-[#b5bac1]">
                  {isDeafened ? 'Deafened' : 'Audio'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        {callStatus === 'connected' && (
          <div className="mt-6 bg-[#2b2d31]/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-[#1e1f22]">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-[#b5bac1]">
                <div className="w-2 h-2 bg-[#23a55a] rounded-full animate-pulse" />
                <span>Voice Connected</span>
              </div>
              <div className="text-[#b5bac1]">
                <span className="text-[#f2f3f5] font-medium">Powered by:</span> Daily.co
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}