interface Product {
  name: string;
  market: string;
  price: string;
  pricePerUnit: string;
  link: string;
}

// Funcion para eliminar los productos que no tengan el query en el nombre
const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const filterByQueryInName = (
  products: Product[],
  query: string
): Product[] => {
  const q = removeAccents(query.trim());
  if (!q) return products;

  return products.filter((p) => {
    const nameNormalized = removeAccents(p.name);
    const regex = new RegExp(`\\b${q}\\b`, "i");
    return regex.test(nameNormalized);
  });
};
