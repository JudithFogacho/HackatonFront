import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

// Importar la fuente Inter de Google Fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Definir configuración de viewport para el navegador
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#004B62',
};

// Definir metadatos para SEO y navegador
export const metadata: Metadata = {
  title: 'Do Up | Conecta con oportunidades',
  description: 'Encuentra trabajos y profesionales en una plataforma verificada con World ID',
  keywords: 'trabajos, profesionales, freelance, World ID, blockchain',
  authors: [{ name: 'Do Up Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://doup.app',
    title: 'Do Up | Conecta con oportunidades',
    description: 'Encuentra trabajos y profesionales verificados',
    siteName: 'Do Up',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Do Up - Conecta con oportunidades',
      },
    ],
  },
};

// Layout principal que envuelve toda la aplicación
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-primary text-white min-h-screen flex flex-col">
        {/* Proveedor de autenticación para toda la aplicación */}
        <AuthProvider>
          {/* Contenedor principal con dimensiones de móvil */}
          <div className="flex flex-col mx-auto w-full max-w-md min-h-screen">
            {/* Renderizar el contenido de la página */}
            {children}
          </div>
        </AuthProvider>
        
        {/* Script para World ID si es necesario */}
        <script
          defer
          src="https://cdn.worldcoin.org/verify.js"
          data-app-id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}
        />
      </body>
    </html>
  );
}