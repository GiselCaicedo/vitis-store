'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@src/service/conexion';
import Link from 'next/link';
const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);  // Esto asegura que estamos en el cliente y no en SSR
    console.log('Página de sign-in cargada');

    const token = document.cookie.split('; ').find(row => row.startsWith('cookieKey='));
    if (token) {
      console.log('Token encontrado, redirigiendo a /dashboard');
      router.push('/dashboard');
    } else {
      console.log('Token no encontrado, permaneciendo en /sign-in');
    }
  }, []);

  if (!isClient) {

    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const userData = await signIn({ email, password });
      localStorage.setItem('datauser', JSON.stringify({ id: userData.id, nombre: userData.user, idrol: userData.idrol, idcalidad: userData.rolCalidad, rol: userData.rol }));

      const token = document.cookie.split('; ').find(row => row.startsWith('cookieKey='));
      if (token) {
        // Solo redirigir si el token es válido
        router.push('/dashboard');
      } else {
        setError('Token no encontrado. No se puede redirigir.');
      }
    } catch (err) {
      setError('Error en el registro. Inténtalo de nuevo.');
    }
  };
  
  
  return (
    <div>
      <section className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10">
          <h2 className="font-semibold text-xl text-center text-blue-600">Iniciar Sesión</h2>
          <p className="text-md mt-2 text-gray-600 text-center">Ingresa tus credenciales para ingresar</p>

          <form className="flex flex-col gap-6 mt-6" onSubmit={handleSignUp}>
            {error && <p className="text-red-500">{error}</p>}
            <input
              className="p-4 rounded-xl border border-gray-300 focus:outline-none faocus:ring-2 focus:ring-blue-600"
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                className="p-4 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                type="password"
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#0a74da] text-white rounded-xl py-3 hover:scale-105 transition-transform duration-300"
            >
              Entrar
            </button>
          </form>

          <div className="mt-5 text-sm border-b border-gray-300 py-4 text-center text-gray-600">
            <Link href="/sign-up" className="underline">Registrarse</Link>
          </div>

          <div className="mt-3 text-sm text-center text-gray-600">
            <p>Globalnews© 2024</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignInPage;