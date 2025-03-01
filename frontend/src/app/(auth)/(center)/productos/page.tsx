'use client'

import React, { useState } from 'react';
import {
    Package,
    Search,
    Plus,
    Filter,
    Tag,
    Edit,
    Trash2,
    Upload,
    Download,
    ArrowUpDown,
    EyeIcon,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    X,
    Save,
    Image
} from 'lucide-react';

export default function ProductosPage() {
    // Estados para las diferentes secciones y datos
    const [activeTab, setActiveTab] = useState('lista');
    const [showForm, setShowForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    // Datos simulados para las categorías
    const categorias = [
        { id: 1, nombre: 'Electrónica', productos: 48, color: 'bg-blue-500' },
        { id: 2, nombre: 'Ropa', productos: 124, color: 'bg-green-500' },
        { id: 3, nombre: 'Hogar', productos: 76, color: 'bg-purple-500' },
        { id: 4, nombre: 'Deportes', productos: 35, color: 'bg-amber-500' },
        { id: 5, nombre: 'Belleza', productos: 62, color: 'bg-pink-500' },
        { id: 6, nombre: 'Juguetes', productos: 29, color: 'bg-teal-500' },
        { id: 7, nombre: 'Libros', productos: 54, color: 'bg-indigo-500' },
        { id: 8, nombre: 'Alimentos', productos: 42, color: 'bg-red-500' },
    ];

    // Datos simulados para los productos
    const productos = [
        {
            id: 1,
            nombre: 'Smartphone Galaxy S22',
            sku: 'TECH-1001',
            categoria: 'Electrónica',
            precio: 899,
            costo: 650,
            stock: 18,
            descripcion: 'Smartphone de última generación con cámara de alta resolución y 5G.',
            imagen: '/placeholder-product.jpg',
            fechaCreacion: '2023-12-15'
        },
        {
            id: 2,
            nombre: 'Zapatillas Deportivas Air Max',
            sku: 'SHOE-2050',
            categoria: 'Deportes',
            precio: 129,
            costo: 75,
            stock: 25,
            descripcion: 'Zapatillas deportivas con tecnología de amortiguación avanzada.',
            imagen: '/placeholder-product.jpg',
            fechaCreacion: '2024-01-05'
        },
        {
            id: 3,
            nombre: 'Auriculares Bluetooth Pro',
            sku: 'TECH-2342',
            categoria: 'Electrónica',
            precio: 79,
            costo: 45,
            stock: 12,
            descripcion: 'Auriculares inalámbricos con cancelación de ruido y alta fidelidad.',
            imagen: '/placeholder-product.jpg',
            fechaCreacion: '2024-01-20'
        },
        {
            id: 4,
            nombre: 'Camiseta Premium Algodón',
            sku: 'CLOTH-5523',
            categoria: 'Ropa',
            precio: 35,
            costo: 12,
            stock: 45,
            descripcion: 'Camiseta de algodón 100% orgánico con diseño exclusivo.',
            imagen: '/placeholder-product.jpg',
            fechaCreacion: '2024-01-18'
        },
        {
            id: 5,
            nombre: 'Reloj Inteligente Serie 7',
            sku: 'TECH-3256',
            categoria: 'Electrónica',
            precio: 299,
            costo: 190,
            stock: 9,
            descripcion: 'Smartwatch con monitor cardíaco, GPS y resistencia al agua.',
            imagen: '/placeholder-product.jpg',
            fechaCreacion: '2023-11-10'
        },
        {
            id: 6,
            nombre: 'Set de Sartenes Antiadherentes',
            sku: 'HOME-4471',
            categoria: 'Hogar',
            precio: 89,
            costo: 52,
            stock: 22,
            descripcion: 'Juego de 3 sartenes con recubrimiento antiadherente libre de PFOA.',
            imagen: '/placeholder-product.jpg',
            fechaCreacion: '2023-12-28'
        },
    ];

    // Filtrar productos según los criterios
    const filteredProducts = productos.filter(producto => {
        // Filtro por búsqueda
        const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.sku.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por categoría
        const matchesCategory = categoryFilter === '' || producto.categoria === categoryFilter;

        // Filtro por stock
        const matchesStock = stockFilter === '' ||
            (stockFilter === 'low' && producto.stock < 10) ||
            (stockFilter === 'medium' && producto.stock >= 10 && producto.stock < 30) ||
            (stockFilter === 'high' && producto.stock >= 30);

        return matchesSearch && matchesCategory && matchesStock;
    });

    // Función para abrir el formulario de nuevo producto
    const openNewProductForm = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    // Función para abrir el formulario de edición de producto
    const openEditProductForm = (product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    // Función para abrir el formulario de nueva categoría
    const openNewCategoryForm = () => {
        setShowCategoryForm(true);
    };

    // Función para cerrar cualquier formulario
    const closeForm = () => {
        setShowForm(false);
        setShowCategoryForm(false);
    };

    // Tabs para la navegación del módulo
    const tabs = [
        { id: 'lista', label: 'Lista de Productos', icon: <Package className="w-4 h-4" /> },
        { id: 'categorias', label: 'Categorías', icon: <Tag className="w-4 h-4" /> },
        { id: 'stock', label: 'Estado de Stock', icon: <AlertTriangle className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto px-4 py-6">
                {/* Encabezado de la página */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión de Productos</h1>
                        <p className="text-slate-500 mt-1">Administra tu catálogo de productos, categorías y stock</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex space-x-2">
                        <button
                            onClick={openNewProductForm}
                            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </button>

                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                    <div className="flex overflow-x-auto scrollbar-none">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`px-5 py-4 text-sm font-medium border-b-2 flex items-center whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido principal - cambia según el tab activo */}
                {activeTab === 'lista' && (
                    <>
                        {/* Barra de filtros y búsqueda */}
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
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <select
                                        className="pl-3 pr-8 py-2 border border-slate-200 rounded-md text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="pl-3 pr-8 py-2 border border-slate-200 rounded-md text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                    >
                                        <option value="">Todos los niveles de stock</option>
                                        <option value="low">Stock bajo (&lt; 10)</option>
                                        <option value="medium">Stock medio (10-30)</option>
                                        <option value="high">Stock alto (&gt; 30)</option>
                                    </select>

                                    <button className="flex items-center px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-600 bg-white hover:bg-slate-50">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Más filtros
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de productos */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 py-3">Producto</th>
                                            <th className="px-4 py-3">SKU</th>
                                            <th className="px-4 py-3">Categoría</th>
                                            <th className="px-4 py-3 text-right">Precio</th>
                                            <th className="px-4 py-3 text-center">Stock</th>
                                            <th className="px-4 py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                                    No se encontraron productos con los filtros seleccionados.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map((producto) => (
                                                <tr key={producto.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-b-0">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 mr-3 bg-slate-100 rounded-md flex items-center justify-center">
                                                                <Image className="w-5 h-5 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-800">{producto.nombre}</div>
                                                                <div className="text-xs text-slate-500 mt-0.5">
                                                                    Creado: {new Date(producto.fechaCreacion).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">{producto.sku}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {producto.categoria}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium">${producto.precio}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <span className={`text-xs font-semibold py-1 px-2 rounded-full ${producto.stock < 10 ? 'bg-red-100 text-red-800' :
                                                                producto.stock < 30 ? 'bg-amber-100 text-amber-800' :
                                                                    'bg-green-100 text-green-800'
                                                            }`}>
                                                            {producto.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => openEditProductForm(producto)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md">
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {filteredProducts.length > 0 && (
                                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                                    <div className="text-sm text-slate-500">
                                        Mostrando <span className="font-medium">{filteredProducts.length}</span> de <span className="font-medium">{productos.length}</span> productos
                                    </div>
                                    <div className="flex space-x-1">
                                        <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                            Anterior
                                        </button>
                                        <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'categorias' && (
                    <>
                        {/* Sección de categorías */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-slate-800">Categorías de Productos</h2>
                            <button
                                onClick={openNewCategoryForm}
                                className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Categoría
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categorias.map((categoria) => (
                                <div key={categoria.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-md ${categoria.color} text-white flex items-center justify-center`}>
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="font-medium text-slate-800">{categoria.nombre}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{categoria.productos} productos</p>
                                    </div>
                                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
                                        <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center">
                                            Ver productos
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'stock' && (
                    <>
                        {/* Vista de estado de stock */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                                        <AlertTriangle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Stock Bajo</h3>
                                    <p className="text-3xl font-bold text-red-600">
                                        {productos.filter(p => p.stock < 10).length}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">Productos con menos de 10 unidades</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Stock Medio</h3>
                                    <p className="text-3xl font-bold text-amber-600">
                                        {productos.filter(p => p.stock >= 10 && p.stock < 30).length}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">Productos entre 10 y 30 unidades</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Stock Bueno</h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {productos.filter(p => p.stock >= 30).length}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">Productos con más de 30 unidades</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de stock */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-800">Estado detallado de stock</h3>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 flex items-center">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filtrar
                                    </button>
                                    <button className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 flex items-center">
                                        <Download className="w-4 h-4 mr-2" />
                                        Exportar
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 py-3">Producto</th>
                                            <th className="px-4 py-3">SKU</th>
                                            <th className="px-4 py-3 text-center">Stock Actual</th>
                                            <th className="px-4 py-3 text-center">Stock Mínimo</th>
                                            <th className="px-4 py-3 text-center">Estado</th>
                                            <th className="px-4 py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map((producto) => {
                                            // Calcular estado de stock
                                            const stockMinimo = 10; // Ejemplo, en una app real sería personalizado por producto
                                            let stockStatus = 'good';
                                            let statusColor = 'bg-green-100 text-green-800';
                                            let statusText = 'Óptimo';

                                            if (producto.stock < stockMinimo) {
                                                stockStatus = 'low';
                                                statusColor = 'bg-red-100 text-red-800';
                                                statusText = 'Bajo';
                                            } else if (producto.stock < stockMinimo * 3) {
                                                stockStatus = 'medium';
                                                statusColor = 'bg-amber-100 text-amber-800';
                                                statusText = 'Medio';
                                            }

                                            return (
                                                <tr key={producto.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-b-0">
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-slate-800">{producto.nombre}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">{producto.sku}</td>
                                                    <td className="px-4 py-3 text-sm text-center font-medium">{producto.stock}</td>
                                                    <td className="px-4 py-3 text-sm text-center text-slate-600">{stockMinimo}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                                                            Actualizar Stock
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Modal para nuevo producto o edición */}
            {showForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={closeForm}>
                            <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
                        </div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                                </h3>
                                <button
                                    onClick={closeForm}
                                    className="text-slate-400 hover:text-slate-500 focus:outline-none"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="px-6 py-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Nombre del Producto *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ingrese el nombre del producto"
                                            defaultValue={selectedProduct?.nombre || ''}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            SKU *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Código único de producto"
                                            defaultValue={selectedProduct?.sku || ''}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Categoría *
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            defaultValue={selectedProduct?.categoria || ''}
                                        >
                                            <option value="">Seleccionar categoría</option>
                                            {categorias.map(cat => (
                                                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Stock Actual *
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Cantidad disponible"
                                            defaultValue={selectedProduct?.stock || ''}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Precio de Venta ($) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Precio de venta"
                                            defaultValue={selectedProduct?.precio || ''}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Costo ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Costo del producto"
                                            defaultValue={selectedProduct?.costo || ''}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            rows="4"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Descripción detallada del producto"
                                            defaultValue={selectedProduct?.descripcion || ''}
                                        ></textarea>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Imagen del Producto
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <div className="w-24 h-24 border border-slate-200 rounded-md overflow-hidden bg-slate-50 mr-4 flex items-center justify-center">
                                                {selectedProduct?.imagen ? (
                                                    <img
                                                        src="/api/placeholder/100/100"
                                                        alt="Imagen del producto"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Image className="w-8 h-8 text-slate-300" />
                                                )}
                                            </div>
                                            <button className="px-4 py-2 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 flex items-center">
                                                <Upload className="w-4 h-4 mr-2" />
                                                Subir imagen
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-5 flex justify-end space-x-3">
                                    <button
                                        onClick={closeForm}
                                        className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center">
                                        <Save className="w-4 h-4 mr-2" />
                                        {selectedProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para nueva categoría */}
            {showCategoryForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={closeForm}>
                            <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
                        </div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Nueva Categoría
                                </h3>
                                <button
                                    onClick={closeForm}
                                    className="text-slate-400 hover:text-slate-500 focus:outline-none"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="px-6 py-5">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Nombre de la Categoría *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: Electrónica, Ropa, Hogar..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Descripción (opcional)
                                        </label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Descripción de la categoría"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Color de la Categoría
                                        </label>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'].map((color, idx) => (
                                                <button
                                                    key={idx}
                                                    className={`w-8 h-8 rounded-full ${color} hover:ring-2 hover:ring-offset-2 hover:ring-slate-400 focus:outline-none`}
                                                ></button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 mt-6 pt-5 flex justify-end space-x-3">
                                    <button
                                        onClick={closeForm}
                                        className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center">
                                        <Save className="w-4 h-4 mr-2" />
                                        Crear Categoría
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}