"use client"

import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { MapPin, Globe, ExternalLink, ArrowRight } from "lucide-react"

export default function MapasPage() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <section className="py-8 lg:py-12 border-b border-border mb-12">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Mapas y Recursos</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  Accede a portales de geolocalización y guías de salud de la provincia de Mendoza para encontrar
                  hospitales, centros de salud, escuelas y otros servicios importantes.
                </p>
              </div>
            </section>

            {/* Resource Cards */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Geolocalización de Facilidades */}
              <a
                href="https://ide.mendoza.gov.ar/portal/apps/experiencebuilder/experience/?id=f4309e1dc7554744a4a9eed2fe8910cb"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="h-full p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-8 h-8 text-primary" aria-hidden="true" />
                    </div>
                    <ExternalLink
                      className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Geolocalización de Facilidades
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Accede al portal IDE Mendoza para ver la ubicación de hospitales, centros de salud, escuelas,
                    comisarías y otras facilidades en toda la provincia.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Abrir mapa interactivo
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
              </a>

              {/* Guía de Salud */}
              <a href="http://guia-salud.mendoza.gov.ar" target="_blank" rel="noopener noreferrer" className="group">
                <div className="h-full p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Globe className="w-8 h-8 text-primary" aria-hidden="true" />
                    </div>
                    <ExternalLink
                      className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Guía de Salud de Mendoza
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Directorio completo de centros de salud con información sobre especialidades, psicólogos, atención
                    de emergencias y servicios disponibles en la provincia.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Acceder a la guía
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
              </a>
            </div>

            {/* Info Section */}
            <section className="mt-12 p-6 bg-muted/50 rounded-2xl border border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">¿Por qué estos recursos?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>
                    <strong>Cobertura provincial:</strong> Acceso a todos los servicios de salud y facilidades en
                    Mendoza
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>
                    <strong>Información actualizada:</strong> Datos en tiempo real desde fuentes oficiales
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>
                    <strong>Especialidades médicas:</strong> Encuentra psicólogos, especialistas y servicios específicos
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
