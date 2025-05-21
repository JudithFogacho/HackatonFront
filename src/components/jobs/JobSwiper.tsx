'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Job } from '@/types';

interface JobSwiperProps {
  jobs: Job[];
  onSwipe: (direction: string, jobId: string) => void;
  onJobClick: (jobId: string) => void;
}

export default function JobSwiper({ jobs, onSwipe, onJobClick }: JobSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);
  
  // Obtener el trabajo actual
  const currentJob = jobs[currentIndex];
  const allJobsSwiped = currentIndex >= jobs.length;
  
  // Configurar valores de movimiento para la animación
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, 
    [-200, -150, 0, 150, 200], 
    [0.5, 1, 1, 1, 0.5]
  );
  
  // Indicadores visuales de izquierda y derecha
  const leftIndicatorOpacity = useTransform(x, [-150, 0], [1, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 150], [0, 1]);
  
  // Manejar el final del arrastre
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // Umbral para considerar un swipe completo
    
    if (info.offset.x > threshold) {
      // Swipe a la derecha - Interesado
      setExitX(200);
      setTimeout(() => {
        onSwipe('right', currentJob._id);
        setCurrentIndex(prev => prev + 1);
        setExitX(null);
        x.set(0);
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swipe a la izquierda - Descartar
      setExitX(-200);
      setTimeout(() => {
        onSwipe('left', currentJob._id);
        setCurrentIndex(prev => prev + 1);
        setExitX(null);
        x.set(0);
      }, 300);
    } else {
      // Reset si no llegó al umbral
      x.set(0);
    }
  };
  
  // Reiniciar y volver a mostrar todos los trabajos
  const handleReset = () => {
    setCurrentIndex(0);
  };
  
  // Formatear el salario
  const formatSalary = (job: Job) => {
    if (!job.salary) return 'Salario no especificado';
    
    const { min, max, currency } = job.salary;
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };
  
  // Si no hay más trabajos por mostrar
  if (allJobsSwiped) {
    return (
      <div className="flex flex-col items-center justify-center h-64 py-6">
        <h3 className="text-lg font-semibold text-primary mb-4">No hay más trabajos</h3>
        <p className="text-gray-700 mb-6 text-center">
          Has visto todos los trabajos disponibles en esta categoría.
        </p>
        <button 
          onClick={handleReset}
          className="px-6 py-3 bg-secondary text-primary font-medium rounded-lg shadow-md"
        >
          Volver a empezar
        </button>
      </div>
    );
  }
  
  return (
    <div className="relative h-[450px] w-full">
      {/* Tarjeta de trabajo */}
      <motion.div 
        className="absolute top-0 left-0 w-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, opacity }}
        animate={{ x: exitX || 0 }}
        transition={{ duration: 0.3 }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
      >
        <div 
          className="bg-primary rounded-xl shadow-lg overflow-hidden w-full"
          onClick={() => onJobClick(currentJob._id)}
        >
          {/* Encabezado de la tarjeta */}
          <div className="p-4 border-b border-primary-dark">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-300">Publicado: {new Date(currentJob.postedAt).toLocaleDateString()}</p>
                <h2 className="text-xl font-bold text-white uppercase mt-1">{currentJob.title}</h2>
                <p className="text-secondary font-medium">{currentJob.company}</p>
              </div>
              <div className="bg-secondary text-primary px-3 py-1 rounded-lg text-sm font-bold">
                {currentJob.salary?.min ? `$${currentJob.salary.min}` : 'N/A'} APROX
              </div>
            </div>
          </div>
          
          {/* Cuerpo de la tarjeta */}
          <div className="p-4">
            <p className="text-white mb-4">{currentJob.description}</p>
            
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-dark text-white text-xs">
                {currentJob.remote ? 'Remoto' : 'Presencial'}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary-dark text-white text-xs">
                {currentJob.location}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary-dark text-white text-xs">
                {currentJob.type.replace('_', ' ')}
              </span>
            </div>
            
            <h3 className="text-white font-semibold mt-3 mb-2">Requisitos:</h3>
            <ul className="text-gray-300 text-sm list-disc pl-5 mb-3">
              {currentJob.requirements.slice(0, 3).map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
              {currentJob.requirements.length > 3 && (
                <li className="text-secondary">Y {currentJob.requirements.length - 3} más...</li>
              )}
            </ul>
          </div>
          
          {/* Pie de la tarjeta con botones */}
          <div className="flex border-t border-primary-dark">
            <div className="w-1/2 p-3 text-center border-r border-primary-dark">
              <button className="text-red-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Descartar
              </button>
            </div>
            <div className="w-1/2 p-3 text-center">
              <button className="text-green-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Interesado
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Indicadores de swipe */}
      <motion.div 
        className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-red-500 rounded-full p-3"
        style={{ opacity: leftIndicatorOpacity }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-green-500 rounded-full p-3"
        style={{ opacity: rightIndicatorOpacity }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </motion.div>
    </div>
  );
}