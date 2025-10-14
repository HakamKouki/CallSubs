'use client';

export const dynamic = 'force-dynamic';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  DollarSign, 
  Phone, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock,
  TrendingUp,
  Save,
  Crown,
  UserCheck,
  UserX
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

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { id: 'payouts', label: 'Payouts', icon: DollarSign, path: '/dashboard/payouts' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-gray-900">CallSubs</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {session?.user?.image && (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-10 h-10 rounded-full border-2 border-purple-200"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">Streamer</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.path !== '/dashboard') {
                    router.push(item.path);
                  }
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left text-sm">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Debug logging for activeCall changes
  useEffect(() => {
    console.log('activeCall state changed:', activeCall);
  }, [activeCall]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStreamerSettings();
      fetchCallQueue();
      
      // Poll for queue updates every 5 seconds (but not during active call)
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
    // Don't fetch queue if there's an active call
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
        
        // If accepting, set active call with the complete data including room info
        if (action === 'accept' && data.callRequest) {
          const call = callQueue.find(c => c.id === callRequestId);
          console.log('Found call in queue:', call);
          
          if (call) {
            const activeCallData = {
              ...call,
              ...data.callRequest, // This includes room_url, room_name from API
              streamer_token: data.callRequest.streamer_token // Token for Daily.co
            };
            console.log('Setting active call:', activeCallData);
            setActiveCall(activeCallData);
            return; // Return early to prevent fetching queue
          }
        }

        // Refresh queue and metrics (only if not accepting)
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
    
    // Complete the call via API
    await handleManageCall(activeCall.id, 'complete');
    
    // Clear active call state
    setActiveCall(null);
    
    // Refresh after call ends
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
      case 'tier1': return 'bg-blue-100 text-blue-700';
      case 'tier2': return 'bg-purple-100 text-purple-700';
      case 'tier3': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
            {session.user?.image && (
              <img src={session.user.image} alt={session.user.name || 'User'} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-xs text-gray-500">Streamer</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold mb-1">Your Public Call Link</h2>
                <p className="text-purple-100 text-sm">Share this link with your viewers so they can request calls</p>
              </div>
              <a href={publicCallLink} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Open in new tab">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 font-mono text-sm break-all">
                {publicCallLink}
              </div>
              <button onClick={handleCopyLink} className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium whitespace-nowrap">
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
              <span className="bg-white/10 px-3 py-1 rounded-full">💡 Add to your Twitch panels</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">📝 Put in your bio</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">💬 Share in chat commands</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Live Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Accepting Calls</span>
                  <button
                    onClick={handleToggleCalls}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAcceptingCalls ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAcceptingCalls ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className={`p-3 rounded-lg ${isAcceptingCalls ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <p className={`text-xs font-medium ${isAcceptingCalls ? 'text-green-700' : 'text-gray-600'}`}>
                    {isAcceptingCalls ? '✓ Link is active - Viewers can request calls' : '○ Link is paused - No new requests'}
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">All Systems Secure</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Call Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Call Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={callPrice}
                      onChange={(e) => setCallPrice(e.target.value)}
                      min="1"
                      max="1000"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="10.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Call Duration (seconds)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      min="30"
                      max="600"
                      step="30"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="300"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{Math.floor(parseInt(callDuration) / 60)} min {parseInt(callDuration) % 60} sec</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-600" />
                      Minimum Subscription Tier
                    </div>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setMinSubTier('tier1')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                        minSubTier === 'tier1' 
                          ? 'bg-blue-100 border-blue-500 text-blue-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Tier 1+
                    </button>
                    <button
                      onClick={() => setMinSubTier('tier2')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                        minSubTier === 'tier2' 
                          ? 'bg-purple-100 border-purple-500 text-purple-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Tier 2+
                    </button>
                    <button
                      onClick={() => setMinSubTier('tier3')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                        minSubTier === 'tier3' 
                          ? 'bg-yellow-100 border-yellow-500 text-yellow-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Tier 3
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Only <span className="font-medium">{getTierLabel(minSubTier)}</span> subscribers can request calls
                  </p>
                </div>

                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400"
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

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Your Metrics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Total Earned</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">${totalEarned.toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-1">After platform fees</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Calls Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{callsCompleted}</p>
                  <p className="text-xs text-blue-600 mt-1">Successful calls</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Call Queue</h2>
              {callQueue.length > 0 && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
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
                <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm font-medium">No calls in queue</p>
                <p className="text-gray-400 text-xs mt-1">Enable calls to start receiving requests</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {callQueue.map((call) => (
                  <div key={call.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <img 
                        src={call.profile_image_url || 'https://via.placeholder.com/40'} 
                        alt={call.viewer_username}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{call.viewer_username}</p>
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
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <UserX className="w-4 h-4"/>
                        Reject
                      </button>
                      <button
                        onClick={() => handleManageCall(call.id, 'accept')}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
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
        </main>
      </div>
    </div>
  );
}