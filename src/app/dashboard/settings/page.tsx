'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  AlertCircle,
  Save,
  FileText,
  CheckSquare,
  Shield,
  Bell,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [callRules, setCallRules] = useState('');
  const [requireRulesAgreement, setRequireRulesAgreement] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/streamer/settings');
      
      if (response.ok) {
        const data = await response.json();
        setCallRules(data.call_rules || '');
        setRequireRulesAgreement(data.require_rules_agreement || false);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/streamer/settings/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callRules,
          requireRulesAgreement
        })
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const setDefaultRules = () => {
    const defaultRules = `1. Be respectful and courteous at all times
2. Keep the conversation appropriate for all audiences
3. No spam, advertising, or self-promotion
4. Stay on topic and follow the streamer's guidance
5. Audio must be clear - use a good microphone
6. Background noise should be minimized
7. Do not share personal information
8. Follow Twitch Terms of Service and Community Guidelines
9. The streamer reserves the right to end the call at any time
10. Refunds are not available once the call has started`;
    
    setCallRules(defaultRules);
  };

  const clearRules = () => {
    if (confirm('Are you sure you want to clear all rules?')) {
      setCallRules('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-700">Settings saved successfully!</p>
          </div>
        )}

        {/* Call Rules Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Call Rules</h2>
                  <p className="text-sm text-gray-500">Set expectations for viewers before they call</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={setDefaultRules}
                  className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Load Default Rules
                </button>
                <button
                  onClick={clearRules}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear all rules"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rules Content
              </label>
              <textarea
                value={callRules}
                onChange={(e) => setCallRules(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Enter your call rules here... (e.g., Be respectful, keep conversation appropriate, etc.)"
              />
              <p className="text-xs text-gray-500 mt-2">
                {callRules.length} characters • Use line breaks to separate rules
              </p>
            </div>

            {/* Preview */}
            {callRules && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview (How it will appear to viewers)
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-gray-900">Call Rules</p>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {callRules}
                  </div>
                </div>
              </div>
            )}

            {/* Require Agreement Toggle */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Require viewers to agree to rules
                    </p>
                    <p className="text-xs text-gray-600">
                      Viewers must check a box confirming they've read and agree to follow your rules before they can proceed to payment
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRequireRulesAgreement(!requireRulesAgreement)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${requireRulesAgreement ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${requireRulesAgreement ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important Information</p>
              <ul className="space-y-1 text-xs">
                <li>• Your rules will be displayed on your public call link page</li>
                <li>• Clear rules help set expectations and reduce conflicts</li>
                <li>• You can update these rules at any time</li>
                <li>• Requiring agreement creates a legal record that viewers accepted your terms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Settings (Future) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Additional Settings</h2>
                <p className="text-sm text-gray-500">More options coming soon</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Notifications</p>
                  <p className="text-xs text-gray-400">Get notified when viewers request calls</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Blocked Users</p>
                  <p className="text-xs text-gray-400">Manage your blocked viewer list</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            onClick={fetchSettings}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? (
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
    </div>
  );
}