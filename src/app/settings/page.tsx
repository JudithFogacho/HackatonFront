'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para las configuraciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState('es');
  const [currency, setCurrency] = useState('USD');
  
  // Manejar el cierre de sesión
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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

  // Componente para interruptores de configuración
  const ToggleSwitch = ({ 
    enabled, 
    onChange 
  }: { 
    enabled: boolean; 
    onChange: (enabled: boolean) => void 
  }) => (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${enabled ? 'bg-secondary' : 'bg-gray-600'}`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* Header con botón de volver */}
      <div className="bg-primary-dark p-4 flex items-center">
        <Link href="/profile" className="text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-white">Configuración</h1>
      </div>

      {/* Contenedor principal con animación */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-6"
      >
        {/* Secciones de configuración */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Sección de notificaciones */}
          <div className="bg-primary-dark rounded-xl p-4">
            <h2 className="text-white font-medium mb-4">Notificaciones</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Notificaciones push</p>
                  <p className="text-gray-400 text-xs">Recibir alertas en tu dispositivo</p>
                </div>
                <ToggleSwitch 
                  enabled={notificationsEnabled} 
                  onChange={setNotificationsEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Notificaciones por email</p>
                  <p className="text-gray-400 text-xs">Recibir actualizaciones por correo</p>
                </div>
                <ToggleSwitch 
                  enabled={emailNotificationsEnabled} 
                  onChange={setEmailNotificationsEnabled} 
                />
              </div>
            </div>
          </div>
          
          {/* Sección de apariencia */}
          <div className="bg-primary-dark rounded-xl p-4">
            <h2 className="text-white font-medium mb-4">Apariencia</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Modo oscuro</p>
                  <p className="text-gray-400 text-xs">Cambiar tema de la aplicación</p>
                </div>
                <ToggleSwitch 
                  enabled={darkModeEnabled} 
                  onChange={setDarkModeEnabled} 
                />
              </div>
              
              <div>
                <p className="text-white text-sm mb-2">Idioma</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Sección de preferencias */}
          <div className="bg-primary-dark rounded-xl p-4">
            <h2 className="text-white font-medium mb-4">Preferencias</h2>
            
            <div>
              <p className="text-white text-sm mb-2">Moneda predeterminada</p>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="USD">USD - Dólar estadounidense</option>
                <option value="EUR">EUR - Euro</option>
                <option value="PEN">PEN - Sol peruano</option>
                <option value="MXN">MXN - Peso mexicano</option>
                <option value="COP">COP - Peso colombiano</option>
                <option value="ARS">ARS - Peso argentino</option>
              </select>
            </div>
          </div>
          
          {/* Sección de seguridad */}
          <div className="bg-primary-dark rounded-xl p-4">
            <h2 className="text-white font-medium mb-4">Seguridad</h2>
            
            <div className="space-y-3">
              <button 
                className="w-full text-left flex items-center justify-between text-white text-sm py-2"
                onClick={() => router.push('/settings/change-password')}
              >
                <span>Cambiar contraseña</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button 
                className="w-full text-left flex items-center justify-between text-white text-sm py-2"
                onClick={() => router.push('/settings/privacy')}
              >
                <span>Privacidad y datos</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button 
                className="w-full text-left flex items-center justify-between text-white text-sm py-2"
                onClick={() => router.push('/settings/verification')}
              >
                <span>Verificación de identidad</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Sección de soporte */}
          <div className="bg-primary-dark rounded-xl p-4">
            <h2 className="text-white font-medium mb-4">Soporte</h2>
            
            <div className="space-y-3">
              <button 
                className="w-full text-left flex items-center justify-between text-white text-sm py-2"
                onClick={() => router.push('/help')}
              >
                <span>Centro de ayuda</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button 
                className="w-full text-left flex items-center justify-between text-white text-sm py-2"
                onClick={() => router.push('/terms')}
              >
                <span>Términos y condiciones</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button 
                className="w-full text-left flex items-center justify-between text-white text-sm py-2"
                onClick={() => router.push('/privacy-policy')}
              >
                <span>Política de privacidad</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Botón para cerrar sesión */}
          <motion.div 
            variants={itemVariants}
            className="pt-4"
          >
            <button
              onClick={handleLogout}
              className="w-full bg-danger text-white font-medium py-3 px-4 rounded-xl hover:bg-danger-dark transition-colors flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Cerrar sesión'
              )}
            </button>
          </motion.div>
          
          {/* Versión de la app */}
          <motion.div 
            variants={itemVariants}
            className="text-center pt-4"
          >
            <p className="text-gray-400 text-xs">
              DoUp v1.0.0
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
