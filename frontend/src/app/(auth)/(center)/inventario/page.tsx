'use client'

import React, { useState } from 'react';
import { 
  Package, 
  PackagePlus, 
  PackageMinus, 
  History, 
  BarChart2, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  X, 
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2
} from 'lucide-react';

// Datos de ejemplo para el inventario
const inventoryData = [
  { id: 1, sku: 'PROD001', name: 'Camiseta Básica', category: 'Ropa', stock: 120, minStock: 20, price: 19.99, lastUpdated: '2025-02-28' },
  { id: 2, sku: 'PROD002', name: 'Pantalón Vaquero', category: 'Ropa', stock: 85, minStock: 15, price: 39.99, lastUpdated: '2025-02-27' },
  { id: 3, sku: 'PROD003', name: 'Zapatillas Deportivas', category: 'Calzado', stock: 45, minStock: 10, price: 59.99, lastUpdated: '2025-02-25' },
  { id: 4, sku: 'PROD004', name: 'Reloj Analógico', category: 'Accesorios', stock: 30, minStock: 5, price: 79.99, lastUpdated: '2025-02-20' },
  { id: 5, sku: 'PROD005', name: 'Gorra Logo', category: 'Accesorios', stock: 8, minStock: 10, price: 14.99, lastUpdated: '2025-02-15' },
];

// Datos de ejemplo para el historial de movimientos
const movementHistory = [
  { id: 1, date: '2025-02-28', product: 'Camiseta Básica', type: 'entrada', quantity: 50, user: 'Carlos Vega' },
  { id: 2, date: '2025-02-27', product: 'Pantalón Vaquero', type: 'entrada', quantity: 25, user: 'María López' },
  { id: 3, date: '2025-02-26', product: 'Camiseta Básica', type: 'salida', quantity: 10, user: 'Juan Pérez' },
  { id: 4, date: '2025-02-25', product: 'Zapatillas Deportivas', type: 'entrada', quantity: 15, user: 'Carlos Vega' },
  { id: 5, date: '2025-02-24', product: 'Gorra Logo', type: 'salida', quantity: 5, user: 'Ana Gómez' },
];

const InventarioModule = () => {
  const [activeTab, setActiveTab] = useState('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showNewMovementModal, setShowNewMovementModal] = useState(false);
  const [movementType, setMovementType] = useState('');
  
  // Filtrado de productos según término de búsqueda
  const filteredProducts = inventoryData.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filtrado de movimientos según término de búsqueda
  const filteredMovements = movementHistory.filter(movement =>
    movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderiza el indicador de stock según el nivel
  const renderStockIndicator = (stock, minStock) => {
    if (stock <= 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Sin stock</span>;
    } else if (stock < minStock) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">Bajo</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Óptimo</span>;
    }
  };

  // Modal para nueva entrada o salida
  const MovementModal = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {movementType === 'entrada' ? 'Registrar entrada de producto' : 'Registrar salida de producto'}
          </h3>
          <button
            onClick={() => setShowNewMovementModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              {inventoryData.map(product => (
                <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            ></textarea>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={() => setShowNewMovementModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            {movementType === 'entrada' ? 'Registrar entrada' : 'Registrar salida'}
          </button>
        </div>
      </div>
    </div>
  );

  // Modal para nuevo producto
  const NewProductModal = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Añadir nuevo producto</h3>
          <button
            onClick={() => setShowNewProductModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="Ropa">Ropa</option>
                <option value="Calzado">Calzado</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock inicial</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock mínimo</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            ></textarea>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={() => setShowNewProductModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Guardar producto
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabecera del módulo */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administra los productos, registra entradas y salidas, y visualiza el stock en tiempo real
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex space-x-3 w-full sm:w-auto justify-end">
          {activeTab === 'stock' && (
            <>
              <button
                onClick={() => setShowNewProductModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Nuevo producto
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center">
                <Filter size={16} className="mr-1" />
                Filtrar
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center">
                <Download size={16} className="mr-1" />
                Exportar
              </button>
            </>
          )}
          {activeTab === 'entradas' && (
            <button
              onClick={() => {
                setMovementType('entrada');
                setShowNewMovementModal(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Nueva entrada
            </button>
          )}
          {activeTab === 'salidas' && (
            <button
              onClick={() => {
                setMovementType('salida');
                setShowNewMovementModal(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Nueva salida
            </button>
          )}
          {activeTab === 'historial' && (
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center">
              <Download size={16} className="mr-1" />
              Exportar historial
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal según la tab activa */}
      {activeTab === 'stock' && (
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{product.stock}</span>
                        {renderStockIndicator(product.stock, product.minStock)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
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

      {activeTab === 'historial' && (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movement.type === 'entrada' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Entrada
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                          Salida
                        </span>
                      )}
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
          {filteredMovements.length === 0 && (
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

      {/* Vista simplificada para las entradas/salidas - Muestra las últimas entradas o salidas */}
      {(activeTab === 'entradas' || activeTab === 'salidas') && (
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
                {filteredMovements
                  .filter(m => m.type === (activeTab === 'entradas' ? 'entrada' : 'salida'))
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
          {filteredMovements.filter(m => m.type === (activeTab === 'entradas' ? 'entrada' : 'salida')).length === 0 && (
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
      
      {/* Modales */}
      {showNewProductModal && <NewProductModal />}
      {showNewMovementModal && <MovementModal />}
      
      {/* Resumen de información de inventario en tarjetas informativas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de productos</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{inventoryData.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-green-600 flex items-center">
              <ChevronUp size={14} className="mr-1" />
              +4.3% con respecto al mes anterior
            </span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor del inventario</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {inventoryData.reduce((total, product) => total + (product.price * product.stock), 0).toFixed(2)}€
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <BarChart2 size={24} className="text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-green-600 flex items-center">
              <ChevronUp size={14} className="mr-1" />
              +8.1% con respecto al mes anterior
            </span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Productos con bajo stock</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {inventoryData.filter(p => p.stock < p.minStock).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <PackageMinus size={24} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-red-600 flex items-center">
              <ChevronDown size={14} className="mr-1" />
              Requiere atención inmediata
            </span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Movimientos este mes</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{movementHistory.length}</p>
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
    </div>
  );
};

export default InventarioModule;