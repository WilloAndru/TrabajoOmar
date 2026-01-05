import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Product {
  name: string;
  price: string;
  image?: string;
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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;
    setData(null);

    try {
      const response = await axios.get<ScrapeResult>(`${API_URL}/search`, {
        params: { q: query },
      });
      setData(response.data);
    } catch (error) {
      console.log("Error al consultar el servidor");
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <form
        onSubmit={handleSearch}
        className="flex border-2 rounded-xl overflow-hidden"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          className="rounded-xl px-4 py-2 focus:outline-0"
        />
        <button className="p-4 bg-emerald-400 border-l-2 hover:bg-emerald-300">
          <FaSearch />
        </button>
      </form>
      {data && (
        <div className="bg-white p-4 rounded-xl shadow w-96">
          <h2 className="font-bold mb-2">{data.supermarket}</h2>

          <ul className="space-y-2">
            {data.products.map((p: any, i: any) => (
              <li key={i} className="border-b pb-1">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-600">{p.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
