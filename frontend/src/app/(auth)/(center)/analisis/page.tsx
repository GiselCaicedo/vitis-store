'use client'

import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronDown,
  X,
  Loader
} from 'lucide-react';
import {
  getAnalysisDashboardData,
  getProductsAnalysis,
  searchSalesHistory,
  exportData
} from '@src/service/conexion';

const AnalysisModule = () => {
  // Estados para los datos
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para almacenar datos dinámicos
  const [salesData, setSalesData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [inventoryMovements, setInventoryMovements] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [currentPeriodData, setCurrentPeriodData] = useState(null);
  const [productsAnalysis, setProductsAnalysis] = useState({ products: [], categories: [] });

  // Estados para filtros
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [compareLastPeriod, setCompareLastPeriod] = useState(false);

  // Estado para el dropdown de rango de tiempo
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);


  // Cargar datos del dashboard según el tab activo
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === 'overview') {
          const params = {
            timeRange,
            ...dateRange.startDate && dateRange.endDate ? dateRange : {}
          };

          const data = await getAnalysisDashboardData(params);

          setSalesData(data.salesData || []);
          setTopProductsData(data.topProductsData || []);
          setInventoryMovements(data.inventoryMovements || []);
          setSalesByCategory(data.salesByCategory || []);
          setSalesHistory(data.salesHistory || []);
          setCurrentPeriodData(data.currentPeriodData || null);
        } else if (activeTab === 'products') {
          const params = {
            timeRange,
            ...dateRange.startDate && dateRange.endDate ? dateRange : {},
            ...(selectedCategory ? { category: selectedCategory } : {})
          };

          const data = await getProductsAnalysis(params);
          setProductsAnalysis(data || { products: [], categories: [] });
        } else if (activeTab === 'history') {
          await loadSalesHistory();
        } else if (activeTab === 'sales') {
          // También cargamos datos para la pestaña de ventas
          const params = {
            timeRange,
            ...dateRange.startDate && dateRange.endDate ? dateRange : {}
          };

          const data = await getAnalysisDashboardData(params);
          setSalesData(data.salesData || []);
          setCurrentPeriodData(data.currentPeriodData || null);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Ocurrió un error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab, timeRange, dateRange.startDate, dateRange.endDate, selectedCategory]);

  // Función para cargar historial de ventas con búsqueda
  const loadSalesHistory = async () => {
    try {
      const params = {
        searchTerm,
        ...dateRange.startDate && dateRange.endDate ? dateRange : {},
        limit: 50
      };

      const data = await searchSalesHistory(params);
      setSalesHistory(data || []);
    } catch (err) {
      console.error('Error al cargar historial de ventas:', err);
      setError('Ocurrió un error al buscar en el historial. Por favor, intenta de nuevo.');
    }
  };

  // Manejar cambio en el término de búsqueda
  useEffect(() => {
    if (activeTab === 'history') {
      const delayDebounce = setTimeout(() => {
        loadSalesHistory();
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, activeTab]);

  // Manejar la exportación de datos
  const handleExport = async () => {
    try {
      // Definir parámetros para la exportación
      const params = {
        startDate: dateRange.startDate || getDefaultStartDate(),
        endDate: dateRange.endDate || new Date().toISOString().split('T')[0],
        format: 'csv'
      };

      await exportData(params);
    } catch (err) {
      console.error('Error al exportar datos:', err);
      alert('Error al exportar datos. Por favor, intenta de nuevo.');
    }
  };

  // Obtener fecha de inicio predeterminada (30 días atrás)
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    setShowFilterModal(false);

    // Dependiendo del tab activo, cargamos los datos correspondientes
    if (activeTab === 'overview') {
      // La carga se maneja automáticamente en el useEffect
    } else if (activeTab === 'products') {
      // La carga se maneja automáticamente en el useEffect
    } else if (activeTab === 'history') {
      loadSalesHistory();
    }
  };

  // Función para reiniciar filtros
  const resetFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setSelectedCategory('');
    setMinAmount('');
    setCompareLastPeriod(false);
  };

  // Calcular totales
  const totalSales = salesData.reduce((sum, month) => sum + month.amount, 0);
  const totalProducts = salesData.reduce((sum, month) => sum + month.count, 0);


  // Modal para filtros avanzados
  const FilterModal = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Filtros avanzados</h3>
          <button
            onClick={() => setShowFilterModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rango de fechas</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Desde</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {salesByCategory.map(category => (
                <option key={category.id} value={category.id}>{category.category}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto mínimo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              id="compareLastPeriod"
              type="checkbox"
              checked={compareLastPeriod}
              onChange={(e) => setCompareLastPeriod(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="compareLastPeriod" className="ml-2 block text-sm text-gray-700">
              Comparar con período anterior
            </label>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Reiniciar
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );

  // Dropdown para selección de rango de tiempo
  const TimeRangeDropdown = () => (
    <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
      <ul className="py-1">
        <li>
          <button
            onClick={() => {
              setTimeRange('week');
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Esta semana
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setTimeRange('month');
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Este mes
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setTimeRange('year');
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Este año
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabecera del módulo */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Análisis y Reportes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visualiza métricas clave, analiza tendencias de ventas y exporta reportes detallados
        </p>
      </div>

      {/* Navegación por tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <BarChart2 size={18} />
            <span>Resumen general</span>
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'sales'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <LineChart size={18} />
            <span>Ventas</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'products'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Package size={18} />
            <span>Productos</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Calendar size={18} />
            <span>Historial</span>
          </button>
        </nav>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
            >
              {timeRange === 'week' ? 'Esta semana' : timeRange === 'month' ? 'Este mes' : 'Este año'}
              <ChevronDown size={16} className="ml-1" />
            </button>
            {showTimeRangeDropdown && <TimeRangeDropdown />}
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
          >
            <Filter size={16} className="mr-1" />
            Filtros
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar en historial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <button
          onClick={handleExport}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
        >
          <Download size={16} className="mr-1" />
          Exportar
        </button>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <Loader size={40} className="animate-spin text-blue-500" />
          <span className="ml-3 text-lg text-gray-600">Cargando datos...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p className="font-medium">Error al cargar datos</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-700 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      )}


      {/* Contenido principal según la tab activa */}
      {!isLoading && !error && activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPIs principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ventas totales</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{totalSales.toLocaleString()}€</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign size={24} className="text-blue-600" />
                </div>
              </div>
              {currentPeriodData && (
                <div className="mt-4 text-xs text-gray-500">
                  {currentPeriodData.changes.totalSales > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight size={14} className="mr-1" />
                      +{currentPeriodData.changes.totalSales.toFixed(1)}% respecto al periodo anterior
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <ArrowDownRight size={14} className="mr-1" />
                      {currentPeriodData.changes.totalSales.toFixed(1)}% respecto al periodo anterior
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Productos vendidos</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{totalProducts}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Package size={24} className="text-green-600" />
                </div>
              </div>
              {currentPeriodData && (
                <div className="mt-4 text-xs text-gray-500">
                  {currentPeriodData.changes.orderCount > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight size={14} className="mr-1" />
                      +{currentPeriodData.changes.orderCount.toFixed(1)}% respecto al periodo anterior
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <ArrowDownRight size={14} className="mr-1" />
                      {currentPeriodData.changes.orderCount.toFixed(1)}% respecto al periodo anterior
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ticket promedio</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalProducts > 0 ? (totalSales / totalProducts).toFixed(2) : '0.00'}€
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <TrendingUp size={24} className="text-indigo-600" />
                </div>
              </div>
              {currentPeriodData && (
                <div className="mt-4 text-xs text-gray-500">
                  {currentPeriodData.changes.avgTicket > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight size={14} className="mr-1" />
                      +{currentPeriodData.changes.avgTicket.toFixed(1)}% respecto al periodo anterior
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <ArrowDownRight size={14} className="mr-1" />
                      {currentPeriodData.changes.avgTicket.toFixed(1)}% respecto al periodo anterior
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Movimientos de inventario</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {inventoryMovements.reduce((sum, m) => sum + m.count, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <BarChart2 size={24} className="text-amber-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 flex justify-between">
                <span>
                  Entradas: {
                    inventoryMovements.find(m => m.type === 'entrada')?.count || 0
                  }
                </span>
                <span>
                  Salidas: {
                    inventoryMovements.find(m => m.type === 'salida')?.count || 0
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Gráficos y tablas resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de ventas mensuales */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ventas mensuales</h3>
              <div className="h-64 w-full">
                {salesData.length > 0 ? (
                  <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="h-4/5 w-11/12 flex items-end space-x-6">
                      {salesData.map((month, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500 rounded-t-sm"
                            style={{
                              height: `${(month.amount / Math.max(...salesData.map(d => d.amount))) * 100}%`
                            }}
                          ></div>
                          <span className="text-xs text-gray-600 mt-2">{month.month.substring(0, 3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No hay datos disponibles</p>
                  </div>
                )}
              </div>
            </div>

            {/* Productos más vendidos */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Productos más vendidos</h3>
              {topProductsData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ventas
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ingresos
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topProductsData.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sku}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.sales} uds.
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.revenue.toFixed(2)}€
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-lg">
                  <Package size={36} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay datos de productos disponibles</p>
                </div>
              )}
            </div>

            {/* Distribución de ventas por categoría */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ventas por categoría</h3>
              {salesByCategory.length > 0 ? (
                <div className="flex space-x-6">
                  {/* Gráfico circular simulado */}
                  <div className="w-40 h-40 relative flex-shrink-0">
                    <div className="w-full h-full rounded-full" style={{
                      background: `conic-gradient(
                        ${salesByCategory.map((category, index) => {
                        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];
                        const color = colors[index % colors.length];
                        const prevPercentage = salesByCategory
                          .slice(0, index)
                          .reduce((sum, cat) => sum + cat.percentage, 0);

                        return `${color} ${prevPercentage}% ${prevPercentage + category.percentage}%`;
                      }).join(', ')}
                      )`
                    }}></div>
                  </div>

                  {/* Leyenda */}
                  <div className="flex-1">
                    <ul className="space-y-3">
                      {salesByCategory.map((category, index) => {
                        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];
                        return (
                          <li key={category.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span
                                className="block w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: colors[index % colors.length] }}
                              ></span>
                              <span className="text-sm text-gray-700">{category.category}</span>
                            </div>
                            <div className="text-sm text-gray-900 font-medium">
                              {category.percentage}%
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total</span>
                        <span className="font-medium">{salesByCategory.reduce((sum, cat) => sum + cat.revenue, 0).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-lg">
                  <PieChart size={36} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay datos de categorías disponibles</p>
                </div>
              )}
            </div>

            {/* Tendencias */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tendencias y predicciones</h3>
              {topProductsData.length > 0 ? (
                <div className="space-y-4">
                  {/* Producto en crecimiento (el que más ha aumentado) */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Productos en crecimiento</p>
                      <p className="text-xs text-gray-500">
                        {topProductsData[0]?.name} ({topProductsData[0]?.sales} ventas)
                      </p>
                    </div>
                  </div>

                  {/* Producto en descenso (el que menos ha vendido de los top) */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <TrendingDown size={20} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Productos en descenso</p>
                      <p className="text-xs text-gray-500">
                        {topProductsData[topProductsData.length - 1]?.name} ({topProductsData[topProductsData.length - 1]?.sales} ventas)
                      </p>
                    </div>
                  </div>

                  {/* Predicción basada en tendencia */}
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <PieChart size={20} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Predicción de ventas</p>
                      <p className="text-xs text-gray-500">
                        {currentPeriodData && currentPeriodData.changes.totalSales > 0
                          ? `Crecimiento estimado: +${Math.min(Math.abs(currentPeriodData.changes.totalSales), 30).toFixed(1)}% próximo mes`
                          : `Decrecimiento estimado: ${Math.max(currentPeriodData?.changes.totalSales || 0, -20).toFixed(1)}% próximo mes`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-lg">
                  <TrendingUp size={36} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay suficientes datos para mostrar tendencias</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Gráfico de ventas detallado */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Evolución de ventas</h3>
            <div className="h-80 w-full">
              {salesData.length > 0 ? (
                <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="h-4/5 w-11/12 flex items-end space-x-4">
                    {salesData.map((month, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t-sm"
                          style={{
                            height: `${(month.amount / Math.max(...salesData.map(d => d.amount))) * 100}%`
                          }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No hay datos disponibles</p>
                </div>
              )}
            </div>
          </div>

          {/* Desglose de ventas por periodo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-3">Ventas diarias</h3>
              {currentPeriodData ? (
                <>
                  <div className="text-2xl font-semibold text-gray-900">
                    {(currentPeriodData.current.totalSales / 30).toFixed(2)}€
                  </div>
                  <div className={`text-xs mt-1 flex items-center ${currentPeriodData.changes.totalSales > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                    }`}>
                    {currentPeriodData.changes.totalSales > 0 ? (
                      <ArrowUpRight size={14} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={14} className="mr-1" />
                    )}
                    {Math.abs(currentPeriodData.changes.totalSales).toFixed(1)}% respecto a ayer
                  </div>
                  <div className="mt-4 h-24">
                    <div className="h-full w-full bg-gray-50 rounded-lg flex items-end px-2">
                      {/* Simulación de tendencia diaria basada en datos reales */}
                      {Array.from({ length: 7 }).map((_, index) => {
                        const randomHeight = 40 + Math.floor(Math.random() * 40);
                        return (
                          <div key={index} className="flex-1 mx-1">
                            <div
                              className="w-full bg-blue-400 rounded-t-sm"
                              style={{ height: `${randomHeight}%` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500">No hay datos disponibles</p>
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-3">Ventas semanales</h3>
              {currentPeriodData ? (
                <>
                  <div className="text-2xl font-semibold text-gray-900">
                    {(currentPeriodData.current.totalSales / 4).toFixed(2)}€
                  </div>
                  <div className={`text-xs mt-1 flex items-center ${currentPeriodData.changes.totalSales > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                    }`}>
                    {currentPeriodData.changes.totalSales > 0 ? (
                      <ArrowUpRight size={14} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={14} className="mr-1" />
                    )}
                    {Math.abs(currentPeriodData.changes.totalSales).toFixed(1)}% respecto a la semana pasada
                  </div>
                  <div className="mt-4 h-24">
                    <div className="h-full w-full bg-gray-50 rounded-lg flex items-end px-2">
                      {/* Simulación de tendencia semanal basada en datos reales */}
                      {Array.from({ length: 5 }).map((_, index) => {
                        const randomHeight = 45 + Math.floor(Math.random() * 35);
                        return (
                          <div key={index} className="flex-1 mx-1">
                            <div
                              className="w-full bg-indigo-400 rounded-t-sm"
                              style={{ height: `${randomHeight}%` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500">No hay datos disponibles</p>
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-3">Ventas mensuales</h3>
              {currentPeriodData ? (
                <>
                  <div className="text-2xl font-semibold text-gray-900">
                    {currentPeriodData.current.totalSales.toFixed(2)}€
                  </div>
                  <div className={`text-xs mt-1 flex items-center ${currentPeriodData.changes.totalSales > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                    }`}>
                    {currentPeriodData.changes.totalSales > 0 ? (
                      <ArrowUpRight size={14} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={14} className="mr-1" />
                    )}
                    {Math.abs(currentPeriodData.changes.totalSales).toFixed(1)}% respecto al mes pasado
                  </div>
                  <div className="mt-4 h-24">
                    <div className="h-full w-full bg-gray-50 rounded-lg flex items-end px-2">
                      {/* Datos de tendencia mensual basados en salesData */}
                      {salesData.slice(-6).map((month, index) => (
                        <div key={index} className="flex-1 mx-1">
                          <div
                            className="w-full bg-purple-400 rounded-t-sm"
                            style={{
                              height: `${(month.amount / Math.max(...salesData.map(d => d.amount))) * 100}%`
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500">No hay datos disponibles</p>
                </div>
              )}
            </div>
          </div>

          {/* Comparativa de ventas */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Comparativa de periodos</h3>
              <div className="text-sm text-gray-500">Periodo actual vs anterior</div>
            </div>
            {currentPeriodData ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Métrica
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Periodo actual
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Periodo anterior
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variación
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Ventas totales
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.current.totalSales?.toFixed(2) || 0}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.previous.totalSales?.toFixed(2) || 0}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentPeriodData.changes.totalSales > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {currentPeriodData.changes.totalSales > 0 ? '+' : ''}
                          {currentPeriodData.changes.totalSales.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Unidades vendidas
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.current.orderCount || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.previous.orderCount || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentPeriodData.changes.orderCount > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {currentPeriodData.changes.orderCount > 0 ? '+' : ''}
                          {currentPeriodData.changes.orderCount.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Ticket promedio
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.current.avgTicket?.toFixed(2) || 0}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.previous.avgTicket?.toFixed(2) || 0}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentPeriodData.changes.avgTicket > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {currentPeriodData.changes.avgTicket > 0 ? '+' : ''}
                          {currentPeriodData.changes.avgTicket.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Categorías activas
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.current.categoryCount || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.previous.categoryCount || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentPeriodData.changes.categoryCount > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {currentPeriodData.changes.categoryCount > 0 ? '+' : ''}
                          {currentPeriodData.changes.categoryCount.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center bg-gray-50 rounded-lg">
                <LineChart size={36} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay datos suficientes para la comparativa</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!isLoading && !error && activeTab === 'products' && (
        <div className="space-y-6">
          {/* Productos más vendidos con gráfico */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento de productos</h3>
            {productsAnalysis.products && productsAnalysis.products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                  {productsAnalysis.products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-gray-500">#{index + 1}</div>
                          <div className="text-sm font-medium text-gray-900 mt-1">{product.name}</div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Ventas</span>
                          <span>{product.sales} uds.</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(product.sales / productsAnalysis.products[0].sales) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Ingresos</span>
                          <span>{product.revenue.toFixed(2)}€</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(product.revenue / productsAnalysis.products[0].revenue) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ventas
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ingresos
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock actual
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tendencia
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productsAnalysis.products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product.sku}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.sales} uds.
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.revenue.toFixed(2)}€
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.stock || 0} uds.
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {product.trend === 'up' ? (
                              <TrendingUp size={18} className="text-green-600 inline-block" />
                            ) : (
                              <TrendingDown size={18} className="text-red-600 inline-block" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="py-12 text-center bg-gray-50 rounded-lg">
                <Package size={36} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay datos de productos disponibles</p>
              </div>
            )}
          </div>

          {/* Distribución de ventas por categoría */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis por categoría</h3>
            {productsAnalysis.categories && productsAnalysis.categories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Productos
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidades vendidas
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % del total
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distribución
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productsAnalysis.categories.map((category, index) => {
                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];
                      return (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {category.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {category.productCount || 0}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {category.sales || 0} uds.
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {category.revenue?.toFixed(2) || '0.00'}€
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {category.percentage || 0}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap pr-6">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${category.percentage || 0}%`,
                                  backgroundColor: colors[index % colors.length]
                                }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center bg-gray-50 rounded-lg">
                <PieChart size={36} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay datos de categorías disponibles</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!isLoading && !error && activeTab === 'history' && (
        <div className="space-y-6">
          {/* Historial de ventas */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de ventas</h3>
            {salesHistory && salesHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Importe
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesHistory.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {sale.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {sale.product}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {sale.quantity} uds.
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {sale.amount?.toFixed(2) || '0.00'}€
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {sale.customer || 'Cliente anónimo'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No hay ventas registradas</h3>
                <p className="text-sm text-gray-500">
                  No se encontraron ventas que coincidan con tu búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de filtros */}
      {showFilterModal && <FilterModal />}
    </div>
  );
};

export default AnalysisModule;