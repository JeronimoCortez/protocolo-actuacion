import { MoveRight } from "lucide-react";
import { ClockIcon, PhoneIcon } from "./icons";

export default function DaeCentralCard({ className = "" }) {
  return (
    <aside
      className={`surface-card rounded-[1.25rem] border-2 border-[oklch(0.82_0.04_250)] bg-gradient-to-br from-[oklch(0.93_0.025_250)] to-[oklch(0.97_0.01_250)] p-5 ${className}`.trim()}
      aria-label="Contacto DAE Central"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="section-title mb-1 text-[var(--primary)]">DAE Central</h3>
          <p className="supporting-copy text-xs">Direccion de Acompanamiento Escolar</p>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[oklch(0.92_0.025_250)] px-3 py-2">
          <ClockIcon className="h-[13px] w-[13px] text-[var(--primary)]" />
          <span className="chip-text text-[var(--primary)]">8:00 a 17:00 hs</span>
        </div>
      </div>

      <div className="border-t border-[oklch(0.88_0.03_250)] pt-4">
        <a
          href="tel:4231473"
          className="flex items-center gap-4 rounded-xl bg-[oklch(0.93_0.02_250)] p-4 transition hover:bg-[oklch(0.88_0.03_250)]"
          aria-label="Llamar a DAE al 4231473"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[var(--primary)]">
            <PhoneIcon className="h-[22px] w-[22px] text-white" />
          </span>
          <span className="flex-1">
            <span className="mb-0.5 block text-xs text-[var(--text-soft)]">Llamar ahora</span>
            <span className="block text-[1.65rem] font-bold leading-none tracking-tight text-[var(--primary)]">4231473</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-right md:gap-2">
            <span className="block text-xs text-[var(--text-soft)]">Disponible</span>
            <MoveRight className="h-4 w-4 shrink-0 hidden md:inline" />
          </span>
        </a>
      </div>

      <p className="supporting-copy pt-3 text-xs">
        Centro de coordinacion para situaciones de emergencia. Reporte inmediatamente cualquier situacion critica.
      </p>
    </aside>
  );
}
