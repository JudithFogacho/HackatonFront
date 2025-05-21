'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import WorldIDAuth from '@/components/auth/WorldIDAuth';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
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

  // Animación para transición entre pasos
  const pageVariants = {
    initial: { x: 300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -300, opacity: 0 }
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6">
      {/* Logo */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-secondary">DoUp</h1>
        </div>
      </motion.div>

      {/* Formulario de registro */}
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
          {step === 1 ? 'Crear Cuenta' : 'Verificar Identidad'}
        </motion.h2>

        {step === 1 ? (
          <motion.form 
            className="space-y-6"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            onSubmit={handleNextStep}
          >
            {/* Campo de nombre completo */}
            <motion.div variants={itemVariants}>
              <div className="border-b-2 border-gray-300 pb-2 mb-6">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Campo de email */}
            <motion.div variants={itemVariants}>
              <div className="border-b-2 border-gray-300 pb-2 mb-6">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Campo de username */}
            <motion.div variants={itemVariants}>
              <div className="border-b-2 border-gray-300 pb-2">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Botón de continuar */}
            <motion.div variants={itemVariants} className="mt-10">
              <button
                type="submit"
                className="w-full bg-secondary text-primary font-bold py-3 px-4 rounded-xl hover:bg-secondary-dark transition-colors"
                disabled={isLoading}
              >
                Continuar
              </button>
            </motion.div>

            {/* Enlace para iniciar sesión */}
            <motion.div variants={itemVariants} className="mt-4 text-center">
              <p className="text-gray-300 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/auth/login" className="text-secondary hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            className="space-y-6"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Resumen de datos */}
            <motion.div 
              variants={itemVariants}
              className="bg-primary-light bg-opacity-20 rounded-xl p-4 mb-6"
            >
              <p className="text-sm text-white mb-1">Nombre: <span className="font-medium">{formData.fullName}</span></p>
              <p className="text-sm text-white mb-1">Usuario: <span className="font-medium">{formData.username}</span></p>
              <p className="text-sm text-white">Email: <span className="font-medium">{formData.email}</span></p>
            </motion.div>

            {/* Mensaje de verificación */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-center text-white mb-6"
            >
              Para completar tu registro, verifica tu identidad con World ID
            </motion.p>

            {/* Botón de World ID */}
            <motion.div
              variants={itemVariants}
              className="mt-8"
            >
              <WorldIDAuth 
                onSuccess={() => {
                  // Aquí se manejaría el registro completo
                  router.push('/profile');
                }} 
              />
            </motion.div>

            {/* Botón para volver */}
            <motion.div variants={itemVariants} className="mt-6">
              <button
                onClick={() => setStep(1)}
                className="w-full bg-transparent border border-gray-400 text-white font-medium py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Volver
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
