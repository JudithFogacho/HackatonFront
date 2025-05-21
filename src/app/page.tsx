'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function SplashPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirigir después de la animación según el estado de autenticación
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          router.push('/jobs/categories');
        } else {
          router.push('/auth/login');
        }
      }
    }, 2500); // Esperar 2.5 segundos para la animación

    return () => clearTimeout(redirectTimer);
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Logo con animación */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01]
          }}
          className="mb-8"
        >
          <Logo />
        </motion.div>

        {/* Animación de carga */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: 'linear'
              }}
              className="w-8 h-full bg-white"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Componente para el logo Do Up
function Logo() {
  return (
    <div className="text-center">
      <motion.h1 
        className="text-5xl font-bold text-secondary"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        D<motion.span
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block"
        >o</motion.span>
        <motion.span
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="inline-block"
        >U</motion.span>
        <motion.span
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="inline-block"
        >p</motion.span>
      </motion.h1>
    </div>
  );
}