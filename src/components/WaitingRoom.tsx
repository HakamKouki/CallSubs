'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface WaitingRoomProps {
  callRequestId: number;
  streamerUsername: string;
  onCallAccepted: (callData: any) => void;
  onCallRejected: () => void;
}

export default function WaitingRoom({ 
  callRequestId, 
  streamerUsername, 
  onCallAccepted,
  onCallRejected 
}: WaitingRoomProps) {
  const [status, setStatus] = useState<'pending' | 'active' | 'rejected' | 'completed'>('pending');
  const [waitTime, setWaitTime] = useState(0);
  const [dots, setDots] = useState('');

  // Poll for call status every 2 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/call/check?id=${callRequestId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Call status:', data);
          
          if (data.status === 'active' && data.room_url) {
            setStatus('active');
            // Call was accepted, pass the call data to parent
            onCallAccepted(data);
          } else if (data.status === 'rejected') {
            setStatus('rejected');
            onCallRejected();
          } else if (data.status === 'completed') {
            setStatus('completed');
            onCallRejected();
          }
        }
      } catch (error) {
        console.error('Error polling call status:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [callRequestId, onCallAccepted, onCallRejected]);

  // Wait time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animated dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {status === 'pending' && (
          <>
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Your call request has been sent to <span className="font-semibold text-purple-600">{streamerUsername}</span>
            </p>

            {/* Waiting Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
              </div>
            </div>

            {/* Status Text */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
              <p className="text-center text-purple-900 font-medium mb-2">
                Waiting for {streamerUsername} to accept{dots}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                <Clock className="w-4 h-4" />
                <span>Time waiting: {formatWaitTime(waitTime)}</span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 text-sm mb-1">
                    Keep this page open!
                  </p>
                  <p className="text-yellow-800 text-xs">
                    You'll automatically join the call when {streamerUsername} accepts your request. 
                    Closing this page will cancel your call.
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">
                💡 <span className="font-medium">Tip:</span> Have your microphone ready
              </p>
              <p className="text-xs text-gray-500 text-center">
                🎧 <span className="font-medium">Tip:</span> Use headphones for better audio quality
              </p>
            </div>
          </>
        )}

        {status === 'rejected' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Call Request Declined
            </h1>
            <p className="text-center text-gray-600 mb-6">
              {streamerUsername} declined your call request. Your payment will be refunded.
            </p>
            <button
              onClick={() => window.location.href = `/call/${streamerUsername}`}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}