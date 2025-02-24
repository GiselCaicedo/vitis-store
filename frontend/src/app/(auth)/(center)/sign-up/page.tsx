'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'; 
import { getCargos, signUp } from '@src/service/conexion';
import Link from 'next/link';
import { AutoComplete } from 'primereact/autocomplete';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');  
  const [cargo, setCargo] = useState('');  
  const [error, setError] = useState('');
  const [cargosDisponibles, setCargosDisponibles] = useState<string[]>([]);  
  const [filteredCargos, setFilteredCargos] = useState<string[]>([]);  
  const router = useRouter(); 

  useEffect(() => {
    const fetchData = async () => {
      try {

        const cargos = await getCargos();  
        const nombresCargos = cargos.map((cargo: { role_name: string }) => cargo.role_name);  
        setCargosDisponibles(nombresCargos);  
        console.log(nombresCargos);  
      } catch (err) {
        console.error('Error al obtener los cargos:', err);
      }
    };

    fetchData();  
  }, []);  

  const searchCargo = (event: any) => {
    setFilteredCargos(
      cargosDisponibles.filter(cargo => {
        if (typeof cargo === 'string') {

          return cargo.toLowerCase().includes(event.query.toLowerCase());
        }
        return false;  
      })
    );
  };
  
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signUp({ email, password, nombre, cargo });


      router.push('/dashboard'); 
    } catch (err) {
      setError('Error en el registro. Inténtalo de nuevo.'); 
    }
  };

  return (
    <div>
      <section className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10">
          <h2 className="font-semibold text-xl text-center text-blue-600">Registrarse</h2>

          <p className="text-md mt-2 text-gray-600 text-center">Ingresa tus datos para crear una cuenta</p>

          <form className="flex flex-col gap-6 mt-6" onSubmit={handleSignUp}>
            {error && <p className="text-red-500">{error}</p>}
            
            {/* Correo */}
            <input
              className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={email}

              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            {/* Contraseña */}
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

            <input
              className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            {/* Cargo (con Autocompletado y Dropdown) */}
            <AutoComplete 
              value={cargo}
              suggestions={filteredCargos}
              completeMethod={searchCargo}
              dropdown  // Habilita el dropdown para seleccionar directamente
              placeholder="Selecciona tu Cargo"
              onChange={(e) => setCargo(e.value)}  // Establece el valor del cargo seleccionado
              className="p-4 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />

            {/* Botón de registro */}
            <button
              type="submit"
              className="bg-[#0a74da] text-white rounded-xl py-3 hover:scale-105 transition-transform duration-300"
            >
              Registrarse
            </button>
          </form>

          <div className="mt-5 text-sm border-b border-gray-300 py-4 text-center text-gray-600">
            <Link href="/sign-in" className="underline">¿Ya tienes una cuenta? Inicia sesión</Link>
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
