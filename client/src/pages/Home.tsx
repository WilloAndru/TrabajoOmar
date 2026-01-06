import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Theme from "../components/Theme";
import Brand from "../components/Brand";
import Exito from "../components/Exito";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedMarkets, setSelectedMarkets] = useState(() => new Set());
  const SUPER_MARKETS = [
    { img: "/exito.png" },
    // { img: "/d1.png" },
    // { img: "/jumbo.png" },
    // { img: "/olimpica.png" },
    // { img: "/alkosto.png" },
  ];

  // Maneja la logica de seleccion de supermercados
  const toggleMarket = (id: number) => {
    if (error) setError("");

    setSelectedMarkets((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Busqueda
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;
    if (!selectedMarkets.size) {
      setError("Seleccione por lo menos un supermercado");
      return;
    }
    setLoading(true);

    try {
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col p-4 gap-6 transition-colors">
      <Theme />
      <Brand />
      <div className="flex gap-3">
        {SUPER_MARKETS.map((item, i) => {
          const isActive = selectedMarkets.has(i);
          return (
            <button
              key={i}
              onClick={() => toggleMarket(i)}
              className={`rounded-xl p-2 ${
                isActive
                  ? "bg-emerald-400"
                  : "bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700"
              }`}
            >
              <img src={item.img} className="w-12 rounded-xl" />
            </button>
          );
        })}
      </div>
      {error && (
        <section className="rounded border px-4 py-3 font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </section>
      )}
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
      {selectedMarkets.has(0) && <Exito />}
      {loading && (
        <section className="font-semibold text-gray-600 dark:text-gray-400">
          Buscando productos para "{query}"
        </section>
      )}
    </main>
  );
}
