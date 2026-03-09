"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FileText, Phone } from "lucide-react"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { ProcedureHeader } from "@/components/emergency/procedure-header"
import { ViewToggle } from "@/components/emergency/view-toggle"
import { QuickSummary } from "@/components/emergency/quick-summary"
import { ProcedureTimeline } from "@/components/emergency/procedure-timeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getProtocolDetail, getProtocolFromCatalog } from "@/lib/protocols-data"

export default function ProtocoloDetallePage() {
  const params = useParams<{ slug: string }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const [view, setView] = useState<"quick" | "detailed">("detailed")

  const catalogProtocol = useMemo(() => getProtocolFromCatalog(slug), [slug])
  const detail = useMemo(() => getProtocolDetail(slug), [slug])

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-16 lg:pt-20 pb-24">
          {!catalogProtocol && (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
              <Card>
                <CardHeader>
                  <CardTitle>Protocolo no encontrado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    El enlace solicitado no corresponde a un protocolo activo.
                  </p>
                  <Link href="/protocolos">
                    <Button>Volver al listado</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {catalogProtocol && !detail && (
            <>
              <ProcedureHeader
                title={catalogProtocol.title}
                description={catalogProtocol.description}
                priority={catalogProtocol.priority}
                estimatedTime={catalogProtocol.estimatedTime}
                responsibleTeam={catalogProtocol.responsibleRole}
                lastUpdated="Marzo 2026"
                icon={catalogProtocol.icon}
              />

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="border-2 border-warning/30 bg-warning/5">
                  <CardHeader>
                    <CardTitle>Protocolo en desarrollo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Esta guia ya forma parte del catalogo, pero su version completa aun esta
                      en proceso de carga.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/protocolos">
                        <Button variant="outline">Volver a protocolos</Button>
                      </Link>
                      <Link href="/contactos">
                        <Button>Ver contactos de emergencia</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {detail && (
            <>
              <ProcedureHeader
                title={detail.title}
                description={detail.description}
                priority={detail.priority}
                estimatedTime={detail.estimatedTime}
                responsibleTeam={detail.responsibleTeam}
                lastUpdated={detail.lastUpdated}
                icon={detail.icon}
              />

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8 no-print">
                  <ViewToggle view={view} onViewChange={setView} />
                </div>

                {view === "quick" && (
                  <QuickSummary
                    doList={detail.doList}
                    dontList={detail.dontList}
                    emergencyNumber={detail.emergencyNumber}
                  />
                )}

                {view === "detailed" && (
                  <>
                    <QuickSummary
                      doList={detail.doList}
                      dontList={detail.dontList}
                      emergencyNumber={detail.emergencyNumber}
                    />

                    <section aria-labelledby="steps-heading" className="mt-8">
                      <h2
                        id="steps-heading"
                        className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"
                      >
                        <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                        Pasos del Protocolo
                      </h2>
                      <ProcedureTimeline steps={detail.steps} allowCheckoff={true} />
                    </section>
                  </>
                )}

                <section className="mt-12 pt-8 border-t border-border no-print">
                  <h2 className="text-lg font-bold text-foreground mb-4">Recursos Relacionados</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {detail.relatedResources.map((resource) => (
                      <Link
                        key={`${detail.slug}-${resource.title}`}
                        href={resource.href}
                        className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                      >
                        <Phone className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
                        <h3 className="font-semibold text-foreground">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
