import { useState } from "react";
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

export const useTotalCount = () => {
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalCount = async (query: string) => {
    if (!query) {
      setError("No hay consulta");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/totalCountExito", { params: { query } });
      console.log("adsf", response.data);

      setData(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchTotalCount };
};
