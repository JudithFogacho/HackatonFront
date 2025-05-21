'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import WorldIDAuth from '@/components/auth/WorldIDAuth';

// Componente que usa useSearchParams envuelto en Suspense
function LoginContent() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/jobs/categories';
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6">
      {/* Logo */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-secondary">DoUp</h1>
        </div>
      </motion.div>

      {/* Formulario de login */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold mb-8 text-center text-white"
        >
          Iniciar Sesión
        </motion.h2>

        <form className="space-y-6">
          {/* Campo de usuario */}
          <motion.div variants={itemVariants}>
            <div className="border-b-2 border-gray-300 pb-2">
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Username"
                className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          {/* Botón de World ID */}
          <motion.div
            variants={itemVariants}
            className="mt-10"
          >
            <WorldIDAuth onSuccess={() => router.push(redirect)} />
          </motion.div>
        </form>

        {/* Mensaje informativo */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-center text-sm text-gray-300"
        >
          Inicia sesión de forma segura verificando tu identidad con World ID.
        </motion.p>
      </motion.div>
    </div>
  );
}

// Componente principal que envuelve el contenido en Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}