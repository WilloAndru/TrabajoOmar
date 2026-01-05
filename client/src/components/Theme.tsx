import { useState } from "react";

export default function Theme() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 rounded fixed top-1 right-1 transition-colors duration-300
                 bg-emerald-300 dark:bg-emerald-700 text-white dark:text-white hover:bg-emerald-400 dark:hover:bg-emerald-600"
    >
      {darkMode ? "Modo Claro" : "Modo Oscuro"}
    </button>
  );
}
