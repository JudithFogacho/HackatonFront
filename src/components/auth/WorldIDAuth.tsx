'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface WorldIDAuthProps {
  onSuccess?: () => void;
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';

  // Handle World ID authentication
  const handleWorldIDAuth = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First show the passport animation for better UX
      setShowPassport(true);
      
      // Small delay before redirecting to Mini App
      setTimeout(() => {
        // Construct the Mini App URL with proper parameters
        const appId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_805d8030cf7f6ba31af4010e5fd9a143';
        const action = 'doup-user-verification';
        
        // Important: Ensure the redirect URL is correctly URL-encoded and includes origin
        const redirectUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
        
        // Create the Mini App URL with all required parameters
        const miniAppUrl = `https://worldcoin.org/mini-app?app_id=${appId}&action=${action}&redirect_url=${redirectUrl}`;
        
        console.log('Redirecting to World ID Mini App:', miniAppUrl);
        window.location.href = miniAppUrl;
      }, 1500);
    } catch (err: any) {
      console.error('Error initiating authentication:', err);
      setError('Error initiating World ID authentication');
      setIsLoading(false);
      setShowPassport(false);
      
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
      
      setTimeout(() => {
        setShowPassport(false);
        setIsLoading(false);
        
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = '/jobs/categories';
        }
      }, 1000);
    } catch (err: any) {
      console.error('Alternative authentication error:', err);
      setError(err.message || 'Authentication error. Please try again.');
      setIsLoading(false);
      setShowPassport(false);
    }
  };

  // Passport verification overlay component
  const PassportOverlay = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
        <div className="relative mx-auto mb-6 w-32">
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            className="w-full"
          >
            <img 
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64cfe35971f7954f30e73c15_Security-Passport.png" 
              alt="World ID Passport" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">Verifying identity</h2>
        <p className="text-gray-600 mb-4">Please wait while we verify your identity with World ID...</p>
        <div className="flex justify-center">
          <motion.div 
            className="w-12 h-1 bg-blue-500 rounded-full"
            animate={{ 
              width: ["25%", "90%", "25%"],
              backgroundColor: ["#3B82F6", "#10B981", "#3B82F6"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>
      </div>
    </motion.div>
  );

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
      
      {showPassport && <PassportOverlay />}
    </div>
  );
}