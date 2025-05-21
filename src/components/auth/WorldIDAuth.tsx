'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Definición de la interfaz para las props
interface WorldIDAuthProps {
  onSuccess?: () => void;
}

// Extender la interfaz Window para incluir WorldID
declare global {
  interface Window {
    WorldID?: {
      init: (config: {
        appId: string;
        action: string;
        enableTelemetry?: boolean;
      }) => void;
      verify: (options: {
        signal?: string;
        action?: string;
        enable_telemetry?: boolean;
      }) => Promise<{
        merkle_root: string;
        nullifier_hash: string;
        proof: string;
        credential_type: string;
      }>;
    };
  }
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';

  // Este efecto inicializa la integración de World ID
  useEffect(() => {
    // Verificar si estamos en el cliente
    if (typeof window === 'undefined') return;

    // Verificar si ya está cargado el script de World ID
    if (window.WorldID) return;

    // Cargar dinámicamente el script de World ID si no está disponible
    const worldIdScript = document.createElement('script');
    worldIdScript.src = 'https://id.worldcoin.org/js/worldid-client.js';
    worldIdScript.async = true;
    worldIdScript.defer = true;
    worldIdScript.onload = initWorldID;
    document.body.appendChild(worldIdScript);

    return () => {
      // Limpieza si es necesario
      if (document.body.contains(worldIdScript)) {
        document.body.removeChild(worldIdScript);
      }
    };
  }, []);

  // Inicializar World ID
  const initWorldID = () => {
    if (!window.WorldID) return;

    // La acción debe coincidir EXACTAMENTE con la del portal de desarrollador
    const action = "doup-user-verification";

    window.WorldID.init({
      appId: process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_805d8030cf7f6ba31af4010e5fd9a143',
      action: action,
      enableTelemetry: false
    });
  };

  // Manejar el inicio de sesión con World ID
  const handleWorldIDAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Si WorldID no está disponible, usar la implementación alternativa
      if (!window.WorldID) {
        await handleAlternativeAuth();
        return;
      }

      // La acción debe coincidir EXACTAMENTE con la del portal de desarrollador
      const action = "doup-user-verification";

      // Obtener un nonce del servidor
      const nonceResponse = await fetch(`${apiUrl}/api/auth/nonce`);
      
      if (!nonceResponse.ok) {
        throw new Error('Error al obtener nonce para la autenticación');
      }
      
      const { nonce } = await nonceResponse.json();
      
      console.log('Nonce obtenido:', nonce); // Para depuración
      
      // Iniciar la verificación con World ID
      const verificationResponse = await window.WorldID.verify({
        signal: nonce, // Asegúrate de que esto sea el nonce obtenido del servidor
        action: "doup-user-verification", // Debe coincidir exactamente con el identificador en el portal
        enable_telemetry: false
      });
      
      console.log('Verificación de World ID:', verificationResponse); // Para depuración

      if (!verificationResponse || !verificationResponse.nullifier_hash) {
        throw new Error('Verificación cancelada o fallida');
      }

      // Enviar prueba de verificación al backend
      const authResponse = await fetch(`${apiUrl}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merkle_root: verificationResponse.merkle_root,
          nullifier_hash: verificationResponse.nullifier_hash,
          proof: verificationResponse.proof,
          credential_type: verificationResponse.credential_type,
          action: "doup-user-verification", // Usar el mismo action
          signal: nonce // Asegúrate de que esto sea el mismo nonce
        })
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || 'Error en la verificación');
      }

      const authData = await authResponse.json();

      // Guardar la información de autenticación
      login(authData.token, authData.user);

      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error durante la autenticación:', err);
      setError(err.message || 'Error al autenticar con World ID. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Método alternativo si WorldID JS no está disponible
  const handleAlternativeAuth = async () => {
    console.warn('La API de World ID no está disponible, usando método alternativo');
    
    try {
      // Hacer una solicitud al endpoint de autenticación alternativo
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: 'User_' + Math.random().toString(36).substring(2, 8)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la autenticación alternativa');
      }

      const authData = await response.json();
      
      // Guardar información de autenticación
      login(authData.token, authData.user);
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error durante la autenticación alternativa:', err);
      setError(err.message || 'Error al autenticar. Inténtalo de nuevo.');
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
            Conectando...
          </div>
        ) : (
          'INICIAR CON WORLD ID'
        )}
      </button>
    </div>
  );
}