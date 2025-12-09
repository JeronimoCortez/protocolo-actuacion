"use client"

import { useState } from "react"
import { Check, Circle, Clock, AlertTriangle, User } from "lucide-react"

interface TimelineStep {
  id: string
  title: string
  description: string
  details?: string[]
  responsible?: string
  duration?: string
  isOptional?: boolean
  warning?: string
}

interface ProcedureTimelineProps {
  steps: TimelineStep[]
  allowCheckoff?: boolean
}

export function ProcedureTimeline({ steps, allowCheckoff = true }: ProcedureTimelineProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  const toggleStep = (stepId: string) => {
    if (!allowCheckoff) return

    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)
  }

  const toggleExpand = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

      {/* Progress Fill */}
      <div
        className="absolute left-5 top-0 w-0.5 bg-success transition-all duration-500"
        style={{
          height: `${(completedSteps.size / steps.length) * 100}%`,
        }}
        aria-hidden="true"
      />

      <ol className="relative space-y-6" role="list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isExpanded = expandedStep === step.id

          return (
            <li key={step.id} className="relative pl-12">
              {/* Step Number/Check */}
              <button
                onClick={() => toggleStep(step.id)}
                disabled={!allowCheckoff}
                className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isCompleted
                    ? "bg-success text-success-foreground"
                    : "bg-card border-2 border-border hover:border-primary"
                } ${allowCheckoff ? "cursor-pointer" : "cursor-default"}`}
                aria-label={isCompleted ? `Paso ${index + 1} completado` : `Marcar paso ${index + 1} como completado`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <span className="text-sm font-bold text-foreground">{index + 1}</span>
                )}
              </button>

              {/* Step Content */}
              <div
                className={`bg-card rounded-xl border transition-all duration-200 ${
                  isCompleted ? "border-success/30 bg-success/5" : "border-border"
                } ${isExpanded ? "shadow-lg" : ""}`}
              >
                <button
                  onClick={() => toggleExpand(step.id)}
                  className="w-full text-left p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-xl"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-bold ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}
                        >
                          {step.title}
                        </h3>
                        {step.isOptional && (
                          <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                            Opcional
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${isCompleted ? "text-muted-foreground" : "text-muted-foreground"}`}>
                        {step.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      {step.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {step.duration}
                        </span>
                      )}
                      {step.responsible && (
                        <span className="hidden sm:flex items-center gap-1">
                          <User className="w-3 h-3" aria-hidden="true" />
                          {step.responsible}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (step.details || step.warning) && (
                  <div className="px-4 pb-4 border-t border-border mt-2 pt-4">
                    {step.warning && (
                      <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg mb-4">
                        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-sm text-warning-foreground">{step.warning}</p>
                      </div>
                    )}

                    {step.details && step.details.length > 0 && (
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Circle className="w-2 h-2 mt-2 text-primary shrink-0" aria-hidden="true" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}

                    {step.responsible && (
                      <p className="mt-4 text-sm text-muted-foreground sm:hidden">
                        <strong>Responsable:</strong> {step.responsible}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {/* Progress Summary */}
      {allowCheckoff && (
        <div className="mt-6 p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progreso</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.size} de {steps.length} pasos
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
              role="progressbar"
              aria-valuenow={completedSteps.size}
              aria-valuemin={0}
              aria-valuemax={steps.length}
            />
          </div>
        </div>
      )}
    </div>
  )
}
