import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { ArrowRight, ExternalLink, FileText, Globe, MapPin, Megaphone } from "lucide-react"

export default function RecursosPage() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="py-8 lg:py-12 border-b border-border mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Recursos y Documentacion
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Centraliza mapas, guias, actas y enlaces de soporte institucional para
                responder mejor ante emergencias.
              </p>
            </section>

            <section id="mapas" className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6">Mapas y Portales</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <a
                  href="https://ide.mendoza.gov.ar/portal/apps/experiencebuilder/experience/?id=f4309e1dc7554744a4a9eed2fe8910cb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="h-full p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <MapPin className="w-8 h-8 text-primary" aria-hidden="true" />
                      </div>
                      <ExternalLink
                        className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      Geolocalizacion de Facilidades
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Portal para ubicar hospitales, centros de salud, escuelas y otras
                      facilidades en Mendoza.
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      Abrir portal
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                </a>

                <a
                  href="http://guia-salud.mendoza.gov.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="h-full p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Globe className="w-8 h-8 text-primary" aria-hidden="true" />
                      </div>
                      <ExternalLink
                        className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      Guia de Salud
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Directorio de centros de salud y especialidades para referencia rapida.
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      Acceder a la guia
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                </a>
              </div>
            </section>

            <section id="actas" className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6">Actas y Formularios</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <FileText className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground mb-2">Modelo de Acta</h3>
                  <p className="text-sm text-muted-foreground">
                    Formato institucional para registro de incidentes. Publicacion en proceso.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <FileText className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground mb-2">Carga de Datos</h3>
                  <p className="text-sm text-muted-foreground">
                    Flujo guiado para completar actas. Se integra en una siguiente iteracion.
                  </p>
                </div>
              </div>
            </section>

            <section id="comunicacion" className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Comunicacion Institucional
              </h2>
              <a
                href="https://www.mendoza.edu.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-card rounded-2xl border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Megaphone className="w-7 h-7 text-primary mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Portal Institucional DGE Mendoza
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Comunicados, resoluciones y lineamientos oficiales para la comunidad
                      educativa.
                    </p>
                  </div>
                </div>
              </a>
            </section>
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
