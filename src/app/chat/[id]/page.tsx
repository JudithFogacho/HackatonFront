'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import { Chat, ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';
  
  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/chat/${id}`);
      return;
    }
    
    fetchChat();
  }, [id, isAuthenticated, router]);
  
  useEffect(() => {
    // Scroll al final de los mensajes cuando cambian
    scrollToBottom();
  }, [chat?.messages]);
  
  const fetchChat = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/chat/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar el chat');
      }
      
      const data = await response.json();
      setChat(data);
    } catch (err: any) {
      console.error('Error fetching chat:', err);
      setError(err.message || 'Error al cargar el chat');
      
      // Si no hay conexión, usar datos de ejemplo
      if (!navigator.onLine || (err.message && err.message.includes('Failed to fetch'))) {
        setChat(getSampleChat(id));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      // Optimistic update
      const newMessage: ChatMessage = {
        role: 'USER',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setChat(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage]
        };
      });
      
      setMessage('');
      
      // Enviar mensaje al backend
      const response = await fetch(`${apiUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chatId: id,
          message: newMessage.content
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }
      
      const data = await response.json();
      
      // Actualizar con la respuesta completa del servidor
      setChat(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: data.messages
        };
      });
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Error al enviar el mensaje');
      
      // Simular respuesta de IA en caso de error
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          role: 'AI',
          content: 'Lo siento, estoy teniendo problemas para responder en este momento. ¿Podrías intentar de nuevo?',
          timestamp: new Date().toISOString()
        };
        
        setChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, aiResponse]
          };
        });
      }, 1500);
    } finally {
      setIsSending(false);
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
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
  
  if (error || !chat) {
    return (
      <div className="min-h-screen flex flex-col bg-primary-light">
        <Header showBackButton title="Chat" />
        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">{error || 'Chat no encontrado'}</p>
          <button 
            onClick={() => router.push('/chat')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Volver a chats
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  const jobTitle = typeof chat.jobId === 'object' && chat.jobId ? chat.jobId.title : null;
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header 
        showBackButton 
        title={jobTitle ? `Chat: ${jobTitle}` : 'Chat con IA'} 
      />
      
      <main className="flex-1 p-4 pb-24 overflow-auto">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {chat.messages.map((msg, index) => (
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
                      : 'bg-white shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'USER' ? 'text-primary-light' : 'text-gray-500'}`}>
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm rounded-bl-none max-w-[80%]">
                <div className="flex space-x-1 items-center">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <div className="fixed bottom-16 left-0 right-0 p-3 max-w-md mx-auto">
        <form onSubmit={handleSendMessage} className="flex bg-primary rounded-full overflow-hidden shadow-lg">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write Here..."
            className="flex-1 py-3 px-4 bg-white text-primary focus:outline-none"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !message.trim()}
            className="px-4 flex items-center justify-center bg-white text-primary disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
      
      <BottomNavigation />
    </div>
  );
}

// Datos de ejemplo
function getSampleChat(id: string): Chat {
  return {
    _id: id,
    userId: 'user1',
    messages: [
      {
        role: 'AI',
        content: 'Bienvenido, he visto que seleccionaste la categoría desarrollo',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        role: 'AI',
        content: 'Como te puedo ayudar?',
        timestamp: new Date(Date.now() - 3595000).toISOString()
      },
      {
        role: 'USER',
        content: 'Necesito un desarrollador que trabaje con Node.js de habla hispana',
        timestamp: new Date(Date.now() - 3550000).toISOString()
      },
      {
        role: 'AI',
        content: 'Claro, aquí te muestro a los desarrolladores con mejor puntaje que trabajan con Node.js\n\nDesarrollador -Node.Js\n3 años de experiencia\n$1500/mes\n\nDesarrollador -Node.Js\n1 años de experiencia\n$1000/mes\n\nDesarrollador -Node.Js\nSin experiencia\n$800/mes',
        timestamp: new Date(Date.now() - 3500000).toISOString()
      }
    ],
    transactionId: 'transaction1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3500000).toISOString()
  };
}