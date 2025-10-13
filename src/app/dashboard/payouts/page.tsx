'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Clock
} from 'lucide-react';

interface StripeStatus {
  connected: boolean;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  accountId?: string;
}

export default function PayoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [callsCompleted, setCallsCompleted] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  // Check for success/refresh params
  useEffect(() => {
    const success = searchParams.get('success');
    const refresh = searchParams.get('refresh');

    if (success === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      // Remove query params
      router.replace('/dashboard/payouts');
    }

    if (refresh === 'true') {
      fetchData();
      router.replace('/dashboard/payouts');
    }
  }, [searchParams, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Stripe status
      const statusResponse = await fetch('/api/stripe/connect/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setStripeStatus(statusData);
      }

      // Fetch streamer stats
      const statsResponse = await fetch('/api/streamer/settings');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setTotalEarned(parseFloat(statsData.total_earned) || 0);
        setCallsCompleted(statsData.calls_completed || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Failed to start Stripe onboarding');
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      alert('Error connecting to Stripe');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleOpenStripeDashboard = async () => {
    try {
      const response = await fetch('/api/stripe/connect/dashboard', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank');
      } else {
        alert('Failed to open Stripe dashboard');
      }
    } catch (error) {
      console.error('Error opening Stripe dashboard:', error);
      alert('Error opening Stripe dashboard');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const platformFee = 0.10; // 10% platform fee
  const estimatedPayout = totalEarned * (1 - platformFee);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payouts</h1>
          <p className="text-gray-600">Manage your earnings and payment settings</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Stripe Connected Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your account is now set up to receive payouts. You can manage your payment details anytime.
              </p>
            </div>
          </div>
        )}

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Total Earned</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalEarned.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Gross earnings before fees</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Estimated Payout</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${estimatedPayout.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">After {(platformFee * 100)}% platform fee</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Calls Completed</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{callsCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">Total successful calls</p>
          </div>
        </div>

        {/* Stripe Connect Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Payment Account</h2>
                <p className="text-sm text-gray-600">Connect your Stripe account to receive payouts</p>
              </div>
              {stripeStatus?.connected && stripeStatus?.onboardingComplete && (
                <button
                  onClick={handleOpenStripeDashboard}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Stripe Dashboard
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {!stripeStatus?.connected ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Stripe Account</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  To receive payouts, you need to connect a Stripe account. This is quick, secure, and free.
                </p>
                <button
                  onClick={handleConnectStripe}
                  disabled={isConnecting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-400"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Connect Stripe Account
                    </>
                  )}
                </button>
              </div>
            ) : !stripeStatus.onboardingComplete ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-2">Complete Your Stripe Setup</h3>
                    <p className="text-sm text-yellow-700 mb-4">
                      Your Stripe account is connected, but you need to complete the onboarding process to receive payouts.
                    </p>
                    <button
                      onClick={handleConnectStripe}
                      disabled={isConnecting}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Complete Setup'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2">Account Active</h3>
                      <p className="text-sm text-green-700">
                        Your Stripe account is fully set up and ready to receive payouts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    {stripeStatus.chargesEnabled ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">Charges</p>
                      <p className="text-xs text-gray-600">
                        {stripeStatus.chargesEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    {stripeStatus.payoutsEnabled ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payouts</p>
                      <p className="text-xs text-gray-600">
                        {stripeStatus.payoutsEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How Payouts Work */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How Payouts Work</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>CallSubs takes a {(platformFee * 100)}% platform fee from each call</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Stripe automatically pays out to your bank account (typically 2-3 business days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>You can view detailed transaction history in your Stripe Dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>All payments are secure and PCI-compliant</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}