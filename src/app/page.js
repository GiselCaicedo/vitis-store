'use client';

import { useState } from 'react';
import SearchBar from '@exp/components/SearchBar';
import NewsTable from '@exp/components/NewsTable';
import NoticiasTable from '@exp/components/NoticiasTable'
import { getConsultas, getDetallesConsulta } from '@exp/services/conexion';
import Swal from 'sweetalert2';
import NoticiasTableTono from '@exp/components/NoticiasTableTono';

export default function NewsPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState([]);
  const [finalResults, setFinalResults] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [titulo, setTitulo] = useState('')

  const currentYear = new Date().getFullYear();

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setError(null);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setError(null);
  };

  const fetchConsultas = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getConsultas(userId);
      setConsultas(response);
      setTitulo(response[0].Titulo)

    } catch (err) {
      if (err.response && err.response.status === 404) {
        Swal.fire({
          title: 'Alerta',
          icon: 'warning',
          text: 'No se encontraron consultas para este usuario'
        })
      } else {
        setError('Error al obtener las consultas');
      }
    } finally {
      setLoading(false);
    }
  };


  const fetchConsultaDetails = async (titulo, consultaId, pautaId, empresaId, usuario ) => {
    if (!startDate && !endDate) {
      setError("Debes seleccionar un rango de fechas antes de continuar.");
      return;
    }
    try {
      setLoading(true);
      const response = await getDetallesConsulta(titulo, consultaId, pautaId, empresaId, startDate, endDate,usuario);
      setFinalResults(response);

    } catch (err) {
      if (err.response && err.response.status === 404) {
        Swal.fire({
          title: 'Alerta',
          icon: 'warning',
          text: 'No se han encontrado Noticias para esta consulta.'
        })
      } else {
        setError('Error al obtener los detalles de la consulta.');
      }

    } finally {
      setLoading(false);
    }
  };

  const handleSelectConsulta = (consulta) => {
    if (!startDate || !endDate) {

      Swal.fire({
        icon: 'warning',
        title: 'Alerta',
        text: 'Seleccione una fecha de inicio y una fecha de fin.'
      })
      return;
    }

    const match = (consulta.Consulta).match(/Pauta: \[(.*?)\]/);
    const titulo = match ? match[1] : null;
    fetchConsultaDetails(titulo, consulta.ConsultaID, consulta.PautaID, consulta.EmpresaID, userId);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchConsultas(user.UserID); // Obtener las consultas del usuario seleccionado
    setUserId(user.UserID)
  };

  return (
    <div>
      <h1
        style={{
          backgroundColor: '#1685F6',
          color: 'white',
          padding: '10px',
          textAlign: 'center'
        }}
        className="text-2xl font-bold mb-4"
      >
        Exporta Noticias
      </h1>
      <div className="container mx-auto p-4">

        {/* Barra de búsqueda y fechas */}
        <div className="flex space-x-4 items-end mb-4">
          <div className="flex-1">
            <SearchBar onSelectUser={handleSelectUser} />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Fecha Inicio
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min={`${currentYear}-01-01`}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Fecha Fin
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min={startDate}  // Asegurarse de que no se pueda seleccionar una fecha fin anterior a la fecha inicio
            />
          </div>
        </div>

        {selectedUser && (
          <div className="mt-4">
            <h2 className="text-xl mb-2">Consultas para {selectedUser.UserName}</h2>

            {loading ? (
              <p>Cargando consultas...</p>
            ) : error ? (
              <div>
                <p className="text-red-500">{error}</p>
                <NewsTable consultas={consultas} onSelectConsulta={handleSelectConsulta} />
              </div>
            ) : (
              <NewsTable consultas={consultas} onSelectConsulta={handleSelectConsulta} />
            )}
          </div>
        )}
        {((finalResults?.conTono?.length > 0 || finalResults?.sinTono?.length > 0) && (!loading)) && (
          <div className="mt-10">
            <h2 className="text-xl mb-4">Resultados</h2>

            {/* Contenedor flex para alinear las dos tablas */}
            <div className="flex space-x-4">

              {/* Primera tabla: Sin Tono */}
              <div className="flex-1 overflow-x-auto">
                <h3 className="text-lg mb-2">Resultados sin Tono</h3>
                <NoticiasTable noticias={finalResults.sinTono} data={[finalResults.titulo, startDate, endDate]} />
              </div>

              {/* Segunda tabla: Con Tono */}
              <div className="flex-1 overflow-x-auto">
                <h3 className="text-lg mb-2">Resultados con Tono</h3>
                <NoticiasTableTono noticias={finalResults.conTono} data={[finalResults.titulo, startDate, endDate]} />
              </div>

            </div>
          </div>


        )}

      </div>
    </div>
  );
}
