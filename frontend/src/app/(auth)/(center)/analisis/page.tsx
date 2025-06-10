'use client'
import * as XLSX from 'xlsx';
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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Pie, Cell, LineChart as RechartsLineChart, Line
} from 'recharts';
import {
  getAnalysisDashboardData,
  getProductsAnalysis,
  searchSalesHistory,
  exportData
} from '@src/service/conexion';

// Professional color palette
const COLORS = {
  primary: '#4B5563',      // Dark gray
  secondary: '#9CA3AF',    // Medium gray
  accent1: '#3B82F6',      // Blue
  accent2: '#EC4899',      // Pink
  accent3: '#10B981',      // Green
  accent4: '#F59E0B',      // Amber
  accent5: '#6366F1',      // Indigo
  background: '#F3F4F6',   // Light gray
  success: '#10B981',      // Green
  danger: '#EF4444',       // Red
  warning: '#F59E0B',      // Amber
  info: '#3B82F6'          // Blue
};



// Professional chart colors
const CHART_COLORS = [
  COLORS.accent1,
  COLORS.accent2,
  COLORS.accent3,
  COLORS.accent4,
  COLORS.accent5,
  '#8B5CF6',   // Purple
  '#14B8A6',   // Teal
  '#F97316',   // Orange
  '#06B6D4',   // Cyan
  '#8B5CF6'    // Purple
];

const AnalysisModule = () => {
  // States for data
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('custom');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for dynamic data
  const [salesData, setSalesData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [inventoryMovements, setInventoryMovements] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [currentPeriodData, setCurrentPeriodData] = useState(null);
  const [productsAnalysis, setProductsAnalysis] = useState({ products: [], categories: [] });

  // Filter states
  const [dateRange, setDateRange] = useState({
    startDate: getDefaultStartDate(),
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [compareLastPeriod, setCompareLastPeriod] = useState(false);

  // Time range dropdown state
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);

  // Load dashboard data based on active tab
  useEffect(() => {
    const loadData = async () => {
      console.log("Starting data load", { activeTab, timeRange, dateRange });
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === 'overview') {
          const params = {
            timeRange,
            ...dateRange.startDate && dateRange.endDate ? dateRange : {}
          };

          console.log("Requesting dashboard data", params);

          // MOCK DATA - REPLACE WITH ACTUAL API CALL
          
          // Uncomment this line when connecting to real API
          const data = await getAnalysisDashboardData(params);

          // Comment this line when connecting to real API

          console.log("Data received", data);

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
          // Also load data for sales tab
          const params = {
            timeRange,
            ...dateRange.startDate && dateRange.endDate ? dateRange : {}
          };

          const data = await getAnalysisDashboardData(params);
          setSalesData(data.salesData || []);
          setCurrentPeriodData(data.currentPeriodData || null);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('An error occurred while loading data. Please try again.');
      } finally {
        setIsLoading(false);
        console.log("Data loading finished", { activeTab });
      }
    };

    loadData();
  }, [activeTab, timeRange, dateRange.startDate, dateRange.endDate, selectedCategory]);

  // Function to load sales history with search
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
      console.error('Error loading sales history:', err);
      setError('An error occurred while searching history. Please try again.');
    }
  };

  // Handle search term change
  useEffect(() => {
    if (activeTab === 'history') {
      const delayDebounce = setTimeout(() => {
        loadSalesHistory();
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, activeTab]);

  // Handle data export
  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Define what data to export based on active tab
      let dataToExport = [];
      let filename = '';
      let sheetNames = [];

      if (activeTab === 'overview') {
        // Export general summary data
        filename = 'resumen_analisis';

        // Monthly sales data
        const salesSheetData = [['Mes', 'Ventas', 'Cantidad']];
        salesData.forEach(month => {
          salesSheetData.push([month.month, month.amount, month.count]);
        });

        // Top-selling products data
        const productsSheetData = [['Producto', 'SKU', 'Categoría', 'Ventas', 'Ingresos ($)']];
        topProductsData.forEach(product => {
          productsSheetData.push([
            product.name,
            product.sku,
            product.category,
            product.sales,
            product.revenue
          ]);
        });

        // Sales by category data
        const categoriesSheetData = [['Categoría', 'Porcentaje (%)', 'Ingresos ($)']];
        salesByCategory.forEach(category => {
          categoriesSheetData.push([
            category.category,
            category.percentage,
            category.revenue
          ]);
        });

        // Add all data to export
        dataToExport = [
          { name: 'Ventas Mensuales', data: salesSheetData },
          { name: 'Productos Top', data: productsSheetData },
          { name: 'Categorías', data: categoriesSheetData }
        ];

      } else if (activeTab === 'sales') {
        // Export sales data
        filename = 'analisis_ventas';

        // Sales data
        const salesSheetData = [['Mes', 'Ventas ($)', 'Cantidad']];
        salesData.forEach(month => {
          salesSheetData.push([month.month, month.amount, month.count]);
        });

        // Period comparison
        const comparisonData = [
          ['Métrica', 'Periodo Actual', 'Periodo Anterior', 'Variación (%)'],
          ['Ventas totales',
            currentPeriodData?.current.totalSales || 0,
            currentPeriodData?.previous.totalSales || 0,
            currentPeriodData?.changes.totalSales || 0
          ],
          ['Unidades vendidas',
            currentPeriodData?.current.orderCount || 0,
            currentPeriodData?.previous.orderCount || 0,
            currentPeriodData?.changes.orderCount || 0
          ],
          ['Ticket promedio',
            currentPeriodData?.current.avgTicket || 0,
            currentPeriodData?.previous.avgTicket || 0,
            currentPeriodData?.changes.avgTicket || 0
          ],
          ['Categorías activas',
            currentPeriodData?.current.categoryCount || 0,
            currentPeriodData?.previous.categoryCount || 0,
            currentPeriodData?.changes.categoryCount || 0
          ]
        ];

        dataToExport = [
          { name: 'Ventas por Mes', data: salesSheetData },
          { name: 'Comparativa', data: comparisonData }
        ];

      } else if (activeTab === 'products') {
        // Export product data
        filename = 'analisis_productos';

        // Product data
        const productsSheetData = [['Producto', 'SKU', 'Categoría', 'Ventas', 'Ingresos ($)', 'Stock', 'Tendencia']];
        productsAnalysis.products.forEach(product => {
          productsSheetData.push([
            product.name,
            product.sku,
            product.category,
            product.sales,
            product.revenue,
            product.stock || 0,
            product.trend === 'up' ? 'Crecimiento' : 'Decrecimiento'
          ]);
        });

        // Category data
        const categoriesSheetData = [['Categoría', 'Productos', 'Unidades Vendidas', 'Ingresos ($)', 'Porcentaje (%)']];
        productsAnalysis.categories.forEach(category => {
          categoriesSheetData.push([
            category.category,
            category.productCount || 0,
            category.sales || 0,
            category.revenue || 0,
            category.percentage || 0
          ]);
        });

        dataToExport = [
          { name: 'Productos', data: productsSheetData },
          { name: 'Categorías', data: categoriesSheetData }
        ];

      } else if (activeTab === 'history') {
        // Export sales history
        filename = 'historial_ventas';

        // History data
        const historySheetData = [['Fecha', 'Producto', 'Cantidad', 'Importe ($)', 'Cliente']];
        salesHistory.forEach(sale => {
          historySheetData.push([
            sale.date,
            sale.product,
            sale.quantity,
            sale.amount || 0,
            sale.customer || 'Cliente anónimo'
          ]);
        });

        dataToExport = [
          { name: 'Historial', data: historySheetData }
        ];
      }

      // Create Excel workbook
      const wb = XLSX.utils.book_new();

      // Add each sheet to the workbook
      dataToExport.forEach(sheet => {
        // Convert data to worksheet
        const ws = XLSX.utils.aoa_to_sheet(sheet.data);

        // Configure automatic column widths based on data length
        const columnWidths = [];
        sheet.data.forEach(row => {
          row.forEach((cell, i) => {
            const cellValue = cell !== null ? String(cell) : '';
            columnWidths[i] = Math.max(columnWidths[i] || 10, Math.min(50, cellValue.length + 2));
          });
        });

        ws['!cols'] = columnWidths.map(width => ({ wch: width }));

        // Add sheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      });

      // Add current date to filename
      const date = new Date().toISOString().split('T')[0];
      filename = `${filename}_${date}`;

      // Write file and download
      XLSX.writeFile(wb, `${filename}.xlsx`);

      // Show success message
      alert(`Data successfully exported to ${filename}.xlsx`);

    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get default start date (30 days ago)
  function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  // Function to apply filters
  const applyFilters = () => {
    setShowFilterModal(false);

    // Depending on active tab, we load corresponding data
    if (activeTab === 'overview') {
      // Loading is handled automatically in useEffect
    } else if (activeTab === 'products') {
      // Loading is handled automatically in useEffect
    } else if (activeTab === 'history') {
      loadSalesHistory();
    }
  };

  // Function to reset filters
  const resetFilters = () => {
    setDateRange({
      startDate: getDefaultStartDate(),
      endDate: new Date().toISOString().split('T')[0]
    });
    setSelectedCategory('');
    setMinAmount('');
    setCompareLastPeriod(false);
  };

  // Calculate totals
  const totalSales = salesData.reduce((sum, month) => sum + (month.amount || 0), 0);
  const totalProducts = salesData.reduce((sum, month) => sum + (month.count || 0), 0);

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  // Filter modal
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
                <span className="text-gray-500 sm:text-sm">$</span>
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

  // Date range display component
  const DateRangeDisplay = () => {
    const formattedStartDate = formatDateForDisplay(dateRange.startDate);
    const formattedEndDate = formatDateForDisplay(dateRange.endDate);

    return (
      <button
        onClick={() => setShowFilterModal(true)}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
      >
        <Calendar size={16} className="mr-2" />
        <span>{formattedStartDate} - {formattedEndDate}</span>
      </button>
    );
  };

  // Dropdown with preset date ranges
  const DateRangeQuickSelect = () => (
    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
      <ul className="py-1">
        <li>
          <button
            onClick={() => {
              const today = new Date();
              const lastWeek = new Date();
              lastWeek.setDate(today.getDate() - 7);
              setDateRange({
                startDate: lastWeek.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              });
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Últimos 7 días
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              const today = new Date();
              const lastMonth = new Date();
              lastMonth.setDate(today.getDate() - 30);
              setDateRange({
                startDate: lastMonth.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              });
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Últimos 30 días
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              const today = new Date();
              const lastQuarter = new Date();
              lastQuarter.setDate(today.getDate() - 90);
              setDateRange({
                startDate: lastQuarter.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              });
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Últimos 90 días
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              const today = new Date();

              // First day of current month
              const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

              setDateRange({
                startDate: firstDayOfMonth.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              });
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Mes actual
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              const today = new Date();

              // First day of the year
              const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

              setDateRange({
                startDate: firstDayOfYear.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              });
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Año actual
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setShowFilterModal(true);
              setShowTimeRangeDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
          >
            Rango personalizado...
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Module header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Análisis y Reportes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visualiza métricas clave, analiza tendencias de ventas y exporta reportes detallados
        </p>
      </div>

      {/* Tab navigation */}
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

      {/* Action bar
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
            >
              <Calendar size={16} className="mr-2" />
              Período
              <ChevronDown size={16} className="ml-1" />
            </button>
            {showTimeRangeDropdown && <DateRangeQuickSelect />}
          </div>

          <DateRangeDisplay />


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
      </div> */}

      {/* Loading state */}
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


      {/* Main content based on active tab */}
      {!isLoading && !error && activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ventas totales</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{totalSales.toLocaleString()}$</p>
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
                    {totalProducts > 0 ? (totalSales / totalProducts).toFixed(2) : '0.00'}$
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
                    {inventoryMovements.reduce((sum, m) => sum + (m.count || 0), 0)}
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

          {/* Charts and summary tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly sales chart with Recharts */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ventas mensuales</h3>
              <div className="h-64 w-full">
                {salesData && salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: COLORS.primary }}
                        tickFormatter={(value) => value.substring(0, 3)}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: COLORS.primary }}
                        tickFormatter={(value) => `${value}$`}
                        width={50}
                      />
                      <Tooltip
                        formatter={(value) => [`${value.toFixed(2)}$`, 'Ventas']}
                        labelFormatter={(label) => `${label}`}
                        contentStyle={{ backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}
                      />
                      <Bar
                        dataKey="amount"
                        name="Importe"
                        fill={COLORS.accent1}
                        activeBar={{ fill: COLORS.accent5 }}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No hay datos disponibles</p>
                  </div>
                )}
              </div>
            </div>

            {/* Best selling products */}
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
                            {product.revenue.toFixed(2)}$
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

            {/* Sales distribution by category - Improved professional chart */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ventas por categoría</h3>
              {salesByCategory && salesByCategory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Horizontal bar chart for categories */}
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={salesByCategory}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 12, fill: COLORS.primary }}
                          tickFormatter={(value) => `${value}$`}
                        />
                        <YAxis
                          dataKey="category"
                          type="category"
                          width={100}
                          tick={{ fontSize: 12, fill: COLORS.primary }}
                        />
                        <Tooltip
                          formatter={(value) => [`${value.toFixed(2)}$`, 'Ventas']}
                          contentStyle={{ backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}
                        />
                        <Bar
                          dataKey="revenue"
                          name="Ingresos"
                          fill={COLORS.accent3}
                          radius={[0, 4, 4, 0]}
                        >
                          {salesByCategory.map((entry, index) => (
                            <Cell key={`cell-${entry.id || index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend and percentage display */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Distribución de ingresos</h4>
                      <ul className="space-y-3">
                        {salesByCategory.map((category, index) => (
                          <li key={`legend-${category.id || index}`} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span
                                className="block w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                              ></span>
                              <span className="text-sm text-gray-700">{category.category}</span>
                            </div>
                            <div className="text-sm text-gray-900 font-medium">
                              {category.percentage}%
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total</span>
                        <span className="font-medium">{salesByCategory.reduce((sum, cat) => sum + (cat.revenue || 0), 0).toFixed(2)}$</span>
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

            {/* Trends */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tendencias y predicciones</h3>
              {topProductsData.length > 0 ? (
                <div className="space-y-4">
                  {/* Growing product (the one that has increased the most) */}
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

                  {/* Declining product (the one that has sold the least from the top) */}
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

                  {/* Prediction based on trend */}
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
          {/* Detailed sales chart */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Evolución de ventas</h3>
            <div className="h-80 w-full">
              {salesData && salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fill: COLORS.primary }} />
                    <YAxis
                      tickFormatter={(value) => `${value}$`}
                      tick={{ fill: COLORS.primary }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toFixed(2)}$`, 'Ventas']}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{ backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Importe ($)" fill={COLORS.accent1} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="count" name="Unidades" fill={COLORS.accent2} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No hay datos disponibles</p>
                </div>
              )}
            </div>
          </div>

          {/* Sales breakdown by period */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-3">Ventas diarias</h3>
              {currentPeriodData ? (
                <>
                  <div className="text-2xl font-semibold text-gray-900">
                    {(currentPeriodData.current.totalSales / 30).toFixed(2)}$
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
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={Array.from({ length: 7 }).map((_, index) => ({
                          day: index + 1,
                          value: Math.floor(Math.random() * 100) + 50
                        }))}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={COLORS.accent1}
                          strokeWidth={2}
                          dot={{ r: 3, fill: COLORS.accent1 }}
                          activeDot={{ r: 5, fill: COLORS.accent1 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
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
                    {(currentPeriodData.current.totalSales / 4).toFixed(2)}$
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
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={Array.from({ length: 5 }).map((_, index) => ({
                          week: index + 1,
                          value: Math.floor(Math.random() * 200) + 100
                        }))}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={COLORS.accent3}
                          strokeWidth={2}
                          dot={{ r: 3, fill: COLORS.accent3 }}
                          activeDot={{ r: 5, fill: COLORS.accent3 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
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
                    {currentPeriodData.current.totalSales.toFixed(2)}$
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
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={salesData.slice(-6).map((month, index) => ({
                          month: month.month,
                          value: month.amount
                        }))}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={COLORS.accent4}
                          strokeWidth={2}
                          dot={{ r: 3, fill: COLORS.accent4 }}
                          activeDot={{ r: 5, fill: COLORS.accent4 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500">No hay datos disponibles</p>
                </div>
              )}
            </div>
          </div>

          {/* Sales comparison */}
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
                        {currentPeriodData.current.totalSales?.toFixed(2) || 0}$
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.previous.totalSales?.toFixed(2) || 0}$
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
                        {currentPeriodData.current.avgTicket?.toFixed(2) || 0}$
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {currentPeriodData.previous.avgTicket?.toFixed(2) || 0}$
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
                    <div
                      key={product.id}
                      className="p-4 border border-gray-200 rounded-lg"
                      style={{ backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}20` }}
                    >
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
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min((product.sales / productsAnalysis.products[0].sales) * 100, 100)}%`,
                              backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Ingresos</span>
                          <span>{product.revenue.toFixed(2)}$</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min((product.revenue / productsAnalysis.products[0].revenue) * 100, 100)}%`,
                              backgroundColor: CHART_COLORS[(index + 5) % CHART_COLORS.length]
                            }}
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
                      {productsAnalysis.products.map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product.sku}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="px-2 py-1 text-xs font-medium rounded-full text-gray-800"
                              style={{ backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}50` }}
                            >
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.sales} uds.
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.revenue.toFixed(2)}$
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
                    {productsAnalysis.categories.map((category, index) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="px-2 py-1 text-xs font-medium rounded-full text-gray-800"
                            style={{ backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}50` }}
                          >
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
                          {category.revenue?.toFixed(2) || '0.00'}$
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
                                backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesHistory.map((sale, index) => (
                      <tr key={`${sale.id}-${index}`} className="hover:bg-gray-50">
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
                          {sale.amount?.toFixed(2) || '0.00'}$
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