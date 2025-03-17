'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  X,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Package,
  ShoppingCart,
  Archive,
  Clock,
  Settings,
  User
} from 'lucide-react';

export default function NotificationSystem({ initialNotifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications.length > 0 ? initialNotifications : getSampleNotifications());
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const dropdownRef = useRef(null);

  // Calcula el número de notificaciones no leídas
  useEffect(() => {
    setUnreadCount(notifications.filter(notification => !notification.read).length);
  }, [notifications]);

  // Cierra el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para marcar una notificación como leída
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Función para eliminar una notificación
  const removeNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Función para filtrar notificaciones
  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(notif => notif.type === activeFilter);
  };

  // Obtener el icono según el tipo de notificación
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inventory':
        return <Archive className="w-5 h-5 text-blue-500" />;
      case 'product':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'sale':
        return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-slate-600" />;
      case 'user':
        return <User className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100 transition-colors relative"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-medium rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden">
          {/* Cabecera */}
          <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Notificaciones</h3>
              <p className="text-xs text-slate-500">
                {unreadCount === 0 ? 'No hay notificaciones sin leer' : `${unreadCount} sin leer`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                disabled={unreadCount === 0}
              >
                Marcar todo como leído
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="px-4 py-2 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeFilter === 'all'
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveFilter('alert')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeFilter === 'alert'
                  ? 'bg-amber-100 text-amber-800 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Alertas
            </button>
            <button
              onClick={() => setActiveFilter('inventory')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeFilter === 'inventory'
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Inventario
            </button>
            <button
              onClick={() => setActiveFilter('sale')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeFilter === 'sale'
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ventas
            </button>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {getFilteredNotifications().length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 mb-3">
                  <Bell className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No hay notificaciones disponibles</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {getFilteredNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-slate-500 truncate">
                            {notification.category}
                          </p>
                          <div className="flex items-center">
                            <span className="text-xs text-slate-400 ml-2">
                              {formatTimeAgo(notification.time)}
                            </span>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="ml-2 text-slate-400 hover:text-slate-600"
                              aria-label="Eliminar notificación"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 mb-1">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {notification.action && (
                            <a
                              href={notification.action.url}
                              className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                            >
                              {notification.action.text}
                              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </a>
                          )}

                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-slate-500 hover:text-slate-700"
                            >
                              Marcar como leída
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pie de página */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
            <a
              href="/notificaciones"
              className="block text-xs text-center font-medium text-blue-600 hover:text-blue-800 py-1"
              onClick={() => setIsOpen(false)}
            >
              Ver todas las notificaciones
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Función para formatear el tiempo transcurrido
function formatTimeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Ahora mismo';
  } else if (diffMins < 60) {
    return `Hace ${diffMins} min`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} h`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} d`;
  } else {
    const day = past.getDate().toString().padStart(2, '0');
    const month = (past.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }
}

// Función para obtener notificaciones de ejemplo
function getSampleNotifications() {
  const now = new Date();
  return [
    {
      id: 1,
      type: 'alert',
      category: 'Alerta de Inventario',
      message: 'El producto "Smartphone Samsung Galaxy A52" está por debajo del stock mínimo (2 unidades)',
      time: new Date(now - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
      read: false,
      action: {
        text: 'Ver producto',
        url: '/productos/123'
      }
    },
    {
      id: 2,
      type: 'inventory',
      category: 'Entrada de Inventario',
      message: 'Se registró una nueva entrada de 25 unidades de "Audífonos Sony WH-1000XM4"',
      time: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      read: false,
      action: {
        text: 'Ver movimiento',
        url: '/inventario/entradas/456'
      }
    },
    {
      id: 3,
      type: 'sale',
      category: 'Venta Completada',
      message: 'Venta #1089 por $2,450.00 completada exitosamente',
      time: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 horas atrás
      read: true,
      action: {
        text: 'Ver detalles',
        url: '/ventas/1089'
      }
    },
    {
      id: 4,
      type: 'product',
      category: 'Producto Actualizado',
      message: 'El precio del producto "Monitor LG 27GL850" fue actualizado a $349.99',
      time: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
      read: true,
      action: {
        text: 'Ver producto',
        url: '/productos/789'
      }
    },
    {
      id: 5,
      type: 'alert',
      category: 'Producto Sin Movimiento',
      message: 'El producto "Tablet Lenovo Tab P11" no ha tenido movimiento en los últimos 30 días',
      time: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
      read: false,
      action: {
        text: 'Ver producto',
        url: '/productos/321'
      }
    },
    {
      id: 6,
      type: 'system',
      category: 'Actualización del Sistema',
      message: 'El sistema ha sido actualizado a la versión 2.3.0',
      time: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
      read: true,
      action: {
        text: 'Ver cambios',
        url: '/configuracion/actualizaciones'
      }
    }
  ];
}