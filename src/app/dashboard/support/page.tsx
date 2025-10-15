'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Mail,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  ExternalLink
} from 'lucide-react';

export default function SupportPage() {
  const { data: session } = useSession();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          category,
          userEmail: session?.user?.email,
          userName: session?.user?.name
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setSubject('');
        setMessage('');
        setCategory('general');
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error submitting support request:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
          <p className="text-gray-600">Get help from the CallSubs team</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
                    <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Success Message */}
                {submitted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Message sent successfully!</p>
                        <p className="text-xs text-green-700 mt-1">
                          Our support team will get back to you shortly at {session?.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* User Info Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Logged in as:</strong> {session?.user?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Email:</strong> {session?.user?.email || 'No email on file'}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="payment">Payment/Billing</option>
                    <option value="account">Account Settings</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">{subject.length}/200 characters</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    placeholder="Please provide as much detail as possible about your question or issue..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{message.length}/2000 characters</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !subject.trim() || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Help Resources */}
          <div className="space-y-6">
            {/* Quick Help */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Quick Help</h3>
              </div>
              <div className="space-y-3 text-sm">
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Getting Started Guide</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Payment FAQs</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Troubleshooting</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Direct Email</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                You can also email us directly at:
              </p>
              <a 
                href="mailto:support@callsubs.com"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 break-all"
              >
                support@callsubs.com
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Response Time</h3>
              </div>
              <p className="text-sm text-gray-600">
                Our support team typically responds within <strong>24 hours</strong> during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}