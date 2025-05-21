'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  transactionId: string;
  amount: number;
  purpose?: string;
  onSuccess: (transactionId: string) => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  reference, 
  transactionId, 
  amount, 
  purpose = 'pago', 
  onSuccess 
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'confirmation' | 'processing' | 'success' | 'error'>('confirmation');

  // Al cerrar, reiniciar el estado
  useEffect(() => {
    if (!isOpen) {
      setStep('confirmation');
      setError(null);
    }
  }, [isOpen]);

  // Simulación de pago con World ID
  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    setStep('processing');
    
    try {
      // Aquí sería donde integrarías con la API de pago de World ID
      // Por ahora, simularemos un proceso de pago con un timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos éxito del pago
      const success = Math.random() > 0.2; // 80% de probabilidad de éxito para probar
      
      if (success) {
        setStep('success');
        
        // Esperar un momento para mostrar la pantalla de éxito
        setTimeout(() => {
          onSuccess(transactionId);
        }, 1500);
      } else {
        throw new Error('Error en el procesamiento del pago');
      }
    } catch (err: any) {
      console.error('Error during payment:', err);
      setError(err.message || 'Ha ocurrido un error al procesar el pago');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-primary-light p-6 rounded-2xl w-full max-w-sm mx-4 relative overflow-hidden"
        >
          {step === 'confirmation' && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-6 text-center text-secondary">
                ¿ESTÁ SEGURO ESTA ACCIÓN SE DE GENERAR ESTE LINK?
              </h2>
              
              <div className="w-32 h-32 bg-secondary-light rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handlePayment}
                  className="flex-1 py-3 px-6 bg-secondary text-primary font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {amount} WLD
                </button>
              </div>
            </div>
          )}
          
          {step === 'processing' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-24 h-24 rounded-full border-4 border-secondary border-t-transparent animate-spin mb-6"></div>
              <h2 className="text-xl font-bold mb-2 text-primary">Procesando pago</h2>
              <p className="text-gray-600 text-center">
                Estamos procesando tu pago con World ID. Por favor, espera un momento...
              </p>
            </div>
          )}
          
          {step === 'success' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-primary">TRANSACCIÓN EXITOSA</h2>
              <p className="text-gray-600 text-center mb-4">
                Tu pago ha sido procesado correctamente.
              </p>
            </div>
          )}
          
          {step === 'error' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-primary">Error en la transacción</h2>
              <p className="text-red-500 text-center mb-6">
                {error || 'Ha ocurrido un error al procesar el pago.'}
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 font-medium rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handlePayment}
                  className="flex-1 py-3 px-6 bg-secondary text-primary font-medium rounded-lg"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}