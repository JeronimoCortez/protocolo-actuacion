import { ClockIcon, PhoneIcon } from "./icons";

export default function HeroSection() {
  return (
    <section
      className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 pb-10 pt-8 md:gap-10 md:px-6 md:pb-8 md:pt-14 lg:grid-cols-[1fr_380px]"
      aria-label="Presentación"
    >
      <div>
        <h1 className="mb-5 font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.2] tracking-[-0.01em] text-[var(--foreground)]">
          Protocolo de Actuación Escolar ante situaciones emergentes
        </h1>
      </div>

      <aside
        className="rounded-[1.25rem] border-2 border-[oklch(0.82_0.04_250)] bg-gradient-to-br from-[oklch(0.93_0.025_250)] to-[oklch(0.97_0.01_250)] p-5"
        aria-label="Contacto DAE Central"
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="mb-1 text-2xl font-bold text-[var(--primary)]">
              DAE Central
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Dirección de Acompañamiento Escolar
            </p>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[oklch(0.92_0.025_250)] px-3 py-2">
            <ClockIcon className="h-[13px] w-[13px] text-[var(--primary)]" />
            <span className="text-xs font-semibold text-[var(--primary)]">
              8:00 a 17:00 hs
            </span>
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
              <span className="mb-0.5 block text-xs text-[var(--muted-foreground)]">
                Llamar ahora
              </span>
              <span className="block text-[1.75rem] font-bold leading-none text-[var(--primary)]">
                4231473
              </span>
            </span>
            <span className="text-right">
              <span className="block text-xs text-[var(--muted-foreground)]">
                Disponible
              </span>
              <span className="block text-xl font-bold text-[var(--primary)]">
                ↗
              </span>
            </span>
          </a>
        </div>

        <p className="pt-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
          Centro de coordinación para situaciones de emergencia. Reporte
          inmediatamente cualquier situación crítica.
        </p>
      </aside>
    </section>
  );
}
