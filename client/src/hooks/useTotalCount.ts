import { useState } from "react";
import { api } from "../api/api";

export const useTotalCount = () => {
  const [count, setCount] = useState<number>();
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
      setCount(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return { count, loading, error, fetchTotalCount };
};
