"use client"

import type React from "react"
import { Phone } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Flame, AlertTriangle, Heart, Shield, ArrowRight, Siren, Users, Building2 } from "lucide-react"
import { ConfirmationModal } from "./confirmation-modal"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: "emergency" | "warning" | "success" | "primary"
  href?: string
  action?: () => void
  phoneNumber?: string
}

export function QuickActions() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const immediateActions: QuickAction[] = [
    {
      id: "dae",
      title: "Llamar DAE Central",
      description: "Despacho de Atención de Emergencias (8 a 17)",
      icon: <Phone className="w-8 h-8" aria-hidden="true" />,
      color: "emergency",
      phoneNumber: "4231473",
      action: () => (window.location.href = "tel:4231473"),
    },
    {
      id: "evacuate",
      title: "Evacuar Edificio",
      description: "Activar protocolo de evacuación inmediata",
      icon: <Building2 className="w-8 h-8" aria-hidden="true" />,
      color: "emergency",
      action: () => setActiveModal("evacuate"),
    },
    {
      id: "fire",
      title: "Incendio",
      description: "Protocolo contra incendios",
      icon: <Flame className="w-8 h-8" aria-hidden="true" />,
      color: "emergency",
      href: "/procedimientos/incendio",
    },
    {
      id: "medical",
      title: "Emergencia Médica",
      description: "Primeros auxilios y asistencia",
      icon: <Heart className="w-8 h-8" aria-hidden="true" />,
      color: "warning",
      href: "/procedimientos/medica",
    },
  ]

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
  ]

  const colorClasses = {
    emergency: "bg-emergency/10 border-emergency/30 hover:bg-emergency/20 text-emergency",
    warning: "bg-warning/10 border-warning/30 hover:bg-warning/20 text-warning",
    success: "bg-success/10 border-success/30 hover:bg-success/20 text-success",
    primary: "bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary",
  }

  const iconBgClasses = {
    emergency: "bg-emergency text-emergency-foreground",
    warning: "bg-warning text-warning-foreground",
    success: "bg-success text-success-foreground",
    primary: "bg-primary text-primary-foreground",
  }

  return (
    <section aria-labelledby="quick-actions-heading" className="space-y-8">
      {/* Immediate Actions - Large Cards */}
      <div>
        <h2 id="quick-actions-heading" className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-emergency rounded-full" aria-hidden="true"></span>
          Acciones Inmediatas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {immediateActions.map((action) => {
            const CardContent = (
              <>
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconBgClasses[action.color]} mb-4`}
                >
                  {action.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <div className="flex items-center text-sm font-medium text-foreground gap-1">
                  Ver protocolo
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </>
            )

            if (action.href) {
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col ${colorClasses[action.color]} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                >
                  {action.color === "emergency" && (
                    <span
                      className="absolute top-3 right-3 w-3 h-3 bg-emergency rounded-full animate-pulse"
                      aria-hidden="true"
                    ></span>
                  )}
                  {CardContent}
                </Link>
              )
            }

            if (action.phoneNumber) {
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col text-left ${colorClasses[action.color]} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                >
                  {action.color === "emergency" && (
                    <span
                      className="absolute top-3 right-3 w-3 h-3 bg-emergency rounded-full animate-pulse"
                      aria-hidden="true"
                    ></span>
                  )}
                  {CardContent}
                </button>
              )
            }

            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col text-left ${colorClasses[action.color]} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              >
                {action.color === "emergency" && (
                  <span
                    className="absolute top-3 right-3 w-3 h-3 bg-emergency rounded-full animate-pulse"
                    aria-hidden="true"
                  ></span>
                )}
                {CardContent}
              </button>
            )
          })}
        </div>
      </div>

      {/* Secondary Actions - Smaller Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-warning rounded-full" aria-hidden="true"></span>
          Otros Procedimientos
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {secondaryActions.map((action) => (
            <Link
              key={action.id}
              href={action.href || "#"}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col ${colorClasses[action.color]} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClasses[action.color]} mb-3`}
              >
                {action.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Evacuation Confirmation Modal */}
      <ConfirmationModal
        isOpen={activeModal === "evacuate"}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          setActiveModal(null)
          // Redirect to evacuation procedure
          window.location.href = "/procedimientos/evacuacion"
        }}
        title="¿Iniciar Evacuación?"
        description="Esta acción activará el protocolo de evacuación. Asegúrese de seguir las rutas de escape designadas."
        confirmText="Iniciar Evacuación"
        cancelText="Cancelar"
        variant="emergency"
      />
    </section>
  )
}
