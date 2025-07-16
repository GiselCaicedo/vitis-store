import axios from 'axios';
const api = 'http://192.168.1.223:3011';

// Solicitud para obtener usuarios
export const getUsers = async (searchTerm = '', limit = 50) => {
    try {
        const response = await axios.get(`${api}/api/exporta`, {
            params: {
                search: searchTerm, 
                limit,              
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    }
};

// Solicitud para obtener consultas de un usuario
export const getConsultas = async (userId) => {
    try {
        const response = await axios.get(`${api}/api/consultas`, { 
            params: { userId }  
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las consultas:', error);
        throw error;
    }
};

export const getDetallesConsulta = async (titulo, consultaId, pautaId, empresaId, startDate, endDate, usuario ) => {
    try {
        const response = await axios.post(`${api}/api/detallesConsulta`, {  
            titulo, consultaId, pautaId, empresaId, startDate, endDate, usuario         
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los detalles de la consulta:', error);
        throw error;
    }
};

