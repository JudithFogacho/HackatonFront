// src/app/auth/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import WorldIDAuth from '@/components/auth/WorldIDAuth';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-[#004B62] px-4 py-12">
      {/* Logo */}
      <div className="mb-16 text-center">
        <h1 className="text-yellow-400 text-8xl font-bold leading-tight">
          <span className="block">Do</span>
          <span className="block -mt-12">Up</span>
        </h1>
      </div>
      
      {/* Iniciar Sesión heading */}
      <h2 className="text-white text-4xl font-semibold mb-12">
        Iniciar Sesión
      </h2>
      
      {/* World ID button container */}
      <div className="w-full max-w-xs">
        <WorldIDAuth onSuccess={() => router.push('/jobs/categories')} />
      </div>
    </div>
  );
}