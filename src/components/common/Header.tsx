'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

export default function Header({ showBackButton = false, title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determinar si mostrar el botón de retroceso basado en la ruta o la prop
  const shouldShowBackButton = showBackButton || 
    !['/jobs/categories', '/chat', '/profile'].includes(pathname);

  return (
    <header className="bg-primary py-4 px-4 flex items-center">
      {/* Botón de retroceso */}
      {shouldShowBackButton && (
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

      {/* Logo o título */}
      {title ? (
        <h1 className="text-xl font-bold text-white flex-1 text-center">{title}</h1>
      ) : (
        <div className={`${shouldShowBackButton ? '' : 'text-center flex-1'}`}>
          <Link href="/jobs/categories" className="inline-block">
            <h1 className="text-2xl font-bold text-secondary">
              D<span className="text-secondary">o</span>Up
            </h1>
          </Link>
        </div>
      )}

      {/* Espacio para mantener el centrado cuando hay botón de retroceso */}
      {shouldShowBackButton && <div className="w-6"></div>}
    </header>
  );
}