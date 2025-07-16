'use client'

import React, { useState, useEffect } from 'react';
import {
  Package,
  BarChart4,
  Bell,
  Home,
  Users,
  Archive,
  FileText,
  Settings,
  ShoppingCart,
  Tag,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Search,
  User
} from 'lucide-react';
import NotificationSystem from '../notificaciones/NotificationSystem';
import { useRouter } from 'next/navigation';

export function HeaderNotificationsIntegration() {
  const router = useRouter();

  // Esta función redirigirá a la página completa de notificaciones
  const handleViewAllNotifications = () => {
    router.push('/notificaciones');
  };

  // Datos iniciales de notificaciones (puedes obtenerlos de una API)
  const initialNotifications = [
    // Puedes incluir algunas notificaciones iniciales aquí si lo deseas
    // o dejar el array vacío y usar las notificaciones de ejemplo del componente
  ];

  return (
    <NotificationSystem
      initialNotifications={initialNotifications}
      onViewAll={handleViewAllNotifications}
    />
  );
}

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated by looking for auth token/cookie
    const checkAuth = () => {
      // Check for auth in localStorage or sessionStorage using the correct key 'datauser'
      const authToken = localStorage.getItem('datauser') || sessionStorage.getItem('datauser');
      setIsAuthenticated(!!authToken);
    };

    checkAuth();

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault();

    // Delete auth data from localStorage
    localStorage.removeItem('datauser');

    // Delete auth data from sessionStorage
    sessionStorage.removeItem('datauser');

    // Delete cookie directly
    document.cookie = "cookieKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to sign-in page
    window.location.reload()
  };

  // Function to handle mobile navigation
  const handleMobileNavigation = (path) => {
    setIsOpen(false); // Cerrar el menú móvil
    router.push(path); // Navegar a la ruta
  };

  // Main navigation items
  const mainNav = [
    { title: 'Dashboard', icon: <Home className="w-4 h-4" />, path: '/' },
    { title: 'Productos', icon: <Package className="w-4 h-4" />, path: '/productos' },
    { title: 'Inventario', icon: <Archive className="w-4 h-4" />, path: '/inventario' },
    { title: 'Ventas', icon: <ShoppingCart className="w-4 h-4" />, path: '/ventas' },
    { title: 'Analísis', icon: <BarChart4 className="w-4 h-4" />, path: '/analisis' }
  ];

  // For dropdown menus and mobile navigation
  const allModules = [
    {
      title: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      path: '/'
    },
    {
      title: 'Productos',
      icon: <Package className="w-4 h-4" />,
      path: '/productos',
     
    },
    {
      title: 'Inventario',
      icon: <Archive className="w-4 h-4" />,
      path: '/inventario',
   
    },
    {
      title: 'Ventas',
      icon: <ShoppingCart className="w-4 h-4" />,
      path: '/ventas',
  
    },
    {
      title: 'Análisis',
      icon: <Tag className="w-4 h-4" />,
      path: '/analisis'
    },
    {
      title: 'Alertas',
      icon: <Bell className="w-4 h-4" />,
      path: '/notificaciones',
     
    },
  
   
  
  ];

  // If not authenticated, don't render the header
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <header
        className={`w-full transition-all duration-300 ${scrolled
            ? 'py-2 bg-white shadow-md border-b border-slate-200'
            : 'py-3 bg-white border-b border-slate-100'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-end space-x-1">
                <span className="text-2xl font-bold text-slate-800">Viti's</span>
                <span className="text-xl font-medium text-slate-600 pb-0.5">Store</span>
              </a>
            </div>

            {/* Desktop Navigation - Main items */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNav.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  className="flex items-center px-3 py-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span className="mr-1.5">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </a>
              ))}
            </nav>

            {/* Right section with search, alerts, and profile */}
            <div className="hidden lg:flex items-center space-x-1">

              {/* Notifications */}
              <HeaderNotificationsIntegration />

              {/* Profile */}
              <div className="relative ml-1">
                <button
                  onClick={() => handleDropdownToggle('profile')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Admin</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile dropdown */}
                {activeDropdown === 'profile' && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50 py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden flex items-center px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black opacity-25"></div>
          <div
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-xl transform transition-transform ease-in-out duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-5 px-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-end space-x-1">
                <span className="text-xl font-bold text-slate-800">Viti's</span>
                <span className="text-lg font-medium text-slate-600 pb-0.5">Store</span>
              </div>
              <button
                className="text-slate-500 hover:text-slate-900"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 px-2 h-full overflow-y-auto">
              <div className="space-y-2 mb-6">
                {allModules.map((module, index) => (
                  <div key={index}>
                    {/* Cambio aquí: usar button con onClick para navegación o enlace directo si no hay submenu */}
                    {module.submenu ? (
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50"
                        onClick={() => handleDropdownToggle(index)}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-slate-500">{module.icon}</span>
                          <span className="font-medium text-sm">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      // Para elementos sin submenu, usar button con handleMobileNavigation
                      <button
                        className="w-full flex items-center px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50"
                        onClick={() => handleMobileNavigation(module.path)}
                      >
                        <span className="mr-3 text-slate-500">{module.icon}</span>
                        <span className="font-medium text-sm">{module.title}</span>
                      </button>
                    )}

                    {module.submenu && activeDropdown === index && (
                      <div className="ml-8 mt-1 mb-2 pl-2 border-l-2 border-slate-100 space-y-1">
                        {module.submenu.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleMobileNavigation(item.path)}
                            className="block w-full text-left py-2 pl-2 text-sm text-slate-600 hover:text-slate-900"
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 pb-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center py-2 px-4 bg-slate-100 rounded-md text-slate-800 hover:bg-slate-200 transition-colors w-full text-center text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}