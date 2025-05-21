'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir inmediatamente a la página de login
    router.replace('/auth/login');
  }, [router]);

  // Retornar un componente vacío o de carga mientras se redirecciona
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="w-8 h-full bg-white animate-[linear_infinite_alternate]"
          style={{
            animation: 'loading 1s linear infinite alternate',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes loading {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}