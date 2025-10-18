'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CallHistoryItem {
  id: number;
  viewer_username: string;
  viewer_tier: string;
  amount: string;
  duration: number;
  status: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  profile_image_url: string;
}

export default function CallHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<CallHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<CallHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCallHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [history, searchQuery, statusFilter]);

  const fetchCallHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/call/history');
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(call =>
        call.viewer_username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.status === statusFilter);
    }

    setFilteredHistory(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <AlertCircle className="w-3 h-3" />
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'tier1': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'tier2': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'tier3': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Viewer', 'Tier', 'Duration', 'Earnings', 'Status'];
    const rows = filteredHistory.map(call => [
      formatDateTime(call.created_at),
      call.viewer_username,
      call.viewer_tier.toUpperCase(),
      formatTime(call.duration),
      `$${parseFloat(call.amount).toFixed(2)}`,
      call.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, endIndex);

  const totalEarnings = filteredHistory
    .filter(call => call.status === 'completed')
    .reduce((sum, call) => sum + parseFloat(call.amount), 0);

  const completedCalls = filteredHistory.filter(call => call.status === 'completed').length;

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-8 bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading call history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Calls</p>
                <p className="text-2xl font-bold text-white">{filteredHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-green-500/30 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{completedCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-6 border border-gray-800/50 hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800/50 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by viewer username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Call History Table */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800/50 overflow-hidden">
          {currentItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/20 border-b border-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Viewer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {currentItems.map((call) => (
                      <tr key={call.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {formatDateTime(call.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={call.profile_image_url || 'https://via.placeholder.com/40'}
                              alt={call.viewer_username}
                              className="w-8 h-8 rounded-full border-2 border-gray-700"
                            />
                            <div>
                              <div className="text-sm font-medium text-white">
                                {call.viewer_username}
                              </div>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded ${getTierBadgeColor(call.viewer_tier)}`}>
                                {call.viewer_tier.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {formatTime(call.duration)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm font-semibold text-white">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            {parseFloat(call.amount).toFixed(2)}
                          </div>
                          <p className="text-xs text-gray-500">After fees</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(call.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-800/50 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-700 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-700 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No call history found</p>
              <p className="text-gray-600 text-sm mt-1">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Your completed calls will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}