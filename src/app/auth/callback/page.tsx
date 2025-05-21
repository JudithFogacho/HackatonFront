// /src/app/auth/callback/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Componente que usa useSearchParams
function CallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';
  
  useEffect(() => {
    const verifyCredential = async () => {
      try {
        console.log('Callback recibido con parámetros:', 
                   Object.fromEntries(searchParams.entries()));
        
        // Extrae los parámetros importantes de la URL
        const proof = searchParams.get('proof');
        const nullifier_hash = searchParams.get('nullifier_hash');
        const merkle_root = searchParams.get('merkle_root');
        const credential_type = searchParams.get('credential_type') || 'orb';
        
        if (!proof || !nullifier_hash || !merkle_root) {
          throw new Error('Parámetros de verificación incompletos');
        }
        
        console.log('Enviando verificación al backend...');
        
        // Envía la verificación a tu backend
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
        
        console.log('Respuesta del backend recibida:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error del backend:', errorData);
          throw new Error(errorData.error || 'Error en verificación');
        }
        
        const data = await response.json();
        console.log('Verificación exitosa, datos recibidos:', data);
        
        // Login exitoso
        login(data.token, data.user);
        
        // Redireccionar a la página principal o dashboard
        router.push('/jobs/categories');
      } catch (err: any) {
        console.error('Error verificando credencial:', err);
        setError(err.message || 'Error en autenticación');
      } finally {
        setLoading(false);
      }
    };
    
    // Verificar si tenemos los parámetros necesarios en la URL
    if (searchParams.has('proof')) {
      verifyCredential();
    } else {
      console.error('No se recibieron credenciales de verificación');
      setError('No se recibieron credenciales de verificación');
      setLoading(false);
    }
  }, [searchParams, router, login, apiUrl]);
  
  // Interfaz visual mientras se procesa la verificación
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-primary mb-2">Verificando identidad</h2>
            <p className="text-gray-600">Por favor espera mientras verificamos tu identidad con World ID...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Mostrar errores si ocurren
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
            <h2 className="text-xl font-bold text-primary mb-2">Error de verificación</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="bg-primary text-white font-medium py-2 px-4 rounded-lg"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Este estado no debería verse normalmente - solo aparece brevemente antes de la redirección
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light">
      <div className="text-center">
        <p className="text-primary">Redirecccionando...</p>
      </div>
    </div>
  );
}

// Componente principal que envuelve el contenido en Suspense
export default function WorldIDCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-primary mb-2">Cargando...</h2>
            <p className="text-gray-600">Por favor espera...</p>
          </div>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}