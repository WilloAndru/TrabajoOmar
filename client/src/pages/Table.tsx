import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";

interface Product {
  name: string;
  supermercado: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

interface ScrapeResult {
  products: Product[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function Table() {
  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("price_asc");
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string>("");

  // Busqueda
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      const response = await axios.get<ScrapeResult>(`${API_URL}/search`, {
        params: { query: `"${query}"`, sortBy },
      });
      setData(response.data);
    } catch (error) {
      setError(String(error));
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSearch}
        className="flex border rounded overflow-hidden"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          className="w-70 rounded px-4 focus:outline-0"
          placeholder="Ingrese el producto a buscar"
        />
        <button className="p-3 bg-emerald-400 border-l hover:bg-emerald-300">
          <FaSearch />
        </button>
      </form>
      <div className="bg-white dark:bg-gray-900 p-4 rounded text-xs">
        <section className="flex gap-2 items-center mb-2">
          <img className="h-10" src="/exito.png" alt="exito" />
        </section>
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
    </div>
  );
}
