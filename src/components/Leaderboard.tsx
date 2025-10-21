'use client';

import { useEffect, useState } from 'react';
import { Trophy, Crown, Medal, TrendingUp, Clock, DollarSign, Zap, Flame } from 'lucide-react';

interface LeaderboardEntry {
  viewer_username: string;
  total_calls: number;
  total_spent: string;
  total_minutes: number;
  last_call_at: string;
}

interface LeaderboardProps {
  streamerUsername: string;
}

export default function Leaderboard({ streamerUsername }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [streamerUsername]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/leaderboard/${streamerUsername}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{index + 1}</div>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-600/50';
      case 1:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/50';
      case 2:
        return 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/50';
      default:
        return 'bg-[#1a1a1a] border border-gray-800';
    }
  };

  const isRecent = (lastCallAt: string) => {
    const lastCall = new Date(lastCallAt);
    const now = new Date();
    const daysDiff = (now.getTime() - lastCall.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 7; // Active in last 7 days
  };

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Top Supporters</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-sm">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Top Supporters</h2>
        </div>
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No calls yet</p>
          <p className="text-gray-600 text-sm mt-1">Be the first to appear on the leaderboard!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Top Supporters</h2>
          </div>
          <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <span className="text-xs text-purple-400 font-medium">Live Rankings</span>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.viewer_username}
              className={`${getRankBadge(index)} rounded-xl p-4 transition-all hover:scale-[1.02] group`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Icon */}
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold truncate ${index < 3 ? 'text-white' : 'text-white'}`}>
                      {entry.viewer_username}
                    </p>
                    {isRecent(entry.last_call_at) && (
                      <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className={`flex items-center gap-1 ${index < 3 ? 'text-white/80' : 'text-gray-400'}`}>
                      <DollarSign className="w-3 h-3" />
                      ${parseFloat(entry.total_spent).toFixed(2)}
                    </span>
                    <span className={`flex items-center gap-1 ${index < 3 ? 'text-white/80' : 'text-gray-400'}`}>
                      <TrendingUp className="w-3 h-3" />
                      {entry.total_calls} calls
                    </span>
                    <span className={`flex items-center gap-1 ${index < 3 ? 'text-white/80' : 'text-gray-400'}`}>
                      <Clock className="w-3 h-3" />
                      {entry.total_minutes}m
                    </span>
                  </div>
                </div>

                {/* Badge for #1 */}
                {index === 0 && (
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 bg-white/20 rounded-full">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        TOP FAN
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            💎 Make calls to climb the leaderboard and show your support!
          </p>
        </div>
      </div>
    </div>
  );
}