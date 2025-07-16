import React from "react";
import { utils, write } from 'sheetjs-style';
import * as FileSaver from "file-saver";
import { FaDownload } from "react-icons/fa";
import moment from 'moment';  // Importa moment para el formateo de fechas
import 'moment/locale/es';  // Asegúrate de cargar el idioma español

const Excel = ({ data, headers, titulo, startDate, endDate }) => {
  const handleExport = () => {
    const workbook = utils.book_new();

    const worksheetData = data.map((row) =>
      headers.map((header) => {
        let cellValue = row[header.key];
        if (header.key === "Link" || header.key === "Link Imagen") {
          return {
            t: "s",
            v: "link",
            l: { Target: cellValue, Tooltip: `Abrir ${header.label}` } 
          };
        }
        return cellValue == null ? '' : cellValue;
      })
    );

    const worksheetHeaders = headers.map((header) => header.label);

    const worksheet = utils.aoa_to_sheet([worksheetHeaders, ...worksheetData]);

    headers.forEach((header, colIndex) => {
      const cellAddress = utils.encode_cell({ r: 0, c: colIndex });
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1685F6" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    });

    const range = utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" };
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s = {
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
    }

    worksheet["!cols"] = headers.map((header) => {
      if (header.key === "Nombre") {
        const maxContentLength = Math.max(
          ...worksheetData.map((row) => row[headers.findIndex(h => h.key === header.key)]?.toString().length || 0),
          header.label.length
        );
        return { wch: maxContentLength + 2 };
      }
      return { wch: header.width || 20 };
    });

    worksheet["!rows"] = data.map(() => ({
      hpt: 20,
    }));

    utils.book_append_sheet(workbook, worksheet, "Noticias");

    // Formateo del nombre del archivo usando moment
    const formattedStartDate = moment(startDate).locale('es').format('DD [de] MMMM');
    const formattedEndDate = moment(endDate).locale('es').format('DD [de] MMMM');
    const fileName = `${titulo} ${formattedStartDate} al ${formattedEndDate}.xlsx`;

    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, fileName);
  };

  return (
    <button
    style={{
      display: 'inline-flex',
      marginLeft: '0.75rem',
      color: 'white',
      backgroundColor: '#1685F6', 
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'background-color 0.2s ease-in-out',
      padding: '0.5rem 1rem',
      height: '2.5rem',
      outline: 'none',
      border: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')} // Hover effect
    onMouseLeave={(e) => (e.target.style.backgroundColor = '#1685F6')}
    onClick={handleExport}
  >
    <FaDownload />
  </button>
  
  );
};

export default Excel;
