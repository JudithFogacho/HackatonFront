'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Datos de ejemplo para el perfil (los mismos que en la página de perfil)
const mockUserData = {
  name: 'Carlos Rodríguez',
  username: '@carlos_rod',
  email: 'carlos.rodriguez@email.com',
  avatar: '/images/avatar-placeholder.jpg',
  bio: 'Profesional en diseño gráfico y marketing digital con más de 5 años de experiencia.',
  hourlyRate: 25,
  skills: ['Diseño Gráfico', 'Marketing Digital', 'Redes Sociales', 'Branding'],
  phone: '+51 987 654 321',
  location: 'Lima, Perú',
};

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: mockUserData.name,
    username: mockUserData.username,
    email: mockUserData.email,
    bio: mockUserData.bio,
    hourlyRate: mockUserData.hourlyRate,
    phone: mockUserData.phone,
    location: mockUserData.location,
    skills: mockUserData.skills.join(', '),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular una petición a la API
    setTimeout(() => {
      setIsLoading(false);
      router.push('/profile');
    }, 1000);
  };

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
      {/* Header con botón de volver */}
      <div className="bg-primary-dark p-4 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="text-white mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">Editar Perfil</h1>
      </div>

      {/* Contenedor principal con animación */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-6"
      >
        {/* Sección de avatar */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              <img 
                src={mockUserData.avatar} 
                alt={mockUserData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/96';
                }}
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-secondary rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <button className="text-secondary text-sm font-medium">
            Cambiar foto
          </button>
        </motion.div>

        {/* Formulario de edición */}
        <form onSubmit={handleSubmit}>
          <motion.div 
            variants={itemVariants}
            className="space-y-6"
          >
            {/* Nombre completo */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              />
            </div>

            {/* Nombre de usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              />
            </div>

            {/* Correo electrónico */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              />
            </div>

            {/* Biografía */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              />
            </div>

            {/* Tarifa por hora */}
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-300 mb-1">
                Tarifa por hora (USD)
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="1"
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              />
            </div>

            {/* Ubicación */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              />
            </div>

            {/* Habilidades */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">
                Habilidades (separadas por comas)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              />
            </div>

            {/* Botones de acción */}
            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-transparent border border-gray-500 text-white font-medium py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-secondary text-primary font-bold py-3 px-4 rounded-xl hover:bg-secondary-dark transition-colors flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
