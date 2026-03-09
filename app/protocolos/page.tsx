import Link from "next/link"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import {
  complementaryProtocolGroups,
  getProtocolSummary,
  thematicAxisGroups,
} from "@/lib/thematic-protocols"

export default function ProtocolosPage() {
  const quickNavigationGroups = [...thematicAxisGroups, ...complementaryProtocolGroups]

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="py-8 lg:py-12 border-b border-border mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Protocolos por Eje</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Los ejes tematicos estan visibles para facilitar la busqueda. Selecciona un eje para ir directo a
                sus protocolos.
              </p>
            </section>

            <section aria-labelledby="axis-navigation-heading" className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <h2 id="axis-navigation-heading" className="text-xl font-bold text-foreground">
                  Navegacion rapida por ejes
                </h2>
                <Link
                  href="/procedimientos"
                  className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  Ver procedimientos completos
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickNavigationGroups.map((axis) => (
                  <a
                    key={axis.id}
                    href={`#${axis.id}`}
                    className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <p className="font-semibold text-foreground">{axis.displayTitle}</p>
                    <p className="text-sm text-muted-foreground mt-1">{axis.protocolCount} protocolos</p>
                  </a>
                ))}
              </div>
            </section>

            {thematicAxisGroups.map((axis) => (
              <section key={axis.id} id={axis.id} className="mb-12 scroll-mt-28" aria-labelledby={`${axis.id}-title`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
                  <h2 id={`${axis.id}-title`} className="text-2xl font-bold text-foreground">
                    {axis.displayTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {axis.protocolCount} protocolos | {axis.actionCount} acciones registradas
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {axis.protocolos.map((protocol) => (
                    <article key={protocol.id} className="rounded-xl border border-border bg-card p-4 h-full flex flex-col">
                      <h3 className="text-base font-bold text-foreground mb-2">{protocol.titulo}</h3>
                      {protocol.codigo && <p className="text-xs text-muted-foreground mb-2">Referencia: {protocol.codigo}</p>}
                      <p className="text-sm text-muted-foreground flex-1">{getProtocolSummary(protocol)}</p>
                      <Link
                        href={`/procedimientos/${encodeURIComponent(protocol.id)}`}
                        className="inline-flex items-center text-sm font-semibold text-primary mt-4 hover:underline"
                      >
                        Ver procedimiento completo
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            {complementaryProtocolGroups.length > 0 && (
              <section aria-labelledby="complementary-title" className="pt-2">
                <h2 id="complementary-title" className="text-xl font-bold text-foreground mb-4">
                  Protocolos Complementarios
                </h2>
                <div className="space-y-8">
                  {complementaryProtocolGroups.map((group) => (
                    <section key={group.id} id={group.id} className="scroll-mt-28" aria-labelledby={`${group.id}-title`}>
                      <h3 id={`${group.id}-title`} className="text-lg font-semibold text-foreground mb-3">{group.displayTitle}</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.protocolos.map((protocol) => (
                          <article key={protocol.id} className="rounded-xl border border-border bg-card p-4">
                            <h4 className="text-base font-bold text-foreground mb-2">{protocol.titulo}</h4>
                            <p className="text-sm text-muted-foreground">{getProtocolSummary(protocol)}</p>
                            <Link
                              href={`/procedimientos/${encodeURIComponent(protocol.id)}`}
                              className="inline-flex items-center text-sm font-semibold text-primary mt-4 hover:underline"
                            >
                              Ver procedimiento completo
                            </Link>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
