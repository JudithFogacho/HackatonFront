// src/app/auth/callback/page.tsx
'use client';

import { Suspense } from 'react';
import CallbackContent from './CallbackContent';

// Componente de carga para Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-primary mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we process your verification...</p>
        </div>
      </div>
    </div>
  );
}

// Componente principal que envuelve el contenido en Suspense
export default function WorldIDCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackContent />
    </Suspense>
  );
}