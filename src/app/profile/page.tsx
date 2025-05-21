// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/common/BottomNavigation';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      try {
        // Get user data from localStorage
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData));
        } else {
          // Use sample data if none found
          setUserData({
            nickname: 'User_name',
            hourlyRate: 20,
            linksGenerated: 15,
            rating: 4.5
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleLogout = () => {
    // Clear stored user data
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    
    // Clear cookies
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
    
    // Redirect to login
    router.push('/auth/login');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-primary-light">
        <Header title="Perfil" />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      <Header title="Perfil" />
      
      <main className="flex-1 p-4 pb-20">
        <div className="flex flex-col items-center">
          {/* Profile picture */}
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {/* Username */}
          <h2 className="text-2xl font-semibold text-primary mb-6">{userData?.nickname || 'User_name'}</h2>
          
          {/* Stats */}
          <div className="bg-primary rounded-lg w-full mb-8">
            <div className="flex text-white text-center">
              <div className="flex-1 p-4 border-r border-primary-dark">
                <p className="text-xl font-bold">${userData?.hourlyRate || 20}</p>
                <p className="text-sm">Por Hora</p>
              </div>
              <div className="flex-1 p-4 border-r border-primary-dark">
                <p className="text-xl font-bold">{userData?.linksGenerated || 15}</p>
                <p className="text-sm">Enlaces Generados</p>
              </div>
              <div className="flex-1 p-4">
                <p className="text-xl font-bold">{userData?.rating || 4.5}/5</p>
                <div className="flex justify-center">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${i < Math.floor(userData?.rating || 4.5) ? 'text-yellow-400' : 'text-gray-400'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Logout button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md"
          >
            CERRAR SESIÓN
          </motion.button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}