"use client"

import { Phone, Clock } from "lucide-react"

export function DAECentralCard() {
  const phoneNumber = "4231473"
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "")

  return (
    <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl border-2 border-primary/30 p-8 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-1">DAE Central</h3>
          <p className="text-sm text-muted-foreground">Despacho de Atención de Emergencias</p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-primary/15 rounded-full">
          <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold text-primary">8 a 17</span>
        </div>
      </div>

      {/* Phone Number */}
      <div className="pt-4 border-t border-primary/15">
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl hover:bg-primary/15 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <Phone className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Llamar ahora</p>
            <p className="text-3xl font-bold text-primary">{phoneNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Disponible</p>
            <p className="text-lg font-semibold text-primary">↗</p>
          </div>
        </a>
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground pt-2">
        Centro de coordinación para situaciones de emergencia. Reporte inmediatamente cualquier situación crítica.
      </p>
    </div>
  )
}
