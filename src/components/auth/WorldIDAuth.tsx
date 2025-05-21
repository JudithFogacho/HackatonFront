// src/components/auth/WorldIDAuth.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WorldIDAuthProps {
  onSuccess?: () => void;
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setIsLoading(true);
    
    try {
      console.log('Authentication process started');
      
      // Generate a realistic-looking token
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                    btoa(JSON.stringify({userId: Date.now(), exp: Date.now() + 86400000})) + 
                    '.simulated';
      
      // Simulate a user
      const user = {
        id: 'user-' + Date.now(),
        username: 'WorldIDUser',
        walletAddress: '0x' + Math.random().toString(36).substring(2, 14),
        profilePictureUrl: null
      };
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Server-side cookie setting via API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, user }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }
      
      console.log('Authentication successful');
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect
        window.location.href = '/jobs/categories';
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={handleAuth}
        disabled={isLoading}
        className="w-full bg-white text-[#004B62] font-semibold py-4 px-6 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg uppercase"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#004B62]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Conectando...
          </div>
        ) : (
          'Iniciar con World ID'
        )}
      </button>
    </div>
  );
}