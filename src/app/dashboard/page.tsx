'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Phone, 
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock,
  TrendingUp,
  Save,
  Crown,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';
import ActiveCallSimple from '@/components/ActiveCallSimple';

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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Widget 1: Live Status
  const [isAcceptingCalls, setIsAcceptingCalls] = useState(false);
  
  // Widget 2: Call Settings
  const [callPrice, setCallPrice] = useState('10.00');
  const [callDuration, setCallDuration] = useState('300');
  const [minSubTier, setMinSubTier] = useState('tier1');
  const [isSaving, setIsSaving] = useState(false);
  
  // Widget 3: Metrics
  const [totalEarned, setTotalEarned] = useState(0);
  const [callsCompleted, setCallsCompleted] = useState(0);

  // Call Queue
  const [callQueue, setCallQueue] = useState<CallRequest[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);

  // Active Call
  const [activeCall, setActiveCall] = useState<CallRequest | null>(null);

  const username = session?.user?.name?.toLowerCase().replace(/\s+/g, '') || 'streamer';
  const publicCallLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/call/${username}`;

  useEffect(() => {
    console.log('activeCall state changed:', activeCall);
  }, [activeCall]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStreamerSettings();
      fetchCallQueue();
      
      const interval = setInterval(() => {
        if (!activeCall) {
          fetchCallQueue();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status, activeCall]);

  const fetchStreamerSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/streamer/settings');
      
      if (response.ok) {
        const data = await response.json();
        setCallPrice(data.call_price?.toString() || '10.00');
        setCallDuration(data.call_duration?.toString() || '300');
        setMinSubTier(data.min_sub_tier || 'tier1');
        setIsAcceptingCalls(data.is_accepting_calls || false);
        setTotalEarned(parseFloat(data.total_earned) || 0);
        setCallsCompleted(data.calls_completed || 0);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCallQueue = async () => {
    if (activeCall) {
      console.log('Skipping queue fetch - active call in progress');
      return;
    }
    
    try {
      setLoadingQueue(true);
      const response = await fetch('/api/call/queue');
      
      if (response.ok) {
        const data = await response.json();
        setCallQueue(data.queue || []);
      }
    } catch (error) {
      console.error('Error fetching call queue:', error);
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleManageCall = async (callRequestId: number, action: 'accept' | 'reject' | 'complete') => {
    try {
      console.log('handleManageCall called:', { callRequestId, action });
      
      const response = await fetch('/api/call/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callRequestId, action })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Call manage response:', data);
        
        if (action === 'accept' && data.callRequest) {
          const call = callQueue.find(c => c.id === callRequestId);
          console.log('Found call in queue:', call);
          
          if (call) {
            const activeCallData = {
              ...call,
              ...data.callRequest,
              streamer_token: data.callRequest.streamer_token
            };
            console.log('Setting active call:', activeCallData);
            setActiveCall(activeCallData);
            return;
          }
        }

        if (action !== 'accept') {
          await fetchCallQueue();
          await fetchStreamerSettings();
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to manage call:', errorData);
        alert(`Failed to manage call request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error managing call:', error);
      alert('Error managing call request');
    }
  };

  const handleEndCall = async () => {
    if (!activeCall) return;

    console.log('Ending call:', activeCall.id);
    
    await handleManageCall(activeCall.id, 'complete');
    setActiveCall(null);
    
    await fetchCallQueue();
    await fetchStreamerSettings();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicCallLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleCalls = async () => {
    const newStatus = !isAcceptingCalls;
    setIsAcceptingCalls(newStatus);
    
    try {
      await fetch('/api/streamer/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callPrice: parseFloat(callPrice),
          callDuration: parseInt(callDuration),
          minSubTier,
          isAcceptingCalls: newStatus
        })
      });
    } catch (error) {
      console.error('Error toggling calls:', error);
      setIsAcceptingCalls(!newStatus);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    const price = parseFloat(callPrice);
    const duration = parseInt(callDuration);
    
    if (isNaN(price) || price < 1 || price > 1000) {
      alert('Please enter a valid price between $1 and $1000');
      setIsSaving(false);
      return;
    }
    
    if (isNaN(duration) || duration < 30 || duration > 600) {
      alert('Please enter a valid duration between 30 and 600 seconds');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/streamer/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callPrice: price,
          callDuration: duration,
          minSubTier,
          isAcceptingCalls
        })
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const getTierLabel = (tier: string) => {
    switch(tier) {
      case 'tier1': return 'Tier 1 & Above';
      case 'tier2': return 'Tier 2 & Above';
      case 'tier3': return 'Tier 3 Only';
      default: return 'Tier 1 & Above';
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

  const getWaitingTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000);
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-8 bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Show Active Call UI if there's an active call
  if (activeCall) {
    console.log('Rendering ActiveCall component with:', activeCall);
    return (
      <ActiveCallSimple 
        key={activeCall.id} 
        callRequest={activeCall} 
        onEndCall={handleEndCall}
        role="streamer"
      />
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-[#0a0a0a] min-h-screen">
      {/* Public Call Link Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-2xl shadow-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold mb-1 text-white">Your Public Call Link</h2>
              <p className="text-purple-100 text-sm">Share this link with your viewers so they can request calls</p>
            </div>
            <a 
              href={publicCallLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 font-mono text-sm break-all text-white border border-white/20">
              {publicCallLink}
            </div>
            <button 
              onClick={handleCopyLink} 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all font-semibold whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-purple-100">
            <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">💡 Add to your Twitch panels</span>
            <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">📝 Put in your bio</span>
            <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">💬 Share in chat commands</span>
          </div>
        </div>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Status Card */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Phone className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Live Status</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Accepting Calls</span>
              <button
                onClick={handleToggleCalls}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isAcceptingCalls ? 'bg-purple-600 shadow-lg shadow-purple-500/50' : 'bg-gray-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAcceptingCalls ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className={`p-3 rounded-lg border ${isAcceptingCalls ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
              <p className={`text-xs font-medium ${isAcceptingCalls ? 'text-green-400' : 'text-gray-400'}`}>
                {isAcceptingCalls ? '✓ Link is active - Viewers can request calls' : '○ Link is paused - No new requests'}
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">All Systems Secure</span>
            </div>
          </div>
        </div>

        {/* Call Settings Card */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Call Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Call Price ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={callPrice}
                  onChange={(e) => setCallPrice(e.target.value)}
                  min="1"
                  max="1000"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="10.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Call Duration (seconds)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={callDuration}
                  onChange={(e) => setCallDuration(e.target.value)}
                  min="30"
                  max="600"
                  step="30"
                  className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="300"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.floor(parseInt(callDuration) / 60)} min {parseInt(callDuration) % 60} sec</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-400" />
                  Minimum Subscription Tier
                </div>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMinSubTier('tier1')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    minSubTier === 'tier1' 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20' 
                      : 'bg-black/40 border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  Tier 1+
                </button>
                <button
                  onClick={() => setMinSubTier('tier2')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    minSubTier === 'tier2' 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/20' 
                      : 'bg-black/40 border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  Tier 2+
                </button>
                <button
                  onClick={() => setMinSubTier('tier3')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    minSubTier === 'tier3' 
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-lg shadow-yellow-500/20' 
                      : 'bg-black/40 border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  Tier 3
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Only <span className="font-medium text-gray-400">{getTierLabel(minSubTier)}</span> subscribers can request calls
              </p>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:bg-gray-700 disabled:text-gray-500 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metrics Card */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Your Metrics</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-green-400">Total Earned</span>
              </div>
              <p className="text-3xl font-bold text-green-400">${totalEarned.toFixed(2)}</p>
              <p className="text-xs text-green-500/70 mt-1">After platform fees</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">Calls Completed</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">{callsCompleted}</p>
              <p className="text-xs text-blue-500/70 mt-1">Successful calls</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call Queue Section */}
      <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Call Queue</h2>
          {callQueue.length > 0 && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-medium rounded-full border border-purple-500/30">
              {callQueue.length} pending
            </span>
          )}
        </div>
        
        {loadingQueue && callQueue.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading queue...</p>
          </div>
        ) : callQueue.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-sm font-medium">No calls in queue</p>
            <p className="text-gray-600 text-xs mt-1">Enable calls to start receiving requests</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {callQueue.map((call) => (
              <div key={call.id} className="py-4 flex items-center justify-between hover:bg-white/5 transition-colors rounded-lg px-2">
                <div className="flex items-center gap-4 flex-1">
                  <img 
                    src={call.profile_image_url || 'https://via.placeholder.com/40'} 
                    alt={call.viewer_username}
                    className="w-12 h-12 rounded-full border-2 border-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{call.viewer_username}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getTierBadgeColor(call.viewer_tier)}`}>
                        {call.viewer_tier.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${parseFloat(call.amount).toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <span>Waiting: {getWaitingTime(call.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleManageCall(call.id, 'reject')}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                  >
                    <UserX className="w-4 h-4"/>
                    Reject
                  </button>
                  <button
                    onClick={() => handleManageCall(call.id, 'accept')}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50"
                  >
                    <UserCheck className="w-4 h-4" />
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}