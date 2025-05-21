'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MiniKit } from '@worldcoin/minikit-js';

interface WorldIDAuthProps {
  onSuccess?: () => void;
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [miniKitStatus, setMiniKitStatus] = useState<string>('Checking...');
  const router = useRouter();
  
  // Verificar el estado de MiniKit al cargar
  useEffect(() => {
    const checkMiniKit = async () => {
      try {
        // Verificar si MiniKit está instalado
        const isInstalled = MiniKit.isInstalled();
        console.log('MiniKit installed:', isInstalled);
        
        if (isInstalled) {
          setMiniKitStatus('Installed ✅');
          
          // Verificar si hay un usuario autenticado
          if (MiniKit.user?.walletAddress) {
            console.log('User already authenticated:', MiniKit.user);
            handleAuthSuccess();
          }
        } else {
          setMiniKitStatus('Not installed ❌');
          console.log('Attempting to install MiniKit...');
          
          // Intentar instalar MiniKit
          try {
            const appId = process.env.NEXT_PUBLIC_APP_ID || 'app_805d8030cf7f6ba31af4010e5fd9a143';
            const installResult = MiniKit.install(appId);
            console.log('MiniKit install result:', installResult);
            
            if (installResult.success) {
              setMiniKitStatus('Installed after attempt ✅');
            } else {
              setMiniKitStatus('Installation failed ❌');
            }
          } catch (installError) {
            console.error('Error installing MiniKit:', installError);
            setMiniKitStatus('Installation error ❌');
          }
        }
      } catch (error) {
        console.error('Error checking MiniKit:', error);
        setMiniKitStatus('Error checking status ❌');
      }
    };
    
    checkMiniKit();
  }, []);
  
  // Función para manejar el éxito de autenticación
  const handleAuthSuccess = () => {
    try {
      // Obtener datos del usuario
      const user = {
        id: MiniKit.user.walletAddress || 'unknown-id',
        username: MiniKit.user.username || 'User',
        walletAddress: MiniKit.user.walletAddress,
        profilePictureUrl: MiniKit.user.profilePictureUrl
      };
      
      console.log('Authentication successful, user:', user);
      
      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redireccionar después de autenticación exitosa
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/jobs/categories');
      }
    } catch (error) {
      console.error('Error handling auth success:', error);
      setError('Error processing authentication');
    }
  };
  
  // Función de autenticación fallback para desarrollo
  const handleDemoAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Using demo authentication');
      
      // Simular un usuario autenticado
      const mockUser = {
        id: 'demo-user-' + Math.random().toString(36).substring(2),
        username: 'DemoUser',
        walletAddress: '0x' + Math.random().toString(36).substring(2, 14),
        profilePictureUrl: null
      };
      
      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // También establecer una cookie para el middleware
      document.cookie = `user=${JSON.stringify(mockUser)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      
      // Simular retraso
      setTimeout(() => {
        // Redireccionar
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/jobs/categories');
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Demo auth error:', err);
      setError('Demo authentication failed');
      setIsLoading(false);
    }
  };
  
  // Función para manejar clic en botón
  const handleAuthClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar si estamos en el entorno correcto
      if (!MiniKit.isInstalled()) {
        console.log('MiniKit not installed, using demo auth instead');
        return handleDemoAuth();
      }
      
      console.log('Starting wallet authentication...');
      
      // Usar el comando walletAuth de MiniKit
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ''),
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: `Authenticate (${crypto.randomUUID().replace(/-/g, '')}).`,
      });
      
      console.log('Wallet auth result:', result);
      
      // Verificar resultado
      if (result.finalPayload.status === 'success') {
        console.log('Authentication successful:', result.finalPayload);
        handleAuthSuccess();
      } else {
        console.error('Authentication failed:', result.finalPayload);
        throw new Error(result.finalPayload.error_code || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Si el error es que MiniKit no está disponible, usar autenticación alternativa
      if (err.message && (
        err.message.includes('not available') || 
        err.message.includes('not installed')
      )) {
        console.log('MiniKit error, using demo auth instead');
        return handleDemoAuth();
      }
      
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <button
        onClick={handleAuthClick}
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
      
      {/* Estado de MiniKit (solo visible durante desarrollo) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-4 text-xs text-gray-500">
          MiniKit Status: {miniKitStatus}
        </div>
      )}
    </div>
  );
}