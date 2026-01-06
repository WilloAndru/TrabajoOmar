import { useState, useEffect } from "react";
import { api } from "../api/api";

interface Product {
  name: string;
  supermercado: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

interface ScrapeResult {
  products: Product[];
}

export const useSearch = (query: string, sortBy: string) => {
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchSearchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<ScrapeResult>("/searchProductsExito", {
          params: { query: `"${query}"`, sortBy },
        });
        setData(response.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSearchProducts();
  }, [query, sortBy]);

  return { data, loading, error };
};
