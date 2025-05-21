'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import PaymentModal from '@/components/payment/PaymentModal';
import { Job } from '@/types';
import { motion } from 'framer-motion';

export default function NewChatPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transaction, setTransaction] = useState<{ reference: string; transactionId: string } | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const { token, isAuthenticated } = useAuth();
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';
  
  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/chat/new${jobId ? `?jobId=${jobId}` : ''}`);
      return;
    }
    
    // Si hay un ID de trabajo, cargar sus detalles
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, isAuthenticated, router]);
  
  const fetchJobDetails = async () => {
    if (!jobId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los detalles del trabajo');
      }
      
      const data = await response.json();
      setJob(data);
    } catch (err: any) {
      console.error('Error fetching job details:', err);
      setError(err.message || 'Error al cargar los detalles del trabajo');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateChat = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/chat/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: jobId || undefined
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'pending') {
        setTransaction({
          reference: data.reference,
          transactionId: data.transactionId
        });
        setShowPaymentModal(true);
      } else {
        setError(data.error || 'Error al iniciar el chat');
      }
    } catch (err: any) {
      console.error('Error creating chat:', err);
      setError(err.message || 'Error al iniciar el chat');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/chat/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transactionId,
          jobId: jobId || undefined
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirigir al chat creado
        router.push(`/chat/${data.chatId}`);
      } else {
        setError(data.error || 'Error al completar la creación del chat');
      }
    } catch (err: any) {
      console.error('Error completing chat creation:', err);
      setError(err.message || 'Error al completar la creación del chat');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header showBackButton title="Nuevo Chat" />
      
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl font-bold text-primary mb-4 text-center">
            {job ? `Chat sobre: ${job.title}` : 'Iniciar nuevo chat con IA'}
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-700 text-center">
              {job 
                ? 'Habla con nuestra IA sobre este trabajo y resuelve tus dudas.' 
                : 'Habla con nuestra IA para encontrar el trabajo perfecto para ti.'
              }
            </p>
            
            {job && (
              <div className="mt-4 p-3 bg-primary-light rounded-lg">
                <p className="text-sm text-primary font-medium">{job.company}</p>
                <p className="text-xs text-gray-600 mt-1">{job.location} · {job.type.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Esta consulta tiene un precio de 1 WLD.</strong> Se te pedirá confirmación antes de procesar el pago.
                </p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            onClick={handleCreateChat}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-secondary text-primary font-medium rounded-lg shadow-md hover:bg-secondary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando...
              </div>
            ) : (
              'Iniciar Chat'
            )}
          </button>
        </motion.div>
      </main>
      
      <BottomNavigation />
      
      {showPaymentModal && transaction && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          reference={transaction.reference}
          transactionId={transaction.transactionId}
          amount={1}
          purpose="chat"
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}