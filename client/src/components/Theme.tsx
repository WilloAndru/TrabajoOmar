import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

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
      className="px-[16px] py-[8px] rounded absolute top-[4px] right-[4px] bg-emerald-400 hover:bg-emerald-300 font-bold border z-10"
    >
      {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
