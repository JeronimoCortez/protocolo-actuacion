"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { matchHeaderSearchEntries } from "../data/headerSearchIndex";
import { MenuIcon, SearchIcon, XIcon } from "./icons";

export default function Header({ navItems }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return matchHeaderSearchEntries(searchQuery).slice(0, 8);
  }, [searchQuery]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevOpen) => !prevOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const goToResult = (entry) => {
    if (!entry?.href) return;
    router.push(entry.href);
    setSearchQuery("");
    closeMobileMenu();
  };

  const handleSearchSubmit = () => {
    if (!searchResults.length) return;
    goToResult(searchResults[0]);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="flex h-16 items-center gap-3 md:gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-[1.08rem] font-semibold tracking-tight text-[var(--primary)]"
          >
            <img
              className="h-10 md:h-15 w-auto"
              src="/logo-dae.png"
              alt="Protocolo de Actuacion Escolar"
            />
          </Link>

          <nav className="hidden flex-1 gap-1 md:flex md:items-center">
            {navItems.map((item) => (
              <Link
                href={item.link}
                key={item.label}
                className="whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium text-[var(--text-soft)] transition hover:text-blue-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative hidden md:block">
            <label className="flex w-[280px] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5">
              <SearchIcon className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Buscar títulos..."
                aria-label="Buscar"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  handleSearchSubmit();
                }}
                className="control-text w-full border-none bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
              />
            </label>

            {searchQuery.trim() ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 max-h-72 w-[360px] overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => goToResult(result)}
                      className="flex w-full items-start justify-between gap-2 border-b border-slate-100 px-3 py-2 text-left transition last:border-b-0 hover:bg-slate-50"
                    >
                      <span className="control-text font-medium text-slate-900">{result.title}</span>
                      <span className="text-xs text-slate-500">{result.subtitle}</span>
                    </button>
                  ))
                ) : (
                  <p className="supporting-copy px-3 py-2">Sin resultados por título.</p>
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--heading)] md:hidden"
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
              placeholder="Buscar títulos..."
              aria-label="Buscar"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                handleSearchSubmit();
              }}
              className="control-text w-full border-none bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </label>

          {searchQuery.trim() ? (
            <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white">
              {searchResults.length ? (
                searchResults.map((result) => (
                  <button
                    key={`mobile-${result.id}`}
                    type="button"
                    onClick={() => goToResult(result)}
                    className="flex w-full items-start justify-between gap-2 border-b border-slate-100 px-3 py-2 text-left transition last:border-b-0 hover:bg-slate-50"
                  >
                    <span className="control-text font-medium text-slate-900">{result.title}</span>
                    <span className="text-xs text-slate-500">{result.subtitle}</span>
                  </button>
                ))
              ) : (
                <p className="supporting-copy px-3 py-2">Sin resultados por título.</p>
              )}
            </div>
          ) : null}

          <nav className="mt-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                onClick={closeMobileMenu}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:text-blue-500"
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
