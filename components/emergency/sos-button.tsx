"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { ConfirmationModal } from "./confirmation-modal"

export function SOSButton() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSOSClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    // In a real app, this would trigger actual emergency protocols
    setShowConfirmation(false)
    // Show success feedback
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100])
    }
  }

  return (
    <>
      <Button
        onClick={handleSOSClick}
        className="bg-emergency hover:bg-emergency/90 text-emergency-foreground font-bold px-4 py-2 h-10 sm:h-auto sm:px-6 sm:py-3 rounded-xl emergency-pulse shadow-lg"
        aria-label="Botón de emergencia SOS - Activar protocolo de emergencia"
      >
        <AlertCircle className="w-5 h-5 sm:mr-2" aria-hidden="true" />
        <span className="hidden sm:inline">SOS</span>
      </Button>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title="¿Activar Protocolo de Emergencia?"
        description="Esta acción notificará al personal de seguridad y activará los protocolos de emergencia establecidos."
        confirmText="Sí, Activar Emergencia"
        cancelText="Cancelar"
        variant="emergency"
      />
    </>
  )
}
