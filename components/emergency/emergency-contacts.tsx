"use client"

import { Phone, ExternalLink, Copy, Check } from "lucide-react"
import { useState } from "react"

interface Contact {
  id: string
  name: string
  role?: string
  phone: string
  isEmergency?: boolean
}

const emergencyContacts: Contact[] = [
  { id: "0", name: "DAE Central", phone: "4231473", isEmergency: true },
  { id: "1", name: "Emergencias", phone: "911", isEmergency: true },
  { id: "2", name: "Bomberos", phone: "(55) 5768-3700", isEmergency: true },
  { id: "3", name: "Cruz Roja", phone: "(55) 5557-5757", isEmergency: true },
  { id: "4", name: "Protección Civil", phone: "(55) 5683-2222", isEmergency: true },
]

const schoolContacts: Contact[] = [
  { id: "5", name: "Directora", role: "María García", phone: "(55) 1234-5678" },
  { id: "6", name: "Coordinador de Seguridad", role: "Roberto Méndez", phone: "(55) 1234-5679" },
  { id: "7", name: "Enfermería", role: "Ana López", phone: "(55) 1234-5680" },
  { id: "8", name: "Vigilancia", role: "Turno actual", phone: "(55) 1234-5681" },
]

export function EmergencyContacts() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (phone: string, id: string) => {
    await navigator.clipboard.writeText(phone)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section aria-labelledby="contacts-heading" className="bg-card rounded-2xl border border-border p-6">
      <h2 id="contacts-heading" className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
        Contactos de Emergencia
      </h2>

      {/* Emergency Numbers */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Servicios de Emergencia
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="flex flex-col items-center p-4 bg-emergency/10 rounded-xl border border-emergency/20 hover:bg-emergency/20 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-2xl font-bold text-emergency">{contact.phone}</span>
              <span className="text-sm text-foreground font-medium">{contact.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* School Contacts */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Contactos Escolares
        </h3>
        <div className="space-y-2">
          {schoolContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{contact.name}</p>
                {contact.role && <p className="text-sm text-muted-foreground">{contact.role}</p>}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  aria-label={`Llamar a ${contact.name}`}
                >
                  <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                </a>
                <button
                  onClick={() => copyToClipboard(contact.phone, contact.id)}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  aria-label={`Copiar número de ${contact.name}`}
                >
                  {copiedId === contact.id ? (
                    <Check className="w-4 h-4 text-success" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <a
          href="/contactos"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Ver todos los contactos y roles
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
