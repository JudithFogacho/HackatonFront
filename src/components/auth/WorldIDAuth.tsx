'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface WorldIDAuthProps {
  onSuccess?: () => void;
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';

  // Handle World ID authentication
  const handleWorldIDAuth = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct the Mini App URL with proper parameters
      const appId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_805d8030cf7f6ba31af4010e5fd9a143';
      const action = 'doup-user-verification';
      
      // Important: Set redirect URL to categories page
      const redirectUrl = encodeURIComponent(`${window.location.origin}/auth/callback?redirect=/jobs/categories`);
      
      // Create the Mini App URL with all required parameters
      const miniAppUrl = `https://worldcoin.org/mini-app?app_id=${appId}&action=${action}&redirect_url=${redirectUrl}`;
      
      console.log('Redirecting to World ID Mini App:', miniAppUrl);
      window.location.href = miniAppUrl;
    } catch (err: any) {
      console.error('Error initiating authentication:', err);
      setError('Error initiating World ID authentication');
      setIsLoading(false);
      
      // Fallback to alternative auth in case of errors
      handleAlternativeAuth();
    }
  };

  // Alternative authentication method if World ID fails
  const handleAlternativeAuth = async () => {
    console.warn('Using alternative authentication method');
    
    try {
      const response = await fetch(`${apiUrl}/api/auth/demo-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: 'Demo_User_' + Math.random().toString(36).substring(2, 8)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication error');
      }

      const authData = await response.json();
      login(authData.token, authData.user);
      
      // Direct redirection to categories page
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/jobs/categories';
      }
    } catch (err: any) {
      console.error('Alternative authentication error:', err);
      setError(err.message || 'Authentication error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
      
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
    </div>
  );
}