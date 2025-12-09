"use client"

import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { AlertBanner } from "@/components/emergency/alert-banner"
import { QuickActions } from "@/components/emergency/quick-actions"
import { EmergencyContacts } from "@/components/emergency/emergency-contacts"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { ProcedureCard } from "@/components/emergency/procedure-card"
import { Flame, Heart, Shield, Building2, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DAECentralCard } from "@/components/emergency/dae-central-card"
import { MendozaResourcesCards } from "@/components/emergency/mendoza-resources-cards"

export default function HomePage() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        {/* Alert Banner - For active emergencies or important notices */}
        <AlertBanner
          type="info"
          title="Simulacro programado"
          message="Próximo simulacro de evacuación: 15 de enero, 10:00 AM"
          action={{ label: "Ver detalles", href: "/procedimientos/evacuacion" }}
        />

        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <section className="py-8 lg:py-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground text-balance mb-2">
                    Guía de Emergencias Escolar
                  </h1>
                  <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
                    Protocolos y procedimientos para responder ante situaciones de emergencia. Accede rápidamente a las
                    acciones necesarias.
                  </p>
                </div>

                {/* Current Status */}
                <div className="lg:w-80">
                  <DAECentralCard />
                </div>
              </div>

              {/* Quick Keyboard Shortcuts Info */}
              <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground mb-8">
                <span>Atajos de teclado:</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">E</kbd>
                  <span className="ml-1">Menú emergencia</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Q</kbd>
                  <span className="ml-1">Acceso rápido</span>
                </span>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Quick Actions */}
              <div className="lg:col-span-2 space-y-8">
                <QuickActions />

                {/* All Procedures Section */}
                <section aria-labelledby="procedures-heading">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="procedures-heading" className="text-xl font-bold text-foreground flex items-center gap-2">
                      <span className="w-2 h-6 bg-primary rounded-full" aria-hidden="true"></span>
                      Todos los Procedimientos
                    </h2>
                    <Link href="/procedimientos">
                      <Button variant="ghost" size="sm" className="gap-2">
                        Ver todos
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <ProcedureCard
                      id="evacuation"
                      title="Evacuación General"
                      description="Protocolo para evacuar el edificio de manera segura y ordenada ante cualquier emergencia."
                      icon={<Building2 className="w-10 h-10 text-emergency" aria-hidden="true" />}
                      priority="critical"
                      estimatedTime="5-10 min"
                      responsibleRole="Todo el personal"
                      href="/procedimientos/evacuacion"
                    />

                    <ProcedureCard
                      id="fire"
                      title="Incendio"
                      description="Acciones inmediatas ante detección de fuego o humo en las instalaciones."
                      icon={<Flame className="w-10 h-10 text-emergency" aria-hidden="true" />}
                      priority="critical"
                      estimatedTime="Inmediato"
                      responsibleRole="Brigada de emergencia"
                      href="/procedimientos/incendio"
                    />

                    <ProcedureCard
                      id="medical"
                      title="Emergencia Médica"
                      description="Primeros auxilios y procedimientos ante lesiones, enfermedades súbitas o accidentes."
                      icon={<Heart className="w-10 h-10 text-warning" aria-hidden="true" />}
                      priority="high"
                      estimatedTime="Variable"
                      responsibleRole="Personal de enfermería"
                      href="/procedimientos/medica"
                    />

                    <ProcedureCard
                      id="lockdown"
                      title="Confinamiento"
                      description="Protocolo de resguardo interno ante amenazas externas o situaciones de riesgo."
                      icon={<Shield className="w-10 h-10 text-warning" aria-hidden="true" />}
                      priority="high"
                      estimatedTime="Hasta nuevo aviso"
                      responsibleRole="Coordinadores de zona"
                      href="/procedimientos/confinamiento"
                    />
                  </div>
                </section>

                {/* Maps & Resources */}
                <MendozaResourcesCards />
              </div>

              {/* Right Column - Contacts & Info */}
              <div className="space-y-6">
                <EmergencyContacts />

                {/* Roles & Responsibilities Quick Access */}
                <section className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                    Roles y Responsabilidades
                  </h2>

                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground">Coordinador General</p>
                      <p className="text-sm text-muted-foreground">Dirección y toma de decisiones</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground">Brigada de Evacuación</p>
                      <p className="text-sm text-muted-foreground">Guiar salidas seguras</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground">Brigada de Primeros Auxilios</p>
                      <p className="text-sm text-muted-foreground">Atención médica inicial</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground">Brigada Contra Incendios</p>
                      <p className="text-sm text-muted-foreground">Control inicial de fuego</p>
                    </div>
                  </div>

                  <Link
                    href="/contactos#roles"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Ver organigrama completo
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </section>

                {/* Legal Notice Placeholder */}
                <div className="bg-muted/50 rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota legal:</strong> Este sistema complementa pero no sustituye los protocolos oficiales de
                    Protección Civil. Consulte siempre las disposiciones vigentes de su localidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  © 2025 Guía de Emergencias Escolar. Última actualización: Enero 2025
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/configuracion"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accesibilidad
                </Link>
                <Link
                  href="/recursos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Recursos
                </Link>
                <Link href="/ayuda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Ayuda
                </Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Emergency Widget */}
        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
