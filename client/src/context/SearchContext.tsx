import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Product {
  name: string;
  market: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

interface SearchContextType {
  data: Product[];
  setData: (data: Product[]) => void;
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Product[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");

  return (
    <SearchContext.Provider
      value={{ data, setData, currentQuery, setCurrentQuery }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchCache() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchCache debe usarse dentro de SearchProvider");
  }
  return context;
}
