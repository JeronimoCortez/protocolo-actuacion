"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Phone,
  AlertTriangle,
  MapPin,
  Users,
  Menu,
  X,
  Shield,
  Home,
  FileText,
  Search,
} from "lucide-react"

type SearchResultType = "eje" | "procedimiento" | "protocolo"

interface SearchResultItem {
  id: string
  title: string
  type: SearchResultType
  href: string
  subtitle?: string
}

const resultTypeLabel: Record<SearchResultType, string> = {
  eje: "Eje",
  procedimiento: "Procedimiento",
  protocolo: "Protocolo",
}

export function EmergencyHeader() {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement | null>(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeResultIndex, setActiveResultIndex] = useState(-1)

  const trimmedQuery = searchQuery.trim()
  const hasSearchResults = searchResults.length > 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "e" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsMenuOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchRef.current) {
        return
      }

      if (!searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      setActiveResultIndex(-1)
      return
    }

    const controller = new AbortController()
    const debounceTimeout = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          setSearchResults([])
          return
        }

        const payload = (await response.json()) as { results?: SearchResultItem[] }
        setSearchResults(payload.results ?? [])
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSearchResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 180)

    return () => {
      window.clearTimeout(debounceTimeout)
      controller.abort()
    }
  }, [trimmedQuery])

  useEffect(() => {
    setActiveResultIndex(searchResults.length > 0 ? 0 : -1)
  }, [searchResults])

  const activeResult = useMemo(() => {
    if (activeResultIndex < 0 || activeResultIndex >= searchResults.length) {
      return null
    }

    return searchResults[activeResultIndex]
  }, [activeResultIndex, searchResults])

  const handleSelectResult = (result: SearchResultItem) => {
    router.push(result.href)
    setSearchQuery("")
    setSearchResults([])
    setIsSearchOpen(false)
    setActiveResultIndex(-1)
  }

  const handleSearchSubmit = () => {
    if (activeResult) {
      handleSelectResult(activeResult)
      return
    }

    if (searchResults[0]) {
      handleSelectResult(searchResults[0])
    }
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!hasSearchResults) {
        return
      }
      setIsSearchOpen(true)
      setActiveResultIndex((prev) => (prev + 1) % searchResults.length)
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!hasSearchResults) {
        return
      }
      setIsSearchOpen(true)
      setActiveResultIndex((prev) => (prev <= 0 ? searchResults.length - 1 : prev - 1))
    }

    if (event.key === "Enter") {
      event.preventDefault()
      handleSearchSubmit()
    }

    if (event.key === "Escape") {
      setIsSearchOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 no-print ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-card border-b border-border"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1 shrink-0"
            aria-label="Inicio - Guia de Emergencias"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">Protocolo de actuacion</h1>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-2" role="navigation" aria-label="Navegacion principal">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" aria-hidden="true" />
                Inicio
              </Button>
            </Link>
            <Link href="/protocolos">
              <Button variant="ghost" size="sm" className="gap-2">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                Protocolos
              </Button>
            </Link>
            <Link href="/procedimientos">
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="w-4 h-4" aria-hidden="true" />
                Procedimientos
              </Button>
            </Link>
            <Link href="/recursos">
              <Button variant="ghost" size="sm" className="gap-2">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Recursos
              </Button>
            </Link>
            <Link href="/contactos">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="w-4 h-4" aria-hidden="true" />
                Contactos
              </Button>
            </Link>
          </nav>

          <div ref={searchRef} className="relative flex-1 min-w-[140px] max-w-md">
            <label htmlFor="header-search" className="sr-only">
              Buscar ejes y protocolos
            </label>
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="header-search"
              type="search"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setIsSearchOpen(true)
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Buscar por titulo..."
              className="w-full h-10 rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />

            {isSearchOpen && (
              <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                {trimmedQuery.length < 2 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Escribe al menos 2 letras para buscar.</p>
                )}

                {trimmedQuery.length >= 2 && isSearching && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Buscando resultados...</p>
                )}

                {trimmedQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No hay resultados para esa busqueda.</p>
                )}

                {trimmedQuery.length >= 2 && !isSearching && searchResults.length > 0 && (
                  <ul className="max-h-80 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <li key={`${result.type}-${result.id}`}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSelectResult(result)}
                          className={`w-full text-left px-4 py-3 border-b border-border/60 last:border-b-0 transition-colors ${
                            index === activeResultIndex ? "bg-primary/10" : "hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">{result.title}</p>
                            <span className="text-[11px] uppercase tracking-wide text-primary font-semibold">
                              {resultTypeLabel[result.type]}
                            </span>
                          </div>
                          {result.subtitle && <p className="text-xs text-muted-foreground mt-1">{result.subtitle}</p>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:911" className="flex">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 px-2 sm:px-3 border-emergency/90 bg-emergency text-emergency-foreground hover:bg-emergency/90 shadow-sm"
                aria-label="Llamar a emergencias 911"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">911</span>
              </Button>
            </a>

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="xl:hidden bg-card border-t border-border"
          role="navigation"
          aria-label="Menu movil"
        >
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Inicio</span>
            </Link>
            <Link
              href="/protocolos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <AlertTriangle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Protocolos</span>
            </Link>
            <Link
              href="/procedimientos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Procedimientos</span>
            </Link>
            <Link
              href="/recursos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Recursos y rutas</span>
            </Link>
            <Link
              href="/contactos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Contactos y roles</span>
            </Link>

            <a
              href="tel:911"
              className="flex items-center gap-3 p-3 rounded-lg bg-emergency text-emergency-foreground hover:bg-emergency/90 transition-colors"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span className="font-semibold">Llamar 911</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
