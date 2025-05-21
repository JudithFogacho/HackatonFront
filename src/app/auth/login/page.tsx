// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WorldIDAuth from '@/components/auth/WorldIDAuth';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs flex flex-col items-center"
      >
        <div className="text-center mb-16">
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

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-semibold text-white mb-12"
        >
          Iniciar Sesión
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full"
        >
          <WorldIDAuth onSuccess={() => router.push('/jobs/categories')} />
        </motion.div>
      </motion.div>
    </div>
  );
}