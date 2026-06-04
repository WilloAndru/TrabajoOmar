import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useSearchCache } from "../context/SearchContext";

interface Product {
  name: string;
  market: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

export const useSearch = (query: string, selectedLabels: string[]) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data, setData, currentQuery, setCurrentQuery } = useSearchCache();

  useEffect(() => {
    if (!query.trim()) return;

    // Si ya tenemos datos para esta búsqueda, no hagas scraping
    if (currentQuery === query && data.length > 0) {
      setLoading(false);
      return;
    }

    const fetchSearchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let listDatas: Product[] = [];
        for (const label of selectedLabels) {
          const url = `/searchProducts${label}`;
          const response = await api.get(url, { params: { query } });
          const productsWithMarket = response.data.map((p: Product) => ({
            ...p,
            market: label,
          }));
          listDatas.push(...productsWithMarket);
        }
        setData(listDatas);
        setCurrentQuery(query);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSearchProducts();
  }, [query, selectedLabels, currentQuery, data.length, setData, setCurrentQuery]);

  return { data, loading, error };
};