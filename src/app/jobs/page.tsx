'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import JobSwiper from '@/components/jobs/JobSwiper';
import { Job, JobType } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// Componente que usa useSearchParams envuelto en Suspense
function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { token } = useAuth();
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Construir la URL con los parámetros de consulta
        let queryUrl = `${apiUrl}/api/jobs`;
        const params = new URLSearchParams();
        
        if (category) {
          params.append('category', category);
        }
        
        if (params.toString()) {
          queryUrl += `?${params.toString()}`;
        }
        
        // Realizar la solicitud
        const response = await fetch(queryUrl, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los trabajos');
        }
        
        const data = await response.json();
        
        // Si el backend devuelve un formato diferente, ajusta esto
        const jobsData = data.jobs || data;
        setJobs(jobsData);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Error al cargar los trabajos');
        
        // Si no hay conexión, usar datos de ejemplo
        if (!navigator.onLine || (err.message && err.message.includes('Failed to fetch'))) {
          setJobs(getSampleJobs());
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [apiUrl, category, token]);
  
  const handleSwipe = async (direction: 'left' | 'right', jobId: string) => {
    if (!token) {
      // Si no está autenticado, redirigir a login
      router.push('/auth/login?redirect=/jobs');
      return;
    }
    
    try {
      const status = direction === 'right' ? 'INTERESTED' : 'DISCARDED';
      
      // Enviar la actualización al backend
      await fetch(`${apiUrl}/api/jobs/${jobId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
    } catch (err) {
      console.error('Error updating job status:', err);
      // Podríamos mostrar un mensaje de error, pero no interrumpimos la experiencia
    }
  };
  
  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };
  
  // Obtener título según la categoría
  const getCategoryTitle = () => {
    if (!category) return 'Trabajos';
    
    const categoryMap: Record<string, string> = {
      'design': 'Diseño',
      'translation': 'Traductor',
      'development': 'Desarrollo',
      'marketing': 'Marketing',
      'accounting': 'Contabilidad',
      'writing': 'Redacción'
    };
    
    return categoryMap[category] || 'Trabajos';
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header title={getCategoryTitle()} showBackButton />
      
      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/jobs/categories')}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Volver a Categorías
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-700 mb-4">No hay trabajos disponibles en esta categoría.</p>
            <button 
              onClick={() => router.push('/jobs/categories')}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Explorar otras categorías
            </button>
          </div>
        ) : (
          <JobSwiper 
            jobs={jobs} 
            onSwipe={(direction, jobId) => handleSwipe(direction as 'left' | 'right', jobId)} 
            onJobClick={handleJobClick}
          />
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}

// Datos de ejemplo para usar cuando no hay conexión
function getSampleJobs(): Job[] {
  return [
    {
      _id: '1',
      title: 'Diseñador UX/UI',
      company: 'TechCorp',
      description: 'Diseñar interfaces de usuario intuitivas y atractivas para aplicaciones web y móviles.',
      requirements: ['3+ años de experiencia', 'Dominio de Figma y Adobe XD', 'Portfolio destacado'],
      salary: {
        min: 2500,
        max: 4000,
        currency: 'USD'
      },
      location: 'Remoto',
      remote: true,
      type: JobType.FULL_TIME,
      category: 'Diseño',
      postedAt: new Date().toISOString(),
      active: true
    },
    {
      _id: '2',
      title: 'Desarrollador Frontend React',
      company: 'WebSolutions',
      description: 'Desarrollar interfaces de usuario interactivas utilizando React, TypeScript y Next.js.',
      requirements: ['Experiencia con React', 'Conocimientos de TypeScript', 'CSS avanzado'],
      salary: {
        min: 3000,
        max: 5000,
        currency: 'USD'
      },
      location: 'Madrid, España',
      remote: true,
      type: JobType.FULL_TIME,
      category: 'Desarrollo',
      postedAt: new Date().toISOString(),
      active: true
    },
    {
      _id: '3',
      title: 'Traductor Español-Inglés',
      company: 'GlobalTranslate',
      description: 'Traducir documentos técnicos y comerciales del español al inglés con precisión y fluidez.',
      requirements: ['Nativo en español', 'Nivel C2 de inglés', 'Experiencia en traducciones técnicas'],
      salary: {
        min: 1500,
        max: 2500,
        currency: 'USD'
      },
      location: 'Barcelona, España',
      remote: true,
      type: JobType.FREELANCE,
      category: 'Traductor',
      postedAt: new Date().toISOString(),
      active: true
    }
  ];
}

// Componente principal que envuelve el contenido en Suspense
export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div></div>}>
      <JobsContent />
    </Suspense>
  );
}