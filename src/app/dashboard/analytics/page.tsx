'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  DollarSign,
  Phone,
  TrendingUp,
  Clock,
  Users,
  Calendar,
  Activity,
  Award,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';

interface AnalyticsData {
  totalEarned: number;
  callsCompleted: number;
  totalCallTime: number;
  averageCallDuration: number;
  topTier: string;
  recentCalls: Array<{
    id: number;
    viewer_username: string;
    amount: string;
    duration: number;
    created_at: string;
    viewer_tier: string;
  }>;
  earningsByMonth: Array<{
    month: string;
    earnings: number;
  }>;
  callsByTier: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-8 bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'tier1': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'tier2': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'tier3': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Earned */}
          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center text-green-400 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span className="ml-1">12%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              ${analytics.totalEarned.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">Total Earned</p>
          </div>

          {/* Calls Completed */}
          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span className="ml-1">8%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {analytics.callsCompleted}
            </p>
            <p className="text-sm text-gray-400">Calls Completed</p>
          </div>

          {/* Total Call Time */}
          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span className="ml-1">15%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {formatTime(analytics.totalCallTime)}
            </p>
            <p className="text-sm text-gray-400">Total Call Time</p>
          </div>

          {/* Average Duration */}
          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <span className="ml-1">—</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {formatTime(analytics.averageCallDuration)}
            </p>
            <p className="text-sm text-gray-400">Avg Call Duration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Earnings by Month Chart */}
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Earnings Over Time</h2>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {analytics.earningsByMonth.map((month, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">{month.month}</span>
                    <span className="text-sm font-semibold text-white">
                      ${month.earnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all shadow-lg shadow-purple-600/30"
                      style={{
                        width: `${(month.earnings / Math.max(...analytics.earningsByMonth.map(m => m.earnings))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {analytics.earningsByMonth.length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No earnings data yet</p>
                <p className="text-gray-600 text-xs mt-1">Complete calls to see your earnings trend</p>
              </div>
            )}
          </div>

          {/* Calls by Tier */}
          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Calls by Tier</h2>
              <Award className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {/* Tier 3 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                    <span className="text-sm font-medium text-gray-400">Tier 3</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {analytics.callsByTier.tier3}
                  </span>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full shadow-lg shadow-yellow-500/30"
                    style={{
                      width: analytics.callsCompleted > 0 ? `${(analytics.callsByTier.tier3 / analytics.callsCompleted) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>

              {/* Tier 2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                    <span className="text-sm font-medium text-gray-400">Tier 2</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {analytics.callsByTier.tier2}
                  </span>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full shadow-lg shadow-purple-500/30"
                    style={{
                      width: analytics.callsCompleted > 0 ? `${(analytics.callsByTier.tier2 / analytics.callsCompleted) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>

              {/* Tier 1 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                    <span className="text-sm font-medium text-gray-400">Tier 1</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {analytics.callsByTier.tier1}
                  </span>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full shadow-lg shadow-blue-500/30"
                    style={{
                      width: analytics.callsCompleted > 0 ? `${(analytics.callsByTier.tier1 / analytics.callsCompleted) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>
            </div>

            {analytics.callsCompleted === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No calls yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h2 className="text-lg font-semibold text-white">Recent Calls</h2>
          </div>

          {analytics.recentCalls.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Viewer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {analytics.recentCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {call.viewer_username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTierColor(call.viewer_tier)}`}>
                          {call.viewer_tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatTime(call.duration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                        ${parseFloat(call.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(call.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No calls yet</p>
              <p className="text-gray-600 text-sm mt-1">Your recent calls will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}