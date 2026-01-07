import { useState } from "react";
import { api } from "../api/api";

type SelectedMarket = {
  index: number;
  label: string;
};

export const useTotalCount = () => {
  const [count, setCount] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalCount = async (
    query: string,
    selectedObjects: SelectedMarket[]
  ) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      let listCount: number[] = [];
      for (const market of selectedObjects) {
        const url = `/totalCount${market.label}`;
        const response = await api.get(url, { params: { query } });
        listCount[market.index] = response.data;
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
