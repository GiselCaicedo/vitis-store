'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { getHomeDashboardData } from '@src/service/conexion';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('resumen');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Estados para almacenar los datos del dashboard
  const [summaryData, setSummaryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Efecto para cargar los datos del dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Formatear la fecha para enviarla como parámetro
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        const data = await getHomeDashboardData({
          searchTerm,
          categoryFilter,
          stockFilter,
          fecha: formattedDate // Usamos "fecha" como nombre del parámetro
        });
        
        // Actualizar los estados con los datos recibidos
        if (data.summaryData) setSummaryData(data.summaryData);
        if (data.topProducts) setTopProducts(data.topProducts);
        if (data.recentAlerts) setRecentAlerts(data.recentAlerts);
        if (data.recentActivities) setRecentActivities(data.recentActivities);
        
        setLoading(false);
        
        console.log("Datos cargados para fecha:", formattedDate);
      } catch (error) {
        console.error('Error al cargar datos del dashboard principal:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [searchTerm, categoryFilter, stockFilter, selectedDate]);
  
  // Funciones de navegación
  const navigateToProductos = () => {
    router.push('/productos');
  };
  
  const navigateToAlertas = () => {
    router.push('/alertas');
  };
  

  
  // Función para manejar la selección de fecha
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };
  
  const handleApplyDateFilter = () => {
    // La fecha ya está aplicada por el useEffect
    setShowDatePicker(false);
  };
  
  // Componente para el selector de fecha
  const DatePicker = () => (
    <div className="absolute top-full mt-1 right-0 bg-white shadow-lg rounded-md border border-slate-200 p-4 z-10 w-72">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-slate-700">Seleccionar fecha</label>
        <input 
          type="date" 
          className="border rounded-md p-2"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
        />
        <div className="flex justify-end space-x-2 mt-2">
          <button 
            onClick={() => setShowDatePicker(false)} 
            className="px-3 py-1 border rounded-md text-sm">
            Cancelar
          </button>
          <button 
            onClick={handleApplyDateFilter} 
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
  
  // Componente para mostrar un mensaje de carga
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <main className="container mx-auto px-4 py-6">
        {/* Bienvenida y fecha */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bienvenido a Viti's Store</h1>
            <p className="text-slate-500 mt-1">
              {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)} 
                className="px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Seleccionar Fecha
              </button>
              {showDatePicker && <DatePicker />}
            </div>
        
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-200"></div>
                  <div className="w-10 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            summaryData.map((card, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                <div className="flex justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${card.color} text-white flex items-center justify-center`}>
                    {card.icon === 'dollar' ? <DollarSign className="w-5 h-5" /> : 
                     card.icon === 'user' ? <UserPlus className="w-5 h-5" /> : 
                     card.icon === 'package' ? <Package className="w-5 h-5" /> : 
                     <Percent className="w-5 h-5" />}
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold ${card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{card.trend}</span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
            ))
          )}
        </div>

        {/* Grid de dos columnas para secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Productos más vendidos */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Productos más vendidos</h2>
              <button 
                onClick={navigateToProductos}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Ver todos
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-full mb-4"></div>
                  {Array(5).fill(0).map((_, idx) => (
                    <div key={idx} className="h-12 bg-slate-200 rounded w-full"></div>
                  ))}
                </div>
              ) : (
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
                        <tr key={product.id_producto} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" 
                            onClick={() => router.push(`/productos/${product.id_producto}`)}>
                          <td className="px-3 py-3 text-sm font-medium text-slate-800">{product.nombre}</td>
                          <td className="px-3 py-3 text-sm text-slate-500">{product.categoria}</td>
                          <td className="px-3 py-3 text-sm text-center">{product.total_vendido}</td>
                          <td className="px-3 py-3 text-sm text-center">
                            <span className={`text-xs font-semibold py-1 px-2 rounded-full ${
                              product.stock_actual < product.stock_minimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {product.stock_actual}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-right font-medium">${parseFloat(product.precio).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {Array(4).fill(0).map((_, idx) => (
                    <div key={idx} className="h-16 bg-slate-200 rounded w-full"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id_alerta} className="p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                         onClick={() => router.push(`/alertas/${alert.id_alerta}`)}>
                      <div className="flex items-start">
                        <div className={`mt-0.5 rounded-full p-1.5 ${
                          alert.prioridad_alerta === 'Alta' ? 'bg-red-100 text-red-600' : 
                          alert.prioridad_alerta === 'Media' ? 'bg-amber-100 text-amber-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-slate-600">{alert.mensaje}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="ml-1 text-xs text-slate-400">
                              {new Date(alert.fecha_alerta).toLocaleString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-slate-100">
              <button 
                onClick={navigateToAlertas}
                className="w-full py-2 text-sm font-medium text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                Ver todas las alertas
              </button>
            </div>
          </div>
        </div>

     
      </main>
    </div>
  );
}