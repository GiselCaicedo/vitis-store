'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@src/service/conexion';
import { LogIn, Eye, EyeOff, AlertCircle, Lock, User, KeyRound, Mail, ChevronLeft } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentYear, setCurrentYear] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);  
    setCurrentYear(new Date().getFullYear().toString());
    
    const token = document.cookie.split('; ').find(row => row.startsWith('cookieKey='));
    if (token) {
      router.push('/');
    }
  }, [router]);

  if (!isClient) {
    return null;
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const userData = await signIn({ email: username, password });
      
      localStorage.setItem('datauser', JSON.stringify({ 
        id: userData.id, 
        nombre: userData.user, 
        idrol: userData.idrol,
        rol: userData.rol 
      }));

      const token = document.cookie.split('; ').find(row => row.startsWith('cookieKey='));
      if (token) {
        router.push('/');
      } else {
        setError('Inicio de sesión exitoso pero no se recibió token. Contacte al administrador.');
      }
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setRecoveryStatus('loading');
    
    try {
      setTimeout(() => {
        setRecoveryStatus('success');
        setTimeout(() => {
          setShowForgotPassword(false);
          setRecoveryStatus('');
          setRecoveryEmail('');
        }, 3000);
      }, 1500);
    } catch (error) {
      setRecoveryStatus('error');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Logo o Icono */}
      <div className="mb-6">
        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center shadow-md">
          <Lock className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <div className="w-full max-w-md">
        {/* Título y subtítulo */}
        <div className="text-center mb-6">
          <h1 className="text-gray-900 text-3xl font-bold mb-2">Vitis Store</h1>
          <p className="text-gray-600">
            Gestión De Inventario De Comercializadora Vitis Store SAS
          </p>
        </div>
        
        {/* Card principal con diseño formal */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Cabecera */}
          <div className="bg-gray-800 text-white py-5 px-6">
            <h2 className="flex items-center text-lg font-medium">
              {!showForgotPassword ? (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Acceso al Sistema
                </>
              ) : (
                <>
                  <KeyRound className="h-5 w-5 mr-2" />
                  Recuperar Contraseña
                </>
              )}
            </h2>
          </div>
          
          <div className="px-8 py-8">
            {!showForgotPassword ? (
              <form onSubmit={handleSignIn}>
                {error && (
                  <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start border-l-4 border-red-500 shadow-sm">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-6">
                  {/* Campo usuario */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 bg-white transition-colors"
                        placeholder="Ingrese su nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Campo contraseña */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 bg-white transition-colors"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                  </div>
                </div>
                
                {/* Botón de inicio de sesión */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg px-4 py-3 mt-8 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando Sesión
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Iniciar Sesión 
                      <LogIn className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword}>
                {recoveryStatus === 'error' && (
                  <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start border-l-4 border-red-500 shadow-sm">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Error al procesar la solicitud. Intente nuevamente.</span>
                  </div>
                )}
                
                {recoveryStatus === 'success' && (
                  <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg text-sm flex items-start border-l-4 border-green-500 shadow-sm">
                    <KeyRound className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>¡Solicitud enviada! Revise su correo para instrucciones.</span>
                  </div>
                )}
                
                {/* Campo correo electrónico */}
                <div className="mb-6">
                  <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="recoveryEmail"
                      type="email"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-90 transition-all duration-200"
                      placeholder="Ingrese su correo electrónico"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      required
                      disabled={recoveryStatus === 'success'}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-8">
                  {/* Botón para volver */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setRecoveryStatus('');
                      setRecoveryEmail('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md px-4 py-3 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-sm"
                  >
                    <ChevronLeft className="mr-1 h-5 w-5" />
                    Volver
                  </button>
                  
                  {/* Botón para recuperar */}
                  <button
                    type="submit"
                    disabled={recoveryStatus === 'loading' || recoveryStatus === 'success'}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md px-4 py-3 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 shadow-md"
                  >
                    {recoveryStatus === 'loading' ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Recuperar
                        <KeyRound className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} Vitis Store SAS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;