import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/auth/login'];

// Verifica si una ruta es pública
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
};

export function middleware(request: NextRequest) {
  // Obtener la ruta
  const path = request.nextUrl.pathname;
  
  // Obtener el token de autenticación
  const token = request.cookies.get('token')?.value;
  
  // Si la ruta es la raíz, redirigir a login
  if (path === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Si la ruta no es pública y no hay token, redirigir a login
  if (!isPublicRoute(path) && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si hay token y el usuario está en login, redirigir a la página principal
  if (token && path === '/auth/login') {
    return NextResponse.redirect(new URL('/jobs/categories', request.url));
  }
  
  return NextResponse.next();
}

// Configurar que rutas deben ser procesadas por el middleware
export const config = {
  matcher: [
    // Excluir archivos estáticos y API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};