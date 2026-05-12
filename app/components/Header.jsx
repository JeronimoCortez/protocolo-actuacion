"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, SearchIcon, XIcon } from "./icons";

export default function Header({ navItems }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevOpen) => !prevOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="flex h-16 items-center gap-3 md:gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-[1.1rem] font-serif text-[var(--primary)]"
          >
            <img
              className="h-10 md:h-15 w-auto"
              src="/logo-dae.png"
              alt="Protocolo de Actuacion Escolar"
            />
          </Link>

          <nav className="hidden flex-1 gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                href={item.link}
                key={item.label}
                className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition hover:text-blue-500`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <label className="hidden w-[220px] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 md:flex">
            <SearchIcon className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Buscar..."
              aria-label="Buscar"
              className="w-full border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </label>

          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] md:hidden"
            aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={`overflow-hidden transition-all duration-200 md:hidden ${
            isMobileMenuOpen ? "max-h-[500px] pb-4" : "max-h-0"
          }`}
        >
          <label className="mt-1 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5">
            <SearchIcon className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Buscar..."
              aria-label="Buscar"
              className="w-full border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </label>

          <nav className="mt-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                onClick={closeMobileMenu}
                className={`rounded-md px-3.5 py-2 text-sm font-medium transition`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
