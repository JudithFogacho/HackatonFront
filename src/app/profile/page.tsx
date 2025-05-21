'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProfileStats from '@/components/profile/ProfileStats';

// Datos de ejemplo para el perfil
const mockUserData = {
  name: 'Carlos Rodríguez',
  username: '@carlos_rod',
  avatar: '/images/avatar-placeholder.jpg', // Asegúrate de tener esta imagen o usa una URL de placeholder
  bio: 'Profesional en diseño gráfico y marketing digital con más de 5 años de experiencia.',
  verified: true,
  hourlyRate: 25,
  linksGenerated: 47,
  rating: 4.8,
  skills: ['Diseño Gráfico', 'Marketing Digital', 'Redes Sociales', 'Branding'],
  completedJobs: 32,
};

// Datos de ejemplo para los trabajos recientes
const recentJobs = [
  {
    id: 'job1',
    title: 'Diseño de logo para startup',
    client: 'TechSolutions Inc.',
    date: '15 mayo, 2025',
    status: 'completed',
    amount: 120,
  },
  {
    id: 'job2',
    title: 'Campaña en redes sociales',
    client: 'Café Aroma',
    date: '3 mayo, 2025',
    status: 'completed',
    amount: 200,
  },
  {
    id: 'job3',
    title: 'Rediseño de sitio web',
    client: 'Viajes Mundo',
    date: '28 abril, 2025',
    status: 'in_progress',
    amount: 350,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('trabajos'); // 'trabajos' o 'reseñas'

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header con botón de volver y opciones */}
      <div className="bg-primary-dark p-4 flex justify-between items-center">
        <Link href="/jobs/categories" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Contenedor principal con animación */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-6"
      >
        {/* Sección de información del perfil */}
        <motion.div variants={itemVariants} className="mb-6 flex items-center">
          {/* Avatar con indicador de verificación */}
          <div className="relative mr-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
              <img 
                src={mockUserData.avatar} 
                alt={mockUserData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback para imagen de avatar si no se encuentra
                  e.currentTarget.src = 'https://via.placeholder.com/80';
                }}
              />
            </div>
            {mockUserData.verified && (
              <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Información básica */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{mockUserData.name}</h2>
            <p className="text-gray-300 text-sm">{mockUserData.username}</p>
            <div className="flex items-center mt-1">
              <span className="bg-secondary-light text-primary text-xs font-medium px-2 py-0.5 rounded">
                Verificado con World ID
              </span>
            </div>
          </div>

          {/* Botón de editar perfil */}
          <Link 
            href="/profile/edit" 
            className="bg-transparent border border-gray-400 text-white text-sm py-1 px-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Editar
          </Link>
        </motion.div>

        {/* Bio */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-white text-sm">{mockUserData.bio}</p>
        </motion.div>

        {/* Estadísticas */}
        <motion.div variants={itemVariants} className="mb-6">
          <ProfileStats 
            hourlyRate={mockUserData.hourlyRate} 
            linksGenerated={mockUserData.linksGenerated} 
            rating={mockUserData.rating} 
          />
        </motion.div>

        {/* Habilidades */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-white font-medium mb-2">Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {mockUserData.skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-primary-light bg-opacity-20 text-white text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tabs para trabajos y reseñas */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="flex border-b border-gray-600">
            <button
              className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'trabajos' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-300'}`}
              onClick={() => setActiveTab('trabajos')}
            >
              Trabajos Recientes
            </button>
            <button
              className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'reseñas' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-300'}`}
              onClick={() => setActiveTab('reseñas')}
            >
              Reseñas
            </button>
          </div>
        </motion.div>

        {/* Contenido de la pestaña activa */}
        {activeTab === 'trabajos' && (
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            {recentJobs.map((job) => (
              <Link 
                href={`/jobs/${job.id}`} 
                key={job.id}
                className="block bg-primary-dark rounded-lg p-4 hover:bg-opacity-80 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white">{job.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${job.status === 'completed' ? 'bg-success-light text-success' : 'bg-primary-light text-primary'}`}>
                    {job.status === 'completed' ? 'Completado' : 'En progreso'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">Cliente: {job.client}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">{job.date}</span>
                  <span className="font-bold text-secondary">${job.amount}</span>
                </div>
              </Link>
            ))}

            {/* Botón para ver más */}
            <div className="text-center mt-4">
              <button className="text-secondary text-sm hover:underline">
                Ver todos los trabajos
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'reseñas' && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-gray-300 mb-2">Aún no tienes reseñas</p>
            <p className="text-gray-400 text-sm">Completa más trabajos para recibir reseñas de tus clientes</p>
          </motion.div>
        )}
      </motion.div>

      {/* Menú de navegación inferior */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-primary-dark py-3 px-4 flex justify-around items-center shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Link href="/jobs/categories" className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs text-gray-400 mt-1">Inicio</span>
        </Link>
        
        <Link href="/chat" className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-xs text-gray-400 mt-1">Chat</span>
        </Link>
        
        <Link href="/profile" className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs text-secondary mt-1">Perfil</span>
        </Link>
      </motion.div>
    </div>
  );
}