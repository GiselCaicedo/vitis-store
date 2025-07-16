import React from 'react';

const NewsTable = ({ consultas = [], onSelectConsulta }) => {
  return (
    <table className="news-table w-full text-left border-collapse mt-4 max-w-30">
      <thead>
        <tr>
          <th className="border-b py-2 px-4">ConsultaID</th>
          <th className="border-b py-2 px-4">Consulta</th>
          <th className="border-b py-2 px-4">PautaID</th>
          <th className="border-b py-2 px-4">EmpresaID</th>
        </tr>
      </thead>
      <tbody>
        {consultas.length > 0 ? (
          consultas.map((consulta, index) => (
            <tr
              key={index}
              onClick={() => onSelectConsulta(consulta)}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="border-b py-2 px-4">{consulta.ConsultaID}</td>
              <td className="border-b py-2 px-4">{consulta.Consulta}</td>
              <td className="border-b py-2 px-4">{consulta.PautaID}</td>
              <td className="border-b py-2 px-4">{consulta.EmpresaID}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4">
              No se encontraron consultas.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default NewsTable;
