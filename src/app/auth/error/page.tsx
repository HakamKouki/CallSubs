'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold text-gray-900">Authentication Error</h2>
        <p className="text-gray-600">
          {error === 'Configuration' && 'There is a problem with the server configuration.'}
          {error === 'AccessDenied' && 'You do not have permission to sign in.'}
          {error === 'Verification' && 'The sign in link is no longer valid.'}
          {!error && 'An error occurred during authentication.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}