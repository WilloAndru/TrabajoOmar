type ExitoProps = {
  count: number;
};

export default function Exito({ count }: ExitoProps) {
  return (
    <section className="flex p-4 flex-col rounded bg-gray-200 dark:bg-gray-800">
      <header className="flex items-center gap-3 mb-4">
        <img className="w-8" src="/exito.png" alt="exito" />
        <h2>Exito</h2>
      </header>
      <h6>{count} resultados</h6>
      <p>
        Tiempo estimado: <strong>{Math.round(count / 95.67)} min</strong>
      </p>
    </section>
  );
}
