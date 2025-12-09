"use client"

import type { ReactNode } from "react"
import { CheckCircle, AlertTriangle, Phone, ArrowRight } from "lucide-react"

interface QuickAction {
  number: number
  title: string
  description: string
  icon?: ReactNode
}

interface QuickSummaryProps {
  // Original props for do/don't lists
  doList?: string[]
  dontList?: string[]
  emergencyNumber?: string
  // New props for numbered actions
  actions?: QuickAction[]
  showEmergencyCall?: boolean
}

export function QuickSummary({
  doList,
  dontList,
  emergencyNumber = "911",
  actions,
  showEmergencyCall = true,
}: QuickSummaryProps) {
  if (actions && actions.length > 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />
          Acciones Inmediatas
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          {actions.map((action) => (
            <div
              key={action.number}
              className="relative bg-card border-2 border-border rounded-2xl p-5 hover:border-primary/50 transition-colors"
            >
              {/* Step number badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {action.number}
              </div>

              {/* Icon */}
              {action.icon && <div className="mb-3">{action.icon}</div>}

              {/* Content */}
              <h4 className="font-bold text-foreground mb-1">{action.title}</h4>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Emergency Call */}
        {showEmergencyCall && (
          <a
            href={`tel:${emergencyNumber}`}
            className="flex items-center justify-center gap-3 p-4 bg-emergency text-emergency-foreground rounded-xl font-bold text-lg hover:bg-emergency/90 transition-colors"
          >
            <Phone className="w-6 h-6" aria-hidden="true" />
            En caso de emergencia real, llama al {emergencyNumber}
          </a>
        )}
      </div>
    )
  }

  // Original do/don't layout
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Do's */}
      {doList && doList.length > 0 && (
        <div className="bg-success/10 rounded-2xl p-6 border border-success/20">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
            <CheckCircle className="w-6 h-6 text-success" aria-hidden="true" />
            Qué HACER
          </h3>
          <ul className="space-y-3">
            {doList.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Don'ts */}
      {dontList && dontList.length > 0 && (
        <div className="bg-emergency/10 rounded-2xl p-6 border border-emergency/20">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
            <AlertTriangle className="w-6 h-6 text-emergency" aria-hidden="true" />
            Qué NO hacer
          </h3>
          <ul className="space-y-3">
            {dontList.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 flex items-center justify-center text-emergency font-bold shrink-0"
                  aria-hidden="true"
                >
                  ✕
                </span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Emergency Call */}
      {showEmergencyCall && (
        <div className="md:col-span-2">
          <a
            href={`tel:${emergencyNumber}`}
            className="flex items-center justify-center gap-3 p-4 bg-emergency text-emergency-foreground rounded-xl font-bold text-lg hover:bg-emergency/90 transition-colors"
          >
            <Phone className="w-6 h-6" aria-hidden="true" />
            En caso de emergencia real, llama al {emergencyNumber}
          </a>
        </div>
      )}
    </div>
  )
}
