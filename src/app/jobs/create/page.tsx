'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { JobType } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const categories = [
  { id: 'design', name: 'Diseño' },
  { id: 'development', name: 'Desarrollo' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'writing', name: 'Redacción' },
  { id: 'translation', name: 'Traducción' },
  { id: 'accounting', name: 'Contabilidad' },
  { id: 'other', name: 'Otro' }
];

const jobTypes = [
  { id: JobType.FULL_TIME, name: 'Tiempo completo' },
  { id: JobType.PART_TIME, name: 'Medio tiempo' },
  { id: JobType.CONTRACT, name: 'Contrato' },
  { id: JobType.FREELANCE, name: 'Freelance' },
  { id: JobType.INTERNSHIP, name: 'Práctica' }
];

// Componente que contiene la lógica principal
function CreateJobContent() {
  // Usamos useEffect para asegurarnos de que el código que accede a APIs del navegador solo se ejecute en el cliente
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const router = useRouter();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    location: '',
    remote: true,
    type: JobType.FREELANCE,
    category: '',
  });

  // Si no hay token y el componente está montado, redirigir a login
  useEffect(() => {
    if (isMounted && !token) {
      router.push('/auth/login?redirect=/jobs/create');
    }
  }, [isMounted, token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar campos obligatorios
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }
      
      // Preparar los datos para enviar
      const jobData = {
        title: formData.title,
        company: formData.company || user?.nickname || 'Anónimo',
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        salary: {
          min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
          max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
          currency: formData.currency
        },
        location: formData.location || 'Remoto',
        remote: formData.remote,
        type: formData.type,
        category: formData.category,
        active: true
      };
      
      // Enviar datos al backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hackatondoup.onrender.com';
      const response = await fetch(`${apiUrl}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el trabajo');
      }
      
      // Redirigir a la página de trabajos
      router.push('/jobs');
      
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.message || 'Error al crear el trabajo');
    } finally {
      setIsLoading(false);
    }
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

  // Si el componente no está montado, mostramos un esqueleto de carga
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-primary pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }
  
  // Si el componente está montado y no hay token, no renderizamos nada (la redirección se maneja en useEffect)
  if (!token) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header con botón de volver */}
      <div className="bg-primary-dark p-4 flex items-center">
        <Link href="/jobs" className="text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-white">Publicar Trabajo</h1>
      </div>

      {/* Contenedor principal con animación */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-6"
      >
        {/* Formulario de creación de trabajo */}
        <form onSubmit={handleSubmit}>
          <motion.div 
            variants={itemVariants}
            className="space-y-6"
          >
            {/* Mensaje de error */}
            {error && (
              <div className="bg-danger-light text-danger p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Título del trabajo */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Título del trabajo *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Diseñador UX/UI"
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              />
            </div>

            {/* Empresa */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                Empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nombre de tu empresa"
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              />
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Descripción del trabajo *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe el trabajo, responsabilidades y detalles importantes"
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                disabled={isLoading}
              />
            </div>

            {/* Requisitos */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-300 mb-1">
                Requisitos (uno por línea)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                placeholder="Experiencia con React&#10;Conocimientos de diseño&#10;Inglés intermedio"
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              />
            </div>

            {/* Rango salarial */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-300 mb-1">
                  Salario mínimo
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-300 mb-1">
                  Salario máximo
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Moneda */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                Moneda
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              >
                <option value="USD">USD - Dólar estadounidense</option>
                <option value="EUR">EUR - Euro</option>
                <option value="PEN">PEN - Sol peruano</option>
                <option value="MXN">MXN - Peso mexicano</option>
                <option value="COP">COP - Peso colombiano</option>
                <option value="ARS">ARS - Peso argentino</option>
              </select>
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
                placeholder="Ej: Lima, Perú (deja vacío si es remoto)"
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              />
            </div>

            {/* Trabajo remoto */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                name="remote"
                checked={formData.remote}
                onChange={handleChange}
                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-600 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remote" className="ml-2 block text-sm text-gray-300">
                Trabajo remoto
              </label>
            </div>

            {/* Tipo de trabajo */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de trabajo
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-primary-dark border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              >
                {jobTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones de acción */}
            <div className="pt-4 flex space-x-3">
              <Link
                href="/jobs"
                className="flex-1 bg-transparent border border-gray-500 text-white font-medium py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors text-center"
              >
                Cancelar
              </Link>
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
                  'Publicar Trabajo'
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

// Componente principal que renderiza el formulario con Suspense
export default function CreateJobPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="animate-spin h-10 w-10 text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>}>
      <CreateJobContent />
    </Suspense>
  );
}