// src/app/jobs/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import { Job, JobType } from '@/types';
import { motion } from 'framer-motion';
import PaymentModal from '@/components/payment/PaymentModal';

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentPurpose, setPaymentPurpose] = useState<'link' | 'chat'>('link');
  const [transaction, setTransaction] = useState<{ reference: string; transactionId: string } | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  
  const router = useRouter();
  
  useEffect(() => {
    const loadJobDetails = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For now, use sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find the job in our mock data
        const sampleJob: Job = {
          _id: id,
          title: 'UX/UI DESIGNER PARA PAGINA WEB',
          company: 'TechCorp',
          description: 'Diseñar interfaces de usuario intuitivas y atractivas para aplicaciones web y móviles. Trabajarás en estrecha colaboración con equipos de producto y desarrollo.',
          requirements: [
            '3+ años de experiencia en diseño UX/UI',
            'Dominio de Figma y Adobe XD',
            'Portfolio destacado de proyectos anteriores',
            'Conocimientos de principios de diseño web',
            'Capacidad para iterar rápidamente en diseños'
          ],
          salary: {
            min: 300,
            max: 500,
            currency: 'USD'
          },
          location: 'Remoto',
          remote: true,
          type: JobType.FREELANCE,
          category: 'Diseño',
          postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          active: true
        };
        
        setJob(sampleJob);
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError('Error al cargar los detalles del trabajo');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobDetails();
  }, [id]);
  
  const handleGenerateLink = async () => {
    // In a real app, this would make an API call to start the payment process
    // For now, simulate it
    setPaymentPurpose('link');
    setTransaction({
      reference: 'ref_' + Math.random().toString(36).substring(2, 10),
      transactionId: 'tx_' + Math.random().toString(36).substring(2, 10)
    });
    setShowPaymentModal(true);
  };
  
  const handleStartChat = async () => {
    // In a real app, make API call first
    setPaymentPurpose('chat');
    setTransaction({
      reference: 'ref_' + Math.random().toString(36).substring(2, 10),
      transactionId: 'tx_' + Math.random().toString(36).substring(2, 10)
    });
    setShowPaymentModal(true);
  };
  
  const handlePaymentSuccess = (transactionId: string, link?: string) => {
    setShowPaymentModal(false);
    
    if (paymentPurpose === 'link' && link) {
      setGeneratedLink(link);
    } else if (paymentPurpose === 'chat') {
      // Redirect to chat
      router.push(`/chat?jobId=${id}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-primary-light">
        <Header showBackButton title="Detalles del trabajo" />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-primary-light">
        <Header showBackButton title="Detalles del trabajo" />
        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">{error || 'Trabajo no encontrado'}</p>
          <button 
            onClick={() => router.push('/jobs')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Volver a trabajos
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header showBackButton title="Detalles del trabajo" />
      
      <motion.div 
        className="flex-1 p-4 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-primary rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Job header */}
          <div className="p-4 border-b border-primary-dark">
            <h1 className="text-xl font-bold text-white uppercase">{job.title}</h1>
            <p className="text-secondary font-medium">{job.company}</p>
          </div>
          
          {/* Job details */}
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary-dark text-white text-xs">
                {job.remote ? 'Remoto' : 'Presencial'}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary-dark text-white text-xs">
                {job.location}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary-dark text-white text-xs">
                {job.type.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-primary text-xs font-medium">
                {job.category}
              </span>
            </div>
            
            <div className="mb-4">
              <h2 className="text-white font-semibold mb-2">Salario</h2>
              <p className="text-gray-300">
                {job.salary 
                  ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}` 
                  : 'No especificado'}
              </p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-white font-semibold mb-2">Descripción</h2>
              <p className="text-gray-300 whitespace-pre-line">{job.description}</p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-white font-semibold mb-2">Requisitos</h2>
              <ul className="text-gray-300 list-disc pl-5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="mb-1">{req}</li>
                ))}
              </ul>
            </div>
            
            <div className="text-xs text-gray-400 mb-4">
              Publicado: {new Date(job.postedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Generated link */}
        {generatedLink && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-medium mb-2">¡Enlace generado correctamente!</h3>
            <p className="text-green-700 text-sm mb-2">Usa este enlace para aplicar al trabajo:</p>
            <div className="bg-white p-3 rounded border border-gray-300 break-all">
              <a 
                href={generatedLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {generatedLink}
              </a>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {!generatedLink && (
            <button
              onClick={handleGenerateLink}
              className="bg-secondary text-primary font-medium py-3 px-4 rounded-lg shadow-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
              </svg>
              Generar enlace de aplicación (1 WLD)
            </button>
          )}
          
          <button
            onClick={handleStartChat}
            className={`${!generatedLink ? 'bg-white text-primary' : 'bg-secondary text-primary'} font-medium py-3 px-4 rounded-lg shadow-md flex items-center justify-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Hablar con asistente IA (1 WLD)
          </button>
        </div>
      </motion.div>
      
      <BottomNavigation />
      
      {/* Payment Modal */}
      {showPaymentModal && transaction && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title={
            paymentPurpose === 'link' 
              ? '¿ESTÁ SEGURO ESTA ACCIÓN SE DE GENERAR ESTE LINK?' 
              : 'ESTA CONSULTA TIENE UN PRECIO DE 1 WLD'
          }
          reference={transaction.reference}
          transactionId={transaction.transactionId}
          amount={1}
          purpose={paymentPurpose}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}