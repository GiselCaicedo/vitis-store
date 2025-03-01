'use client'

import React, { useState } from 'react';
import { 
  Package, 
  BarChart4, 
  AlertCircle, 
  TrendingUp, 
  Calendar,

  ShoppingCart, 
  Tag, 
  Clock,
  ChevronRight,
  ArrowRight,
  Search,
  UserPlus,
  DollarSign,
  Percent
} from 'lucide-react';


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Datos para las tarjetas de resumen
  const summaryCards = [
    { title: 'Ventas de hoy', value: '$8,459', trend: '+12%', icon: <DollarSign className="w-5 h-5" />, color: 'bg-blue-500' },
    { title: 'Nuevos clientes', value: '24', trend: '+3', icon: <UserPlus className="w-5 h-5" />, color: 'bg-green-500' },
    { title: 'Productos activos', value: '342', trend: '-5', icon: <Package className="w-5 h-5" />, color: 'bg-purple-500' },
    { title: 'Tasa de conversión', value: '5.72%', trend: '+0.4%', icon: <Percent className="w-5 h-5" />, color: 'bg-amber-500' },
  ];

  // Datos para productos más vendidos
  const topProducts = [
    { id: 1, name: 'Smartphone Galaxy S22', category: 'Electrónica', sales: 42, stock: 18, price: '$899' },
    { id: 2, name: 'Zapatillas Deportivas Air Max', category: 'Calzado', sales: 38, stock: 25, price: '$129' },
    { id: 3, name: 'Auriculares Bluetooth Pro', category: 'Accesorios', sales: 35, stock: 12, price: '$79' },
    { id: 4, name: 'Camiseta Premium Algodón', category: 'Ropa', sales: 31, stock: 45, price: '$35' },
    { id: 5, name: 'Reloj Inteligente Serie 7', category: 'Electrónica', sales: 28, stock: 9, price: '$299' },
  ];

  // Datos para alertas recientes
  const recentAlerts = [
    { id: 1, type: 'stock', message: 'Auriculares Bluetooth Pro - Stock bajo (12 unidades)', time: '8 min' },
    { id: 2, type: 'price', message: 'Actualización de precio necesaria para Zapatillas Deportivas', time: '35 min' },
    { id: 3, type: 'system', message: 'Backup automático completado exitosamente', time: '1 hora' },
    { id: 4, type: 'stock', message: 'Reloj Inteligente Serie 7 - Stock bajo (9 unidades)', time: '2 horas' },
  ];

  // Datos para actividades recientes
  const recentActivities = [
    { id: 1, type: 'sale', user: 'Carlos Méndez', action: 'registró una venta', details: '$345.00 - 3 productos', time: '12:45 PM' },
    { id: 2, type: 'inventory', user: 'Ana Martínez', action: 'actualizó el inventario', details: '+25 Camisetas Premium', time: '11:32 AM' },
    { id: 3, type: 'product', user: 'Luis García', action: 'agregó un nuevo producto', details: 'Tablet Pro 11"', time: '10:15 AM' },
    { id: 4, type: 'sale', user: 'María Rodríguez', action: 'registró una venta', details: '$1,299.00 - 2 productos', time: '9:23 AM' },
    { id: 5, type: 'return', user: 'Juan Pérez', action: 'procesó una devolución', details: 'Auriculares Bluetooth', time: '8:50 AM' },
  ];

  // Fechas para el calendario
  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Tabs de la página principal
  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: <BarChart4 className="w-4 h-4" /> },
    { id: 'inventario', label: 'Inventario', icon: <Package className="w-4 h-4" /> },
    { id: 'ventas', label: 'Ventas', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'alertas', label: 'Alertas', icon: <AlertCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      <main className="container mx-auto px-4 py-6">
        {/* Bienvenida y fecha */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bienvenido a Viti's Store</h1>
            <p className="text-slate-500 mt-1">
              {today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Seleccionar Fecha
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generar Reportes
            </button>
          </div>
        </div>



        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <div className="flex justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${card.color} text-white flex items-center justify-center`}>
                  {card.icon}
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{card.trend}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Grid de dos columnas para secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Productos más vendidos */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Productos más vendidos</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Ver todos
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                      <th className="px-3 py-3">Producto</th>
                      <th className="px-3 py-3">Categoría</th>
                      <th className="px-3 py-3 text-center">Ventas</th>
                      <th className="px-3 py-3 text-center">Stock</th>
                      <th className="px-3 py-3 text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-3 text-sm font-medium text-slate-800">{product.name}</td>
                        <td className="px-3 py-3 text-sm text-slate-500">{product.category}</td>
                        <td className="px-3 py-3 text-sm text-center">{product.sales}</td>
                        <td className="px-3 py-3 text-sm text-center">
                          <span className={`text-xs font-semibold py-1 px-2 rounded-full ${
                            product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-right font-medium">{product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Alertas recientes */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Alertas recientes</h2>
              <div className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                {recentAlerts.length} alertas
              </div>
            </div>
            <div className="p-3">
              <div className="space-y-1">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="p-2 rounded-md hover:bg-slate-50">
                    <div className="flex items-start">
                      <div className={`mt-0.5 rounded-full p-1.5 ${
                        alert.type === 'stock' ? 'bg-red-100 text-red-600' : 
                        alert.type === 'price' ? 'bg-blue-100 text-blue-600' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-slate-600">{alert.message}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="ml-1 text-xs text-slate-400">Hace {alert.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-slate-100">
              <button className="w-full py-2 text-sm font-medium text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                Ver todas las alertas
              </button>
            </div>
          </div>
        </div>

        {/* Actividades recientes y calendario */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividades recientes */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Actividades recientes</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Ver historial
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'sale' ? 'bg-green-100 text-green-600' : 
                      activity.type === 'inventory' ? 'bg-blue-100 text-blue-600' : 
                      activity.type === 'product' ? 'bg-purple-100 text-purple-600' : 
                      activity.type === 'return' ? 'bg-amber-100 text-amber-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {activity.type === 'sale' && <ShoppingCart className="w-4 h-4" />}
                      {activity.type === 'inventory' && <Package className="w-4 h-4" />}
                      {activity.type === 'product' && <Tag className="w-4 h-4" />}
                      {activity.type === 'return' && <ArrowRight className="w-4 h-4 transform rotate-180" />}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-slate-800">
                            <span className="font-medium">{activity.user}</span>
                            <span className="ml-1 text-slate-600">{activity.action}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
                        </div>
                        <span className="text-xs text-slate-400">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mini calendario / Próximas fechas */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">Próximos eventos</h2>
            </div>
            <div className="px-5 py-2">
              {dates.map((date, idx) => (
                <div key={idx} className="py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-12 text-center">
                      <span className="block text-xs text-slate-500">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                      <span className="block text-lg font-bold text-slate-800 mt-1">{date.getDate()}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      {idx === 0 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-md p-2">
                          <p className="text-sm font-medium text-blue-800">Inventario mensual</p>
                          <p className="text-xs text-blue-600 mt-1">9:00 AM - 12:00 PM</p>
                        </div>
                      )}
                      {idx === 2 && (
                        <div className="bg-purple-50 border border-purple-100 rounded-md p-2">
                          <p className="text-sm font-medium text-purple-800">Reunión de ventas</p>
                          <p className="text-xs text-purple-600 mt-1">2:00 PM - 3:30 PM</p>
                        </div>
                      )}
                      {idx === 4 && (
                        <div className="bg-amber-50 border border-amber-100 rounded-md p-2">
                          <p className="text-sm font-medium text-amber-800">Entrega de pedidos</p>
                          <p className="text-xs text-amber-600 mt-1">10:00 AM - 11:00 AM</p>
                        </div>
                      )}
                      
                      {(idx !== 0 && idx !== 2 && idx !== 4) && (
                        <div className="h-12 flex items-center">
                          <p className="text-sm text-slate-500">Sin eventos programados</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100">
              <button className="w-full py-2 text-sm font-medium text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                Ver calendario completo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}