'use client'

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

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
  const [sortOrder, setSortOrder] = useState('name_asc');
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

  const normalizeCategorias = (categoriasData) => {
    if (!Array.isArray(categoriasData) || categoriasData.length === 0) {
      console.warn('No se recibieron categorías o formato inválido');
      return [];
    }

    // Your actual data format has 'id' and 'nombre' fields
    if (categoriasData[0].id && categoriasData[0].nombre) {
      return categoriasData.map(item => ({
        id_categoria: item.id,
        nombre_categoria: item.nombre
      }));
    }
    // Check if data is already in the expected format
    else if (categoriasData[0].id_categoria && categoriasData[0].nombre_categoria) {
      return categoriasData;
    }
    // Any other format - return empty array
    return [];
  };


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar categorías
        const categoriasData = await getCategorias();
        console.log("Categorías recibidas:", categoriasData);

        // Normalizar el formato de categorías
        const normalizedCategorias = normalizeCategorias(categoriasData);
        setCategorias(normalizedCategorias);

        // Cargar alertas de stock
        const alertasData = await getAlertasStock();
        console.log("Alertas recibidas:", alertasData);
        setAlertas(alertasData);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        showError('Error al cargar datos iniciales');
        // Configurar categoría predeterminada en caso de error
        setCategorias([{
          id_categoria: 1,
          nombre_categoria: "General"
        }]);
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
          console.log(data)
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
    setSortOrder(filters.sortOrder);
    setShowFiltersModal(false);
  };

  // Resetear filtros
  const resetFilters = () => {
    setCategoriaFilter('');
    setStockStatusFilter('');
    setSortOrder('name_asc');
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

  // Modal para filtros
  const FiltersModal = () => (
    <div className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Filtrar productos</h3>
          <button
            onClick={() => setShowFiltersModal(false)}
            className="text-slate-400 hover:text-slate-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado de stock</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stockAll"
                    name="stockStatus"
                    value=""
                    checked={stockStatusFilter === ""}
                    onChange={() => setStockStatusFilter("")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="stockAll" className="ml-2 block text-sm text-slate-700">
                    Todos los estados
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stockEmpty"
                    name="stockStatus"
                    value="sin_stock"
                    checked={stockStatusFilter === "sin_stock"}
                    onChange={() => setStockStatusFilter("sin_stock")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="stockEmpty" className="ml-2 block text-sm text-slate-700">
                    Sin stock
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stockLow"
                    name="stockStatus"
                    value="bajo"
                    checked={stockStatusFilter === "bajo"}
                    onChange={() => setStockStatusFilter("bajo")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="stockLow" className="ml-2 block text-sm text-slate-700">
                    Stock bajo
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stockOptimal"
                    name="stockStatus"
                    value="optimo"
                    checked={stockStatusFilter === "optimo"}
                    onChange={() => setStockStatusFilter("optimo")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="stockOptimal" className="ml-2 block text-sm text-slate-700">
                    Stock óptimo
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ordenar por</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name_asc">Nombre (A-Z)</option>
                <option value="name_desc">Nombre (Z-A)</option>
                <option value="stock_asc">Stock (Menor a Mayor)</option>
                <option value="stock_desc">Stock (Mayor a Menor)</option>
                <option value="price_asc">Precio (Menor a Mayor)</option>
                <option value="price_desc">Precio (Mayor a Menor)</option>
                <option value="updated_desc">Última actualización (Más reciente)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-6 pt-5 flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Reiniciar Filtros
            </button>
            <button
              onClick={() => applyFilters({
                categoria: categoriaFilter,
                stockStatus: stockStatusFilter,
                sortOrder: sortOrder
              })}
              className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );



  const handleExportExcel = (data, filename) => {
    try {
      console.log("Exportando datos:", data);

      // Verify data exists and is an array
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("No data to export or invalid data format:", data);
        showError('No hay datos para exportar o el formato es inválido');
        return false;
      }

      // Preparar los datos según el tipo de archivo
      let exportData = [];

      // Si son productos
      if (filename.includes('productos')) {
        // Crear encabezados - asegurando que incluya los campos faltantes
        exportData.push([
          'ID',
          'Nombre',
          'SKU',
          'Categoría',
          'Precio',
          'Costo',
          'Stock',
          'Stock Mínimo',
          'Valor Total',
          'Estado Stock',
          'Última Actualización',
        ]);

        // Añadir datos
        data.forEach(item => {
          if (!item) {
            console.warn("Item undefined, skipping");
            return; // Skip this iteration
          }

          // Asegurarnos de que podemos acceder a los campos faltantes bajo cualquier nombre posible
          const fechaCreacion = item.fechacreacion || item.fecha_creacion || item.createdAt || '';
          const proveedor = item.proveedor || item.supplier || '';
          const ubicacion = item.ubicacion || item.location || '';

          // Formatear la fecha de creación
          let fechaCreacionFormateada = formatearFecha(fechaCreacion);

          // Formatear la fecha de última actualización
          let fechaActualizacionFormateada = formatearFecha(item.lastUpdated || item.ultima_actualizacion || '');

          // Calcular valor total del inventario para este producto
          const valorTotal = (item.stock || 0) * (item.precio || item.price || 0);

          // Determinar el estado del stock
          let estadoStock = determinarEstadoStock(item);

          // Imprimir para debugging
          console.log("Procesando item:", {
            id: item.id,
            nombre: item.nombre || item.name,
            fechaCreacion: fechaCreacion,
            fechaCreacionFormateada: fechaCreacionFormateada,
            proveedor: proveedor,
            ubicacion: ubicacion
          });

          exportData.push([
            item.id,
            item.nombre || item.name || '',
            item.sku || '',
            item.categoria || item.category || '',
            item.precio || item.price || 0,
            item.costo || item.cost || 0,
            item.stock || 0,
            item.stock_minimo || item.minStock || 0,
            valorTotal.toFixed(2),
            estadoStock,
            fechaActualizacionFormateada,
          ]);
        });

        // Debugging para verificar los datos completos
        console.log("Datos preparados para exportación:", exportData);
      }
      // Si son categorías
      else if (filename.includes('categorias')) {
        // Verificar que categorias existe y es un array
        if (!categorias || !Array.isArray(categorias)) {
          console.warn("No hay categorías para exportar o formato inválido");
          showError('No hay categorías para exportar');
          return false;
        }

        // Crear encabezados
        exportData.push(['ID', 'Nombre']);

        // Añadir datos
        categorias.forEach(cat => {
          if (!cat) return; // Skip undefined items
          exportData.push([
            cat.id_categoria || cat.id || '',
            cat.nombre_categoria || cat.nombre || ''
          ]);
        });
      }
      // Si son movimientos o historial
      else if (filename.includes('movimientos') || filename.includes('historial')) {
        // Verificar que los movimientos existen
        if (!movimientos || !Array.isArray(movimientos)) {
          console.warn("No hay movimientos para exportar o formato inválido");
          showError('No hay movimientos para exportar');
          return false;
        }

        // Crear encabezados para movimientos
        exportData.push([
          'ID',
          'Fecha',
          'Producto',
          'Tipo',
          'Cantidad',
          'Usuario',
          'Notas'
        ]);

        // Añadir datos
        movimientos.forEach(mov => {
          if (!mov) return; // Skip undefined items
          exportData.push([
            mov.id || '',
            mov.date || mov.fecha || '',
            mov.product || mov.producto || '',
            mov.type || mov.tipo || '',
            mov.quantity || mov.cantidad || 0,
            mov.user || mov.usuario || '',
            mov.notes || mov.notas || ''
          ]);
        });
      }
      // Por defecto (algún otro tipo de datos)
      else {
        // Si no reconocemos el tipo de archivo, intentar exportar de forma genérica
        console.warn("Tipo de archivo no reconocido:", filename);

        // Verificar si data[0] existe antes de intentar acceder a sus propiedades
        if (!data[0]) {
          console.warn("No hay datos para exportar o la estructura es inválida");
          showError('No hay datos para exportar');
          return false;
        }

        // Obtener las cabeceras a partir de las propiedades del primer elemento
        const headers = Object.keys(data[0]);
        exportData.push(headers);

        // Añadir filas de datos
        data.forEach(item => {
          if (!item) return; // Skip undefined items
          const row = headers.map(header => item[header] || '');
          exportData.push(row);
        });
      }

      // Si no hay datos para exportar después de procesar
      if (exportData.length <= 1) {
        console.warn("No se generaron datos para exportar");
        showError('No hay datos para exportar');
        return false;
      }

      // Crear una hoja de trabajo
      const ws = XLSX.utils.aoa_to_sheet(exportData);

      // Aplicar estilos a las celdas
      const numColumns = exportData[0].length;
      const colWidths = Array(numColumns).fill().map((_, i) => {
        // Asegurar anchos adecuados para todos los campos
        switch (i) {
          case 0: return { wch: 8 };     // ID
          case 1: return { wch: 30 };    // Nombre
          case 2: return { wch: 15 };    // SKU
          case 3: return { wch: 20 };    // Categoría
          case 4: return { wch: 12 };    // Precio
          case 5: return { wch: 12 };    // Costo
          case 6: return { wch: 10 };    // Stock
          case 7: return { wch: 15 };    // Stock Mínimo
          case 8: return { wch: 15 };    // Valor Total
          case 9: return { wch: 15 };    // Estado Stock
          case 10: return { wch: 20 };   // Última Actualización
          default: return { wch: 15 };   // Otras columnas
        }
      });

      ws['!cols'] = colWidths;

      // Crear un libro de trabajo y añadir la hoja
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');

      // Escribir el archivo y descargarlo
      XLSX.writeFile(wb, `${filename}.xlsx`);

      showSuccess(`Archivo ${filename}.xlsx exportado correctamente`);
      console.log(`Archivo ${filename}.xlsx exportado correctamente`);
      return true;

    } catch (error) {
      console.error('Error al exportar datos a Excel:', error);
      showError('Error al exportar datos a Excel. Intente de nuevo.');
      return false;
    }
  };
  // Función auxiliar para formatear fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';

    try {
      // Si la fecha es en formato ISO o yyyy-mm-dd
      if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
        const partes = fechaStr.split('T')[0].split('-');
        if (partes.length === 3) {
          // Convertir de YYYY-MM-DD a DD/MM/YYYY
          return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
      }

      // Intentar crear un objeto Date
      const fecha = new Date(fechaStr);
      if (!isNaN(fecha.getTime())) {
        return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
      }

      // Si no se puede parsear, devolver el string original
      return fechaStr;
    } catch (e) {
      console.warn('Error al formatear fecha:', e);
      return fechaStr;
    }
  };

  // Función para determinar el estado del stock
  const determinarEstadoStock = (item) => {
    // Obtener el stock actual y mínimo considerando diferentes nombres de propiedades
    const stockActual = item.stock_actual !== undefined ? item.stock_actual :
      (item.stock !== undefined ? item.stock : 0);

    const stockMinimo = item.stock_minimo !== undefined ? item.stock_minimo :
      (item.stockMinimo !== undefined ? item.stockMinimo :
        (item.minStock !== undefined ? item.minStock : 0));

    // Si ya viene un estado definido, usarlo
    if (item.stockStatus === 'sin_stock') return 'Sin stock';
    if (item.stockStatus === 'bajo') return 'Bajo';
    if (item.stockStatus === 'optimo') return 'Óptimo';
    if (item.estado_stock) return item.estado_stock;

    // Si no hay estado definido, calcularlo
    if (stockActual <= 0) return 'Sin stock';
    if (stockActual < stockMinimo) return 'Bajo';
    if (stockActual >= stockMinimo * 2) return 'Óptimo';
    return 'Normal';
  };

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
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'stock'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Package size={18} />
            <span>Inventario actual</span>
          </button>
          <button
            onClick={() => setActiveTab('entradas')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'entradas'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <PackagePlus size={18} />
            <span>Entradas</span>
          </button>
          <button
            onClick={() => setActiveTab('salidas')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'salidas'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <PackageMinus size={18} />
            <span>Salidas</span>
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`py-4 px-6 flex items-center space-x-2 text-sm font-medium ${activeTab === 'historial'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <History size={18} />
            <span>Historial</span>
          </button>
        </nav>
      </div>

      {/* Barra de acciones con filtros integrados */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex flex-wrap gap-2">
          

         
            {activeTab === 'stock' && (
              <button
                key="export-products-button"
                onClick={() => handleExportExcel(productos, 'inventario_productos')}
                disabled={exportingData}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 flex items-center"
              >
                {exportingData ? (
                  <Loader2 size={16} className="mr-1 animate-spin" />
                ) : (
                  <Download size={16} className="mr-1" />
                )}
                Exportar
              </button>
            )}

            {activeTab === 'historial' && (
              <button
                key="export-history-button"
                onClick={() => handleExportExcel(movimientos, 'historial_movimientos')}
                disabled={exportingData}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 flex items-center"
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
                      {movement.notes}
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
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">

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


    </div>
  );
};

export default InventarioModule;