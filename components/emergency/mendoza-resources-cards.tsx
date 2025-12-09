"use client"

import { MapPin, Globe, ExternalLink } from "lucide-react"

export function MendozaResourcesCards() {
  return (
    <section aria-labelledby="mendoza-resources-heading" className="space-y-4">
      <h2 id="mendoza-resources-heading" className="text-xl font-bold text-foreground flex items-center gap-2">
        <span className="w-2 h-6 bg-success rounded-full" aria-hidden="true"></span>
        Recursos de Mendoza
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Geolocalización de Facilidades */}
        <a
          href="https://ide.mendoza.gov.ar/portal/apps/experiencebuilder/experience/?id=f4309e1dc7554744a4a9eed2fe8910cb"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MapPin className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <ExternalLink
              className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </div>
          <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            Geolocalización de Facilidades
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ubicación de hospitales, centros de salud, escuelas y otras facilidades en toda la provincia de Mendoza.
          </p>
          <div className="text-xs font-semibold text-primary">Abrir en IDE Mendoza →</div>
        </a>

        {/* Guía de Salud */}
        <a
          href="http://guia-salud.mendoza.gov.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Globe className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <ExternalLink
              className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </div>
          <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Guía de Salud</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Directorio de centros de salud con información sobre especialidades, psicólogos, atención y servicios
            disponibles.
          </p>
          <div className="text-xs font-semibold text-primary">Acceder a Guía Salud →</div>
        </a>
      </div>
    </section>
  )
}
