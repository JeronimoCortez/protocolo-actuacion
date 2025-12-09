"use client"

import { useState } from "react"
import { AlertTriangle, X, Info, CheckCircle, AlertCircle } from "lucide-react"

interface AlertBannerProps {
  type: "emergency" | "warning" | "info" | "success"
  title: string
  message: string
  dismissible?: boolean
  action?: {
    label: string
    href: string
  }
}

export function AlertBanner({ type, title, message, dismissible = true, action }: AlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const styles = {
    emergency: {
      bg: "bg-emergency",
      text: "text-emergency-foreground",
      icon: <AlertCircle className="w-5 h-5" aria-hidden="true" />,
    },
    warning: {
      bg: "bg-warning",
      text: "text-warning-foreground",
      icon: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
    },
    info: {
      bg: "bg-primary",
      text: "text-primary-foreground",
      icon: <Info className="w-5 h-5" aria-hidden="true" />,
    },
    success: {
      bg: "bg-success",
      text: "text-success-foreground",
      icon: <CheckCircle className="w-5 h-5" aria-hidden="true" />,
    },
  }

  const { bg, text, icon } = styles[type]

  return (
    <div
      className={`${bg} ${text} py-3 px-4 no-print`}
      role="alert"
      aria-live={type === "emergency" ? "assertive" : "polite"}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <strong className="font-semibold">{title}</strong>
            <span className="hidden sm:inline"> — {message}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {action && (
            <a
              href={action.href}
              className={`text-sm font-medium underline underline-offset-2 hover:no-underline ${text}`}
            >
              {action.label}
            </a>
          )}

          {dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              className={`p-1 rounded hover:bg-white/20 transition-colors ${text}`}
              aria-label="Cerrar alerta"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
