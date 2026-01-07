import { useEffect } from "react";
import { getTime } from "../utils/getTime";

type D1Props = {
  count: number;
  setWaitingTime: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function D1({ count, setWaitingTime }: D1Props) {
  const totalSeconds = (count / 16) * 10;

  useEffect(() => {
    setWaitingTime((prev) => {
      const next = [...prev];
      next[0] = totalSeconds;
      return next;
    });
  }, []);

  return (
    <section className="flex p-4 flex-col rounded bg-gray-200 dark:bg-gray-800">
      <header className="flex items-center gap-3 mb-4">
        <img className="w-8" src="/d1.png" alt="d1" />
        <h2>D1</h2>
      </header>
      <h6>{count} resultados</h6>
      <p>
        Tiempo estimado: <strong>{getTime(totalSeconds)}</strong>
      </p>
    </section>
  );
}
