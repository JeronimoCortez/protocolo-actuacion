"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import {
  complementaryProtocolGroups,
  procedureCatalog,
  thematicAxisGroups,
} from "@/lib/thematic-protocols"

const allAxisGroups = [...thematicAxisGroups, ...complementaryProtocolGroups]

export default function ProcedimientosPage() {
  const [selectedAxisId, setSelectedAxisId] = useState<string>("all")
  const [search, setSearch] = useState("")

  const normalizedSearch = search.trim().toLowerCase()

  const filteredItems = useMemo(() => {
    return procedureCatalog.filter((item) => {
      const matchesAxis = selectedAxisId === "all" || item.axisId === selectedAxisId
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.summary.toLowerCase().includes(normalizedSearch) ||
        (item.code?.toLowerCase().includes(normalizedSearch) ?? false)

      return matchesAxis && matchesSearch
    })
  }, [normalizedSearch, selectedAxisId])

  const groupsWithResults = useMemo(() => {
    const byAxisId = new Map<string, typeof filteredItems>()
    for (const axis of allAxisGroups) {
      byAxisId.set(axis.id, [])
    }

    for (const item of filteredItems) {
      const current = byAxisId.get(item.axisId)
      if (current) {
        current.push(item)
      }
    }

    return allAxisGroups
      .map((axis) => ({
        axis,
        items: byAxisId.get(axis.id) ?? [],
      }))
      .filter((group) => group.items.length > 0)
  }, [filteredItems])

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="py-8 lg:py-12 border-b border-border mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Procedimientos</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Elegi un eje, busca por palabra clave y abri cada procedimiento en una vista clara con checklist.
              </p>
              <Link href="/protocolos" className="inline-flex text-sm font-semibold text-primary mt-4 hover:underline">
                Volver a protocolos por eje
              </Link>
            </section>

            <section className="mb-10 space-y-6" aria-labelledby="filters-heading">
              <h2 id="filters-heading" className="text-xl font-bold text-foreground">
                Filtros visibles
              </h2>

              <div>
                <label htmlFor="procedure-search" className="text-sm font-semibold text-foreground block mb-2">
                  Buscar procedimiento
                </label>
                <input
                  id="procedure-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ejemplo: violencia, consumo, 2.4, explosivos"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Filtrar por eje</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAxisId("all")}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedAxisId === "all"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    Todos
                  </button>
                  {allAxisGroups.map((axis) => (
                    <button
                      key={axis.id}
                      type="button"
                      onClick={() => setSelectedAxisId(axis.id)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedAxisId === axis.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {axis.displayTitle}
                    </button>
                  ))}
                </div>
              </div>

            </section>

            <section aria-labelledby="results-heading">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
                <h2 id="results-heading" className="text-xl font-bold text-foreground">
                  Resultados
                </h2>
                <p className="text-sm text-muted-foreground">{filteredItems.length} procedimientos encontrados</p>
              </div>

              {groupsWithResults.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">
                    No encontramos resultados con esos filtros. Proba cambiando el eje o la palabra buscada.
                  </p>
                </div>
              )}

              <div className="space-y-10">
                {groupsWithResults.map((group) => (
                  <div key={group.axis.id}>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{group.axis.displayTitle}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.items.map((item) => (
                        <article key={item.id} className="rounded-xl border border-border bg-card p-4 flex flex-col">
                          <h4 className="text-base font-bold text-foreground mb-2">{item.title}</h4>
                          {item.code && <p className="text-xs text-muted-foreground mb-2">Referencia: {item.code}</p>}
                          <p className="text-sm text-muted-foreground flex-1">{item.summary}</p>
                          <p className="text-xs text-muted-foreground mt-3 mb-4">{item.actionCount} acciones</p>
                          <Link
                            href={`/procedimientos/${encodeURIComponent(item.id)}`}
                            className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                          >
                            Abrir vista del procedimiento
                          </Link>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
