'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import Sidebar from './MenuItem';

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Cerrar paneles al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulación de notificaciones
  const notifications = [
    {
      id: 1,
      title: 'Stock Bajo',
      message: 'Producto "Auriculares Gaming" está por debajo del umbral mínimo',
      type: 'warning',
      time: '5 min'
    },
    {
      id: 2,
      title: 'Nueva Venta',
      message: 'Venta #1234 completada exitosamente',
      type: 'success',
      time: '10 min'
    },
    {
      id: 3,
      title: 'Error de Sistema',
      message: 'Error al sincronizar inventario',
      type: 'error',
      time: '15 min'
    }
  ];

  const NotificationPanel = () => (
    <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 mt-2 rounded-full ${
                notification.type === 'warning' ? 'bg-yellow-400' :
                notification.type === 'success' ? 'bg-green-500' :
                'bg-red-500'
              }`} />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-800">
        <button className="w-full text-sm text-blue-500 hover:text-blue-400 transition-colors">
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );

  const ProfilePanel = () => (
    <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Juan Pérez</h3>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
        </div>
      </div>
      <div className="p-2">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
          Mi Perfil
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
          Configuración
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="relative">
                <h1 className="text-xl font-bold">
                  <span className="text-yellow-400">Viti's</span>
                  <span className="text-blue-500"> Store</span>
                </h1>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-400" />
              </div>
              
              {/* Barra de búsqueda */}
              <div className={`relative transition-all duration-500 ease-in-out ${
                searchFocused ? 'w-96' : 'w-64'
              }`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl
                    text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                    transition-all duration-300"
                  placeholder="Buscar en inventario..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Iconos de la derecha */}
            <div className="flex items-center gap-4">
              {/* Notificaciones */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  className="relative p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileOpen(false);
                  }}
                >
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <Bell className="h-6 w-6" />
                </button>
                {isNotificationsOpen && <NotificationPanel />}
              </div>

              {/* Perfil */}
              <div className="relative" ref={profileRef}>
                <button 
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationsOpen(false);
                  }}
                >
                  <User className="h-6 w-6" />
                </button>
                {isProfileOpen && <ProfilePanel />}
              </div>

              {/* Menú */}
              <button 
                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => {
                  setIsSidebarOpen(true);
                  setIsNotificationsOpen(false);
                  setIsProfileOpen(false);
                }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
};

export default Navbar;