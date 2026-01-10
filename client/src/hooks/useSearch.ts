import { useState, useEffect } from "react";
import { api } from "../api/api";
import { filterByQueryInName } from "../utils/filterByQueryInName ";

interface Product {
  name: string;
  market: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

export const useSearch = (query: string, selectedLabels: string[]) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

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
        const filteredData = filterByQueryInName(listDatas, query);
        setData(filteredData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSearchProducts();
  }, [query]);

  return { data, loading, error };
};
