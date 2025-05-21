'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

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
  const [showPassport, setShowPassport] = useState(false);
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
  const handleWorldIDAuth = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Primero mostrar la animación del pasaporte
      setShowPassport(true);
      
      // Simular un pequeño retraso antes de iniciar la autenticación real
      setTimeout(() => {
        // Si WorldID está disponible, usamos Mini App
        if (window.WorldID) {
          const miniAppUrl = `https://worldcoin.org/mini-app?app_id=app_805d8030cf7f6ba31af4010e5fd9a143&action=doup-user-verification&redirect_url=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
          console.log('Redirigiendo a Mini App:', miniAppUrl);
          window.location.href = miniAppUrl;
        } else {
          // Si WorldID no está disponible, usar método alternativo
          console.log('WorldID no disponible, usando método alternativo');
          handleAlternativeAuth();
        }
      }, 1500); // Esperar 1.5 segundos para mostrar la animación
    } catch (err: any) {
      console.error('Error al iniciar autenticación:', err);
      setError('Error al iniciar la autenticación con World ID');
      setIsLoading(false);
      setShowPassport(false);
    }
  };

  // Método alternativo si WorldID JS no está disponible
  const handleAlternativeAuth = async () => {
    console.warn('La API de World ID no está disponible, usando método alternativo');
    
    try {
      // Hacer una solicitud al endpoint de autenticación alternativo simplificado
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
        throw new Error(errorData.error || 'Error en la autenticación alternativa');
      }

      const authData = await response.json();
      console.log('Autenticación exitosa, datos:', authData);
      
      // Guardar información de autenticación
      login(authData.token, authData.user);
      
      // Simular un pequeño retraso antes de redireccionar
      setTimeout(() => {
        setShowPassport(false);
        setIsLoading(false);
        
        console.log('Intentando redireccionar, onSuccess existe:', !!onSuccess);
        // Llamar al callback de éxito si existe
        if (onSuccess) {
          console.log('Llamando a onSuccess para redireccionar');
          onSuccess();
        } else {
          console.log('No hay función onSuccess definida, redireccionando manualmente');
          // Redirección alternativa si no hay onSuccess
          window.location.href = '/jobs/categories';
        }
      }, 1000);
    } catch (err: any) {
      console.error('Error durante la autenticación alternativa:', err);
      setError(err.message || 'Error al autenticar. Inténtalo de nuevo.');
      setIsLoading(false);
      setShowPassport(false);
    }
  };

  // Overlay de verificación con pasaporte
  const PassportOverlay = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={() => {}} // Evitar que clicks accidentales cierren el overlay
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
        <h2 className="text-xl font-bold mb-2 text-gray-800">Verificando identidad</h2>
        <p className="text-gray-600 mb-4">Por favor espera mientras verificamos tu identidad con World ID...</p>
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
            Conectando...
          </div>
        ) : (
          'INICIAR CON WORLD ID'
        )}
      </button>
      
      {/* Overlay de verificación con animación de pasaporte */}
      {showPassport && <PassportOverlay />}
    </div>
  );
}