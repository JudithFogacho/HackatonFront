'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Efecto para redirigir automáticamente después de 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/jobs/categories');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-lg"
      >
        {/* Ícono de éxito animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.2 
          }}
          className="w-24 h-24 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg 
            className="w-12 h-12 text-success" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </motion.div>

        {/* Título y mensaje */}
        <motion.h1 
          className="text-2xl font-bold text-primary mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¡Pago Exitoso!
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Tu transacción ha sido procesada correctamente. El profesional ha sido notificado y se pondrá en contacto contigo pronto.
        </motion.p>

        {/* Detalles de la transacción */}
        <motion.div 
          className="bg-primary-light rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-primary mb-2">Número de transacción:</p>
          <p className="font-mono text-xs text-gray-700 break-all">
            {`TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().substring(5)}`}
          </p>
        </motion.div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href="/chat"
              className="block w-full bg-secondary text-primary font-bold py-3 px-4 rounded-xl hover:bg-secondary-dark transition-colors"
            >
              Ir al chat
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              href="/jobs/categories"
              className="block w-full bg-primary-light text-primary font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Volver al inicio
            </Link>
          </motion.div>
        </div>

        {/* Contador de redirección */}
        <motion.p 
          className="text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Serás redirigido en {countdown} segundos
        </motion.p>
      </motion.div>
    </div>
  );
}