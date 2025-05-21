// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback'];

// Verifica si una ruta es pública
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
};

export function middleware(request: NextRequest) {
  // Obtener la ruta
  const path = request.nextUrl.pathname;
  
  // Evitar procesar rutas de API, ya que esto podría interferir con la ruta de login
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Obtener el token de autenticación de la cookie
  const token = request.cookies.get('token')?.value || 
    // También intentar leer del encabezado por si es una API
    request.headers.get('authorization')?.replace('Bearer ', '');
  
  console.log('Middleware checking path:', path, 'Token exists:', !!token);
  
  // Si la ruta es la raíz, redirigir a login o a categorías si está autenticado
  if (path === '/') {
    return token 
      ? NextResponse.redirect(new URL('/jobs/categories', request.url))
      : NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Si la ruta no es pública y no hay token, redirigir a login
  if (!isPublicRoute(path) && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // Guardar la URL de redirección para volver después del login
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si la ruta es de autenticación y ya hay token, redirigir a categorías
  if (isPublicRoute(path) && token) {
    return NextResponse.redirect(new URL('/jobs/categories', request.url));
  }
  
  return NextResponse.next();
}

// Configurar que rutas deben ser procesadas por el middleware
export const config = {
  matcher: [
    // Incluir todas las rutas excepto archivos estáticos y API
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};