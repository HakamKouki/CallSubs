'use client';

import { CheckCircle, Phone, Home } from 'lucide-react';

interface CallCompletedProps {
  streamerUsername: string;
  streamerDisplayName: string;
  callDuration: number;
  onBookAnother: () => void;
}

export default function CallCompleted({ 
  streamerUsername, 
  streamerDisplayName,
  callDuration,
  onBookAnother 
}: CallCompletedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Call Completed!
        </h1>
        
        {/* Message */}
        <p className="text-center text-gray-600 mb-8">
          Thanks for calling <span className="font-semibold text-purple-600">{streamerDisplayName}</span>! 
          Your {Math.floor(callDuration / 60)}-minute call has ended.
        </p>

        {/* Stats */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-purple-700 mb-2">Total call time</p>
            <p className="text-3xl font-bold text-purple-900">
              {Math.floor(callDuration / 60)} min {callDuration % 60} sec
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onBookAnother}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            <Phone className="w-5 h-5" />
            Book Another Call
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center text-gray-500 mt-6">
          We hope you enjoyed your call! 💜
        </p>
      </div>
    </div>
  );
}