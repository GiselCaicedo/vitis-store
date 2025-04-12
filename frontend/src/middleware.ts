import type { NextRequest } from 'next/server';
import { verifyToken } from '@src/service/verify-token';

const isProtectedRoute = (pathname: string) => {
  const protectedRoutes = ['/dashboard', '/'];
  return protectedRoutes.some((route) => pathname.startsWith(route));
};

const isAuthRoute = (pathname: string) => {
  return ['/sign-in'].some((route) => pathname.includes(route));
};

interface TokenError extends Error {
  name: string;
  message: string;
  stack?: string;
}

export default async function middleware(request: NextRequest) {
  // Si estamos en modo de prueba, siempre permitir el acceso
  if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
    return;
  }

  const { pathname } = request.nextUrl;

  if (isAuthRoute(pathname)) {
    console.log('Ruta de autenticación detectada:', pathname);
    return;
  }

  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get('cookieKey')?.value;
    console.log('Token obtenido del middleware:', token ? 'Token presente' : 'No hay token');

    if (!token) {
      console.log('No hay token, redirigiendo a /sign-in');
      const signInUrl = new URL('/sign-in', request.url);
      return Response.redirect(signInUrl.toString(), 302);
    }

    try {
      // IMPORTANTE: Esperar la resolución de la promesa con await
      const decoded = await verifyToken(token);
      console.log('Token verificado correctamente');
      // Permitir continuar a la ruta protegida
    } catch (err: unknown) {
      const error = err as TokenError;
      console.error('Error al verificar el token:', error.name, error.message);
      const signInUrl = new URL('/sign-in', request.url);
      return Response.redirect(signInUrl.toString(), 302);
    }
  }

  return;
}

export const config = {
  matcher: ['/((?!.*\\..*|_next|api).*)', '/', '/(api|trpc)(.*)'],
};