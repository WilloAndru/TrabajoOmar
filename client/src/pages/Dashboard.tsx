import { useState, useMemo } from "react";
import { useSearch } from "../hooks/useSearch";
import { Link, Navigate, useLocation } from "react-router-dom";

interface Product {
  name: string;
  market: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

type LocationState = {
  query: string;
  selectedLabels: string[];
};

interface MarketStats {
  market: string;
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

export default function Dashboard() {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) return <Navigate to="/" replace />;

  const { query, selectedLabels } = state;
  const { data, loading } = useSearch(query, selectedLabels);

  // Cálculos de estadísticas
  const statistics = useMemo(() => {
    if (data.length === 0) {
      return {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        stdDeviation: 0,
        marketStats: [],
      };
    }

    const prices = data.map((p: Product) => Number(p.price));

    // Promedios
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Mín y máx
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Desviación estándar
    const variance =
      prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) /
      prices.length;
    const stdDeviation = Math.sqrt(variance);

    // Estadísticas por supermercado
    const marketMap = new Map<string, Product[]>();
    data.forEach((product: Product) => {
      const key = product.market;
      if (!marketMap.has(key)) marketMap.set(key, []);
      marketMap.get(key)!.push(product);
    });

    const marketStats: MarketStats[] = Array.from(marketMap.entries())
      .map(([market, products]) => {
        const marketPrices = products.map((p) => Number(p.price));
        return {
          market,
          count: products.length,
          avgPrice:
            marketPrices.reduce((a, b) => a + b, 0) / marketPrices.length,
          minPrice: Math.min(...marketPrices),
          maxPrice: Math.max(...marketPrices),
        };
      })
      .sort((a, b) => a.avgPrice - b.avgPrice);

    return {
      avgPrice,
      minPrice,
      maxPrice,
      stdDeviation,
      marketStats,
    };
  }, [data]);

  if (loading) {
    return (
      <main className="w-full bg-gray-200 dark:bg-gray-800 h-screen flex flex-col items-center justify-center gap-2 text-center">
        <h2>Cargando datos para "{query}"</h2>
        <h4>Por favor espere</h4>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-200 dark:bg-gray-800 min-h-screen flex items-center justify-center flex-col gap-2 transition-colors">
      <header className="bg-white top-0 absolute dark:bg-gray-900 w-full flex items-center py-[8px] px-[16px]">
        <Link to="/" className="flex gap-4 font-bold items-center">
          <img src="/icon.png" className="w-[32px]" alt="icon" />
          <h2>PriceCompare</h2>
        </Link>
      </header>

      <div className="bg-white dark:bg-gray-900 p-6 rounded text-sm m-2 mt-[56px] w-full max-w-4xl">
        {/* Encabezado */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-1">Estadísticas de Precios</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Búsqueda: "{query}"
          </p>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              PROMEDIO
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              $
              {statistics.avgPrice.toLocaleString("es-CO", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              MÍNIMO
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              $
              {statistics.minPrice.toLocaleString("es-CO", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              MÁXIMO
            </p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              $
              {statistics.maxPrice.toLocaleString("es-CO", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              DESV. EST.
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              $
              {statistics.stdDeviation.toLocaleString("es-CO", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        {/* Tabla por supermercado */}
        <div>
          <h4 className="font-bold mb-3">Promedio por Supermercado</h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-semibold">
                  Supermercado
                </th>
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-semibold">
                  Productos
                </th>
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-semibold">
                  Promedio
                </th>
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-semibold">
                  Mínimo
                </th>
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-semibold">
                  Máximo
                </th>
              </tr>
            </thead>
            <tbody>
              {statistics.marketStats.map((market, idx) => (
                <tr
                  key={idx}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-3 px-3 font-semibold">{market.market}</td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-400">
                    {market.count}
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                    $
                    {market.avgPrice.toLocaleString("es-CO", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="py-3 px-3 text-green-600 dark:text-green-400 font-semibold">
                    $
                    {market.minPrice.toLocaleString("es-CO", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="py-3 px-3 text-red-600 dark:text-red-400 font-semibold">
                    $
                    {market.maxPrice.toLocaleString("es-CO", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
          <p>
            Total de productos:{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {data.length}
            </span>
          </p>
          <Link
            to="/table"
            state={{ query, selectedLabels }}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Volver a tabla →
          </Link>
        </div>
      </div>
    </main>
  );
}
