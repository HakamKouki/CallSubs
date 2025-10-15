'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Phone, Clock, DollarSign, Shield, Check, User, Loader2, AlertCircle, Crown, FileText, CheckSquare } from 'lucide-react';
import WaitingRoom from '@/components/WaitingRoom';
import ActiveCallSimple from '@/components/ActiveCallSimple';
import CallCompleted from '@/components/CallCompleted';

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

    // Check if rules agreement is required and not yet agreed
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
      case 'tier1': return 'bg-blue-100 text-blue-700';
      case 'tier2': return 'bg-purple-100 text-purple-700';
      case 'tier3': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !streamerData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-900 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!streamerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-gray-900">CallSubs</span>
          </div>
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm text-gray-700">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: `/call/${username}` })}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('twitch', { callbackUrl: `/call/${username}` })}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={streamerData.profileImage} 
                  alt={streamerData.displayName}
                  className="w-20 h-20 rounded-full border-4 border-purple-100"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{streamerData.displayName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {streamerData.isLive && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                        LIVE
                      </span>
                    )}
                    <span className="text-sm text-gray-500">@{streamerData.username}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">Call Price</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">${streamerData.callPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{Math.floor(streamerData.callDuration / 60)} min {streamerData.callDuration % 60} sec</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Crown className="w-5 h-5" />
                    <span className="text-sm font-medium">Required Tier</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getTierBadgeColor(streamerData.minSubTier || 'tier1')}`}>
                    {getTierLabel(streamerData.minSubTier || 'tier1')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span className={`text-sm font-medium ${streamerData.isAcceptingCalls ? 'text-green-600' : 'text-red-600'}`}>
                    {streamerData.isAcceptingCalls ? 'Accepting Calls' : 'Not Accepting'}
                  </span>
                </div>
              </div>
            </div>

            {/* Call Rules Section */}
            {streamerData.callRules && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Call Rules</h3>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {streamerData.callRules}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="bg-purple-50 rounded-lg p-4 text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900 mb-1">Subscriber Only</p>
                    <p className="text-purple-700">You must be subscribed to request a call</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Audio Only</p>
                    <p className="text-blue-700">Calls are audio-only for your safety and privacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Request a Call</h2>

            {!session && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Sign in required:</strong> You need to sign in with Twitch to request a call.
                </p>
              </div>
            )}

            {session && checkingSubscription && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                  Checking your subscription status...
                </p>
              </div>
            )}

            {session && subscriptionStatus && !subscriptionStatus.isSubscribed && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Not Subscribed</p>
                    <p className="text-sm text-red-700 mt-1">{subscriptionStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            {session && subscriptionStatus && subscriptionStatus.isSubscribed && !subscriptionStatus.meetsRequirement && (
              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Tier Requirement Not Met</p>
                    <p className="text-sm text-orange-700 mt-1">{subscriptionStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            {session && subscriptionStatus && subscriptionStatus.meetsRequirement && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Eligible to Call!</p>
                    <p className="text-sm text-green-700 mt-1">{subscriptionStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {!streamerData.isAcceptingCalls && (
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>{streamerData.displayName}</strong> is not currently accepting calls. Check back later!
                </p>
              </div>
            )}

            {/* Rules Agreement Checkbox */}
            {streamerData.callRules && streamerData.requireRulesAgreement && session && subscriptionStatus?.meetsRequirement && (
              <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rulesAgreed}
                    onChange={(e) => setRulesAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      I have read and agree to follow the call rules
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      You must agree to the rules before proceeding to payment
                    </p>
                  </div>
                </label>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Your Information</span>
                </div>
                <p className="text-sm text-gray-600">
                  {session ? `Signed in as ${session.user?.name}` : 'Not signed in'}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">${streamerData.callPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-600">For a {Math.floor(streamerData.callDuration / 60)}-minute call</p>
              </div>
            </div>

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
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  {session ? 'Request Call' : 'Sign in to Request'}
                </>
              )}
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              By requesting a call, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}