'use client'

import React, { useState, useEffect } from 'react';
import {
    Bell,
    AlertTriangle,
    CheckCircle,
    Info,
    Package,
    ShoppingCart,
    Archive,
    Settings,
    User,
    Filter,
    ChevronRight,
    MoreHorizontal,
    Calendar,
    Trash2,
    CheckSquare
} from 'lucide-react';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [selectedTab, setSelectedTab] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortBy, setSortBy] = useState('date-desc');
    const [dateFilter, setDateFilter] = useState('all');

    // Cargar notificaciones (simulación)
    useEffect(() => {
        // En un caso real, aquí harías una llamada API para obtener las notificaciones
        setNotifications(getSampleNotifications());
    }, []);

    // Función para marcar notificaciones como leídas
    const markAsRead = (ids) => {
        setNotifications(
            notifications.map((notif) =>
                ids.includes(notif.id) ? { ...notif, read: true } : notif
            )
        );
        setSelectedItems([]);
    };

    // Función para eliminar notificaciones
    const deleteNotifications = (ids) => {
        setNotifications(
            notifications.filter((notif) => !ids.includes(notif.id))
        );
        setSelectedItems([]);
    };

    // Función para filtrar notificaciones por tipo
    const getFilteredNotifications = () => {
        let filtered = [...notifications];

        // Filtro por tipo/tab
        if (selectedTab !== 'all') {
            filtered = filtered.filter(notif => notif.type === selectedTab);
        }

        // Filtro por fecha
        if (dateFilter !== 'all') {
            const now = new Date();
            const dayInMs = 24 * 60 * 60 * 1000;

            switch (dateFilter) {
                case 'today':
                    filtered = filtered.filter(notif => {
                        const date = new Date(notif.time);
                        return now.toDateString() === date.toDateString();
                    });
                    break;
                case 'yesterday':
                    const yesterday = new Date(now - dayInMs);
                    filtered = filtered.filter(notif => {
                        const date = new Date(notif.time);
                        return yesterday.toDateString() === date.toDateString();
                    });
                    break;
                case 'week':
                    filtered = filtered.filter(notif => {
                        const date = new Date(notif.time);
                        return (now - date) <= 7 * dayInMs;
                    });
                    break;
                case 'month':
                    filtered = filtered.filter(notif => {
                        const date = new Date(notif.time);
                        return (now - date) <= 30 * dayInMs;
                    });
                    break;
                default:
                    break;
            }
        }

        // Ordenar
        filtered.sort((a, b) => {
            const dateA = new Date(a.time);
            const dateB = new Date(b.time);

            if (sortBy === 'date-desc') {
                return dateB - dateA;
            } else if (sortBy === 'date-asc') {
                return dateA - dateB;
            }

            return 0;
        });

        return filtered;
    };

    // Seleccionar/deseleccionar notificación
    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Seleccionar/deseleccionar todas las notificaciones
    const toggleSelectAll = () => {
        if (selectedItems.length === getFilteredNotifications().length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(getFilteredNotifications().map(notif => notif.id));
        }
    };

    // Obtener el ícono según el tipo de notificación
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

    // Obtener texto para la fecha
    const getFormattedDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (24 * 60 * 60 * 1000));

        if (diffInDays === 0) {
            // Hoy: Hora
            return `Hoy, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else if (diffInDays === 1) {
            // Ayer
            return `Ayer, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else if (diffInDays < 7) {
            // Esta semana
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            return `${days[date.getDay()]}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else {
            // Más de una semana
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
    };

    // Obtener el contador de notificaciones no leídas
    const getUnreadCount = (type = null) => {
        if (type === null) {
            return notifications.filter(notif => !notif.read).length;
        }
        return notifications.filter(notif => !notif.read && notif.type === type).length;
    };

    const filteredNotifications = getFilteredNotifications();

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Cabecera */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Notificaciones</h1>
                <p className="text-sm text-slate-500">
                    Gestiona y revisa todas tus notificaciones
                </p>
            </div>

            {/* Tabs de Navegación */}
            <div className="border-b border-slate-200 mb-6">
                <div className="flex flex-wrap -mb-px">
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm ${selectedTab === 'all'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <Bell className="w-4 h-4 mr-2" />
                        Todas
                        {getUnreadCount() > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {getUnreadCount()}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setSelectedTab('alert')}
                        className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm ${selectedTab === 'alert'
                                ? 'border-amber-500 text-amber-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Alertas
                        {getUnreadCount('alert') > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                {getUnreadCount('alert')}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setSelectedTab('inventory')}
                        className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm ${selectedTab === 'inventory'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <Archive className="w-4 h-4 mr-2" />
                        Inventario
                        {getUnreadCount('inventory') > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {getUnreadCount('inventory')}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setSelectedTab('product')}
                        className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm ${selectedTab === 'product'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <Package className="w-4 h-4 mr-2" />
                        Productos
                    </button>

                    <button
                        onClick={() => setSelectedTab('sale')}
                        className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm ${selectedTab === 'sale'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ventas
                    </button>

                    <button
                        onClick={() => setSelectedTab('system')}
                        className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm ${selectedTab === 'system'
                                ? 'border-slate-500 text-slate-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Sistema
                    </button>
                </div>
            </div>

            {/* Barra de acciones */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
                <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center">
                        {selectedItems.length > 0 ? (
                            <>
                                <button
                                    onClick={() => markAsRead(selectedItems)}
                                    className="inline-flex items-center mr-2 px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                                >
                                    <CheckSquare className="w-4 h-4 mr-2" />
                                    Marcar como leídas
                                </button>
                                <button
                                    onClick={() => deleteNotifications(selectedItems)}
                                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => markAsRead(notifications.filter(n => !n.read).map(n => n.id))}
                                    className="inline-flex items-center mr-2 px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                                    disabled={getUnreadCount() === 0}
                                >
                                    <CheckSquare className="w-4 h-4 mr-2" />
                                    Marcar todas como leídas
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="relative inline-block text-left">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filtrar
                            </button>

                            {isFilterOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1 border-b border-slate-200">
                                        <div className="px-3 py-2 text-xs font-medium text-slate -500">Fecha</div>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setDateFilter('all');
                                                setIsFilterOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                                }`}
                                        >
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDateFilter('today');
                                                setIsFilterOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'today' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                                }`}
                                        >
                                            Hoy
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDateFilter('yesterday');
                                                setIsFilterOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'yesterday' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                                }`}
                                        >
                                            Ayer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDateFilter('week');
                                                setIsFilterOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'week' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                                }`}
                                        >
                                            Últimos 7 días
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDateFilter('month');
                                                setIsFilterOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'month' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                                }`}
                                        >
                                            Últimos 30 días
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="pl-3 pr-10 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="date-desc">Más recientes primero</option>
                            <option value="date-asc">Más antiguas primero</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Notificaciones */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                            <Bell className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No hay notificaciones</h3>
                        <p className="text-slate-500 text-sm">
                            No se encontraron notificaciones con los filtros seleccionados
                        </p>
                    </div>
                ) : (
                    <div>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                                        <input
                                            type="checkbox"
                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                                            checked={selectedItems.length === filteredNotifications.length}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
                                    >
                                        Notificación
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
                                    >
                                        Fecha
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative py-3 pl-3 pr-4 sm:pr-6"
                                    >
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {filteredNotifications.map((notification) => (
                                    <tr
                                        key={notification.id}
                                        className={`${!notification.read ? 'bg-blue-50/40' : ''
                                            } hover:bg-slate-50 transition-colors`}
                                    >
                                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                                                checked={selectedItems.includes(notification.id)}
                                                onChange={() => toggleSelectItem(notification.id)}
                                            />
                                        </td>
                                        <td className="py-4 pl-4 pr-3 text-sm">
                                            <div className="flex items-start">
                                                <div className="mr-3 flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <span className="text-xs font-medium text-slate-500 mr-2">
                                                            {notification.category}
                                                        </span>
                                                        {!notification.read && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Nueva
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-medium text-slate-900 mb-1">
                                                        {notification.message}
                                                    </p>
                                                    {notification.action && (
                                                        <a
                                                            href={notification.action.url}
                                                            className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            {notification.action.text}
                                                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-sm text-slate-500 whitespace-nowrap">
                                            {getFormattedDate(notification.time)}
                                        </td>
                                        <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex justify-end">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead([notification.id])}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Marcar como leída
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotifications([notification.id])}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginación */}
                        {filteredNotifications.length > 0 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                                        Anterior
                                    </button>
                                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                                        Siguiente
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-slate-700">
                                            Mostrando <span className="font-medium">1</span> a{' '}
                                            <span className="font-medium">{filteredNotifications.length}</span> de{' '}
                                            <span className="font-medium">{filteredNotifications.length}</span> resultados
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                                <span className="sr-only">Anterior</span>
                                                {/* SVG para anterior */}
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                                                1
                                            </button>
                                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                                <span className="sr-only">Siguiente</span>
                                                {/* SVG para siguiente */}
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Función para obtener notificaciones de ejemplo
function getSampleNotifications() {
    const now = new Date();
    return [
        {
            id: 1,
            type: 'alert',
            category: 'Alerta de Stock',
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
        },
        {
            id: 7,
            type: 'user',
            category: 'Nuevo Usuario',
            message: 'El usuario "Carlos Mendoza" se ha registrado en el sistema',
            time: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
            read: true,
            action: {
                text: 'Ver perfil',
                url: '/usuarios/456'
            }
        },
        {
            id: 8,
            type: 'inventory',
            category: 'Ajuste de Inventario',
            message: 'Se realizó un ajuste de inventario para 5 productos',
            time: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 días atrás
            read: true,
            action: {
                text: 'Ver ajuste',
                url: '/inventario/ajustes/123'
            }
        },
        {
            id: 9,
            type: 'sale',
            category: 'Venta Cancelada',
            message: 'La venta #1056 por $899.99 fue cancelada',
            time: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 días atrás
            read: true,
            action: {
                text: 'Ver detalles',
                url: '/ventas/1056'
            }
        },
        {
            id: 10,
            type: 'success',
            category: 'Respaldo Completo',
            message: 'El respaldo automático de la base de datos se completó exitosamente',
            time: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
            read: true,
            action: {
                text: 'Ver registros',
                url: '/configuracion/respaldos'
            }
        }
    ];
}