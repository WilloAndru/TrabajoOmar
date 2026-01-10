import { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import { Link, Navigate, useLocation } from "react-router-dom";
import Select from "../components/Select";
import * as XLSX from "xlsx";
import { LuDownload } from "react-icons/lu";

interface Product {
  name: string;
  market: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

type LocationState = {
  query: string;
  selectedLabels: string[];
};

export default function Table() {
  const location = useLocation();
  const state = location.state as LocationState;

  // Ruta protegida
  if (!state) return <Navigate to="/" replace />;

  const { query, selectedLabels } = state;
  const { data, loading } = useSearch(query, selectedLabels);
  const [orderType, setOrderType] = useState<number>(1);

  // Lista ordenada
  const sortedData = [...data].sort((a: Product, b: Product) => {
    const priceA = Number(a.price);
    const priceB = Number(b.price);
    const unitA = Number(a.pricePerUnit);
    const unitB = Number(b.pricePerUnit);

    switch (orderType) {
      case 1: // Menor precio
        return priceA - priceB;
      case 2: // Mayor precio
        return priceB - priceA;
      case 3: // Menor precio por unidad
        return unitA - unitB;
      case 4: // Mayor precio por unidad
        return unitB - unitA;
      default:
        return 0;
    }
  });

  // Funcion para descargar excel
  const exportToExcel = () => {
    const rows = sortedData.map((p) => ({
      Nombre: p.name,
      Mercado: p.market,
      "Precio final": Number(p.price),
      "Precio por gr": Number(p.pricePerUnit),
      Link: p.link,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
    XLSX.writeFile(workbook, `PriceCompare-${query}.xlsx`);
  };

  // Interfaz de carga
  if (loading) {
    return (
      <main className="w-full bg-gray-200 dark:bg-gray-800 h-screen flex flex-col items-center justify-center gap-2 text-center">
        <h2>Buscando productos para "{query}"</h2>
        <h4>Porfavor espere</h4>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col gap-2 transition-colors">
      <header className="bg-white top-0 absolute dark:bg-gray-900 w-full flex items-center py-[8px] px-[16px]">
        <Link to="/" className="flex gap-4 font-bold items-center">
          <img src="/icon.png" className="w-[32px]" alt="icon" />
          <h2>PriceCompare</h2>
        </Link>
      </header>
      <div className="bg-white dark:bg-gray-900 p-4 pt-2 rounded text-xs m-2 mt-[56px]">
        <header className="flex justify-between mb-2 items-center">
          <h4>Resultados para {query}</h4>
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="rounded text-base border-2 bg-gray-200 dark:bg-gray-700 px-3 border-gray-300 hover:bg-emerald-400"
            >
              <LuDownload />
            </button>
            <Select onChange={setOrderType} />
          </div>
        </header>
        <table className="min-w-full bg-white dark:bg-gray-800 rounded overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Id</th>
              <th className="px-4 text-left">Nombre</th>
              <th className="px-4 text-left">Mercado</th>
              <th className="px-4 text-left">Precio final</th>
              <th className="px-4 text-left">Precio por gr</th>
              <th className="px-4 text-left">Link</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((p: Product, i: number) => (
              <tr
                key={i}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 font-semibold">{i + 1}</td>
                <td className="px-4 font-semibold">{p.name}</td>
                <td className="px-4 font-semibold">{p.market}</td>
                <td className="px-4 font-bold">
                  $ {Number(p.price).toLocaleString("es-CO")}
                </td>
                <td className="px-4 text-gray-600 dark:text-gray-400">
                  $ {Number(p.pricePerUnit).toLocaleString("es-CO")}
                </td>
                <td className="px-5 py-2">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full hover:scale-120 transition-transform"
                  >
                    🔗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
