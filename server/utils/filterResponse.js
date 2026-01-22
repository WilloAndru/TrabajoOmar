const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const filterResponse = (products, query) => {
  const q = removeAccents(query.trim());

  return products.filter((p) => {
    // Filtrar productos con precio 0
    if (p.price === 0) return false;

    // Si no hay query, mostrar todos (excepto los de precio 0)
    if (!q) return true;

    // Filtrar por nombre
    const nameNormalized = removeAccents(p.name);
    const regex = new RegExp(`\\b${q}\\b`, "i");
    return regex.test(nameNormalized);
  });
};
