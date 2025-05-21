'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface WorldIDAuthProps {
  onSuccess?: () => void;
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';

  // Function to handle World ID authentication through Mini App
  const handleWorldIDAuth = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // App parameters
      const appId = 'app_805d8030cf7f6ba31af4010e5fd9a143'; // Your World ID App ID
      const action = 'doup-user-verification'; // Must match exactly what's in the Developer Portal
      
      // Construct properly encoded redirect URL - this is critical
      const redirectUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
      
      // Construct the Mini App URL according to specs
      const miniAppUrl = `https://worldcoin.org/mini-app?app_id=${appId}&action=${action}&redirect_url=${redirectUrl}`;
      
      console.log('Opening World ID Mini App:', miniAppUrl);
      
      // Open the Mini App in the current window
      window.location.href = miniAppUrl;
    } catch (err: any) {
      console.error('Error launching Mini App:', err);
      setError('Failed to launch World ID verification');
      setIsLoading(false);
    }
  };

  // Alternative login for development/testing
  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const nickname = 'Demo_User_' + Math.random().toString(36).substring(2, 8);
      console.log('Starting demo login for:', nickname);
      
      const response = await fetch(`${apiUrl}/api/auth/demo-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication error');
      }

      const authData = await response.json();
      console.log('Login successful:', authData);
      
      login(authData.token, authData.user);
      
      // Navigate after login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/jobs/categories');
        }
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
      
      {/* World ID Auth Button */}
      <button
        onClick={handleWorldIDAuth}
        disabled={isLoading}
        className="w-full bg-white text-primary font-medium py-3 px-4 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </div>
        ) : (
          'SIGN IN WITH WORLD ID'
        )}
      </button>
      
      {/* Demo Login (for development only) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center text-sm"
        >
          Development: Demo Login
        </button>
      )}
    </div>
  );
}