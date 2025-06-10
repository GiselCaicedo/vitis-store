'use client'
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Filter, Download, ChevronDown, ShoppingBag, Clock, FileText, Info, X } from 'lucide-react';
import {
  getVentas,
  getVentaDetalle,
  createVenta,
  updateVentaEstado,
  getVentasStats,
  getHistorialVentas,
  getClientes,
  getProductosParaVenta
} from '@src/service/conexion';
import * as XLSX from 'xlsx';

const SalesModule = () => {
  const [activeTab, setActiveTab] = useState('registro');
  const [showModal, setShowModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para las ventas
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Estados para el historial
  const [summaryData, setSummaryData] = useState({
    totalVentas: 0,
    numeroTransacciones: 0,
    promedioVenta: 0
  });

  // Estados para la creación de ventas
  const [clientesList, setClientesList] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de crédito');
  const [notes, setNotes] = useState('');
  const [currentProduct, setCurrentProduct] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(1);

  // Función para cargar las ventas
  const fetchSales = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        searchTerm,
        estado: statusFilter !== 'Todos' ? statusFilter : null,
        fechaInicio: startDateFilter || null,
        fechaFin: endDateFilter || null
      };

      const data = await getVentas(params);
      setSales(data.ventas);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modificación del handleExportExcel para exportar datos de ventas
  const handleExportExcel = () => {
    // Verificar si hay ventas para exportar
    if (sales.length === 0) {
      alert('No hay ventas para exportar');
      return;
    }

    try {
      // Preparar los datos para exportación
      let exportData = [];

      // Crear encabezados para ventas
      exportData.push([
        'ID',
        'Fecha',
        'Cliente',
        'Total',
        'Items',
        'Método de Pago',
        'Notas'
      ]);

      // Añadir datos de ventas
      sales.forEach(sale => {
        if (!sale) return; // Omitir esta iteración si la venta es undefined

        exportData.push([
          sale.id,
          sale.date,
          sale.customer,
          parseFloat(sale.total).toFixed(2),
          sale.items,
          getStatusText(sale.status),
          sale.paymentMethod || '',
          sale.notes || ''
        ]);
      });

      // Crear una hoja de trabajo
      const ws = XLSX.utils.aoa_to_sheet(exportData);

      // Aplicar estilos a las celdas (anchos de columna)
      const colWidths = [
        { wch: 8 },     // ID
        { wch: 15 },    // Fecha
        { wch: 30 },    // Cliente
        { wch: 12 },    // Total
        { wch: 10 },    // Items
        { wch: 20 },    // Método de Pago
        { wch: 30 }     // Notas
      ];

      ws['!cols'] = colWidths;

      // Crear un libro de trabajo y añadir la hoja
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

      // Escribir el archivo y descargarlo
      const filename = 'ventas_' + new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `${filename}.xlsx`);

      alert(`Archivo ${filename}.xlsx exportado correctamente`);
      return true;

    } catch (error) {
      console.error('Error al exportar datos a Excel:', error);
      alert('Error al exportar datos a Excel. Intente de nuevo.');
      return false;
    }
  };


  // Función para exportar las ventas actuales
  const exportCurrentSales = () => {
    if (sales.length === 0) {
      alert('No hay ventas para exportar');
      return;
    }

    // Llamar a la función de exportación con los datos y nombre de archivo
    handleExportExcel(sales, 'ventas_actuales');
  };

  // Función para exportar todas las ventas (requiere obtener todos los datos)
 

  // Función para exportar el historial de ventas
  const exportSalesHistory = async () => {
    setLoading(true);
    try {
      const params = {
        fechaInicio: startDateFilter || null,
        fechaFin: endDateFilter || null
      };

      const data = await getHistorialVentas(params);

      if (!data || !data.historial || data.historial.length === 0) {
        alert('No hay datos de historial para exportar');
        return;
      }

      // Exportamos el historial
      handleExportExcel(data.historial, 'historial_ventas');
    } catch (error) {
      console.error('Error al obtener historial para exportar:', error);
      alert('Error al obtener datos del historial para exportar. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar ventas al montar el componente y cuando cambian los filtros
  useEffect(() => {
    fetchSales(pagination.page);
  }, [searchTerm, statusFilter, startDateFilter, endDateFilter, pagination.page]);

  // Función para cargar detalles de una venta
  const fetchSaleDetails = async (id) => {
    setLoading(true);
    try {
      const data = await getVentaDetalle(id);
      setSelectedSale(data);
    } catch (error) {
      console.error(`Error al cargar detalles de la venta ${id}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar datos del historial
  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const params = {
        fechaInicio: startDateFilter || null,
        fechaFin: endDateFilter || null
      };

      const data = await getHistorialVentas(params);
      setSummaryData(data.resumen);
    } catch (error) {
      console.error('Error al cargar historial de ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial cuando cambia la pestaña a "historial"
  useEffect(() => {
    if (activeTab === 'historial') {
      fetchHistoricalData();
    }
  }, [activeTab, startDateFilter, endDateFilter]);

  // Función para cargar clientes y productos al abrir el modal de nueva venta
  const loadNewSaleData = async () => {
    setLoading(true);
    try {
      // Cargar clientes
      const clientesData = await getClientes();
      setClientesList(clientesData);

      // Cargar productos
      const productosData = await getProductosParaVenta();
      setProductosList(productosData);

      // Reiniciar formulario
      setSelectedClient('');
      setSaleDate(new Date().toISOString().split('T')[0]);
      setSelectedProducts([]);
      setPaymentMethod('Tarjeta de crédito');
      setNotes('');
    } catch (error) {
      console.error('Error al cargar datos para nueva venta:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar producto a la venta
  const addProduct = () => {
    if (!currentProduct) {
      alert('Seleccione un producto');
      return;
    }

    const product = productosList.find(p => p.id.toString() === currentProduct);
    if (!product) return;

    const quantity = parseInt(currentQuantity) || 1;
    if (quantity <= 0 || quantity > product.stock) {
      alert(`La cantidad debe estar entre 1 y ${product.stock}`);
      return;
    }

    // Verificar si el producto ya está en la lista
    const existingProductIndex = selectedProducts.findIndex(p => p.id === product.id);

    if (existingProductIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedProducts = [...selectedProducts];
      const newQuantity = updatedProducts[existingProductIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        alert(`No hay suficiente stock. Máximo disponible: ${product.stock}`);
        return;
      }

      updatedProducts[existingProductIndex].quantity = newQuantity;
      updatedProducts[existingProductIndex].total = newQuantity * product.precio;
      setSelectedProducts(updatedProducts);
    } else {
      // Agregar nuevo producto
      setSelectedProducts([...selectedProducts, {
        id: product.id,
        name: product.nombre,
        price: product.precio,
        quantity: quantity,
        total: quantity * product.precio
      }]);
    }

    // Reiniciar selección
    setCurrentProduct('');
    setCurrentQuantity(1);
  };

  // Función para eliminar producto de la venta
  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  // Función para calcular totales de la venta
  // Función para calcular totales de la venta
  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, product) => sum + product.total, 0);
    const total = subtotal; // Remove tax calculation

    return {
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2)
    };
  };
  // Función para crear una nueva venta
  const createNewSale = async () => {
    if (!selectedClient) {
      alert('Debe seleccionar un cliente');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    setLoading(true);
    try {
      const ventaData = {
        usuarioId: selectedClient,
        productos: selectedProducts.map(p => ({
          productoId: p.id,
          cantidad: p.quantity,
          precio: p.price
        })),
        metodoPago: paymentMethod,
        notas: notes
      };

      const response = await createVenta(ventaData);

      alert(`Venta creada con éxito! ID: ${response.ventaId}`);
      setShowModal(false);
      fetchSales(1); // Recargar lista de ventas
    } catch (error) {
      console.error('Error al crear venta:', error);
      alert(`Error al crear venta: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado de una venta
  

  // Función para obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener texto según estado
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  // Renderizado condicional según pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'registro':
        return (
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative flex-1 w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Buscar ventas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>

                <button
                  onClick={(e) => { handleExportExcel() }}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>

                <button
                  onClick={() => {
                    loadNewSaleData();
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  <PlusCircle className="w-4 h-4" />
                  Nueva Venta
                </button>
              </div>
            </div>

            {filterOpen && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Filtros</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de fin</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                    />
                  </div>
                 
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('Todos');
                      setStartDateFilter('');
                      setEndDateFilter('');
                    }}
                  >
                    Limpiar
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      setPagination({ ...pagination, page: 1 });
                      fetchSales(1);
                      setFilterOpen(false);
                    }}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500">Cargando ventas...</p>
                  </div>
                </div>
              ) : (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sales.length > 0 ? (
                        sales.map(sale => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{sale.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sale.customer}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${parseFloat(sale.total).toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.items}</td>
                           
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => {
                                  fetchSaleDetails(sale.id);
                                  setActiveTab('detalles');
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Ver detalles
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                            No se encontraron ventas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Mostrando {sales.length} de {pagination.total} ventas
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page <= 1}
                      >
                        Anterior
                      </button>

                      {/* Mostrar hasta 3 páginas */}
                      {Array.from({ length: Math.min(3, pagination.pages) }, (_, i) => {
                        // Si estamos en las primeras páginas
                        let pageNumber;
                        if (pagination.page <= 2) {
                          pageNumber = i + 1;
                        }
                        // Si estamos cerca del final
                        else if (pagination.page >= pagination.pages - 1) {
                          pageNumber = pagination.pages - 2 + i;
                        }
                        // Si estamos en el medio
                        else {
                          pageNumber = pagination.page - 1 + i;
                        }

                        // Solo mostrar si es una página válida
                        if (pageNumber > 0 && pageNumber <= pagination.pages) {
                          return (
                            <button
                              key={pageNumber}
                              className={`px-3 py-1 border ${pageNumber === pagination.page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300'
                                } rounded text-sm`}
                              onClick={() => setPagination({ ...pagination, page: pageNumber })}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        return null;
                      })}

                      <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page >= pagination.pages}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'historial':
        return (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900">Historial de Ventas</h3>
            <p className="text-sm text-gray-500 mb-4">Visualización del historial completo de ventas.</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Fecha de fin</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                />
              </div>
              <div className="self-end">
                <button
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={fetchHistoricalData}
                  disabled={loading}
                >
                  Buscar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Cargando datos del historial...</p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resumen de ventas:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total de ventas</p>
                    <p className="text-2xl font-semibold">${parseFloat(summaryData.totalVentas).toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Número de transacciones</p>
                    <p className="text-2xl font-semibold">{summaryData.numeroTransacciones}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Promedio por venta</p>
                    <p className="text-2xl font-semibold">${parseFloat(summaryData.promedioVenta).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-2">El historial detallado se encuentra en la pestaña "Registro de ventas".</p>
          </div>
        );

      case 'detalles':
        return (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detalles de Venta</h3>
              <p className="text-sm text-gray-500">
                {selectedSale ? `Venta #${selectedSale.id}` : 'Seleccione una venta para ver sus detalles'}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Cargando detalles...</p>
                </div>
              </div>
            ) : selectedSale ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Información de la venta */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Información de la venta</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Número de venta</p>
                          <p className="text-sm font-medium">{selectedSale.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Fecha</p>
                          <p className="text-sm">{selectedSale.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Estado</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(selectedSale.status)}`}>
                            {getStatusText(selectedSale.status)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Método de pago</p>
                          <p className="text-sm">{selectedSale.paymentMethod}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Notas</p>
                          <p className="text-sm">{selectedSale.notes || 'Sin notas adicionales'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del cliente */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Información del cliente</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="mb-3">
                        <p className="text-xs text-gray-500">Nombre</p>
                        <p className="text-sm font-medium">{selectedSale.customer}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm">{selectedSale.email}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-gray-500">Teléfono</p>
                        <p className="text-sm">{selectedSale.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dirección</p>
                        <p className="text-sm">{selectedSale.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Productos</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedSale.products.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${parseFloat(product.price).toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${parseFloat(product.total).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resumen financiero */}
                <div className="flex justify-end">
                  <div className="w-full max-w-xs">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Subtotal:</span>
                        <span className="text-sm">${parseFloat(selectedSale.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Impuesto (16%):</span>
                        <span className="text-sm">${parseFloat(selectedSale.tax).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span>${parseFloat(selectedSale.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="text-center p-6">
                  <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No hay detalles para mostrar</h3>
                  <p className="text-sm text-gray-500">Seleccione una venta de la tabla para ver sus detalles</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Modal de nueva venta
  const renderNewSaleModal = () => {
    const totals = calculateTotals();

    return showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-full overflow-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Nueva Venta</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">Seleccionar cliente</option>
                  {clientesList.map(client => (
                    <option key={client.id_usuario} value={client.id_usuario}>
                      {client.nombre_usuario}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Productos</h4>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="relative flex-grow">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={currentProduct}
                    onChange={(e) => setCurrentProduct(e.target.value)}
                  >
                    <option value="">Seleccionar producto</option>
                    {productosList.map(product => (
                      <option key={product.id} value={product.id.toString()}>
                        {product.nombre} - ${product.precio.toFixed(2)} (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                />

                <button
                  className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center"
                  onClick={addProduct}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-800">{product.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 text-right">${parseFloat(product.price).toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 text-right">{product.quantity}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">${parseFloat(product.total).toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeProduct(product.id)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-2 text-center text-sm text-gray-500">
                        No hay productos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="text-sm">${totals.subtotal}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span>${totals.total}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Método de pago</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                  <option value="Tarjeta de débito">Tarjeta de débito</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia bancaria">Transferencia bancaria</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                rows="2"
                placeholder="Añadir notas a esta venta (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={createNewSale}
              disabled={loading || selectedProducts.length === 0 || !selectedClient}
            >
              {loading ? 'Procesando...' : 'Registrar Venta'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Módulo de Ventas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión y seguimiento de todas las ventas</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('registro')}
              className={`px-6 py-4 text-sm font-medium inline-flex items-center ${activeTab === 'registro'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Registro de ventas
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-6 py-4 text-sm font-medium inline-flex items-center ${activeTab === 'historial'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Historial de ventas
            </button>

          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal de Nueva Venta */}
      {renderNewSaleModal()}
    </div>
  );
};

export default SalesModule;