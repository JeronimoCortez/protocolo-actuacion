"use client"

import { useState } from "react"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { ProcedureHeader } from "@/components/emergency/procedure-header"
import { ProcedureTimeline } from "@/components/emergency/procedure-timeline"
import { ViewToggle } from "@/components/emergency/view-toggle"
import { QuickSummary } from "@/components/emergency/quick-summary"
import { Heart, Phone, MapPin, Users, FileText } from "lucide-react"
import Link from "next/link"

const medicalSteps = [
  {
    id: "1",
    title: "Evaluar la Situación",
    description: "Verifique que el área sea segura y evalúe el estado de la persona.",
    details: [
      "Asegúrese de que no hay peligro para usted o la víctima.",
      "Verifique si la persona está consciente llamándola y tocando suavemente su hombro.",
      "Observe signos vitales: respiración, sangrado visible, color de piel.",
      "No mueva a la persona si sospecha lesión de cuello o columna.",
    ],
    responsible: "Primer respondedor",
    duration: "30 seg",
    warning: "No mueva a la víctima a menos que esté en peligro inmediato.",
  },
  {
    id: "2",
    title: "Solicitar Ayuda",
    description: "Notifique a enfermería y solicite apoyo de emergencia si es necesario.",
    details: [
      "Envíe a alguien a buscar al personal de enfermería inmediatamente.",
      "Si la situación es grave, llame al 911 mientras se brinda atención.",
      "Proporcione la ubicación exacta y descripción de la emergencia.",
      "Solicite el botiquín de primeros auxilios más cercano.",
    ],
    responsible: "Testigo más cercano",
    duration: "1 min",
  },
  {
    id: "3",
    title: "Aplicar Primeros Auxilios",
    description: "Brinde atención básica según la situación mientras llega ayuda profesional.",
    details: [
      "Si hay sangrado, aplique presión directa con un paño limpio.",
      "Si la persona no respira y está capacitado, inicie RCP.",
      "Si hay convulsiones, retire objetos cercanos y proteja la cabeza.",
      "Mantenga a la persona cómoda y tranquila.",
      "Cubra a la persona si está en shock (piel fría, palidez).",
    ],
    responsible: "Personal capacitado",
    duration: "Hasta llegada de ayuda",
    warning: "Solo aplique procedimientos para los que esté capacitado.",
  },
  {
    id: "4",
    title: "Documentar y Comunicar",
    description: "Registre los eventos y notifique a los contactos de emergencia.",
    details: [
      "Anote la hora del incidente y las acciones tomadas.",
      "Recopile información de testigos.",
      "Notifique a los padres o tutores del estudiante.",
      "Informe a la dirección sobre el incidente.",
    ],
    responsible: "Enfermería / Administración",
    duration: "Después de estabilizar",
  },
  {
    id: "5",
    title: "Seguimiento",
    description: "Acompañe a la persona si es trasladada y complete reportes.",
    details: [
      "Un adulto responsable debe acompañar al estudiante si es trasladado.",
      "Lleve la información del seguro escolar.",
      "Complete el reporte de incidente para el expediente.",
      "Programe seguimiento según sea necesario.",
    ],
    responsible: "Personal designado",
    duration: "Variable",
  },
]

const doList = [
  "Mantener la calma y actuar con rapidez",
  "Verificar la seguridad del área",
  "Solicitar ayuda de enfermería",
  "Aplicar primeros auxilios básicos si está capacitado",
  "Mantener a la víctima cómoda y tranquila",
  "Documentar el incidente",
]

const dontList = [
  "Mover a la persona si hay posible lesión de columna",
  "Administrar medicamentos sin autorización",
  "Dejar sola a la víctima",
  "Hacer procedimientos sin capacitación",
  "Olvidar notificar a los padres",
  "Omitir el reporte del incidente",
]

export default function MedicaPage() {
  const [view, setView] = useState<"quick" | "detailed">("detailed")

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-16 lg:pt-20">
          <ProcedureHeader
            title="Emergencia Médica"
            description="Protocolo de primeros auxilios y procedimientos ante lesiones, enfermedades súbitas, accidentes o situaciones que requieran atención médica inmediata."
            priority="high"
            estimatedTime="Variable según la situación"
            responsibleTeam="Enfermería / Primeros auxilios"
            lastUpdated="Enero 2025"
            icon={<Heart className="w-8 h-8" aria-hidden="true" />}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8 no-print">
              <ViewToggle view={view} onViewChange={setView} />
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

                  <ProcedureTimeline steps={medicalSteps} allowCheckoff={true} />
                </section>
              </>
            )}

            <section className="mt-12 pt-8 border-t border-border no-print">
              <h2 className="text-lg font-bold text-foreground mb-4">Recursos Relacionados</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  href="/mapas#enfermeria"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Ubicación de Enfermería</h3>
                  <p className="text-sm text-muted-foreground">Ver en el mapa</p>
                </Link>
                <Link
                  href="/contactos"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <Phone className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Contactos Médicos</h3>
                  <p className="text-sm text-muted-foreground">Hospitales cercanos</p>
                </Link>
                <Link
                  href="/contactos#roles"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <Users className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Brigada de Primeros Auxilios</h3>
                  <p className="text-sm text-muted-foreground">Personal capacitado</p>
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
