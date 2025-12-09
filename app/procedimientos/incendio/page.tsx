"use client"

import { useState } from "react"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { ProcedureHeader } from "@/components/emergency/procedure-header"
import { ProcedureTimeline } from "@/components/emergency/procedure-timeline"
import { ViewToggle } from "@/components/emergency/view-toggle"
import { QuickSummary } from "@/components/emergency/quick-summary"
import { Flame, Phone, MapPin, Users, FileText } from "lucide-react"
import Link from "next/link"

const fireSteps = [
  {
    id: "1",
    title: "Detectar y Alertar",
    description: "Identifique la situación y active la alarma de incendio más cercana.",
    details: [
      "Si detecta humo, fuego o olor a quemado, mantenga la calma.",
      "Active la estación manual de alarma más cercana (botón rojo en pasillos).",
      "Notifique a la persona más cercana sobre la situación.",
      "Si el fuego es pequeño y tiene extintor disponible, intente controlarlo solo si es seguro.",
    ],
    responsible: "Cualquier persona",
    duration: "30 seg",
    warning: "Nunca intente combatir un incendio si no está capacitado o si el fuego es grande.",
  },
  {
    id: "2",
    title: "Llamar a Emergencias",
    description: "Contacte a los servicios de emergencia inmediatamente.",
    details: [
      "Llame al 911 o al número de bomberos local.",
      "Proporcione la dirección exacta de la escuela.",
      "Describa la ubicación específica del incendio dentro del edificio.",
      "Indique si hay personas atrapadas o heridas.",
      "No cuelgue hasta que el operador lo indique.",
    ],
    responsible: "Personal administrativo",
    duration: "1-2 min",
  },
  {
    id: "3",
    title: "Iniciar Evacuación",
    description: "Guíe a todos hacia las salidas de emergencia siguiendo las rutas establecidas.",
    details: [
      "Los maestros deben tomar la lista de asistencia si está accesible.",
      "Forme filas ordenadas y avance hacia la salida más cercana.",
      "No use elevadores bajo ninguna circunstancia.",
      "Si hay humo, agáchese y avance cerca del piso donde el aire es más limpio.",
      "Toque las puertas antes de abrirlas; si están calientes, use otra ruta.",
    ],
    responsible: "Brigada de evacuación",
    duration: "3-5 min",
    warning: "Si una ruta está bloqueada por fuego o humo, use la ruta alternativa.",
  },
  {
    id: "4",
    title: "Dirigirse al Punto de Reunión",
    description: "Lleve a todos al punto de reunión designado y manténgalos ahí.",
    details: [
      "El punto de reunión principal está en el patio trasero (zona verde).",
      "Si el punto principal no es seguro, use el punto alternativo en el estacionamiento norte.",
      "Mantenga a los grupos organizados por salón.",
      "No permita que nadie regrese al edificio.",
    ],
    responsible: "Maestros / Coordinadores",
    duration: "2-3 min",
  },
  {
    id: "5",
    title: "Conteo y Reporte",
    description: "Verifique que todos estén presentes y reporte al coordinador.",
    details: [
      "Cada maestro debe pasar lista de sus alumnos.",
      "Reporte inmediatamente cualquier persona faltante al coordinador de emergencia.",
      "Proporcione información sobre la última ubicación conocida de personas faltantes.",
      "Mantenga a los estudiantes calmados y en su lugar.",
    ],
    responsible: "Maestros",
    duration: "3-5 min",
  },
  {
    id: "6",
    title: "Esperar Instrucciones",
    description: "Aguarde las indicaciones de los servicios de emergencia.",
    details: [
      "Solo los servicios de emergencia pueden autorizar el regreso al edificio.",
      "Siga todas las instrucciones de bomberos y personal de emergencia.",
      "Si se requiere evacuación a otro lugar, siga el protocolo de evacuación extendida.",
      "Mantenga a los padres informados a través de los canales oficiales.",
    ],
    responsible: "Dirección",
    duration: "Variable",
    isOptional: false,
  },
]

const doList = [
  "Mantener la calma y actuar con rapidez",
  "Activar la alarma de incendio",
  "Cerrar puertas al salir (sin llave)",
  "Agacharse si hay humo",
  "Dirigirse al punto de reunión",
  "Esperar el conteo de personas",
]

const dontList = [
  "Usar elevadores",
  "Regresar por pertenencias",
  "Correr o empujar",
  "Abrir puertas calientes",
  "Regresar al edificio sin autorización",
  "Combatir fuegos grandes sin capacitación",
]

export default function IncendioPage() {
  const [view, setView] = useState<"quick" | "detailed">("detailed")

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-16 lg:pt-20">
          <ProcedureHeader
            title="Protocolo de Incendio"
            description="Procedimiento paso a paso para responder ante la detección de fuego, humo o activación de alarmas contra incendio en las instalaciones escolares."
            priority="critical"
            estimatedTime="5-10 minutos para evacuación completa"
            responsibleTeam="Brigada contra incendios"
            lastUpdated="Enero 2025"
            icon={<Flame className="w-8 h-8" aria-hidden="true" />}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-8 no-print">
              <ViewToggle view={view} onViewChange={setView} />

              <Link
                href="/mapas#evacuacion"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Ver mapa de evacuación
              </Link>
            </div>

            {/* Quick View */}
            {view === "quick" && <QuickSummary doList={doList} dontList={dontList} emergencyNumber="911" />}

            {/* Detailed View */}
            {view === "detailed" && (
              <>
                <QuickSummary doList={doList} dontList={dontList} emergencyNumber="911" />

                <section aria-labelledby="steps-heading" className="mt-8">
                  <h2 id="steps-heading" className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                    Pasos del Procedimiento
                  </h2>

                  <ProcedureTimeline steps={fireSteps} allowCheckoff={true} />
                </section>
              </>
            )}

            {/* Related Resources */}
            <section className="mt-12 pt-8 border-t border-border no-print">
              <h2 className="text-lg font-bold text-foreground mb-4">Recursos Relacionados</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  href="/mapas"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Rutas de Evacuación</h3>
                  <p className="text-sm text-muted-foreground">Ver mapas interactivos</p>
                </Link>
                <Link
                  href="/contactos"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <Phone className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Contactos de Emergencia</h3>
                  <p className="text-sm text-muted-foreground">Números importantes</p>
                </Link>
                <Link
                  href="/contactos#roles"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <Users className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Brigada Contra Incendios</h3>
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
