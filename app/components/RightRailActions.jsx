export default function RightRailActions() {
  return (
    <section
      className="surface-card rounded-[1.25rem] border border-[var(--border)] bg-white p-4"
      aria-label="Acciones de gestión"
    >
      <div className="grid gap-4">
        <button
          className="w-full rounded-2xl bg-yellow-600 px-6 py-4 text-base font-semibold tracking-tight text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-yellow-700 active:scale-[0.98]"
          type="button"
        >
          Carga para directivo
        </button>

        <button
          className="w-full rounded-2xl border-2 border-blue-600 bg-blue-800 px-6 py-4 text-base font-semibold tracking-tight text-white shadow-md transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98]"
          type="button"
        >
          Comité de crisis
        </button>
      </div>
    </section>
  );
}
