"use client";

import Link from "next/link";
import { ExternalLink, Users } from "lucide-react";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { AlertBanner } from "@/components/emergency/alert-banner";
import { DAECentralCard } from "@/components/emergency/dae-central-card";
import { EmergencyContacts } from "@/components/emergency/emergency-contacts";
import { EmergencyHeader } from "@/components/emergency/emergency-header";
import { FloatingWidget } from "@/components/emergency/floating-widget";
import { MendozaResourcesCards } from "@/components/emergency/mendoza-resources-cards";
import { QuickActions } from "@/components/emergency/quick-actions";
import {
  complementaryProtocolGroups,
  thematicAxisGroups,
} from "@/lib/thematic-protocols";
import { SituacionesEmergentes } from "@/components/emergency/situaciones-emergentes";

const axisCardColorClasses = [
  "border-primary/30 bg-primary/5 hover:bg-primary/10",
  "border-warning/30 bg-warning/5 hover:bg-warning/10",
  "border-emergency/30 bg-emergency/5 hover:bg-emergency/10",
];

const indexAxes = [...thematicAxisGroups, ...complementaryProtocolGroups];

export default function HomePage() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <AlertBanner
          type="info"
          title="Simulacro programado"
          message="Proximo simulacro de evacuacion: 15 de enero, 10:00 AM"
          action={{ label: "Ver detalles", href: "/protocolos/evacuacion" }}
        />

        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="py-8 lg:py-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    Protocolo de actuacion
                  </h1>
                  <p className="text-base lg:text-lg text-muted-foreground max-w-2xl">
                    Acceso rapido a acciones urgentes y ejes del sistema para decidir que hacer sin perder tiempo.
                  </p>
                </div>

                <div className="lg:w-80">
                  <DAECentralCard />
                </div>
              </div>
            </section>

            <SituacionesEmergentes/>

            <section className="grid xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-10">
                <QuickActions />

                <section aria-labelledby="axes-heading">
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      id="axes-heading"
                      className="text-2xl font-bold text-foreground flex items-center gap-2"
                    >
                      <span className="w-2 h-7 bg-primary rounded-full" />
                      Ejes
                    </h2>
                    <Link
                      href="/protocolos"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      Ver mapa completo
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Selecciona un eje para abrir directamente su seccion de protocolos.
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {indexAxes.map((axis, index) => (
                      <Link
                        key={axis.id}
                        href={`/protocolos#${axis.id}`}
                        className={`rounded-2xl border p-5 transition-colors h-full flex flex-col ${
                          axisCardColorClasses[index % axisCardColorClasses.length]
                        }`}
                      >
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          {axis.displayTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground flex-1">
                          {axis.protocolCount} protocolos disponibles en este eje.
                        </p>
                        <span className="mt-4 text-sm font-semibold text-foreground">
                          Abrir eje
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>

                <MendozaResourcesCards />
              </div>

              <aside className="space-y-6">
                <div className="xl:block">
                  <EmergencyContacts />
                </div>

                <section className="bg-card rounded-2xl border p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Roles y Responsabilidades
                  </h2>

                  <div className="space-y-3">
                    {[
                      ["Coordinador General", "Direccion y toma de decisiones"],
                      ["Brigada de Evacuacion", "Guiar salidas seguras"],
                      ["Primeros Auxilios", "Atencion medica inicial"],
                      ["Contra Incendios", "Control inicial de fuego"],
                    ].map(([title, desc]) => (
                      <div key={title} className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contactos#roles"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    Ver organigrama completo
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </section>

                <div className="bg-muted/50 rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota legal:</strong> Este sistema complementa pero no sustituye los protocolos oficiales
                    de Proteccion Civil.
                  </p>
                </div>
              </aside>
            </section>
          </div>
        </main>

        <footer className="bg-card border-t py-8">
          <div className="max-w-7xl mx-auto px-4 flex justify-between">
            <p className="text-sm text-muted-foreground">© 2025 Protocolo de actuacion - DAE</p>
          </div>
        </footer>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  );
}
