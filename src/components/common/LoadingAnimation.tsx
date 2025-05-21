// src/components/common/LoadingAnimation.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoadingAnimation() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirect to login after animation completes
          setTimeout(() => {
            router.push('/auth/login');
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-8xl font-bold text-secondary"
          >
            <span className="block">Do</span>
            <span className="block -mt-12">Up</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-1 bg-secondary rounded-full mt-8"
        />
      </motion.div>
    </div>
  );
}