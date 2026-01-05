import { useEffect, useState } from "react";

export default function Theme() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((p) => !p)}
      className="px-4 py-2 rounded fixed top-1 right-1 bg-emerald-400 hover:bg-emerald-300 font-bold"
    >
      {darkMode ? "Modo Claro" : "Modo Oscuro"}
    </button>
  );
}
