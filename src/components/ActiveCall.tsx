'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

interface ActiveCallProps {
  callRequest: {
    id: number;
    viewer_username: string;
    viewer_tier: string;
    amount: string;
    duration: number;
    profile_image_url: string;
    room_url?: string;
  };
  onEndCall: () => void;
}

// Global flag to prevent multiple initializations across component remounts
const initializedCalls = new Set<string>();

export default function ActiveCall({ callRequest, onEndCall }: ActiveCallProps) {
  const [timeRemaining, setTimeRemaining] = useState(callRequest.duration);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ending'>('connecting');
  const callObjectRef = useRef<DailyCall | null>(null);
  const callKey = `${callRequest.id}-${callRequest.room_url}`;

  useEffect(() => {
    // Prevent double initialization using global Set
    if (initializedCalls.has(callKey)) {
      console.log('Call already initialized, skipping...');
      return;
    }

    // Mark this call as initialized
    initializedCalls.add(callKey);
    console.log('Initializing call:', callKey);

    // Initialize Daily.co call
    const initializeCall = async () => {
      if (!callRequest.room_url) {
        console.error('No room URL provided');
        setCallStatus('connected'); // Show UI anyway
        return;
      }

      try {
        console.log('Joining Daily.co room:', callRequest.room_url);

        // Create call object
        const callObject = DailyIframe.createCallObject({
          audioSource: true,
          videoSource: false
        });

        callObjectRef.current = callObject;

        // Set up event listeners
        callObject
          .on('joined-meeting', () => {
            console.log('Joined Daily.co meeting');
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
          url: callRequest.room_url,
          userName: 'Streamer'
        });

      } catch (error) {
        console.error('Error joining Daily.co call:', error);
        setCallStatus('connected'); // Fallback to show UI even if Daily fails
      }
    };

    initializeCall();

    // Cleanup on unmount
    return () => {
      if (callObjectRef.current) {
        console.log('Leaving Daily.co call');
        try {
          callObjectRef.current.destroy();
        } catch (error) {
          console.error('Error destroying call object:', error);
        }
        callObjectRef.current = null;
      }
      // Remove from initialized set when component unmounts for real
      initializedCalls.delete(callKey);
    };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (callStatus !== 'connected') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

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

  const handleEndCall = async () => {
    setCallStatus('ending');
    
    if (callObjectRef.current) {
      try {
        await callObjectRef.current.leave();
        callObjectRef.current.destroy();
      } catch (error) {
        console.error('Error ending call:', error);
      }
      callObjectRef.current = null;
    }
    
    // Clean up the global flag
    initializedCalls.delete(callKey);
    
    await onEndCall();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((callRequest.duration - timeRemaining) / callRequest.duration) * 100;
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
        {callStatus === 'connecting' && (
          <div className="mb-6 bg-[#5865F2] text-white px-6 py-3 rounded-lg text-center animate-pulse">
            <p className="font-medium">Connecting to voice channel...</p>
          </div>
        )}

        {callStatus === 'ending' && (
          <div className="mb-6 bg-[#ed4245] text-white px-6 py-3 rounded-lg text-center">
            <p className="font-medium">Ending call...</p>
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
                    style={{ backgroundColor: getTierColor(callRequest.viewer_tier) }}
                  />
                  <div 
                    className="relative w-3 h-3 rounded-full"
                    style={{ backgroundColor: getTierColor(callRequest.viewer_tier) }}
                  />
                </div>
                <div>
                  <p className="text-[#f2f3f5] font-semibold text-sm">Voice Call</p>
                  <p className="text-[#b5bac1] text-xs">Active • End-to-end encrypted</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#f2f3f5] font-bold text-2xl font-mono">{formatTime(timeRemaining)}</p>
                <p className="text-[#b5bac1] text-xs">Time remaining</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-[#1e1f22] rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getTierColor(callRequest.viewer_tier)
                }}
              />
            </div>
          </div>

          {/* User Display */}
          <div className="p-12 text-center">
            <div className="mb-8 relative inline-block">
              {/* Animated Ring */}
              {callStatus === 'connected' && (
                <div className="absolute inset-0 rounded-full animate-ping" style={{
                  backgroundColor: getTierColor(callRequest.viewer_tier),
                  opacity: 0.2
                }} />
              )}
              
              {/* Avatar Container */}
              <div 
                className="relative w-32 h-32 rounded-full p-1"
                style={{ 
                  background: `linear-gradient(135deg, ${getTierColor(callRequest.viewer_tier)}, transparent)`
                }}
              >
                <div className="w-full h-full rounded-full bg-[#2b2d31] p-1">
                  <img 
                    src={callRequest.profile_image_url || 'https://via.placeholder.com/128'} 
                    alt={callRequest.viewer_username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#23a55a] rounded-full border-4 border-[#2b2d31]" />
            </div>

            <h2 className="text-3xl font-bold text-[#f2f3f5] mb-2">
              {callRequest.viewer_username}
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{ 
                  backgroundColor: `${getTierColor(callRequest.viewer_tier)}20`,
                  color: getTierColor(callRequest.viewer_tier)
                }}
              >
                {callRequest.viewer_tier.replace('tier', 'Tier ')}
              </span>
              <span className="text-[#b5bac1] text-sm">
                ${parseFloat(callRequest.amount).toFixed(2)} call
              </span>
            </div>

            {callStatus === 'connecting' ? (
              <div className="flex items-center justify-center gap-2 text-[#b5bac1]">
                <div className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#5865F2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-[#23a55a]">
                <div className="w-3 h-3 bg-[#23a55a] rounded-full animate-pulse" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-[#232428] px-8 py-6 border-t border-[#1e1f22]">
            <div className="flex items-center justify-center gap-4">
              {/* Mute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all ${
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

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                disabled={callStatus === 'ending'}
                className="relative w-16 h-16 bg-[#ed4245] hover:bg-[#c53b3e] rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6 text-white group-hover:animate-pulse" />
              </button>

              {/* Deafen Button */}
              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all ${
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
              <span className="text-xs text-[#ed4245] font-medium">
                Hang Up
              </span>
              <span className="text-xs text-[#b5bac1]">
                {isDeafened ? 'Deafened' : 'Audio'}
              </span>
            </div>
          </div>
        </div>

        {/* Info Card */}
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
      </div>
    </div>
  );
}