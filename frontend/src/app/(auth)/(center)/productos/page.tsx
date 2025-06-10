'use client'

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
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
import { createCategoria, createProducto, deleteProducto, getDashboardData, updateProducto, updateStock, deleteCategoria, updateCategoria } from '@src/service/conexion';
// Importar las funciones de conexion.ts en lugar de axios

export default function ProductosPage() {
    // Estados para las diferentes secciones y datos
    const [activeTab, setActiveTab] = useState('lista');
    const [showForm, setShowForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showCategoryEditForm, setShowCategoryEditForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [filteredCategoryProducts, setFilteredCategoryProducts] = useState([]);
    const [showCategoryProducts, setShowCategoryProducts] = useState(false);
    const searchInputRef = useRef(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Estados para almacenar datos de la API
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [stockResumen, setStockResumen] = useState({ bajo: 0, medio: 0, bueno: 0 });
    const [stockDetalle, setStockDetalle] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await getDashboardData({
                    searchTerm: debouncedSearchTerm,  // Usar el término debounceado aquí
                    categoryFilter,
                    stockFilter
                });
                console.log(data)

                setCategorias(data.categorias);
                setProductos(data.productos);
                setStockResumen(data.stockResumen);
                setStockDetalle(data.stockDetalle);

                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [debouncedSearchTerm, categoryFilter, stockFilter]);


    const filteredProducts = productos.filter(producto => {
        // Filtro por búsqueda
        const matchesSearch =
            (producto.nombre && searchTerm ? producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
            (producto.sku && searchTerm ? producto.sku.toLowerCase().includes(searchTerm.toLowerCase()) : false);

        // Si no hay término de búsqueda, mostrar todos
        const showAll = !searchTerm;

        // Filtro por categoría
        const matchesCategory = categoryFilter === '' || producto.categoria === categoryFilter;

        // Filtro por stock
        const matchesStock = stockFilter === '' ||
            (stockFilter === 'low' && producto.stock < 10) ||
            (stockFilter === 'medium' && producto.stock >= 10 && producto.stock < 30) ||
            (stockFilter === 'high' && producto.stock >= 30);

        return (matchesSearch || showAll) && matchesCategory && matchesStock;
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

    // Función para abrir el formulario de edición de categoría
    const openEditCategoryForm = (category) => {
        setSelectedCategory(category);
        setShowCategoryEditForm(true);
    };

    // Función para cerrar cualquier formulario
    const closeForm = () => {
        setShowForm(false);
        setShowCategoryForm(false);
        setShowCategoryEditForm(false);
        setSelectedCategory(null);
    };

    // Función para mostrar los productos de una categoría
    const handleViewCategoryProducts = (categoryId) => {
        const categoryProducts = productos.filter(producto => producto.id_categoria === categoryId);
        setFilteredCategoryProducts(categoryProducts);
        setShowCategoryProducts(true);
        setActiveTab('categoria-productos');
    };

    // Función para volver a la lista de categorías
    const backToCategories = () => {
        setShowCategoryProducts(false);
        setActiveTab('categorias');
    };

    // Función para guardar un nuevo producto o actualizar uno existente
    const handleSaveProduct = async (productData) => {
        try {
            if (selectedProduct) {
                // Actualizar producto existente usando la función de conexion.ts
                await updateProducto(selectedProduct.id, productData);
            } else {
                // Crear nuevo producto usando la función de conexion.ts
                await createProducto(productData);
            }

            // Recargar datos usando la función de conexion.ts
            const data = await getDashboardData();
            setProductos(data.productos);

            closeForm();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            // Aquí podrías mostrar un mensaje de error
        }
    };

    // Función para eliminar un producto
    const handleDeleteProduct = async (productId) => {
        if (window.confirm('¿Está seguro que desea eliminar este producto?')) {
            try {
                // Eliminar producto usando la función de conexion.ts
                await deleteProducto(productId);

                // Recargar datos usando la función de conexion.ts
                const data = await getDashboardData();
                setProductos(data.productos);
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                // Aquí podrías mostrar un mensaje de error
            }
        }
    };

    // Función para eliminar una categoría
    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('¿Está seguro que desea eliminar esta categoría? Esto podría afectar a los productos asociados.')) {
            try {
                // Eliminar categoría usando la función de conexion.ts
                await deleteCategoria(categoryId);

                // Recargar datos usando la función de conexion.ts
                const data = await getDashboardData();
                setCategorias(data.categorias);
            } catch (error) {
                console.error('Error al eliminar categoría:', error);
                // Aquí podrías mostrar un mensaje de error
            }
        }
    };

    const filteredStockDetails = stockDetalle.filter(producto => {
        // Filtro por búsqueda
        const matchesSearch = !searchTerm || 
            (producto.nombre && producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (producto.sku && producto.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
        // Filtro por nivel de stock
        const matchesStockLevel = stockFilter === '' ||
            (stockFilter === 'low' && producto.stock_actual < 10) ||
            (stockFilter === 'medium' && producto.stock_actual >= 10 && producto.stock_actual < 30) ||
            (stockFilter === 'high' && producto.stock_actual >= 30);
    
        return matchesSearch && matchesStockLevel;
    });

    const handleExportExcel = (data, filename) => {
        try {
            console.log(data)
            // Importar SheetJS si aún no está en tu proyecto
            // npm install xlsx
            // import * as XLSX from 'xlsx';

            // Preparar los datos según el tipo de archivo
            let exportData = [];

            // Si son productos
            if (filename.includes('productos')) {
                // Añadir encabezados como primer elemento
                exportData.push(['ID', 'Nombre', 'SKU', 'Categoría', 'Precio', 'Costo', 'Stock', 'Stock Mínimo', 'Fecha Creación']);

                // Añadir datos
                data.forEach(item => {
                    // Formatear la fecha correctamente (yyyy-mm-dd -> dd/mm/yyyy)
                    let fechaFormateada = '';

                    if (item.fechacreacion) {
                        try {
                            // Las fechas ya están en formato YYYY-MM-DD
                            const partes = item.fechacreacion.split('-');
                            if (partes.length === 3) {
                                // Invertir el orden: de YYYY-MM-DD a DD/MM/YYYY
                                fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                            } else {
                                // Si el formato no es el esperado, intentar con Date
                                const fecha = new Date(item.fechacreacion);
                                if (!isNaN(fecha.getTime())) {
                                    fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
                                }
                            }
                        } catch (e) {
                            console.warn('Error al formatear fecha:', e);
                        }
                    }

                    exportData.push([
                        item.id,
                        item.nombre,
                        item.sku || '',  // Usar string vacío si es null
                        item.categoria,
                        item.precio,
                        item.costo,
                        item.stock,
                        item.stock_minimo,
                        fechaFormateada
                    ]);
                });
            }
            // Si son categorías
            else if (filename.includes('categorias')) {
                // Añadir encabezados
                exportData.push(['ID', 'Nombre', 'Productos']);

                // Añadir datos
                data.forEach(item => {
                    exportData.push([
                        item.id,
                        item.nombre,
                        item.productos || 0
                    ]);
                });
            }
            // Si es stock
            else if (filename.includes('stock')) {
                // Añadir encabezados
                exportData.push(['ID', 'Nombre', 'SKU', 'Stock Actual', 'Stock Mínimo', 'Estado']);

                // Añadir datos
                data.forEach(item => {
                    // Determinar el estado del stock
                    let estadoStock = '';
                    // Verificar qué propiedad existe en el objeto para el stock actual
                    const stockActual = item.stock_actual !== undefined ? item.stock_actual : item.stock;
                    const stockMinimo = item.stock_minimo !== undefined ? item.stock_minimo :
                        (item.stockMinimo !== undefined ? item.stockMinimo : 0);

                    if (stockActual < stockMinimo) {
                        estadoStock = 'Bajo';
                    } else if (stockActual >= stockMinimo * 2) {
                        estadoStock = 'Óptimo';
                    } else {
                        estadoStock = 'Normal';
                    }

                    // Imprimir objeto para depuración
                    console.log('Item de stock:', item);

                    exportData.push([
                        item.id,
                        item.nombre,
                        item.sku || '',
                        stockActual,  // Usar la propiedad correcta según exista
                        stockMinimo,  // Usar la propiedad correcta según exista
                        estadoStock
                    ]);
                });
            }

            // Crear una hoja de trabajo
            const ws = XLSX.utils.aoa_to_sheet(exportData);

            // Aplicar estilos a las celdas (opcional)
            // Por ejemplo, podemos ajustar el ancho de las columnas
            const colWidths = [
                { wch: 8 },   // ID
                { wch: 30 },  // Nombre
                { wch: 15 },  // SKU/Productos 
                { wch: 20 },  // Categoría/Stock Actual
                { wch: 15 },  // Precio/Stock Mínimo
                { wch: 15 },  // Costo/Estado
                { wch: 10 },  // Stock
                { wch: 15 },  // Stock Mínimo
                { wch: 15 }   // Fecha Creación
            ];
            ws['!cols'] = colWidths.slice(0, exportData[0].length);

            // Crear un libro de trabajo y añadir la hoja
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Datos');

            // Escribir el archivo y descargarlo
            XLSX.writeFile(wb, `${filename}.xlsx`);

            console.log(`Archivo ${filename}.xlsx exportado correctamente`);
            return true;

        } catch (error) {
            console.error('Error al exportar datos a Excel:', error);
            alert('Error al exportar datos a Excel. Intente de nuevo.');
            return false;
        }
    };


    // Ejemplo de uso:
    // handleExportExcel(misProductos, 'reporte_productos');

    // Función para filtrar stock
    // Función para filtrar stock
    const handleFilterStock = () => {
        // Crear un modal de filtro
        const stockFilterModal = document.createElement('div');
        stockFilterModal.className = 'fixed inset-0 z-50 overflow-y-auto';
        stockFilterModal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity">
                <div class="absolute inset-0 bg-slate-900 opacity-75"></div>
            </div>
            
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-slate-800">Filtrar por Estado de Stock</h3>
                    <button id="closeStockFilter" class="text-slate-400 hover:text-slate-500 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div class="px-6 py-5">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Nivel de Stock</label>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input type="checkbox" id="stockLow" name="stockLevel" value="low" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded">
                                    <label for="stockLow" class="ml-2 block text-sm text-slate-700">Stock Bajo (&lt; 10)</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="stockMedium" name="stockLevel" value="medium" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded">
                                    <label for="stockMedium" class="ml-2 block text-sm text-slate-700">Stock Medio (10-30)</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="stockHigh" name="stockLevel" value="high" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded">
                                    <label for="stockHigh" class="ml-2 block text-sm text-slate-700">Stock Alto (&gt; 30)</label>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Relación con Stock Mínimo</label>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input type="checkbox" id="belowMinimum" name="stockRelation" value="below" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded">
                                    <label for="belowMinimum" class="ml-2 block text-sm text-slate-700">Por debajo del mínimo</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="nearMinimum" name="stockRelation" value="near" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded">
                                    <label for="nearMinimum" class="ml-2 block text-sm text-slate-700">Cerca del mínimo (menos del 20% por encima)</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" id="aboveMinimum" name="stockRelation" value="above" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded">
                                    <label for="aboveMinimum" class="ml-2 block text-sm text-slate-700">Por encima del mínimo</label>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Ordenar por</label>
                            <select id="sortStock" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="stock_asc">Stock (Menor a Mayor)</option>
                                <option value="stock_desc">Stock (Mayor a Menor)</option>
                                <option value="name_asc">Nombre (A-Z)</option>
                                <option value="name_desc">Nombre (Z-A)</option>
                                <option value="sku_asc">SKU (Ascendente)</option>
                                <option value="relation_asc">Relación con mínimo (Crítico primero)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="border-t border-slate-200 mt-6 pt-5 flex justify-end space-x-3">
                        <button id="resetStockFilter" class="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Reiniciar Filtros
                        </button>
                        <button id="applyStockFilter" class="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700">
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

        document.body.appendChild(stockFilterModal);

        // Añadir event listeners
        document.getElementById('closeStockFilter').addEventListener('click', () => {
            document.body.removeChild(stockFilterModal);
        });

        document.getElementById('resetStockFilter').addEventListener('click', () => {
            const checkboxes = stockFilterModal.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            document.getElementById('sortStock').value = 'stock_asc';
        });

        document.getElementById('applyStockFilter').addEventListener('click', async () => {
            // Obtener valores seleccionados
            const selectedStockLevels = Array.from(stockFilterModal.querySelectorAll('input[name="stockLevel"]:checked')).map(el => el.value);
            const selectedRelations = Array.from(stockFilterModal.querySelectorAll('input[name="stockRelation"]:checked')).map(el => el.value);
            const sortBy = document.getElementById('sortStock').value;

            // Filtrar los datos de stock
            try {
                // Eliminar el modal
                document.body.removeChild(stockFilterModal);

                // Mostrar indicador de carga
                setLoading(true);

                // Llamar a la API con los filtros seleccionados
                const response = await getDashboardData({
                    stockLevels: selectedStockLevels.length > 0 ? selectedStockLevels : null,
                    stockRelations: selectedRelations.length > 0 ? selectedRelations : null,
                    sortBy: sortBy
                });

                // Actualizar los datos con la respuesta filtrada
                setStockDetalle(response.stockDetalle);

                // Ocultar indicador de carga
                setLoading(false);
            } catch (error) {
                console.error('Error al aplicar filtros de stock:', error);
                alert('Error al aplicar los filtros. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        });
    };
    // Tabs para la navegación del módulo
    const tabs = [
        { id: 'lista', label: 'Lista de Productos', icon: <Package className="w-4 h-4" /> },
        { id: 'categorias', label: 'Categorías', icon: <Tag className="w-4 h-4" /> },
        { id: 'stock', label: 'Estado de Stock', icon: <AlertTriangle className="w-4 h-4" /> },
    ];

    // Renderizar loader mientras se cargan los datos
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <main className="container mx-auto px-4 py-6">
                {/* Encabezado de la página */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Productos</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Administra tu catálogo de productos, categorías y stock
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                        <button
                            onClick={openNewProductForm}
                            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </button>

                        <button
                            onClick={() => handleExportExcel(filteredProducts, 'productos-export')}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center">
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
                                        ref={searchInputRef}
                                    />
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
                                                                    Creado: {new Date(producto.fechacreacion).toLocaleDateString()}
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
                                                            <button
                                                                onClick={() => handleDeleteProduct(producto.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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

                {activeTab === 'categorias' && !showCategoryProducts && (
                    <>
                        {/* Sección de categorías */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-slate-800">Categorías de Productos</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={openNewCategoryForm}
                                    className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Categoría
                                </button>
                                <button
                                    onClick={() => handleExportExcel(categorias, 'categorias-export')}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center">
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar
                                </button>
                            </div>
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
                                                <button
                                                    onClick={() => openEditCategoryForm(categoria)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(categoria.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="font-medium text-slate-800">{categoria.nombre}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{categoria.productos} productos</p>
                                    </div>
                                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
                                        <button
                                            onClick={() => handleViewCategoryProducts(categoria.id)}
                                            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center">
                                            Ver productos
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'categoria-productos' && showCategoryProducts && (
                    <>
                        {/* Vista de productos de una categoría */}
                        <div className="flex items-center mb-6">
                            <button
                                onClick={backToCategories}
                                className="mr-4 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 flex items-center"
                            >
                                <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
                                Volver a categorías
                            </button>
                            <h2 className="text-lg font-semibold text-slate-800">Productos de la categoría</h2>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 py-3">Producto</th>
                                            <th className="px-4 py-3">SKU</th>
                                            <th className="px-4 py-3 text-right">Precio</th>
                                            <th className="px-4 py-3 text-center">Stock</th>
                                            <th className="px-4 py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCategoryProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                                                    No hay productos en esta categoría.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCategoryProducts.map((producto) => (
                                                <tr key={producto.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-b-0">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 mr-3 bg-slate-100 rounded-md flex items-center justify-center">
                                                                <Image className="w-5 h-5 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-800">{producto.nombre}</div>
                                                                <div className="text-xs text-slate-500 mt-0.5">
                                                                    Creado: {new Date(producto.fechacreacion).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">{producto.sku}</td>
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
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(producto.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
                                        {stockResumen.bajo}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Stock Medio</h3>
                                    <p className="text-3xl font-bold text-amber-600">
                                        {stockResumen.medio}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Stock Bueno</h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {stockResumen.bueno}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Filtros y acciones */}
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
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                    >
                                        <option value="">Todos los niveles de stock</option>
                                        <option value="low">Stock bajo (&lt; 10)</option>
                                        <option value="medium">Stock medio (10-30)</option>
                                        <option value="high">Stock alto (&gt; 30)</option>
                                    </select>

                                    <button
                                        onClick={() => handleExportExcel(filteredStockDetails, 'stock-detalle-export')}
                                        className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 flex items-center">
                                        <Download className="w-4 h-4 mr-2" />
                                        Exportar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de stock */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-800">Estado detallado de stock</h3>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStockDetails.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                                                    No se encontraron productos con los filtros seleccionados.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStockDetails.map((producto) => (
                                                <tr key={producto.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-b-0">
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-slate-800">{producto.nombre}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">{producto.sku}</td>
                                                    <td className="px-4 py-3 text-sm text-center font-medium">{producto.stock_actual}</td>
                                                    <td className="px-4 py-3 text-sm text-center text-slate-600">{producto.stock_minimo}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${producto.status_color}`}>
                                                            {producto.estado_stock}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {filteredStockDetails.length > 0 && (
                                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                                    <div className="text-sm text-slate-500">
                                        Mostrando <span className="font-medium">{filteredStockDetails.length}</span> de <span className="font-medium">{stockDetalle.length}</span> productos
                                    </div>
                                </div>
                            )}
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

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const productData = {
                                    nombre: formData.get('nombre'),
                                    sku: formData.get('sku'),
                                    idCategoria: formData.get('categoria'),
                                    stock: parseInt(formData.get('stock')),
                                    stockMinimo: parseInt(formData.get('stockMinimo')),
                                    precio: parseFloat(formData.get('precio')),
                                    costo: parseFloat(formData.get('costo')),
                                    descripcion: formData.get('descripcion'),
                                    imagen: formData.get('imagen') || (selectedProduct?.imagen || '/placeholder-product.jpg')
                                };
                                handleSaveProduct(productData);
                            }}>
                                <div className="px-6 py-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nombre del Producto *
                                            </label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Ingrese el nombre del producto"
                                                defaultValue={selectedProduct?.nombre || ''}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                SKU *
                                            </label>
                                            <input
                                                type="text"
                                                name="sku"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Código único de producto"
                                                defaultValue={selectedProduct?.sku || ''}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Categoría *
                                            </label>
                                            <select
                                                name="categoria"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={selectedProduct?.id_categoria || ''}
                                                required
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                {categorias.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Stock Actual *
                                            </label>
                                            <input
                                                type="number"
                                                name="stock"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Cantidad disponible"
                                                defaultValue={selectedProduct?.stock || ''}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Stock Mínimo *
                                            </label>
                                            <input
                                                type="number"
                                                name="stockMinimo"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Stock mínimo para alertas"
                                                defaultValue={selectedProduct?.stock_minimo || ''}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Precio de Venta ($) *
                                            </label>
                                            <input
                                                type="number"
                                                name="precio"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Precio de venta"
                                                defaultValue={selectedProduct?.precio || ''}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Costo ($)
                                            </label>
                                            <input
                                                type="number"
                                                name="costo"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Costo del producto"
                                                defaultValue={selectedProduct?.costo || ''}
                                                min="0"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Descripción
                                            </label>
                                            <textarea
                                                name="descripcion"
                                                rows="4"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Descripción detallada del producto"
                                                defaultValue={selectedProduct?.descripcion || ''}
                                            ></textarea>
                                        </div>

                                  
                                    </div>

                                    <div className="border-t border-slate-200 pt-5 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {selectedProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                        </button>
                                    </div>
                                </div>
                            </form>
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

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const nombre = formData.get('nombreCategoria');
                                const descripcion = formData.get('descripcion');

                                try {
                                    // Usar función de conexion.ts para crear categoría
                                    await createCategoria({
                                        nombreCategoria: nombre,
                                        descripcion: descripcion
                                    });

                                    // Recargar datos de categorías usando la función de conexion.ts
                                    const data = await getDashboardData();
                                    setCategorias(data.categorias);

                                    closeForm();
                                } catch (error) {
                                    console.error('Error al crear categoría:', error);
                                }
                            }}>
                                <div className="px-6 py-5">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nombre de la Categoría *
                                            </label>
                                            <input
                                                type="text"
                                                name="nombreCategoria"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Ej: Electrónica, Ropa, Hogar..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Descripción (opcional)
                                            </label>
                                            <textarea
                                                name="descripcion"
                                                rows="3"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Descripción de la categoría"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 mt-6 pt-5 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Crear Categoría
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar categoría */}
            {showCategoryEditForm && selectedCategory && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={closeForm}>
                            <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
                        </div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Editar Categoría
                                </h3>
                                <button
                                    onClick={closeForm}
                                    className="text-slate-400 hover:text-slate-500 focus:outline-none"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const nombre = formData.get('nombreCategoria');
                                const descripcion = formData.get('descripcion');

                                try {
                                    // Usar función de conexion.ts para actualizar categoría
                                    await updateCategoria(selectedCategory.id, {
                                        nombreCategoria: nombre,
                                        descripcion: descripcion
                                    });

                                    // Recargar datos de categorías
                                    const data = await getDashboardData();
                                    setCategorias(data.categorias);

                                    closeForm();
                                } catch (error) {
                                    console.error('Error al actualizar categoría:', error);
                                }
                            }}>
                                <div className="px-6 py-5">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nombre de la Categoría *
                                            </label>
                                            <input
                                                type="text"
                                                name="nombreCategoria"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={selectedCategory.nombre}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Descripción (opcional)
                                            </label>
                                            <textarea
                                                name="descripcion"
                                                rows="3"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue={selectedCategory.descripcion}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 mt-6 pt-5 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 flex items-center"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}