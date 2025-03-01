'use client'
import React, { useState } from 'react';
import { Search, PlusCircle, Filter, Download, ChevronDown, ShoppingBag, Clock, FileText, Info, X } from 'lucide-react';

const SalesModule = () => {
  const [activeTab, setActiveTab] = useState('registro');
  const [showModal, setShowModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  
  // Sample sales data with detailed information
  const sales = [
    { 
      id: 'VT-001', 
      date: '01/03/2025', 
      customer: 'María López', 
      email: 'maria.lopez@example.com',
      phone: '+34 612 345 678',
      address: 'Calle Principal 123, Madrid',
      total: 125.50, 
      subtotal: 105.46,
      tax: 20.04,
      items: 3, 
      status: 'completed',
      paymentMethod: 'Tarjeta de crédito',
      notes: 'Entrega en horario de tarde',
      products: [
        { name: 'Camiseta Básica', price: 25.99, quantity: 2, total: 51.98 },
        { name: 'Pantalón Casual', price: 53.48, quantity: 1, total: 53.48 }
      ] 
    },
    { 
      id: 'VT-002', 
      date: '28/02/2025', 
      customer: 'Juan Pérez', 
      email: 'juan.perez@example.com',
      phone: '+34 623 456 789',
      address: 'Avenida Secundaria 45, Barcelona',
      total: 78.90, 
      subtotal: 66.30,
      tax: 12.60,
      items: 2, 
      status: 'completed',
      paymentMethod: 'PayPal',
      notes: '',
      products: [
        { name: 'Zapatillas Deportivas', price: 65.50, quantity: 1, total: 65.50 },
        { name: 'Calcetines Pack 3', price: 4.47, quantity: 3, total: 13.40 }
      ]
    },
    { 
      id: 'VT-003', 
      date: '27/02/2025', 
      customer: 'Ana García', 
      email: 'ana.garcia@example.com',
      phone: '+34 634 567 890',
      address: 'Plaza Mayor 8, Valencia',
      total: 245.00, 
      subtotal: 206.72,
      tax: 38.28,
      items: 5, 
      status: 'pending',
      paymentMethod: 'Transferencia bancaria',
      notes: 'Pendiente de confirmación de pago',
      products: [
        { name: 'Chaqueta de Invierno', price: 89.99, quantity: 1, total: 89.99 },
        { name: 'Bufanda de Lana', price: 19.50, quantity: 2, total: 39.00 },
        { name: 'Guantes Táctiles', price: 15.75, quantity: 1, total: 15.75 },
        { name: 'Gorro de Punto', price: 12.99, quantity: 1, total: 12.99 },
        { name: 'Botas de Nieve', price: 86.99, quantity: 1, total: 86.99 }
      ]
    },
    { 
      id: 'VT-004', 
      date: '25/02/2025', 
      customer: 'Carlos Rodríguez', 
      email: 'carlos.rodriguez@example.com',
      phone: '+34 645 678 901',
      address: 'Calle Comercial 56, Sevilla',
      total: 56.75, 
      subtotal: 47.69,
      tax: 9.06,
      items: 1, 
      status: 'completed',
      paymentMethod: 'Efectivo',
      notes: 'Recogida en tienda',
      products: [
        { name: 'Camisa Formal', price: 47.69, quantity: 1, total: 47.69 }
      ]
    },
    { 
      id: 'VT-005', 
      date: '24/02/2025', 
      customer: 'Laura Martínez', 
      email: 'laura.martinez@example.com',
      phone: '+34 656 789 012',
      address: 'Avenida Principal 78, Málaga',
      total: 187.30, 
      subtotal: 157.65,
      tax: 29.65,
      items: 4, 
      status: 'cancelled',
      paymentMethod: 'Tarjeta de débito',
      notes: 'Cancelado por cliente - Reembolso procesado',
      products: [
        { name: 'Vestido de Fiesta', price: 79.99, quantity: 1, total: 79.99 },
        { name: 'Zapatos de Tacón', price: 54.90, quantity: 1, total: 54.90 },
        { name: 'Collar Elegante', price: 23.50, quantity: 1, total: 23.50 },
        { name: 'Pendientes a Juego', price: 14.45, quantity: 2, total: 28.90 }
      ]
    },
  ];

  // New sale sample data (for the modal)
  const newSaleItems = [
    { id: 1, product: 'Camiseta Básica', price: 25.99, quantity: 2, total: 51.98 },
    { id: 2, product: 'Jeans Slim Fit', price: 45.50, quantity: 1, total: 45.50 }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

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
                
                <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                
                <button 
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                      <option>Todos los períodos</option>
                      <option>Hoy</option>
                      <option>Esta semana</option>
                      <option>Este mes</option>
                      <option>Personalizado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                      <option>Todos los estados</option>
                      <option>Completada</option>
                      <option>Pendiente</option>
                      <option>Cancelada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cliente</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Nombre del cliente" />
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Limpiar</button>
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Aplicar</button>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map(sale => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{sale.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sale.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${sale.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(sale.status)}`}>
                          {getStatusText(sale.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button 
                          onClick={() => {
                            setSelectedSale(sale);
                            setActiveTab('detalles');
                          }} 
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500">Mostrando 5 de 120 ventas</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Anterior</button>
                  <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm">2</button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm">3</button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm">Siguiente</button>
                </div>
              </div>
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
                <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Fecha de fin</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="self-end">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Buscar</button>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Resumen de ventas:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total de ventas</p>
                  <p className="text-2xl font-semibold">$693.45</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Número de transacciones</p>
                  <p className="text-2xl font-semibold">5</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Promedio por venta</p>
                  <p className="text-2xl font-semibold">$138.69</p>
                </div>
              </div>
            </div>
            
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
            
            {selectedSale ? (
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${product.total.toFixed(2)}</td>
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
                        <span className="text-sm">${selectedSale.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Impuesto (16%):</span>
                        <span className="text-sm">${selectedSale.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span>${selectedSale.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="mt-8 flex justify-end gap-3">
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar factura
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm rounded-lg inline-flex items-center ${
                      selectedSale.status === 'completed' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {selectedSale.status === 'completed' ? 'Venta completada' : 'Marcar como completada'}
                  </button>
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
              className={`px-6 py-4 text-sm font-medium inline-flex items-center ${
                activeTab === 'registro'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Registro de ventas
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-6 py-4 text-sm font-medium inline-flex items-center ${
                activeTab === 'historial'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Historial de ventas
            </button>
            <button
              onClick={() => setActiveTab('detalles')}
              className={`px-6 py-4 text-sm font-medium inline-flex items-center ${
                activeTab === 'detalles'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Detalles de ventas
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Nueva Venta Modal */}
      {showModal && (
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
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option>Seleccionar cliente</option>
                    <option>María López</option>
                    <option>Juan Pérez</option>
                    <option>Ana García</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <input type="date" defaultValue="2025-03-01" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Productos</h4>
                  <button className="text-xs text-blue-600 hover:text-blue-800">+ Agregar producto</button>
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
                    {newSaleItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-800">{item.product}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">${item.total.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">
                          <button className="text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Subtotal:</span>
                  <span className="text-sm">$97.48</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Impuesto (16%):</span>
                  <span className="text-sm">$15.60</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>$113.08</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  rows="2"
                  placeholder="Añadir notas a esta venta (opcional)"
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
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Registrar Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesModule;