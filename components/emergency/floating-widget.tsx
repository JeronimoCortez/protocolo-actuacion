"use client"

import { useState, useEffect } from "react"
import { Phone, AlertCircle, X, ChevronUp, Heart, MapPin, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FloatingWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsExpanded((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-14 right-6 z-50 flex flex-col items-end gap-3 no-print"
      role="complementary"
      aria-label="Acceso rapido a emergencias"
    >
      {isExpanded && (
        <div className="bg-card rounded-2xl shadow-2xl border border-border p-4 w-64 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Acceso Rapido</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Cerrar menu"
            >
              <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href="tel:911"
              className="flex items-center gap-3 p-3 rounded-xl bg-emergency/10 hover:bg-emergency/20 transition-colors"
            >
              <Phone className="w-5 h-5 text-emergency" aria-hidden="true" />
              <span className="font-medium text-foreground">Llamar 911</span>
            </a>

            <Link
              href="/protocolos/medica"
              className="flex items-center gap-3 p-3 rounded-xl bg-success/10 hover:bg-success/20 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <Heart className="w-5 h-5 text-success" aria-hidden="true" />
              <span className="font-medium text-foreground">Emergencia Medica</span>
            </Link>

            <a
              href="tel:4231473"
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-warning/20 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <Building className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="font-medium text-foreground">Llamar a DAE</span>
            </a>

            <Link
              href="/recursos"
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="font-medium text-foreground">Ver Recursos</span>
            </Link>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
          isExpanded
            ? "bg-muted text-foreground hover:bg-muted/80"
            : "bg-emergency text-emergency-foreground hover:bg-emergency/90 emergency-pulse"
        }`}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Cerrar menu de emergencia" : "Abrir menu de emergencia"}
      >
        {isExpanded ? (
          <ChevronUp className="w-6 h-6" aria-hidden="true" />
        ) : (
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}
