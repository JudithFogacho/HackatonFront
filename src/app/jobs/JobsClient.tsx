// src/app/jobs/JobsClient.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import JobSwiper from '@/components/jobs/JobSwiper';
import { Job, JobType } from '@/types';

// Inner component that uses searchParams
function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  useEffect(() => {
    // Simulate loading jobs from API
    const loadJobs = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For now, use sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleJobs: Job[] = [
          {
            _id: '1',
            title: 'UX/UI DESIGNER PARA PAGINA WEB',
            company: 'TechCorp',
            description: 'Diseñar interfaces de usuario intuitivas y atractivas para aplicaciones web.',
            requirements: ['3+ años de experiencia', 'Dominio de Figma y Adobe XD', 'Portfolio destacado'],
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
          },
          {
            _id: '2',
            title: 'Desarrollador Frontend React',
            company: 'WebSolutions',
            description: 'Desarrollar interfaces de usuario interactivas utilizando React y TypeScript.',
            requirements: ['Experiencia con React', 'Conocimientos de TypeScript', 'CSS avanzado'],
            salary: {
              min: 400,
              max: 600,
              currency: 'USD'
            },
            location: 'Madrid, España',
            remote: true,
            type: JobType.FULL_TIME,
            category: 'Desarrollo',
            postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            active: true
          },
          {
            _id: '3',
            title: 'Traductor Español-Inglés',
            company: 'GlobalTranslate',
            description: 'Traducir documentos técnicos y comerciales del español al inglés.',
            requirements: ['Nivel nativo español', 'Nivel C2 de inglés', 'Experiencia en traducciones técnicas'],
            salary: {
              min: 250,
              max: 350,
              currency: 'USD'
            },
            location: 'Barcelona, España',
            remote: true,
            type: JobType.FREELANCE,
            category: 'Traductor',
            postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            active: true
          }
        ];
        
        // Filter by category if specified
        const filteredJobs = category 
          ? sampleJobs.filter(job => job.category.toLowerCase() === category) 
          : sampleJobs;
        
        setJobs(filteredJobs);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError('Error al cargar los trabajos');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobs();
  }, [category]);
  
  const handleSwipe = (direction: 'left' | 'right', jobId: string) => {
    console.log(`Swiped ${direction} on job ${jobId}`);
    // In a real app, you would update the job status in the database
  };
  
  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };
  
  // Get title based on category
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

// Loading fallback component
function JobsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header title="Trabajos" showBackButton />
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      <BottomNavigation />
    </div>
  );
}

// Main component with suspense boundary
export default function JobsClient() {
  return (
    <Suspense fallback={<JobsLoading />}>
      <JobsContent />
    </Suspense>
  );
}
