import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const SUPER_MARKETS = [
    { img: "/exito.png", label: "Exito" },
    { img: "/d1.png", label: "D1" },
    { img: "/jumbo.png", label: "Jumbo" },
    { img: "/olimpica.png", label: "Olimpica" },
    { img: "/carulla.png", label: "Carulla" },
    // { img: "/vaquita.png", label: "Vaquita" },
    { img: "/euro.svg", label: "Euro" },
    // { img: "/zapatoca.jpg", label: "Zapatoca" },
    { img: "/makro.png", label: "Makro" },
  ];

  const [selectedMarkets, setSelectedMarkets] = useState(() => new Set());
  const selectedLabels = SUPER_MARKETS.filter((_, index) =>
    selectedMarkets.has(index),
  ).map((market) => market.label);

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

    navigate("/table", {
      state: { query, selectedLabels },
    });
  };

  return (
    <main className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col p-4 gap-6 transition-colors">
      <section className="flex gap-4 text-3xl font-bold items-center">
        <img src="/icon.png" className="w-15" alt="icon" />
        <h1>PriceCompare</h1>
      </section>
      {/* Selector de supermercados */}
      <div className="grid grid-cols-4 gap-3">
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
    </main>
  );
}
