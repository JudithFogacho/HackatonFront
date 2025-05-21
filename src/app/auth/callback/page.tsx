// src/app/auth/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function WorldIDCallback() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';
  
  useEffect(() => {
    const verifyCredential = async () => {
      try {
        // Log received parameters
        console.log('Callback received with parameters:', 
                   Object.fromEntries(searchParams.entries()));
        
        // Extract verification parameters as returned by World ID Mini App
        // Note: Mini App returns parameters in the URL query string
        const proof = searchParams.get('proof');
        const nullifier_hash = searchParams.get('nullifier_hash');
        const merkle_root = searchParams.get('merkle_root');
        const credential_type = searchParams.get('credential_type') || 'orb';
        
        // Check for required parameters
        if (!proof || !nullifier_hash || !merkle_root) {
          throw new Error('Incomplete verification parameters');
        }
        
        console.log('Sending verification to backend...');
        
        // Send verification data to backend
        const response = await fetch(`${apiUrl}/api/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            proof,
            nullifier_hash,
            merkle_root,
            credential_type,
            action: 'doup-user-verification'
          })
        });
        
        console.log('Backend response:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Backend verification error:', errorData);
          throw new Error(errorData.error || 'Verification failed');
        }
        
        const data = await response.json();
        console.log('Verification successful:', data);
        
        // Save authentication data
        login(data.token, data.user);
        
        // Redirect to categories page
        router.push('/jobs/categories');
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };
    
    // Only proceed if we have proof parameter
    if (searchParams.has('proof')) {
      verifyCredential();
    } else {
      console.error('No verification parameters received');
      setError('No verification credentials received');
      setLoading(false);
    }
  }, [searchParams, router, login, apiUrl]);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-primary mb-2">Verifying identity</h2>
            <p className="text-gray-600">Please wait while we verify your identity with World ID...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Verification Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="bg-primary text-white font-medium py-2 px-4 rounded-lg"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // This should not be seen as the user should be redirected
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light">
      <div className="text-center">
        <p className="text-primary">Redirecting...</p>
      </div>
    </div>
  );
}