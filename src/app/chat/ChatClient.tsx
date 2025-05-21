// src/app/chat/ChatClient.tsx
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import PaymentModal from '@/components/payment/PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';

// Inner component that uses searchParams
function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams?.get('jobId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transaction, setTransaction] = useState<{ reference: string; transactionId: string } | null>(null);
  const [messages, setMessages] = useState<Array<{role: 'USER' | 'AI', content: string, timestamp: Date}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle initial load
  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, check if the user has an existing chat
        // or if they need to make a payment first
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // If jobId is provided, simulate a chat about that job
        // Otherwise, show a general greeting
        if (jobId) {
          setMessages([
            {
              role: 'AI',
              content: 'Bienvenido, he visto que seleccionaste la categoría desarrollo',
              timestamp: new Date()
            },
            {
              role: 'AI',
              content: 'Como te puedo ayudar?',
              timestamp: new Date()
            }
          ]);
        } else {
          setMessages([
            {
              role: 'AI',
              content: 'Hola, soy tu asistente de Do Up. ¿En qué puedo ayudarte hoy?',
              timestamp: new Date()
            }
          ]);
          
          // Show payment modal if this is a new chat
          simulatePaymentRequirement();
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initChat();
  }, [jobId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const simulatePaymentRequirement = () => {
    setTransaction({
      reference: 'ref_' + Math.random().toString(36).substring(2, 10),
      transactionId: 'tx_' + Math.random().toString(36).substring(2, 10)
    });
    setShowPaymentModal(true);
  };
  
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Already showing initial messages
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      role: 'USER' as const,
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      // Handle specific test case from the images
      let responseContent = '';
      
      if (inputMessage.toLowerCase().includes('node.js') && inputMessage.toLowerCase().includes('desarrollador')) {
        responseContent = `Claro, aquí te muestro a los desarrolladores con mejor puntaje que trabajan con Node.js

Desarrollador -Node.Js
3 años de experiencia
$1500/mes

Desarrollador -Node.Js
1 años de experiencia
$1000/mes

Desarrollador -Node.Js
Sin experiencia
$800/mes`;
      } else {
        // Generic responses
        const genericResponses = [
          'Entiendo lo que buscas. Puedo ayudarte a encontrar el profesional adecuado para tu proyecto.',
          'Basado en tus requisitos, te recomendaría buscar en la categoría de desarrollo web.',
          'Puedo ayudarte a redactar una descripción del trabajo para atraer a los mejores candidatos.',
          'Hay varios freelancers disponibles que coinciden con lo que necesitas. ¿Quieres que te muestre algunos perfiles?'
        ];
        responseContent = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }
      
      const aiResponse = {
        role: 'AI' as const,
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-primary-light">
        <Header showBackButton title="Chat" />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header showBackButton title="Chat" />
      
      <main className="flex-1 p-4 pb-20 overflow-auto">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'USER' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-green-100 text-primary rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'USER' ? 'text-primary-light' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-green-100 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                <div className="flex space-x-1 items-center h-6">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <div className="fixed bottom-16 left-0 right-0 p-3 max-w-md mx-auto">
        <form onSubmit={handleSendMessage} className="flex bg-white rounded-full overflow-hidden shadow-lg">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Write Here..."
            className="flex-1 py-3 px-4 bg-white text-primary focus:outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputMessage.trim()}
            className="px-4 flex items-center justify-center bg-primary text-white disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
      
      <BottomNavigation />
      
      {/* Payment Modal */}
      {showPaymentModal && transaction && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => router.push('/jobs/categories')}
          title="ESTA CONSULTA TIENE UN PRECIO DE 1 WLD"
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

// Loading fallback component
function ChatLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header showBackButton title="Chat" />
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      <BottomNavigation />
    </div>
  );
}

// Main component with suspense boundary
export default function ChatClient() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  );
}
