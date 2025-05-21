// src/components/payment/PaymentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  reference: string;
  transactionId: string;
  amount: number;
  purpose?: 'link' | 'chat';
  onSuccess: (transactionId: string, link?: string) => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  title,
  reference, 
  transactionId, 
  amount, 
  purpose = 'link', 
  onSuccess 
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'confirmation' | 'processing' | 'success'>('confirmation');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('confirmation');
      setError(null);
      setGeneratedLink(null);
    }
  }, [isOpen]);

  // Process payment (simulation)
  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    setStep('processing');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For link generation, simulate a link
      if (purpose === 'link') {
        const link = 'https://docs.World.Org/Mini-Apps/More/Promotion';
        setGeneratedLink(link);
      }
      
      setStep('success');
      
      // Short delay before calling onSuccess
      setTimeout(() => {
        onSuccess(transactionId, generatedLink || undefined);
      }, 1500);
    } catch (err: any) {
      console.error('Error during payment:', err);
      setError(err.message || 'Ha ocurrido un error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md h-full bg-primary p-6 flex flex-col items-center justify-center"
        >
          {step === 'confirmation' && (
            <div className="flex flex-col items-center max-w-xs mx-auto">
              <h2 className="text-2xl font-bold mb-10 text-center text-secondary">
                {title || '¿ESTÁ SEGURO ESTA ACCIÓN SE DE GENERAR ESTE LINK?'}
              </h2>
              
              <div className="w-40 h-40 bg-light-mint rounded-full flex items-center justify-center mb-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              {/* Buttons */}
              <div className="flex w-full gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 px-6 bg-gray-400 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handlePayment}
                  className="flex-1 py-4 px-6 bg-secondary text-primary font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {amount} WLD
                </button>
              </div>
            </div>
          )}
          
          {step === 'processing' && (
            <div className="flex flex-col items-center max-w-xs mx-auto">
              <div className="w-24 h-24 rounded-full border-4 border-secondary border-t-transparent animate-spin mb-8"></div>
              <h2 className="text-2xl font-bold mb-4 text-secondary">Procesando pago</h2>
              <p className="text-white text-center mb-4">
                Estamos procesando tu pago con World ID. Por favor, espera un momento...
              </p>
            </div>
          )}
          
          {step === 'success' && (
            <div className="flex flex-col items-center max-w-xs mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-secondary">
                TRANSACCIÓN EXITOSA
              </h2>
              
              <div className="w-40 h-40 bg-light-mint rounded-full flex items-center justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
              
              {generatedLink && (
                <div className="w-full mb-8">
                  <p className="text-secondary font-bold mb-2">LINK</p>
                  <div className="bg-white p-3 rounded-lg break-all border border-secondary">
                    <p className="text-primary text-sm overflow-hidden">{generatedLink}</p>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => onSuccess(transactionId, generatedLink || undefined)}
                className="w-full py-4 px-6 bg-secondary text-primary font-bold rounded-lg"
              >
                IR
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}