"use client";

import { AccessibilityProvider } from "@/lib/accessibility-context";
import { EmergencyHeader } from "@/components/emergency/emergency-header";
import { AlertBanner } from "@/components/emergency/alert-banner";
import {
  QuickAction,
  QuickActions,
} from "@/components/emergency/quick-actions";
import { EmergencyContacts } from "@/components/emergency/emergency-contacts";
import { FloatingWidget } from "@/components/emergency/floating-widget";
import { ProcedureCard } from "@/components/emergency/procedure-card";
import {
  Flame,
  Heart,
  Shield,
  Building2,
  Users,
  ExternalLink,
  AlertTriangle,
  Siren,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DAECentralCard } from "@/components/emergency/dae-central-card";
import { MendozaResourcesCards } from "@/components/emergency/mendoza-resources-cards";
import { procedures } from "./procedimientos/page";
import { SituacionesEmergentes } from "@/components/emergency/situaciones-emergentes";
import { ProceduresCards } from "@/components/emergency/procedures-cards";

const secondaryActions: QuickAction[] = [
  {
    id: "lockdown",
    title: "Confinamiento",
    description: "Protocolo de resguardo",
    icon: <Shield className="w-6 h-6" aria-hidden="true" />,
    color: "warning",
    href: "/procedimientos/confinamiento",
  },
  {
    id: "earthquake",
    title: "Sismo",
    description: "Protocolo ante temblores",
    icon: <AlertTriangle className="w-6 h-6" aria-hidden="true" />,
    color: "warning",
    href: "/procedimientos/sismo",
  },
  {
    id: "intruder",
    title: "Intruso",
    description: "Protocolo de seguridad",
    icon: <Siren className="w-6 h-6" aria-hidden="true" />,
    color: "emergency",
    href: "/procedimientos/intruso",
  },
  {
    id: "missing",
    title: "Persona Perdida",
    description: "Protocolo de búsqueda",
    icon: <Users className="w-6 h-6" aria-hidden="true" />,
    color: "primary",
    href: "/procedimientos/persona-perdida",
  },
];

const colorClasses = {
  emergency:
    "bg-emergency/10 border-emergency/30 hover:bg-emergency/20 text-emergency",
  warning: "bg-warning/10 border-warning/30 hover:bg-warning/20 text-warning",
  success: "bg-success/10 border-success/30 hover:bg-success/20 text-success",
  primary: "bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary",
};

const iconBgClasses = {
  emergency: "bg-emergency text-emergency-foreground",
  warning: "bg-warning text-warning-foreground",
  success: "bg-success text-success-foreground",
  primary: "bg-primary text-primary-foreground",
};

export default function HomePage() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        {/* Alert Banner */}
        <AlertBanner
          type="info"
          title="Simulacro programado"
          message="Próximo simulacro de evacuación: 15 de enero, 10:00 AM"
          action={{ label: "Ver detalles", href: "/procedimientos/evacuacion" }}
        />

        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* HERO */}
            <section className="py-8 lg:py-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    Protocolo de actuación
                  </h1>
                </div>

                <div className="lg:w-80">
                  <DAECentralCard />
                </div>
              </div>
            </section>

            {/* SITUACIONES EMERGENTES */}
            <section className="mb-10">
              <SituacionesEmergentes />
            </section>

            {/* PROCEDURES CARDS */}
            <section className="mb-12">
              <ProceduresCards />
            </section>

            {/* MAIN GRID */}
            <section className="grid lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-8">
                <QuickActions />

                <div className="md:hidden mb-2">
                  <EmergencyContacts />
                </div>

                {/* Todos los procedimientos */}
                <section aria-labelledby="procedures-heading">
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      id="procedures-heading"
                      className="text-xl font-bold text-foreground flex items-center gap-2"
                    >
                      <span className="w-2 h-6 bg-primary rounded-full" />
                      Todos los Procedimientos
                    </h2>

                    <Link href="/procedimientos">
                      <Button variant="ghost" size="sm" className="gap-2">
                        Ver todos
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {procedures.slice(0, 4).map((p) => (
                      <ProcedureCard key={p.id} {...p} />
                    ))}
                  </div>
                </section>

                {/* Otros procedimientos */}
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-5 bg-warning rounded-full" />
                    Otros Procedimientos
                  </h2>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {secondaryActions.map((action) => (
                      <Link
                        key={action.id}
                        href={action.href || "#"}
                        className={`p-4 rounded-xl border transition-all flex flex-col ${
                          colorClasses[action.color]
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            iconBgClasses[action.color]
                          } mb-3`}
                        >
                          {action.icon}
                        </div>
                        <h3 className="font-semibold text-sm mb-1">
                          {action.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>

                <MendozaResourcesCards />
              </div>

              {/* RIGHT COLUMN */}
              <aside className="space-y-6">
                <div className="hidden md:block">
                  <EmergencyContacts />
                </div>
                {/* Roles */}
                <section className="bg-card rounded-2xl border p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Roles y Responsabilidades
                  </h2>

                  <div className="space-y-3">
                    {[
                      ["Coordinador General", "Dirección y toma de decisiones"],
                      ["Brigada de Evacuación", "Guiar salidas seguras"],
                      ["Primeros Auxilios", "Atención médica inicial"],
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

                {/* Nota legal */}
                <div className="bg-muted/50 rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota legal:</strong> Este sistema complementa pero
                    no sustituye los protocolos oficiales de Protección Civil.
                  </p>
                </div>
              </aside>
            </section>
          </div>
        </main>

        <footer className="bg-card border-t py-8">
          <div className="max-w-7xl mx-auto px-4 flex justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 Protocolo de actuación – DAE
            </p>
          </div>
        </footer>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  );
}
