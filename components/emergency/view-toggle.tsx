"use client"

import { List, FileText } from "lucide-react"

interface ViewToggleProps {
  view: "quick" | "detailed"
  onViewChange: (view: "quick" | "detailed") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-muted rounded-lg p-1" role="tablist" aria-label="Seleccionar vista">
      <button
        role="tab"
        aria-selected={view === "quick"}
        onClick={() => onViewChange("quick")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          view === "quick" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <List className="w-4 h-4" aria-hidden="true" />
        Vista Rápida
      </button>
      <button
        role="tab"
        aria-selected={view === "detailed"}
        onClick={() => onViewChange("detailed")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          view === "detailed" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <FileText className="w-4 h-4" aria-hidden="true" />
        Vista Detallada
      </button>
    </div>
  )
}
