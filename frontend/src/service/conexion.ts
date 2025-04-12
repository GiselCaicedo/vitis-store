import axios from 'axios';

const API_URL = 'http://192.168.11.3:3001';

/**
 * Obtiene los datos del dashboard principal
 * @param {Object} params - Parámetros de consulta (fecha, searchTerm, etc.)
 * @returns {Promise<Object>} Datos del dashboard principal
 */
export const getHomeDashboardData = async (params = {}) => {
  try {
    // Agregar un timestamp para evitar caché
    const timestamp = new Date().getTime();
    
    console.log('Consultando datos del dashboard para fecha:', params.fecha || 'actual');
    
    const response = await axios.get(`${API_URL}/api/dashboard`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 15000 // Aumentar el timeout para consultas complejas
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard principal:', error);
    throw error; // Propagar el error para que la UI lo maneje
  }
};

/**
 * Obtiene los datos del dashboard de productos
 * @param {Object} params - Parámetros de consulta
 * @returns {Promise<Object>} Datos del dashboard de productos
 */
export const getDashboardData = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/productos/dashboard`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    throw error;
  }
};

// Productos
/**
 * Obtiene la lista de productos
 * @returns {Promise<Array>} Lista de productos
 */
export const getProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/productos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Crea un nuevo producto
 * @param {Object} productoData - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
export const createProducto = async (productoData) => {
  try {
    const response = await axios.post(`${API_URL}/api/productos`, productoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Actualiza un producto existente
 * @param {string} id - ID del producto
 * @param {Object} productoData - Datos actualizados del producto
 * @returns {Promise<Object>} Producto actualizado
 */
export const updateProducto = async (id, productoData) => {
  try {
    const response = await axios.put(`${API_URL}/api/productos/${id}`, productoData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Elimina un producto
 * @param {string} id - ID del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// Categorías
/**
 * Obtiene la lista de categorías
 * @returns {Promise<Array>} Lista de categorías
 */
export const getCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/categorias`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Crea una nueva categoría
 * @param {Object} categoriaData - Datos de la categoría
 * @returns {Promise<Object>} Categoría creada
 */
export const createCategoria = async (categoriaData) => {
  try {
    const response = await axios.post(`${API_URL}/api/categorias`, categoriaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Actualiza una categoría existente
 * @param {string} id - ID de la categoría
 * @param {Object} categoriaData - Datos actualizados de la categoría
 * @returns {Promise<Object>} Categoría actualizada
 */
export const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await axios.put(`${API_URL}/api/categorias/${id}`, categoriaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
};

/**
 * Elimina una categoría
 * @param {string} id - ID de la categoría
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteCategoria = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
};

// Stock
/**
 * Obtiene los detalles del stock
 * @returns {Promise<Object>} Detalles del stock
 */
export const getStockDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/productos/stock`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles de stock:', error);
    throw error;
  }
};

/**
 * Actualiza el stock de un producto
 * @param {string} id - ID del producto
 * @param {number} newStock - Nuevo valor de stock
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateStock = async (id, newStock) => {
  try {
    const response = await axios.put(`${API_URL}/api/productos/${id}/stock`, { stock: newStock });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    throw error;
  }
};


/**
 * Obtiene los datos del dashboard de inventario
 * @param {Object} params - Parámetros de consulta (searchTerm, etc.)
 * @returns {Promise<Object>} Datos del dashboard de inventario
 */
export const getInventarioDashboard = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`${API_URL}/api/inventario`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard de inventario:', error);
    throw error;
  }
};

/**
 * Registra un nuevo movimiento de inventario (entrada o salida)
 * @param {Object} movimientoData - Datos del movimiento
 * @returns {Promise<Object>} Resultado de la operación
 */
export const registrarMovimiento = async (movimientoData) => {
  try {
    const response = await axios.post(`${API_URL}/api/inventario/movimientos`, movimientoData, {
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    throw error;
  }
};

/**
 * Obtiene las alertas de stock bajo activas
 * @returns {Promise<Array>} Lista de alertas
 */
export const getAlertasStock = async () => {
  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`${API_URL}/api/inventario/alertas`, {
      params: { _t: timestamp },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener alertas de stock:', error);
    throw error;
  }
};

/**
 * Resuelve una alerta de stock
 * @param {string|number} id - ID de la alerta
 * @returns {Promise<Object>} Resultado de la operación
 */
export const resolverAlerta = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/api/inventario/alertas/${id}/resolver`);
    return response.data;
  } catch (error) {
    console.error(`Error al resolver alerta con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Agrega un nuevo producto
 * @param {Object} productoData - Datos del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
export const addProducto = async (productoData) => {
  try {
    const response = await axios.post(`${API_URL}/api/inventario/productos`, productoData, {
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de movimientos
 * @param {Object} params - Parámetros de consulta (searchTerm, tipo, limit)
 * @returns {Promise<Array>} Lista de movimientos
 */
export const getMovimientos = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`${API_URL}/api/inventario/movimientos`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener movimientos de inventario:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de productos para inventario
 * @param {Object} params - Parámetros de consulta (searchTerm, categoria, stockStatus)
 * @returns {Promise<Array>} Lista de productos
 */
export const getProductosInventario = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`${API_URL}/api/inventario/productos`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos de inventario:', error);
    throw error;
  }
};

/**
 * Obtiene un producto específico por ID
 * @param {string|number} id - ID del producto
 * @returns {Promise<Object>} Datos del producto
 */
export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/inventario/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto con ID ${id}:`, error);
    throw error;
  }
};

// Servicio para obtener listado de ventas con filtros opcionales
// In your service functions
export const getVentas = async (params = {}) => {
  try {
    console.log('Calling getVentas with params:', params);
    const timestamp = new Date().getTime();
    const response = await axios.get(`${API_URL}/api/venta`, {
      params: { ...params, _t: timestamp },
      timeout: 10000
    });
    console.log('getVentas response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

// Servicio para obtener detalles de una venta específica
export const getVentaDetalle = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/venta/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener detalles de la venta ${id}:`, error);
    throw error;
  }
};

// Servicio para crear una nueva venta
export const createVenta = async (ventaData) => {
  try {
    const response = await axios.post(`${API_URL}/api/venta`, ventaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear venta:', error);
    throw error;
  }
};

// Servicio para actualizar el estado de una venta
export const updateVentaEstado = async (id, estado) => {
  try {
    const response = await axios.patch(`${API_URL}/api/venta/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar estado de la venta ${id}:`, error);
    throw error;
  }
};

// Servicio para obtener estadísticas de ventas
export const getVentasStats = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/venta/stats`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de ventas:', error);
    throw error;
  }
};

// Servicio para obtener historial de ventas
export const getHistorialVentas = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/venta/historial`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de ventas:', error);
    throw error;
  }
};

// Servicio para obtener datos del dashboard de ventas
export const getDashboardVentas = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    console.log('Consultando datos del dashboard para fecha:', params.fecha || 'actual');
    
    const response = await axios.get(`${API_URL}/api/venta/dashboard`, {
      params: { ...params, _t: timestamp },
      timeout: 15000 // Aumentar el timeout para consultas complejas
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard de ventas:', error);
    throw error;
  }
};

// Servicio para obtener clientes para el selector
export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/venta/clientes`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

// Servicio para obtener productos disponibles para venta
export const getProductosParaVenta = async (searchTerm = '') => {
  try {
    const response = await axios.get(`${API_URL}/api/venta/productos`, {
      params: { searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos para venta:', error);
    throw error;
  }
};

/**
 * Obtiene los datos principales para el dashboard de análisis
 * @param {Object} params - Parámetros de consulta (timeRange, startDate, endDate)
 * @returns {Promise<Object>} Datos del dashboard de análisis
 */
export const getAnalysisDashboardData = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    
    console.log('Consultando datos del dashboard de análisis:', params);
    
    const response = await axios.get(`${API_URL}/api/analisis`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 15000 // Aumentar el timeout para consultas complejas
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard de análisis:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de ventas específicas
 * @param {Object} params - Parámetros de consulta (timeUnit, date)
 * @returns {Promise<Object>} Estadísticas de ventas
 */
export const getSalesStats = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`${API_URL}/api/analisis/stats/ventas`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de ventas:', error);
    throw error;
  }
};

/**
 * Obtiene análisis detallado de productos
 * @param {Object} params - Parámetros de consulta (timeRange, startDate, endDate, category)
 * @returns {Promise<Object>} Datos de análisis de productos
 */
export const getProductsAnalysis = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`${API_URL}/api/analisis/productos`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener análisis de productos:', error);
    throw error;
  }
};

/**
 * Busca en el historial de ventas
 * @param {Object} params - Parámetros de consulta (searchTerm, startDate, endDate, limit)
 * @returns {Promise<Array>} Historial de ventas filtrado
 */
export const searchSalesHistory = async (params = {}) => {
  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`${API_URL}/api/analisis/historial`, {
      params: {
        ...params,
        _t: timestamp
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al buscar en el historial de ventas:', error);
    throw error;
  }
};

/**
 * Exporta datos en formato CSV
 * @param {Object} params - Parámetros de consulta (startDate, endDate, format)
 * @returns {Promise<Blob>} Blob con los datos exportados
 */
export const exportData = async (params = {}) => {
  try {
    if (!params.startDate || !params.endDate) {
      throw new Error('Se requieren fechas de inicio y fin para exportar datos');
    }
    
    const timestamp = new Date().getTime();
    
    // Para descargar un archivo, necesitamos configurar la respuesta como un blob
    const response = await axios.get(`${API_URL}/api/analisis/exportar`, {
      params: {
        ...params,
        _t: timestamp
      },
      responseType: 'blob',
      timeout: 30000 // Aumentar timeout para exportaciones grandes
    });
    
    // Crear una URL para el blob y simular un clic para descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Nombre del archivo basado en las fechas
    const fileName = `analisis_${params.startDate}_a_${params.endDate}.${params.format || 'csv'}`;
    link.setAttribute('download', fileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return response.data;
  } catch (error) {
    console.error('Error al exportar datos:', error);
    throw error;
  }
};


export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    
    // La cookie debería ser establecida por el servidor, pero si no:
    if (response.data.token) {
      document.cookie = `cookieKey=${response.data.token}; path=/; max-age=86400`; // 1 día
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para cerrar sesión
export const signOut = () => {
  // Eliminar cookie
  document.cookie = 'cookieKey=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  // Eliminar datos de localStorage
  localStorage.removeItem('datauser');
};




/**
 * Obtiene todas las notificaciones
 * @returns {Promise} Promesa que resuelve a un array de notificaciones
 */
export async function getAllNotifications() {
  try {
    const response = await fetch(`${API_URL}/api/notificaciones`);
    
    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getAllNotifications:', error);
    throw error;
  }
}

/**
 * Obtiene solo las notificaciones pendientes
 * @returns {Promise} Promesa que resuelve a un array de notificaciones pendientes
 */
export async function getPendingNotifications() {
  try {
    const response = await fetch(`${API_URL}/api/notificaciones/pending`);
    
    if (!response.ok) {
      throw new Error('Error al obtener notificaciones pendientes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getPendingNotifications:', error);
    throw error;
  }
}

/**
 * Obtiene un resumen de las notificaciones por estado y prioridad
 * @returns {Promise} Promesa que resuelve a un objeto con el resumen
 */
export async function getNotificationsSummary() {
  try {
    const response = await fetch(`${API_URL}/api/notificaciones/summary`);
    
    if (!response.ok) {
      throw new Error('Error al obtener resumen de notificaciones');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getNotificationsSummary:', error);
    throw error;
  }
}

/**
 * Obtiene las últimas notificaciones para el dashboard
 * @param {number} limit - Número máximo de notificaciones a obtener
 * @returns {Promise} Promesa que resuelve a un array de notificaciones
 */
export async function getLatestNotifications(limit = 5) {
  try {
    const response = await fetch(`${API_URL}/api/notificaciones/latest?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener últimas notificaciones');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getLatestNotifications:', error);
    throw error;
  }
}

/**
 * Marca una notificación como resuelta
 * @param {number} id - ID de la notificación
 * @returns {Promise} Promesa que resuelve a un objeto con el resultado
 */
export async function resolveNotification(id) {
  try {
    const response = await fetch(`${API_URL}/api/notificaciones/${id}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al resolver notificación');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en resolveNotification:', error);
    throw error;
  }
}

/**
 * Marca una notificación como ignorada
 * @param {number} id - ID de la notificación
 * @returns {Promise} Promesa que resuelve a un objeto con el resultado
 */
export async function ignoreNotification(id) {
  try {
    const response = await fetch(`${API_URL}/api/notificaciones/${id}/ignore`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al ignorar notificación');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en ignoreNotification:', error);
    throw error;
  }
}

/**
 * Marca como resueltas todas las notificaciones de un producto
 * @param {number} productId - ID del producto
 * @returns {Promise} Promesa que resuelve a un objeto con el resultado
 */
export async function resolveProductNotifications(productId) {
  try {
    const response = await fetch(`${API_URL}/api/notificaciones/product/${productId}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al resolver notificaciones del producto');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en resolveProductNotifications:', error);
    throw error;
  }
}