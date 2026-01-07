import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Brand from "../components/Brand";
import { useTotalCount } from "../hooks/useTotalCount";
import Exito from "../components/Exito";
import D1 from "../components/D1";
import { Link } from "react-router-dom";
import { getTime } from "../utils/getTime";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const { count, loading, error, fetchTotalCount } = useTotalCount();
  const [waitingTime, setWaitingTime] = useState<number[]>([]); // Tiempo de espera para cada resultado

  const [selectedMarkets, setSelectedMarkets] = useState(() => new Set());
  const SUPER_MARKETS = [
    { img: "/exito.png", label: "Exito" },
    { img: "/d1.png", label: "D1" },
    { img: "/jumbo.png", label: "Exito" },
    { img: "/olimpica.png", label: "Exito" },
    { img: "/alkosto.png", label: "Exito" },
  ];

  // Maneja la logica de seleccion de supermercados
  const toggleMarket = (id: number) => {
    setSelectedMarkets((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Busqueda de cantidad de resultados
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    const selectedLabels = SUPER_MARKETS.filter((_, index) =>
      selectedMarkets.has(index)
    ).map((market) => market.label);

    fetchTotalCount(query, selectedLabels);
  };

  return (
    <main className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col p-4 gap-6 transition-colors">
      <Brand />
      {/* Selector de supermercados */}
      <div className="flex gap-3">
        {SUPER_MARKETS.map((item, i) => {
          const isActive = selectedMarkets.has(i);
          return (
            <button
              key={i}
              onClick={() => toggleMarket(i)}
              className={`rounded-xl p-1 ${
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
      {loading && (
        <section className="font-semibold text-gray-600 dark:text-gray-400">
          Calculando tiempo de busqueda para "{query}"
        </section>
      )}
      {/* Barra de busqueda */}
      {selectedMarkets.size > 0 && (
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
      )}
      {/* Cantidad de resultados encontrados */}
      {count.length > 0 && selectedMarkets.size > 0 && (
        <section className="flex flex-col gap-2 rounded bg-white dark:bg-gray-900 p-4 pt-2">
          <h2>{query.charAt(0).toUpperCase() + query.slice(1)}</h2>
          <div className="grid grid-cols-2 gap-2">
            {selectedMarkets.has(0) && (
              <Exito count={count[0]} setWaitingTime={setWaitingTime} />
            )}
            {selectedMarkets.has(1) && (
              <D1 count={count[1]} setWaitingTime={setWaitingTime} />
            )}
          </div>
          <Link
            to="/table"
            state={{
              query,
              selectedMarkets: Array.from(selectedMarkets),
              waitingTime,
            }}
            className="px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-300 font-bold text-center"
          >
            Buscar en{" "}
            {getTime(waitingTime.reduce((acc, curr) => acc + curr, 0))}
          </Link>
        </section>
      )}
    </main>
  );
}
