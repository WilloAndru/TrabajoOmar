import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Product {
  name: string;
  price: string;
  pricePerUnit: string;
  unit: string;
  link: string;
}

interface ScrapeResult {
  supermarket: string;
  query: string;
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
    <div className="w-full bg-gray-200 min-h-screen flex items-center justify-center flex-col p-4 gap-4">
      <form
        onSubmit={handleSearch}
        className="flex border rounded-xl overflow-hidden"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          className="rounded-xl px-4 focus:outline-0"
        />
        <button className="p-3 bg-emerald-300 border-l hover:bg-emerald-200">
          <FaSearch />
        </button>
      </form>
      {loading && (
        <div className="text-gray-700 font-semibold">
          Buscando productos para "{query}"...
        </div>
      )}
      {data && (
        <div className="bg-white p-4 rounded-xl">
          <section className="flex gap-2 items-center mb-2">
            <img className="h-10" src="/exito.png" alt="exito" />
          </section>
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Precio final</th>
                <th className="px-4 py-2 text-left">Precio por gr</th>
                <th className="px-4 py-2 text-left">Link</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p: Product, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  {/* Nombre del producto */}
                  <td className="px-4 font-semibold">{p.name}</td>

                  {/* Precio final */}
                  <td className="px-4 font-bold">
                    $ {Number(p.price).toLocaleString("es-CO")}
                  </td>

                  {/* Precio por gramo */}
                  <td className="px-4 text-gray-600">
                    $ {Number(p.pricePerUnit).toLocaleString("es-CO")}
                  </td>

                  {/* Link*/}
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
