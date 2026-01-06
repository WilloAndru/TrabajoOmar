import { useEffect } from "react";
import { getTime } from "../utils/getTime";

type ExitoProps = {
  count: number;
  setWaitingTime: React.Dispatch<React.SetStateAction<number>>;
};

export default function Exito({ count, setWaitingTime }: ExitoProps) {
  const totalSeconds = (count / 16) * 10;

  useEffect(() => {
    setWaitingTime(totalSeconds);
  }, []);

  return (
    <section className="flex p-4 flex-col rounded bg-gray-200 dark:bg-gray-800">
      <header className="flex items-center gap-3 mb-4">
        <img className="w-8" src="/exito.png" alt="exito" />
        <h2>Exito</h2>
      </header>
      <h6>{count} resultados</h6>
      <p>
        Tiempo estimado: <strong>{getTime(totalSeconds)}</strong>
      </p>
    </section>
  );
}
