"use client"

import { useState } from "react"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { ProcedureHeader } from "@/components/emergency/procedure-header"
import { ProcedureTimeline } from "@/components/emergency/procedure-timeline"
import { ViewToggle } from "@/components/emergency/view-toggle"
import { QuickSummary } from "@/components/emergency/quick-summary"
import { Building2, Phone, MapPin, Users, FileText } from "lucide-react"
import Link from "next/link"

const evacuationSteps = [
  {
    id: "1",
    title: "Escuchar la Alarma",
    description: "Al escuchar la alarma de evacuación, detenga toda actividad inmediatamente.",
    details: [
      "La alarma de evacuación es un sonido continuo que indica que se debe abandonar el edificio.",
      "Mantenga la calma y siga las instrucciones del personal.",
      "No ignore la alarma, incluso si cree que es un simulacro.",
    ],
    responsible: "Todos",
    duration: "Inmediato",
  },
  {
    id: "2",
    title: "Prepararse para Salir",
    description: "Tome solo lo esencial y prepárese para evacuar ordenadamente.",
    details: [
      "Los maestros deben tomar la lista de asistencia y teléfono celular.",
      "Los estudiantes deben dejar sus pertenencias y formar fila.",
      "Apague equipos eléctricos si es seguro y rápido hacerlo.",
      "Cierre ventanas si está cerca de ellas.",
    ],
    responsible: "Maestros y estudiantes",
    duration: "30 seg - 1 min",
  },
  {
    id: "3",
    title: "Seguir la Ruta de Evacuación",
    description: "Camine hacia la salida siguiendo la ruta señalizada para su zona.",
    details: [
      "Cada salón tiene asignada una ruta de evacuación específica.",
      "Siga las señales verdes de salida de emergencia.",
      "Camine, no corra. Mantenga la fila ordenada.",
      "Ayude a personas con movilidad reducida.",
      "Use las escaleras, nunca el elevador.",
    ],
    responsible: "Brigada de evacuación",
    duration: "2-4 min",
    warning: "Si encuentra humo en su ruta, agáchese y busque una ruta alternativa.",
  },
  {
    id: "4",
    title: "Llegar al Punto de Reunión",
    description: "Diríjase al punto de reunión asignado y permanezca ahí.",
    details: [
      "El punto de reunión principal es el patio trasero (zona verde marcada).",
      "Punto alternativo: estacionamiento norte.",
      "Permanezca con su grupo y no se disperse.",
      "Mantenga distancia del edificio.",
    ],
    responsible: "Todos",
    duration: "1-2 min",
  },
  {
    id: "5",
    title: "Conteo de Personas",
    description: "El maestro realizará el conteo y reportará al coordinador.",
    details: [
      "Responda cuando escuche su nombre.",
      "Informe si sabe de alguien que no evacuó.",
      "No abandone el punto de reunión.",
    ],
    responsible: "Maestros",
    duration: "3-5 min",
  },
  {
    id: "6",
    title: "Esperar Autorización",
    description: "Permanezca en el punto de reunión hasta recibir indicaciones.",
    details: [
      "Solo el coordinador de emergencia puede autorizar el regreso.",
      "Si se requiere moverse a otro lugar, siga las instrucciones.",
      "Mantenga la calma y ayude a tranquilizar a otros.",
    ],
    responsible: "Coordinador de emergencia",
    duration: "Variable",
  },
]

const doList = [
  "Mantener la calma en todo momento",
  "Seguir la ruta de evacuación asignada",
  "Caminar ordenadamente en fila",
  "Ayudar a quienes lo necesiten",
  "Cerrar puertas al salir (sin llave)",
  "Permanecer en el punto de reunión",
]

const dontList = [
  "Usar elevadores",
  "Correr o empujar a otros",
  "Regresar por pertenencias",
  "Dispersarse del grupo",
  "Regresar al edificio sin autorización",
  "Bloquear salidas de emergencia",
]

export default function EvacuacionPage() {
  const [view, setView] = useState<"quick" | "detailed">("detailed")

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-16 lg:pt-20">
          <ProcedureHeader
            title="Protocolo de Evacuación General"
            description="Procedimiento estándar para evacuar el edificio de manera segura y ordenada ante cualquier situación de emergencia que requiera abandonar las instalaciones."
            priority="critical"
            estimatedTime="5-10 minutos para evacuación completa"
            responsibleTeam="Todo el personal"
            lastUpdated="Enero 2025"
            icon={<Building2 className="w-8 h-8" aria-hidden="true" />}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8 no-print">
              <ViewToggle view={view} onViewChange={setView} />

              <Link
                href="/mapas"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Ver mapa de evacuación
              </Link>
            </div>

            {view === "quick" && <QuickSummary doList={doList} dontList={dontList} emergencyNumber="911" />}

            {view === "detailed" && (
              <>
                <QuickSummary doList={doList} dontList={dontList} emergencyNumber="911" />

                <section aria-labelledby="steps-heading" className="mt-8">
                  <h2 id="steps-heading" className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                    Pasos del Procedimiento
                  </h2>

                  <ProcedureTimeline steps={evacuationSteps} allowCheckoff={true} />
                </section>
              </>
            )}

            <section className="mt-12 pt-8 border-t border-border no-print">
              <h2 className="text-lg font-bold text-foreground mb-4">Recursos Relacionados</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  href="/mapas"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Rutas de Evacuación</h3>
                  <p className="text-sm text-muted-foreground">Mapas por edificio</p>
                </Link>
                <Link
                  href="/contactos"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <Phone className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Contactos</h3>
                  <p className="text-sm text-muted-foreground">Números de emergencia</p>
                </Link>
                <Link
                  href="/contactos#roles"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <Users className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Brigada de Evacuación</h3>
                  <p className="text-sm text-muted-foreground">Ver integrantes</p>
                </Link>
              </div>
            </section>
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
