"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle, MapPin, Users, Menu, X, Shield, Settings, Home } from "lucide-react"
import { SOSButton } from "./sos-button"

export function EmergencyHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Keyboard shortcut for emergency menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsMenuOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 no-print ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-card border-b border-border"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo/Title */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
            aria-label="Inicio - Guía de Emergencias"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">Guía de Emergencias</h1>
              <p className="text-xs text-muted-foreground">Escuela Primaria</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2" role="navigation" aria-label="Navegación principal">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" aria-hidden="true" />
                Inicio
              </Button>
            </Link>
            <Link href="/procedimientos">
              <Button variant="ghost" size="sm" className="gap-2">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                Procedimientos
              </Button>
            </Link>
            <Link href="/mapas">
              <Button variant="ghost" size="sm" className="gap-2">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Mapas
              </Button>
            </Link>
            <Link href="/contactos">
              <Button variant="ghost" size="sm" className="gap-2">
                <Users className="w-4 h-4" aria-hidden="true" />
                Contactos
              </Button>
            </Link>
            <Link href="/configuracion">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="w-4 h-4" aria-hidden="true" />
                Ajustes
              </Button>
            </Link>
          </nav>

          {/* Emergency Actions */}
          <div className="flex items-center gap-3">
            {/* Call Emergency - Always visible */}
            <a href="tel:911" className="hidden sm:flex">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-warning text-warning-foreground bg-warning/10 hover:bg-warning/20"
                aria-label="Llamar a emergencias 911"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">911</span>
              </Button>
            </a>

            {/* SOS Button - Maximum visibility */}
            <SOSButton />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="lg:hidden bg-card border-t border-border"
          role="navigation"
          aria-label="Menú móvil"
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
              href="/procedimientos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <AlertTriangle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Procedimientos</span>
            </Link>
            <Link
              href="/mapas"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Mapas y Rutas</span>
            </Link>
            <Link
              href="/contactos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium">Contactos y Roles</span>
            </Link>

            {/* Mobile Emergency Call */}
            <a
              href="tel:911"
              className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 hover:bg-warning/20 transition-colors"
            >
              <Phone className="w-5 h-5 text-warning" aria-hidden="true" />
              <span className="font-semibold text-warning-foreground">Llamar 911</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
