import { useState, useRef, useCallback } from "react";
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

export const useSearch = () => {
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, sortBy: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ScrapeResult>("/searchProductsExito", {
        params: { query: `"${query}"`, sortBy },
        signal: controller.signal,
      });
      setData(response.data);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
};
