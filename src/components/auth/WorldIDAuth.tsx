'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MiniKit } from '@worldcoin/minikit-js';

interface WorldIDAuthProps {
  onSuccess?: () => void;
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const router = useRouter();
  
  // Verificar si MiniKit está instalado
  useEffect(() => {
    const checkMiniKit = () => {
      const installed = MiniKit.isInstalled();
      console.log('MiniKit installed:', installed);
      setIsInstalled(installed);
      
      if (!installed) {
        console.log('MiniKit not installed, attempting to install...');
        try {
          // Intenta instalar MiniKit (esto solo funciona en el entorno de World App)
          const appId = process.env.NEXT_PUBLIC_APP_ID || 'app_805d8030cf7f6ba31af4010e5fd9a143';
          const result = MiniKit.install(appId);
          console.log('MiniKit install result:', result);
          setIsInstalled(result.success);
        } catch (error) {
          console.error('Error installing MiniKit:', error);
        }
      }
    };
    
    checkMiniKit();
  }, []);
  
  // Función que maneja el login con World ID
  const handleWorldIDAuth = async () => {
    console.log('Starting auth process...');
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isInstalled) {
        throw new Error('World ID not available. Please try in World App.');
      }
      
      // Generar un nonce para la autenticación
      const nonce = crypto.randomUUID().replace(/-/g, '');
      console.log('Generated nonce:', nonce);
      
      // Realizar la autenticación
      console.log('Calling walletAuth command...');
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: `Authenticate (${crypto.randomUUID().replace(/-/g, '')}).`,
      });
      
      console.log('Auth result:', result);
      
      if (!result || result.finalPayload.status !== 'success') {
        console.error('Authentication failed:', result?.finalPayload);
        const errorMessage = 'Authentication failed';
        throw new Error(errorMessage);
      }
      
      // Obtener datos del usuario
      const user = MiniKit.user;
      console.log('User data:', user);
      
      // Almacenar el token (simple para pruebas)
      localStorage.setItem('user', JSON.stringify({
        walletAddress: user.walletAddress,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl
      }));
      
      // Redirigir a la página de categorías o ejecutar callback onSuccess
      console.log('Authentication successful, redirecting...');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/jobs/categories');
      }
      
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función de login alternativa para desarrollo
  const handleDemoLogin = async () => {
    console.log('Starting demo login...');
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';
      const nickname = 'Demo_User_' + Math.random().toString(36).substring(2, 8);
      
      console.log('Sending demo login request for:', nickname);
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
      
      // Almacenar datos en localStorage
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      // Redirigir a la página de categorías o ejecutar callback onSuccess
      console.log('Demo login successful, redirecting...');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/jobs/categories');
      }
      
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
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
      
      {/* Botón alternativo para desarrollo */}
      <button
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="w-full bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center text-sm"
      >
        Demo Login (Development Only)
      </button>
      
      {/* Estado de la instalación de MiniKit */}
      <div className="text-xs text-gray-500">
        MiniKit Status: {isInstalled ? 'Installed ✅' : 'Not Installed ❌'}
      </div>
    </div>
  );
}