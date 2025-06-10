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
    Trash2,
    CheckSquare,
    Loader2
} from 'lucide-react';
import {
    getAllNotifications,
    getPendingNotifications,
    resolveNotification,
    ignoreNotification
} from '@src/service/conexion';
import { toast } from 'react-hot-toast';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [selectedTab, setSelectedTab] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortBy, setSortBy] = useState('date-desc');
    const [dateFilter, setDateFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar notificaciones al inicio o cuando cambian los filtros
    useEffect(() => {
        loadNotifications();
    }, [selectedTab]);

    // Función para cargar notificaciones desde la API
    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            let data;
            if (selectedTab === 'all') {
                data = await getAllNotifications();
            } else if (selectedTab === 'pending') {
                data = await getPendingNotifications();
            } else {
                // Si se selecciona una pestaña específica (por tipo), cargamos todas y filtramos en el cliente
                data = await getAllNotifications();
            }

            setNotifications(data);
        } catch (err) {
            console.error('Error al cargar notificaciones:', err);
            setError('No se pudieron cargar las notificaciones. Intente nuevamente.');
            toast.error('Error al cargar notificaciones');
        } finally {
            setLoading(false);
        }
    };

    // Función para marcar notificaciones como leídas (resueltas)
    const markAsRead = async (ids) => {
        try {
            // Para cada ID, llamamos a la API para marcar como resuelta
            await Promise.all(ids.map(id => resolveNotification(id)));

            // Actualizar el estado local
            setNotifications(
                notifications.map((notif) =>
                    ids.includes(notif.id) ? { ...notif, read: true, estado: 'Resuelto' } : notif
                )
            );

            setSelectedItems([]);
            toast.success(`${ids.length} notificación(es) marcada(s) como resuelta(s)`);
        } catch (err) {
            console.error('Error al marcar notificaciones como resueltas:', err);
            toast.error('Error al marcar notificaciones como resueltas');
        }
    };

    // Función para ignorar notificaciones
    const dismissNotifications = async (ids) => {
        try {
            // Para cada ID, llamamos a la API para marcar como ignorada
            await Promise.all(ids.map(id => ignoreNotification(id)));

            // Actualizar el estado local o volver a cargar las notificaciones
            setNotifications(
                notifications.map((notif) =>
                    ids.includes(notif.id) ? { ...notif, read: true, estado: 'Ignorado' } : notif
                )
            );

            setSelectedItems([]);
            toast.success(`${ids.length} notificación(es) ignorada(s)`);
        } catch (err) {
            console.error('Error al ignorar notificaciones:', err);
            toast.error('Error al ignorar notificaciones');
        }
    };


    // Función para filtrar notificaciones por tipo
    const getFilteredNotifications = () => {
        let filtered = [...notifications];

        // Filtro por tipo/tab (si no es 'all')
        if (selectedTab !== 'all' && selectedTab !== 'pending') {
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
                    Gestiona y revisa todas tus notificaciones y alertas de stock
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
                        onClick={() => setSelectedTab('pending')}
                        className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm ${selectedTab === 'pending'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <Bell className="w-4 h-4 mr-2" />
                        Pendientes
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
                </div>
            </div>

           
            {/* Estado de carga o error */}
            {loading && (
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center">
                    <Loader2 className="h-8 w-8 mx-auto text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-600">Cargando notificaciones...</p>
                </div>
            )}

            {error && !loading && (
                <div className="bg-white border border-red-200 rounded-lg shadow-sm p-8 text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-4" />
                    <p className="text-red-600 mb-2">{error}</p>
                    <button
                        onClick={loadNotifications}
                        className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Lista de Notificaciones */}
            {!loading && !error && (
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
                                                checked={selectedItems.length === filteredNotifications.length && filteredNotifications.length > 0}
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
                                            className={`${notification.estado === 'Pendiente' ? 'bg-blue-50/40' : ''
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
                                                            {notification.estado === 'Pendiente' && (
                                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Pendiente
                                                                </span>
                                                            )}
                                                            {notification.prioridad === 'Alta' && (
                                                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    Prioridad alta
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="font-medium text-slate-900 mb-1">
                                                            {notification.message}
                                                        </p>
                                                        {notification.stockActual !== undefined && (
                                                            <div className="mt-1 mb-2 text-xs text-slate-500">
                                                                Stock actual: <span className="font-semibold">{notification.stockActual}</span> /
                                                                Mínimo: <span className="font-semibold">{notification.stockMinimo}</span>
                                                            </div>
                                                        )}
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
                                          
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Resumen de notificaciones */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                                <div className="text-sm text-slate-700">
                                    <p>
                                        Total: <span className="font-medium">{filteredNotifications.length}</span> notificaciones
                    
                                    </p>
                                </div>
                                <div>
                                    <button
                                        onClick={loadNotifications}
                                        className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}