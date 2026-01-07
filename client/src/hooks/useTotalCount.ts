import { useState } from "react";
import { api } from "../api/api";

export const useTotalCount = () => {
  const [count, setCount] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalCount = async (query: string, supermarket: string[]) => {
    if (!query) {
      setError("No hay consulta");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let listCount: number[] = [];
      for (const superName of supermarket) {
        const url = `/totalCount${superName}`;
        const response = await api.get(url, { params: { query } });
        listCount.push(response.data);
      }
      setCount(listCount);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { count, loading, error, fetchTotalCount };
};
