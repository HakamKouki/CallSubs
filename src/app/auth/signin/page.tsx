'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/50 p-2">
              <Image 
                src="/logo.svg" 
                alt="CallSubs Logo" 
                width={32} 
                height={32}
                className="w-full h-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-white">CallSubs</h1>
          </div>
          <p className="text-purple-200 text-sm">Sign in to start accepting calls from your community</p>
        </div>

        {/* Sign-in Container */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-800/50 p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Choose your platform</h2>
          
          <div className="space-y-4">
            {/* Twitch Button */}
            <button
              onClick={() => handleSignIn('twitch')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#9146FF] hover:bg-[#7d3ddb] text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading === 'twitch' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              )}
              <span>Continue with Twitch</span>
            </button>

            {/* YouTube Button */}
            <button
              onClick={() => handleSignIn('google')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              )}
              <span>Continue with YouTube</span>
            </button>

            {/* Kick Button (Coming Soon) */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-800 text-gray-500 rounded-xl font-semibold cursor-not-allowed relative overflow-hidden"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.5 13.5l-5 5c-.276.276-.724.276-1 0l-5-5c-.276-.276-.276-.724 0-1l.707-.707c.276-.276.724-.276 1 0L12 14.586V6.5c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v8.086l2.793-2.793c.276-.276.724-.276 1 0l.707.707c.276.276.276.724 0 1z"/>
              </svg>
              <span>Continue with Kick</span>
              <span className="absolute top-2 right-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">
                Soon
              </span>
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}