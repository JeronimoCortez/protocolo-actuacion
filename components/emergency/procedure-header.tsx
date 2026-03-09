"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, Share2, Clock, Users, AlertTriangle } from "lucide-react"

interface ProcedureHeaderProps {
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  estimatedTime?: string
  responsibleTeam?: string
  lastUpdated?: string
  icon: React.ReactNode
}

export function ProcedureHeader({
  title,
  description,
  priority,
  estimatedTime,
  responsibleTeam,
  lastUpdated,
  icon,
}: ProcedureHeaderProps) {
  const priorityStyles = {
    critical: { bg: "bg-emergency/10", text: "text-emergency", badge: "bg-emergency text-emergency-foreground" },
    high: { bg: "bg-warning/10", text: "text-warning", badge: "bg-warning text-warning-foreground" },
    medium: { bg: "bg-primary/10", text: "text-primary", badge: "bg-primary text-primary-foreground" },
    low: { bg: "bg-muted", text: "text-muted-foreground", badge: "bg-muted text-muted-foreground" },
  }

  const priorityLabels = {
    critical: "Prioridad Crítica",
    high: "Prioridad Alta",
    medium: "Prioridad Media",
    low: "Prioridad Baja",
  }

  const styles = priorityStyles[priority]

  const handlePrint = () => window.print()

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      })
    }
  }

  return (
    <header className={`${styles.bg} py-8 lg:py-12 border-b border-border`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href="/protocolos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver a protocolos
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${styles.badge}`}>{icon}</div>

            <div className="flex-1">
              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${styles.badge} mb-2`}
              >
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                {priorityLabels[priority]}
              </span>

              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{title}</h1>

              <p className="text-muted-foreground max-w-2xl">{description}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                {estimatedTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {estimatedTime}
                  </span>
                )}
                {responsibleTeam && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    {responsibleTeam}
                  </span>
                )}
                {lastUpdated && <span>Actualizado: {lastUpdated}</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 no-print">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 bg-transparent">
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Compartir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

