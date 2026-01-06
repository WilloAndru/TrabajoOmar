import { useEffect, useState } from "react";
import { useSearch } from "../hooks/useSearch";
import { useLocation } from "react-router-dom";
import { getTime } from "../utils/getTime";

interface Product {
  name: string;
  supermercado: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

type LocationState = {
  query: string;
  selectedMarkets: number[];
  waitingTime: number;
};

export default function Table() {
  const location = useLocation();
  const { query, selectedMarkets, waitingTime } =
    location.state as LocationState;
  const { data, loading, error } = useSearch(query, "price_asc");

  // Logica de contador para tiempo restante
  const [remaining, setRemaining] = useState(waitingTime);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Interfaz de carga
  if (loading) {
    return (
      <main className="w-full bg-gray-200 dark:bg-gray-800 h-screen flex flex-col items-center justify-center gap-2 text-center">
        <h2>Buscando productos para "{query}"</h2>
        {remaining > 0 ? (
          <h4>Quedan aproximadamente {getTime(remaining)}</h4>
        ) : (
          <h4>Porfavor espere mas tiempo o reinicie la busqueda</h4>
        )}
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col p-4 gap-6 transition-colors">
      <div className="bg-white dark:bg-gray-900 p-4 rounded text-xs">
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
            {data?.products.map((p: Product, i: number) => (
              <tr
                key={i}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 font-semibold">{i + 1}</td>
                <td className="px-4 font-semibold">{p.name}</td>
                <td className="px-4 font-semibold">Exito</td>
                <td className="px-4 font-bold">
                  $ {Number(p.price).toLocaleString("es-CO")}
                </td>
                <td className="px-4 text-gray-600 dark:text-gray-400">
                  $ {Number(p.pricePerUnit).toLocaleString("es-CO")}
                </td>
                <td className="px-5 py-2">
                  <a
                    href={`https://www.exito.com${p.link}`}
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
