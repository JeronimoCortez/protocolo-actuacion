"use client"

import type React from "react"

import Link from "next/link"
import { ArrowRight, Clock, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProcedureCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  priority: "critical" | "high" | "medium" | "low"
  estimatedTime?: string
  responsibleRole?: string
  href: string
  showProcedureButton?: boolean
  actions?: string[]
}

export function ProcedureCard({
  id,
  title,
  description,
  icon,
  priority,
  estimatedTime,
  responsibleRole,
  href,
  showProcedureButton = true,
}: ProcedureCardProps) {
  const priorityStyles = {
    critical: "border-emergency/40 bg-emergency/5",
    high: "border-warning/40 bg-warning/5",
    medium: "border-primary/40 bg-primary/5",
    low: "border-border bg-card",
  }

  const priorityBadgeStyles = {
    critical: "bg-emergency text-emergency-foreground",
    high: "bg-warning text-warning-foreground",
    medium: "bg-primary text-primary-foreground",
    low: "bg-muted text-muted-foreground",
  }

  const priorityLabels = {
    critical: "Crítico",
    high: "Alta",
    medium: "Media",
    low: "Baja",
  }

  return (
    <article
      className={`group relative rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${priorityStyles[priority]}`}
    >
      {/* Priority Badge */}
      <span
        className={`absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full ${priorityBadgeStyles[priority]}`}
      >
        {priorityLabels[priority]}
      </span>

      {/* Icon */}
      <div className="mb-4">{icon}</div>

      {/* Content */}
      <h3 className="text-lg font-bold text-foreground mb-2 pr-16">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
        {estimatedTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {estimatedTime}
          </span>
        )}
        {responsibleRole && (
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" aria-hidden="true" />
            {responsibleRole}
          </span>
        )}
      </div>

      {/* Actions */}
      {showProcedureButton && (
        <div className="flex items-center gap-2">
          <Link href={href} className="flex-1">
            <Button variant="default" size="sm" className="w-full gap-2">
              <FileText className="w-4 h-4" aria-hidden="true" />
              Ver Procedimiento
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      )}
    </article>
  )
}
