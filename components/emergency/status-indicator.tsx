"use client"

interface StatusIndicatorProps {
  status: "safe" | "warning" | "emergency"
  label: string
  lastUpdated?: string
}

export function StatusIndicator({ status, label, lastUpdated }: StatusIndicatorProps) {
  const statusStyles = {
    safe: {
      bg: "bg-success",
      ring: "ring-success/30",
      text: "text-success",
      label: "Estado Normal",
    },
    warning: {
      bg: "bg-warning",
      ring: "ring-warning/30",
      text: "text-warning",
      label: "Precaución",
    },
    emergency: {
      bg: "bg-emergency",
      ring: "ring-emergency/30",
      text: "text-emergency",
      label: "Emergencia Activa",
    },
  }

  const { bg, ring, text, label: statusLabel } = statusStyles[status]

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
      <div className={`relative w-4 h-4 rounded-full ${bg} ring-4 ${ring}`}>
        {status === "emergency" && (
          <span className={`absolute inset-0 rounded-full ${bg} animate-ping`} aria-hidden="true"></span>
        )}
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${text}`}>{statusLabel}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {lastUpdated && <p className="text-xs text-muted-foreground">Actualizado: {lastUpdated}</p>}
    </div>
  )
}
