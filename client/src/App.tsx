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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;
    setData(null);
    setLoading(true);

    try {
      const response = await axios.get<ScrapeResult>(`${API_URL}/search`, {
        params: { q: query },
      });
      setData(response.data);
    } catch (error) {
      console.log("Error al consultar el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 gap-4 bg-primary text-primary transition-colors duration-300">
      <Theme />
      <form
        onSubmit={handleSearch}
        className="flex border rounded-xl overflow-hidden"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          className="input flex-1"
        />
        <button className="button">
          <FaSearch />
        </button>
      </form>
      {loading && <div className="font-semibold">Buscando "{query}"...</div>}
      {data && (
        <div className="card">
          <section className="flex gap-2 items-center mb-2">
            <img className="h-10" src="/exito.png" alt="exito" />
            <h2>{data.totalCount} resultados</h2>
          </section>
          <table className="table">
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
              {data.products.map((p, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-4 font-semibold">{i + 1}</td>
                  <td className="px-4 font-semibold">{p.name}</td>
                  <td className="px-4 font-bold">
                    $ {Number(p.price).toLocaleString("es-CO")}
                  </td>
                  <td className="px-4 text-gray-600 dark:text-gray-300">
                    $ {Number(p.pricePerUnit).toLocaleString("es-CO")}
                  </td>
                  <td className="px-5 py-2">
                    <a
                      href={`https://www.exito.com${p.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
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
