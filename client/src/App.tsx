import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Theme from "./components/Theme";

interface Product {
  name: string;
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
  const [sortBy, setSortBy] = useState("relevance");
  const [error, setError] = useState<string>("");

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

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col p-4 gap-4 transition-colors">
      <Theme />
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
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="relevance">Relevancia</option>
        <option value="price_asc">Menor precio</option>
        <option value="price_desc">Mayor precio</option>
      </select>
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
        <div className="bg-white dark:bg-gray-900 p-4 rounded">
          <section className="flex gap-2 items-center mb-2">
            <img className="h-10" src="/exito.png" alt="exito" />
            <h2>{data.totalCount} resultados</h2>
          </section>

          <table className="min-w-full bg-white dark:bg-gray-800 rounded overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Id</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Precio final</th>
                <th className="px-4 py-2 text-left">Precio por gr</th>
                <th className="px-4 py-2 text-left">Link</th>
              </tr>
            </thead>

            <tbody>
              {data.products.map((p: Product, i: number) => (
                <tr
                  key={i}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {/* Id */}
                  <td className="px-4 font-semibold">{i + 1}</td>

                  {/* Nombre del producto */}
                  <td className="px-4 font-semibold">{p.name}</td>

                  {/* Precio final */}
                  <td className="px-4 font-bold">
                    $ {Number(p.price).toLocaleString("es-CO")}
                  </td>

                  {/* Precio por gramo */}
                  <td className="px-4 text-gray-600 dark:text-gray-400">
                    $ {Number(p.pricePerUnit).toLocaleString("es-CO")}
                  </td>

                  {/* Link */}
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
