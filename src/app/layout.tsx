import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientAuthProvider from '@/components/common/ClientAuthProvider';

// Importar la fuente Inter de Google Fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Definir metadatos para SEO y navegador
export const metadata: Metadata = {
  title: 'Do Up | Conecta con oportunidades',
  description: 'Encuentra trabajos y profesionales en una plataforma verificada con World ID',
  keywords: 'trabajos, profesionales, freelance, World ID, blockchain',
  authors: [{ name: 'Do Up Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#004B62',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    title: 'Do Up | Conecta con oportunidades',
    description: 'Encuentra trabajos y profesionales verificados',
    siteName: 'Do Up',
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
      <body 
        className="bg-primary-light text-primary min-h-screen flex flex-col"
        suppressHydrationWarning={true} // Añadimos esto para evitar advertencias de hidratación
      >
        <ClientAuthProvider>
          {/* Contenedor principal con dimensiones de móvil */}
          <div className="flex flex-col mx-auto w-full max-w-md min-h-screen">
            {/* Renderizar el contenido de la página */}
            {children}
          </div>
        </ClientAuthProvider>
      </body>
    </html>
  );
}