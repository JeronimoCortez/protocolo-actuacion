"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, CheckCircle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  cancelText: string
  variant?: "emergency" | "warning" | "success"
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  variant = "warning",
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const variantStyles = {
    emergency: {
      icon: <AlertTriangle className="w-12 h-12 text-emergency" aria-hidden="true" />,
      confirmClass: "bg-emergency hover:bg-emergency/90 text-emergency-foreground",
      bgClass: "bg-emergency/10",
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-warning" aria-hidden="true" />,
      confirmClass: "bg-warning hover:bg-warning/90 text-warning-foreground",
      bgClass: "bg-warning/10",
    },
    success: {
      icon: <CheckCircle className="w-12 h-12 text-success" aria-hidden="true" />,
      confirmClass: "bg-success hover:bg-success/90 text-success-foreground",
      bgClass: "bg-success/10",
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </button>

        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${styles.bgClass} mb-4`}>
            {styles.icon}
          </div>

          <h2 id="modal-title" className="text-xl font-bold text-foreground mb-2">
            {title}
          </h2>

          <p id="modal-description" className="text-muted-foreground mb-6">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              {cancelText}
            </Button>
            <Button ref={confirmButtonRef} className={`flex-1 ${styles.confirmClass}`} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
