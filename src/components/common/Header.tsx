// src/components/common/Header.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

export default function Header({ showBackButton = false, title }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-primary py-4 px-4 flex items-center">
      {/* Back button */}
      {showBackButton && (
        <button 
          onClick={() => router.back()} 
          className="p-1 mr-4 text-white hover:text-secondary transition-colors"
          aria-label="Volver"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Logo or title */}
      <div className={`${!showBackButton ? 'flex-1 text-center' : ''}`}>
        {title ? (
          <h1 className="text-xl font-bold text-white">{title}</h1>
        ) : (
          <Link href="/jobs/categories" className="inline-block">
            <h1 className="text-3xl font-bold text-secondary">
              <span className="inline-block">Do</span>
              <span className="inline-block -ml-1">Up</span>
            </h1>
          </Link>
        )}
      </div>

      {/* Spacer to maintain alignment when back button is shown */}
      {showBackButton && <div className="w-7"></div>}
    </header>
  );
}