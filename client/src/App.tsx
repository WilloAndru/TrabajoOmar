import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Theme from "./components/Theme";
import Exito from "./components/Exito";
import Jumbo from "./components/Jumbo";

interface Product {
  name: string;
  supermercado: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

interface ScrapeResult {
  totalCount: number;
  products: Product[];
}

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("price_asc");
  const [error, setError] = useState<string>("");
  const [selectedMarkets, setSelectedMarkets] = useState(() => new Set());

  const toggleMarket = (id: string) => {
    setSelectedMarkets((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;
    setData(null);
    setLoading(true);

    try {
      const response = await axios.get<ScrapeResult>(`${API_URL}/search`, {
        params: { query, sortBy },
      });
      setData(response.data);
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  const SUPER_MARKETS = [
    { id: "exito", img: "/exito.png" },
    { id: "d1", img: "/d1.png" },
    { id: "jumbo", img: "/jumbo.png" },
    { id: "olimpica", img: "/olimpica.png" },
    { id: "alkosto", img: "/alkosto.png" },
  ];

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col p-4 gap-6 transition-colors">
      <Theme />
      <section className="flex gap-4 text-3xl font-bold items-center">
        <img src="/icon.png" className="w-15" alt="icon" />
        <h1>PriceCompare</h1>
      </section>
      <div className="flex gap-3">
        {SUPER_MARKETS.map((item) => {
          const isActive = selectedMarkets.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleMarket(item.id)}
              className={`rounded-xl p-2 ${
                isActive
                  ? "bg-gray-900 ring-2 ring-gray-900 dark:bg-gray-100 dark:ring-gray-100"
                  : "bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700"
              }`}
              aria-pressed={isActive}
            >
              <img src={item.img} className="w-12 rounded-xl" />
            </button>
          );
        })}
      </div>

      <form
        onSubmit={handleSearch}
        className="flex border rounded overflow-hidden"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          className="rounded px-4 focus:outline-0"
        />
        <button className="p-3 bg-emerald-400 border-l hover:bg-emerald-300">
          <FaSearch />
        </button>
      </form>
      {loading && (
        <section className="font-semibold text-gray-600 dark:text-gray-400">
          Buscando productos para "{query}"
        </section>
      )}
      {error && (
        <section className="rounded border px-4 py-3 font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </section>
      )}
      {data && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded text-xs">
          <section className="flex gap-2 items-center mb-2">
            <img className="h-10" src="/exito.png" alt="exito" />
            <h2>{data.totalCount} resultados</h2>
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
              {data.products.map((p: Product, i: number) => (
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
      )}
    </div>
  );
}

export default App;
