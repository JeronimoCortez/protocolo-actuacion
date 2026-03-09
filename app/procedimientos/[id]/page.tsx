"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { Checkbox } from "@/components/ui/checkbox"
import { getNodeChildren, getProcedureById, type ProcedureNode } from "@/lib/thematic-protocols"

type CheckedSteps = Record<string, boolean>

const buildStepKeys = (node: ProcedureNode): string[] => {
  const stepKeys = [
    ...(node.pasos?.map((_, index) => `${node.id}::paso::${index}`) ?? []),
    ...(node.contenido?.map((_, index) => `${node.id}::contenido::${index}`) ?? []),
  ]

  for (const child of getNodeChildren(node)) {
    stepKeys.push(...buildStepKeys(child))
  }

  return stepKeys
}

interface ProcedureNodeChecklistProps {
  node: ProcedureNode
  checkedSteps: CheckedSteps
  onSetChecked: (key: string, checked: boolean) => void
  depth?: number
}

function ProcedureNodeChecklist({ node, checkedSteps, onSetChecked, depth = 0 }: ProcedureNodeChecklistProps) {
  const children = getNodeChildren(node)
  const sectionClass = depth === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-card"

  return (
    <article className={`rounded-xl border ${sectionClass} p-4`}>
      <header className="mb-3">
        <h3 className={`${depth === 0 ? "text-xl" : "text-lg"} font-bold text-foreground`}>{node.titulo}</h3>
        {node.codigo && <p className="text-xs text-muted-foreground mt-1">Referencia: {node.codigo}</p>}
      </header>

      {node.descripcion && <p className="text-sm text-muted-foreground mb-4">{node.descripcion}</p>}

      {node.pasos && node.pasos.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-foreground mb-2">Pasos</p>
          <ul className="space-y-2">
            {node.pasos.map((paso, index) => {
              const key = `${node.id}::paso::${index}`
              const isChecked = Boolean(checkedSteps[key])
              return (
                <li key={key}>
                  <label
                    htmlFor={key}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                      isChecked ? "border-primary/50 bg-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Checkbox
                      id={key}
                      checked={isChecked}
                      onCheckedChange={(checked) => onSetChecked(key, checked === true)}
                      className="mt-0.5 size-5 rounded-md border-primary/40"
                    />
                    <span className={`text-sm ${isChecked ? "text-foreground line-through" : "text-muted-foreground"}`}>
                      {paso}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {node.contenido && node.contenido.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-foreground mb-2">Contenido</p>
          <ul className="space-y-2">
            {node.contenido.map((item, index) => {
              const key = `${node.id}::contenido::${index}`
              const isChecked = Boolean(checkedSteps[key])
              return (
                <li key={key}>
                  <label
                    htmlFor={key}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                      isChecked ? "border-primary/50 bg-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Checkbox
                      id={key}
                      checked={isChecked}
                      onCheckedChange={(checked) => onSetChecked(key, checked === true)}
                      className="mt-0.5 size-5 rounded-md border-primary/40"
                    />
                    <span className={`text-sm ${isChecked ? "text-foreground line-through" : "text-muted-foreground"}`}>
                      {item}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {children.length > 0 && (
        <div className="space-y-4 mt-4">
          {children.map((child) => (
            <ProcedureNodeChecklist
              key={child.id}
              node={child}
              checkedSteps={checkedSteps}
              onSetChecked={onSetChecked}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </article>
  )
}

export default function ProcedimientoDetallePage() {
  const params = useParams<{ id: string }>()
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id
  const procedureId = decodeURIComponent(rawId ?? "")

  const procedureData = useMemo(() => getProcedureById(procedureId), [procedureId])
  const [checkedSteps, setCheckedSteps] = useState<CheckedSteps>({})

  const stepKeys = useMemo(() => {
    if (!procedureData) {
      return []
    }

    return buildStepKeys(procedureData.procedure)
  }, [procedureData])

  useEffect(() => {
    if (!procedureData) {
      return
    }

    const storageKey = `procedure-checklist:${procedureData.procedure.id}`
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) {
      setCheckedSteps({})
      return
    }

    try {
      setCheckedSteps(JSON.parse(stored) as CheckedSteps)
    } catch {
      setCheckedSteps({})
    }
  }, [procedureData])

  useEffect(() => {
    if (!procedureData) {
      return
    }

    const storageKey = `procedure-checklist:${procedureData.procedure.id}`
    window.localStorage.setItem(storageKey, JSON.stringify(checkedSteps))
  }, [checkedSteps, procedureData])

  const completedCount = stepKeys.filter((key) => checkedSteps[key]).length
  const progress = stepKeys.length > 0 ? Math.round((completedCount / stepKeys.length) * 100) : 0

  const setStepChecked = (key: string, checked: boolean) => {
    setCheckedSteps((current) => ({
      ...current,
      [key]: checked,
    }))
  }

  const clearChecklist = () => {
    setCheckedSteps({})
  }

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {!procedureData && (
              <section className="py-10">
                <h1 className="text-2xl font-bold text-foreground mb-2">Procedimiento no encontrado</h1>
                <p className="text-muted-foreground mb-4">
                  El identificador solicitado no corresponde a un procedimiento disponible.
                </p>
                <Link href="/procedimientos" className="text-primary font-semibold hover:underline">
                  Volver a procedimientos
                </Link>
              </section>
            )}

            {procedureData && (
              <>
                <section className="py-8 border-b border-border mb-8">
                  <p className="text-sm text-muted-foreground mb-2">{procedureData.axis.displayTitle}</p>
                  <h1 className="text-3xl font-bold text-foreground mb-3">{procedureData.procedure.titulo}</h1>
                  {procedureData.procedure.descripcion && (
                    <p className="text-muted-foreground max-w-3xl mb-4">{procedureData.procedure.descripcion}</p>
                  )}

                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <p className="text-sm font-semibold text-foreground">
                        Progreso checklist: {completedCount} de {stepKeys.length} acciones
                      </p>
                      <button
                        type="button"
                        onClick={clearChecklist}
                        className="text-sm font-semibold text-primary hover:underline text-left sm:text-right"
                      >
                        Limpiar checks
                      </button>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{progress}% completado</p>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-5">
                    <Link href="/procedimientos" className="text-sm font-semibold text-primary hover:underline">
                      Volver al listado
                    </Link>
                    <Link href={`/protocolos#${procedureData.axis.id}`} className="text-sm font-semibold text-primary hover:underline">
                      Ir al eje en protocolos
                    </Link>
                  </div>
                </section>

                <section className="space-y-5">
                  <ProcedureNodeChecklist
                    node={procedureData.procedure}
                    checkedSteps={checkedSteps}
                    onSetChecked={setStepChecked}
                  />
                </section>
              </>
            )}
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
