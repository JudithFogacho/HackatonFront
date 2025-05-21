// src/components/jobs/CategoryCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onSelect: () => void;
}

export default function CategoryCard({ category, onSelect }: CategoryCardProps) {
  return (
    <motion.div
      className="bg-primary rounded-xl shadow-md overflow-hidden cursor-pointer h-32"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center justify-center p-6 h-full">
        <div className="text-white mb-3">
          {category.icon}
        </div>
        <h3 className="text-white font-medium text-sm md:text-base">
          {category.name}
        </h3>
        {category.count !== undefined && (
          <span className="text-xs text-gray-300 mt-1">
            {category.count} ofertas
          </span>
        )}
      </div>
    </motion.div>
  );
}