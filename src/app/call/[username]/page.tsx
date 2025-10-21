'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Phone, Clock, DollarSign, Shield, Check, User, Loader2, AlertCircle, Crown, FileText, CheckSquare, Sparkles, Zap } from 'lucide-react';
import WaitingRoom from '@/components/WaitingRoom';
import ActiveCallSimple from '@/components/ActiveCallSimple';
import CallCompleted from '@/components/CallCompleted';
import Image from 'next/image';

interface StreamerData {
  username: string;
  displayName: string;
  profileImage: string;
  callPrice: number;
  callDuration: number;
  isAcceptingCalls: boolean;
  isLive: boolean;
  minSubTier?: string;
  callRules?: string;
  requireRulesAgreement?: boolean;
}

export default function CallRequestPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const { data: session, status } = useSession();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [streamerData, setStreamerData] = useState<StreamerData | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [rulesAgreed, setRulesAgreed] = useState(false);
  
  // Call state management
  const [callState, setCallState] = useState<'idle' | 'waiting' | 'active' | 'completed'>('idle');
  const [callRequestId, setCallRequestId] = useState<number | null>(null);
  const [activeCallData, setActiveCallData] = useState<any>(null);

  useEffect(() => {
    const fetchStreamerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/streamer/${username}`);
        
        if (response.ok) {
          const data = await response.json();
          setStreamerData(data);
        } else {
          setError('Streamer not found');
        }
      } catch (err) {
        setError('Failed to load streamer data');
      } finally {
        setLoading(false);
      }
    };

    fetchStreamerData();
  }, [username]);

  useEffect(() => {
    if (session && streamerData) {
      checkSubscription();
    }
  }, [session, streamerData]);

  useEffect(() => {
    const success = searchParams.get('success');
    const callId = searchParams.get('call_request_id');

    if (success === 'true' && callId) {
      console.log('Payment successful, showing waiting room for call:', callId);
      setCallState('waiting');
      setCallRequestId(Number(callId));
    }
  }, [searchParams]);

  const checkSubscription = async () => {
    setCheckingSubscription(true);
    try {
      const response = await fetch('/api/twitch/check-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamerUsername: username })
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleRequestCall = async () => {
    if (!session) {
      signIn('twitch', { callbackUrl: `/call/${username}` });
      return;
    }
  
    if (!subscriptionStatus?.isSubscribed) {
      setError('You must be subscribed to this channel to request a call');
      return;
    }
  
    if (!subscriptionStatus?.meetsRequirement) {
      setError(subscriptionStatus?.message || 'You do not meet the subscription tier requirement');
      return;
    }

    if (streamerData?.requireRulesAgreement && !rulesAgreed) {
      setError('You must agree to the call rules before proceeding');
      return;
    }
  
    setIsSubmitting(true);
    setError('');
  
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamerUsername: username,
          amount: streamerData!.callPrice,
          duration: streamerData!.callDuration,
          tier: subscriptionStatus.tier
        })
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }
  
      const { url } = await response.json();
      window.location.href = url;
  
    } catch (err: any) {
      setError(err.message || 'Failed to process payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCallAccepted = (callData: any) => {
    console.log('Call accepted! Moving to active call:', callData);
    setActiveCallData(callData);
    setCallState('active');
  };

  const handleCallRejected = () => {
    console.log('Call was rejected or cancelled');
    setCallState('idle');
    setCallRequestId(null);
    setActiveCallData(null);
  };

  const handleEndCall = () => {
    console.log('Call ended');
    setCallState('completed');
  };

  const handleBookAnother = () => {
    setCallState('idle');
    setActiveCallData(null);
    setCallRequestId(null);
  };

  const getTierLabel = (tier: string) => {
    switch(tier) {
      case 'tier1': return 'Tier 1+';
      case 'tier2': return 'Tier 2+';
      case 'tier3': return 'Tier 3 Only';
      default: return 'Tier 1+';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch(tier) {
      case 'tier1': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'tier2': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'tier3': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  if (callState === 'completed' && activeCallData) {
    return (
      <CallCompleted
        streamerUsername={username}
        streamerDisplayName={streamerData?.displayName || username}
        callDuration={activeCallData.duration}
        onBookAnother={handleBookAnother}
      />
    );
  }

  if (callState === 'waiting' && callRequestId) {
    return (
      <WaitingRoom
        callRequestId={callRequestId}
        streamerUsername={username}
        onCallAccepted={handleCallAccepted}
        onCallRejected={handleCallRejected}
      />
    );
  }

  if (callState === 'active' && activeCallData) {
    return (
      <ActiveCallSimple
        callRequest={activeCallData}
        onEndCall={handleEndCall}
        role="viewer"
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !streamerData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl text-white font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!streamerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Premium Header with CallSubs Branding */}
      <header className="relative border-b border-gray-800/50 bg-[#1a1a1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/50 p-2">
                <Image 
                  src="/logo.svg" 
                  alt="CallSubs" 
                  width={24} 
                  height={24}
                  className="w-full h-full"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a] animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold text-white text-lg">CallSubs</span>
              <p className="text-xs text-gray-400">Premium Creator Calls</p>
            </div>
          </div>
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-gray-800 rounded-lg">
                {session.user?.image && (
                  <img src={session.user.image} alt="User" className="w-6 h-6 rounded-full" />
                )}
                <span className="text-sm text-gray-300">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: `/call/${username}` })}
                className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('twitch', { callbackUrl: `/call/${username}` })}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-600/30"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Streamer Info */}
          <div className="space-y-6">
            {/* Streamer Card with Premium Design */}
            <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-6 border border-gray-800/50 relative overflow-hidden group hover:border-purple-500/30 transition-all">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img 
                      src={streamerData.profileImage} 
                      alt={streamerData.displayName}
                      className="w-20 h-20 rounded-full border-4 border-purple-500/30 shadow-lg"
                    />
                    {streamerData.isLive && (
                      <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-red-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-1">{streamerData.displayName}</h1>
                    <p className="text-sm text-gray-400">@{streamerData.username}</p>
                    {streamerData.isAcceptingCalls && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-medium">
                        <Zap className="w-3 h-3" />
                        Available Now
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Call Details */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-medium">Call Price</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">${streamerData.callPrice.toFixed(2)}</span>
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <span className="text-lg font-bold text-white">{Math.floor(streamerData.callDuration / 60)} min {streamerData.callDuration % 60} sec</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">Required Tier</span>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getTierBadgeColor(streamerData.minSubTier || 'tier1')}`}>
                      {getTierLabel(streamerData.minSubTier || 'tier1')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <span className={`text-sm font-medium ${streamerData.isAcceptingCalls ? 'text-green-400' : 'text-red-400'}`}>
                      {streamerData.isAcceptingCalls ? 'Accepting Calls' : 'Not Accepting'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Rules Card */}
            {streamerData.callRules && (
              <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Call Rules</h3>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {streamerData.callRules}
                  </p>
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="space-y-3">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-sm">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white mb-1">Subscriber Only</p>
                    <p className="text-gray-400">You must be subscribed to request a call</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white mb-1">Audio Only</p>
                    <p className="text-gray-400">Calls are audio-only for your safety and privacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Request Call */}
          <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-800/50 sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-purple-400" />
              Request a Call
            </h2>

            {/* Status Messages */}
            {!session && (
              <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400">Sign in required</p>
                    <p className="text-sm text-gray-400 mt-1">You need to sign in with Twitch to request a call</p>
                  </div>
                </div>
              </div>
            )}

            {session && checkingSubscription && (
              <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-sm text-blue-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking your subscription status...
                </p>
              </div>
            )}

            {session && subscriptionStatus && !subscriptionStatus.isSubscribed && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Not Subscribed</p>
                    <p className="text-sm text-gray-400 mt-1">{subscriptionStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            {session && subscriptionStatus && subscriptionStatus.isSubscribed && !subscriptionStatus.meetsRequirement && (
              <div className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-400">Tier Requirement Not Met</p>
                    <p className="text-sm text-gray-400 mt-1">{subscriptionStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            {session && subscriptionStatus && subscriptionStatus.meetsRequirement && (
              <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-400">Eligible to Call!</p>
                    <p className="text-sm text-gray-400 mt-1">{subscriptionStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {!streamerData.isAcceptingCalls && (
              <div className="mb-6 bg-gray-700/30 border border-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-300">
                  <strong>{streamerData.displayName}</strong> is not currently accepting calls. Check back later!
                </p>
              </div>
            )}

            {/* Rules Agreement */}
            {streamerData.callRules && streamerData.requireRulesAgreement && session && subscriptionStatus?.meetsRequirement && (
              <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rulesAgreed}
                    onChange={(e) => setRulesAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 bg-black border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                      I have read and agree to follow the call rules
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      You must agree to the rules before proceeding to payment
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* User Info & Price */}
            <div className="space-y-4 mb-6">
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Your Information</span>
                </div>
                <p className="text-sm text-gray-400">
                  {session ? `Signed in as ${session.user?.name}` : 'Not signed in'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 border-2 border-purple-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Total Amount</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">${streamerData.callPrice.toFixed(2)}</span>
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">For a {Math.floor(streamerData.callDuration / 60)}-minute premium call</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleRequestCall}
              disabled={
                !session || 
                !streamerData.isAcceptingCalls || 
                isSubmitting || 
                checkingSubscription ||
                !subscriptionStatus?.meetsRequirement ||
                (streamerData.requireRulesAgreement && !rulesAgreed)
              }
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-bold text-lg disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {session ? 'Request Call Now' : 'Sign in to Request'}
                </>
              )}
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              Secured by <span className="text-purple-400 font-medium">CallSubs</span> • Safe & Private
            </p>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-full">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center p-1">
              <Image 
                src="/logo.svg" 
                alt="CallSubs" 
                width={12} 
                height={12}
                className="w-full h-full"
              />
            </div>
            <span className="text-sm text-gray-400">Powered by <span className="text-white font-semibold">CallSubs</span></span>
          </div>
        </div>
      </main>
    </div>
  );
}