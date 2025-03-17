'use client'

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  PackagePlus, 
  PackageMinus, 
  History, 
  BarChart2, 
  Search, 
  Filter, 
  Download, 
  X, 
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { 
  getInventarioDashboard,
  getMovimientos,
  getAlertasStock,
  getCategorias
} from '@src/service/conexion';

// Componente de notificación personalizado
const Notification = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100 border-green-500' : 
                  type === 'error' ? 'bg-red-100 border-red-500' : 
                  'bg-blue-100 border-blue-500';
  
  const textColor = type === 'success' ? 'text-green-800' : 
                    type === 'error' ? 'text-red-800' : 
                    'text-blue-800';
  
  return (
    <div className={`fixed top-4 right-4 max-w-xs p-4 border-l-4 ${bgColor} rounded shadow-md z-50`}>
      <div className="flex items-start">
        <div className={`mr-3 ${textColor}`}>
          {type === 'success' ? <Check size={20} /> : 
           type === 'error' ? <AlertTriangle size={20} /> : 
           <Package size={20} />}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <button onClick={onClose} className={`ml-3 ${textColor}`}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Hook personalizado para notificaciones
const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
    
    return id;
  };
  
  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const NotificationsContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
  
  return {
    showSuccess: (message) => showNotification(message, 'success'),
    showError: (message) => showNotification(message, 'error'),
    showInfo: (message) => showNotification(message, 'info'),
    NotificationsContainer
  };
};

const InventarioModule = () => {
  // Sistema de notificaciones
  const { showSuccess, showError, NotificationsContainer } = useNotification();
  
  // Estados para gestionar la UI
  const [activeTab, setActiveTab] = useState('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportingData, setExportingData] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  // Estados para filtros
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');
  
  // Estados para datos
  const [summaryData, setSummaryData] = useState({
    totalProductos: 0,
    valorInventario: 0,
    productosConBajoStock: 0,
    movimientosMes: 0,
    crecimientoProductos: 0,
    crecimientoValor: 0
  });
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  
  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar categorías
        const categoriasData = await getCategorias();
        setCategorias(categoriasData);
        
        // Cargar alertas de stock
        const alertasData = await getAlertasStock();
        setAlertas(alertasData);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        showError('Error al cargar datos iniciales');
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Cargar datos según la pestaña activa
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'stock') {
          const data = await getInventarioDashboard({ 
            searchTerm,
            categoria: categoriaFilter,
            stockStatus: stockStatusFilter 
          });
          setSummaryData(data.summaryData);
          setProductos(data.productos);
          setMovimientos(data.movimientos);
        } else if (activeTab === 'entradas' || activeTab === 'salidas') {
          const tipo = activeTab === 'entradas' ? 'Entrada' : 'Salida';
          const data = await getMovimientos({ 
            searchTerm, 
            tipo 
          });
          setMovimientos(data);
        } else if (activeTab === 'historial') {
          const data = await getMovimientos({ searchTerm });
          setMovimientos(data);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        showError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, searchTerm, categoriaFilter, stockStatusFilter]);
  
  // Manejar búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Aplicar filtros
  const applyFilters = (filters) => {
    setCategoriaFilter(filters.categoria);
    setStockStatusFilter(filters.stockStatus);
    setShowFiltersModal(false);
  };
  
  // Resetear filtros
  const resetFilters = () => {
    setCategoriaFilter('');
    setStockStatusFilter('');
    setShowFiltersModal(false);
  };
  
  // Renderizar indicador de stock
  const renderStockIndicator = (stock, minStock, stockStatus) => {
    if (stockStatus === 'sin_stock') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Sin stock</span>;
    } else if (stockStatus === 'bajo') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">Bajo</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Óptimo</span>;
    }
  };
  
  // Exportar datos a CSV
  const exportToCSV = async (data, filename) => {
    setExportingData(true);
    
    try {
      let csvContent = '';
      
      if (activeTab === 'stock') {
        // Cabeceras para productos
        csvContent = 'SKU,Nombre,Categoría,Stock,Stock Mínimo,Precio,Última Actualización,Estado\n';
        
        // Datos de productos
        data.forEach(item => {
          let stockStatus = 'Óptimo';
          if (item.stockStatus === 'sin_stock') stockStatus = 'Sin stock';
          if (item.stockStatus === 'bajo') stockStatus = 'Bajo';
          
          csvContent += `"${item.sku || ''}","${item.name}","${item.category || ''}",${item.stock},${item.minStock},${item.price},"${item.lastUpdated || ''}","${stockStatus}"\n`;
        });
      } else {
        // Cabeceras para movimientos
        csvContent = 'Fecha,Producto,Tipo,Cantidad,Usuario,Notas,Referencia\n';
        
        // Datos de movimientos
        data.forEach(item => {
          csvContent += `"${item.date}","${item.product}","${item.type}",${item.quantity},"${item.user}","${item.notes || ''}","${item.reference || ''}"\n`;
        });
      }
      
      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar datos:', error);
      showError('Error al exportar datos');
    } finally {
      setExportingData(false);
    }
  };
  
  // Recargar datos
  const reloadStockData = async () => {
    try {
      const data = await getInventarioDashboard({
        searchTerm,
        categoria: categoriaFilter,
        stockStatus: stockStatusFilter
      });
      setSummaryData(data.summaryData);
      setProductos(data.productos);
      setMovimientos(data.movimientos);
      
      // Actualizar alertas
      const alertasData = await getAlertasStock();
      setAlertas(alertasData);
    } catch (error) {
      console.error('Error al recargar datos de stock:', error);
      showError('Error al recargar datos');
    }
  };
  
  const reloadMovementsData = async () => {
    try {
      if (activeTab === 'entradas' || activeTab === 'salidas') {
        const tipo = activeTab === 'entradas' ? 'Entrada' : 'Salida';
        const data = await getMovimientos({ 
          searchTerm, 
          tipo 
        });
        setMovimientos(data);
      } else if (activeTab === 'historial') {
        const data = await getMovimientos({ searchTerm });
        setMovimientos(data);
      }
    } catch (error) {
      console.error('Error al recargar movimientos:', error);
      showError('Error al recargar datos');
    }
  };
  
  // Modal para filtros
  const FiltersModal = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Filtrar productos</h3>
          <button
            onClick={() => setShowFiltersModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de stock</label>
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="sin_stock">Sin stock</option>
              <option value="bajo">Stock bajo</option>
              <option value="optimo">Stock óptimo</option>
            </select>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
          <button
            onClick={() => applyFilters({ categoria: categoriaFilter, stockStatus: stockStatusFilter })}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Contenedor de notificaciones */}
      <NotificationsContainer />
      
      {/* Cabecera del módulo */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visualiza el stock en tiempo real, entradas, salidas e historial de movimientos
        </p>
      </div>

      {/* Navegación por tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${
              activeTab === 'stock'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={18} />
            <span>Inventario actual</span>
          </button>
          <button
            onClick={() => setActiveTab('entradas')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${
              activeTab === 'entradas'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PackagePlus size={18} />
            <span>Entradas</span>
          </button>
          <button
            onClick={() => setActiveTab('salidas')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${
              activeTab === 'salidas'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PackageMinus size={18} />
            <span>Salidas</span>
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${
              activeTab === 'historial'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <History size={18} />
            <span>Historial</span>
          </button>
        </nav>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex space-x-3 w-full sm:w-auto justify-end">
          {activeTab === 'stock' && (
            <>
              <button 
                onClick={() => setShowFiltersModal(true)} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
              >
                <Filter size={16} className="mr-1" />
                Filtrar
              </button>
              <button 
                onClick={() => exportToCSV(productos, 'inventario_productos.csv')} 
                disabled={exportingData}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
              >
                {exportingData ? (
                  <Loader2 size={16} className="mr-1 animate-spin" />
                ) : (
                  <Download size={16} className="mr-1" />
                )}
                Exportar
              </button>
            </>
          )}
          {activeTab === 'historial' && (
            <button
              onClick={() => exportToCSV(movimientos, 'historial_movimientos.csv')}
              disabled={exportingData}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
            >
              {exportingData ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <Download size={16} className="mr-1" />
              )}
              Exportar historial
            </button>
          )}
        </div>
      </div>

      {/* Spinner de carga */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={40} className="animate-spin text-blue-600" />
        </div>
      )}

      {/* Contenido principal según la tab activa */}
      {!loading && activeTab === 'stock' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última actualización
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {product.category || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{product.stock}</span>
                        {renderStockIndicator(product.stock, product.minStock, product.stockStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.lastUpdated || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {productos.length === 0 && (
            <div className="py-12 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay productos</h3>
              <p className="text-sm text-gray-500">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && (activeTab === 'historial') && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movimientos.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movement.type === 'Entrada' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Entrada
                        </span>
                      ) : movement.type === 'Salida' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                          Salida
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Ajuste
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.quantity} unidades
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {movimientos.length === 0 && (
            <div className="py-12 text-center">
              <History size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay movimientos</h3>
              <p className="text-sm text-gray-500">
                No se encontraron movimientos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Vista para las entradas/salidas */}
      {!loading && (activeTab === 'entradas' || activeTab === 'salidas') && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referencia
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movimientos
                  .filter(m => m.type === (activeTab === 'entradas' ? 'Entrada' : 'Salida'))
                  .map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movement.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movement.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movement.quantity} unidades
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.reference || '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {movimientos.filter(m => m.type === (activeTab === 'entradas' ? 'Entrada' : 'Salida')).length === 0 && (
            <div className="py-12 text-center">
              {activeTab === 'entradas' ? (
                <PackagePlus size={48} className="mx-auto text-gray-400 mb-4" />
              ) : (
                <PackageMinus size={48} className="mx-auto text-gray-400 mb-4" />
              )}
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No hay {activeTab === 'entradas' ? 'entradas' : 'salidas'} registradas
              </h3>
              <p className="text-sm text-gray-500">
                No se encontraron {activeTab === 'entradas' ? 'entradas' : 'salidas'} que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Modal para filtros */}
      {showFiltersModal && <FiltersModal />}
      
      {/* Resumen de información de inventario en tarjetas informativas */}
      {!loading && activeTab === 'stock' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de productos</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{summaryData.totalProductos}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {parseFloat(summaryData.crecimientoProductos) > 0 ? (
                <span className="text-green-600 flex items-center">
                  <ChevronUp size={14} className="mr-1" />
                  +{summaryData.crecimientoProductos}% con respecto al mes anterior
                </span>
              ) : parseFloat(summaryData.crecimientoProductos) < 0 ? (
                <span className="text-red-600 flex items-center">
                  <ChevronDown size={14} className="mr-1" />
                  {summaryData.crecimientoProductos}% con respecto al mes anterior
                </span>
              ) : (
                <span className="text-gray-600 flex items-center">
                  Sin cambios respecto al mes anterior
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Valor del inventario</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ${parseFloat(summaryData.valorInventario).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <BarChart2 size={24} className="text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {parseFloat(summaryData.crecimientoValor) > 0 ? (
                <span className="text-green-600 flex items-center">
                  <ChevronUp size={14} className="mr-1" />
                  +{summaryData.crecimientoValor}% con respecto al mes anterior
                </span>
              ) : parseFloat(summaryData.crecimientoValor) < 0 ? (
                <span className="text-red-600 flex items-center">
                  <ChevronDown size={14} className="mr-1" />
                  {summaryData.crecimientoValor}% con respecto al mes anterior
                </span>
              ) : (
                <span className="text-gray-600 flex items-center">
                  Sin cambios respecto al mes anterior
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Productos con bajo stock</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {summaryData.productosConBajoStock}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {alertas.length > 0 ? (
                <span className="text-red-600 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {alertas.length} alertas pendientes de revisión
                </span>
              ) : (
                <span className="text-green-600 flex items-center">
                  <Check size={14} className="mr-1" />
                  No hay alertas pendientes
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Movimientos este mes</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{summaryData.movimientosMes}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <History size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Check size={14} className="mr-1 text-green-600" />
                Todos los movimientos registrados
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Alertas de stock bajo */}
      {!loading && activeTab === 'stock' && alertas.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Alertas de stock</h3>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock actual
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock mínimo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alertas.slice(0, 5).map((alerta) => (
                    <tr key={alerta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{alerta.productName}</div>
                        <div className="text-xs text-gray-500">{alerta.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Stock bajo
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {alerta.currentStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {alerta.minStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alerta.priority === 'Alta' ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Alta
                          </span>
                        ) : alerta.priority === 'Media' ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                            Media
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Baja
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {alertas.length > 5 && (
              <div className="px-6 py-3 bg-gray-50 text-right">
                <span className="text-sm text-gray-500">
                  Mostrando 5 de {alertas.length} alertas pendientes
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioModule;