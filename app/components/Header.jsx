import Link from "next/link";
import { SearchIcon } from "./icons";

export default function Header({ navItems }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-4 px-4 md:gap-8 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[1.1rem] font-serif text-[var(--primary)]">
          <img className="" src="./logo-dae.png" alt="Protocolo de Actuación Escolar" />
        </Link>

        <nav className="hidden flex-1 gap-1 md:flex">
          {navItems.map((item) => (
            <span
              key={item.label}
              className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition ${
                item.active
                  ? "bg-[var(--secondary)] text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </span>
          ))}
        </nav>

        <label className="flex w-[170px] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 md:w-[220px]">
          <SearchIcon className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Buscar..."
            aria-label="Buscar"
            className="w-full border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </label>
      </div>
    </header>
  );
}
