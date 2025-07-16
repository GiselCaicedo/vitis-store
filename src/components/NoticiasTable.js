import React, { useState } from 'react';
import Excel from './Excel';  // Mantén el componente de Excel

const NoticiasTable = ({ noticias = [], data }) => {
  const [rowLimit, setRowLimit] = useState(1); 

  const headers = [
    { label: 'Referencia', key: 'Referencia' },
    { label: 'Fecha de publicación en medio', key: 'Fecha de publicación en medio' },
    { label: 'Nombre del medio', key: 'Nombre del medio' },
    { label: 'Tipo de medio', key: 'Tipo de medio' },
    { label: 'TipoMedioPadreId', key: 'TipoMedioPadreId' },
    { label: 'Pais del medio', key: 'Pais del medio' },
    { label: 'Sección', key: 'Sección' },
    { label: 'Titulo', key: 'Titulo' },
    { label: 'Autores', key: 'Autores' },
    { label: 'Nro. Pagina', key: 'Nro. Pagina' },
    { label: 'Dimension cm2', key: 'Dimension cm2' },
    { label: 'Num. de caracteres', key: 'Num. de caracteres' },
    { label: 'Valor de la Nota', key: 'Valor de la Nota' },
    { label: 'Tier', key: 'Tier' },
    { label: 'Moneda', key: 'Moneda' },
    { label: 'Audiencia', key: 'Audiencia' },
    { label: 'Circulación del medio', key: 'Circulación del medio' },
    { label: 'Dimension Cliente', key: 'Dimension Cliente' },
    { label: 'Agencias', key: 'Agencias' },
    { label: 'Importancia', key: 'Importancia' },
    { label: 'Tipo de nota', key: 'Tipo de nota' },
    { label: 'Empresas Consulta', key: 'Empresas Consulta' },
    { label: 'Empresa rel.', key: 'Empresa rel.' },
    { label: 'Valor del medio', key: 'Valor del medio' },
    { label: 'Alexa Ranking', key: 'Alexa Ranking' },
    { label: 'Origen Noticia', key: 'Origen Noticia' },
    { label: 'Tipo de Mencion', key: 'Tipo de Mencion' },
    { label: 'Menciones', key: 'Menciones' },
    { label: 'Mensaje', key: 'Mensaje' },
    { label: 'Claves Clasificacion', key: 'Claves Clasificacion' },
    { label: 'Link', key: 'Link' },
    { label: 'Valor en dolares', key: 'Valor en dolares' },
    { label: 'Link Imagen', key: 'Link Imagen' },
    { label: 'NoticiaID', key: 'NoticiaID' },
    { label: 'EmpresaID', key: 'EmpresaID' },
    { label: 'Tipo Mención', key: 'Tipo Mención' },
    { label: 'Tipo Vocero', key: 'Tipo Vocero' },
    { label: 'Nombre Vocero', key: 'Nombre Vocero' },
    { label: 'Mención en Titulo', key: 'Mención en Titulo' },
    { label: 'Mención en Foto', key: 'Mención en Foto' },
    { label: 'Mención en Texto', key: 'Mención en Texto' },
    { label: 'Mención en Citas', key: 'Mención en Citas' },
    { label: 'Tipo Mención 2', key: 'Tipo Mención 2' },
    { label: 'Producto', key: 'Producto' },
    { label: 'Aparece Foto', key: 'Aparece Foto' },
    { label: 'Tematica', key: 'Tematica' },
    { label: 'Tipo de información', key: 'Tipo de información' },
    { label: 'Origen de la noticia', key: 'Origen de la noticia' },
    { label: 'Ave', key: 'Ave' },
    { label: 'Cantidad Caracteres', key: 'Cantidad Caracteres' },
    { label: 'Dimensión', key: 'Dimensión' },
    { label: 'Ancho y alto', key: 'Ancho y alto' },
    { label: 'Posicionamiento', key: 'Posicionamiento' },
    { label: 'Subtema', key: 'Subtema' },
    { label: 'Resumen', key: 'Resumen' },
    { label: 'Aparece Logo', key: 'Aparece Logo' },
    { label: 'Dimensión Página Completa', key: 'Dimensión Página Completa' },
    { label: 'OrigenRow', key: 'OrigenRow' },
  ];

  return (
    <div className="overflow-x-auto">
      <Excel
        data={noticias}  // Datos de las noticias
        headers={headers}  // Headers de las columnas
        titulo={data[0]}  // Título para el archivo
        startDate={data[1]}  // Fecha de inicio
        endDate={data[2]}  // Fecha de fin
      />

      {/* tabla de noticias */}
      <table className="news-table w-full text-left border-collapse mt-4 table-auto">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border py-2 px-4">{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {noticias.length > 0 ? (
            noticias.slice(0, rowLimit).map((noticia, index) => (
              <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                {headers.map((header, i) => (
                  <td key={i} className="border py-2 px-4">
                    {noticia[header.key] != null ? noticia[header.key] : ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No se encontraron noticias.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* bton para cargar más filas */}
      {rowLimit < noticias.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setRowLimit(rowLimit + 5)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticiasTable;
