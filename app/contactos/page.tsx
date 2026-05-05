import contactosRaw from "@/app/protocolos/data/contactos.json"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { Building2, Globe, Mail, MapPin, Phone, Shield, Users } from "lucide-react"

interface ContactoBasico {
  nombre: string
  telefono?: string
  telefonos?: string[]
  email?: string
  web?: string
  direccion?: string
  departamento?: string
}

interface ETIGuardia {
  tipo: string
  horario: string
  telefono: string
}

interface ETISede {
  departamento: string
  direccion?: string
  telefono: string
}

interface DepartamentoHospital {
  nombre: string
  hospitales: Array<{
    nombre: string
    telefono: string
  }>
}

interface ContactosData {
  emergencias: Array<{ nombre: string; telefono: string }>
  organismos_provinciales: ContactoBasico[]
  salud_mental_infanto_juvenil: ContactoBasico[]
  centros_adicciones: ContactoBasico[]
  eti: {
    guardias: ETIGuardia[]
    sedes: ETISede[]
  }
  departamentos: DepartamentoHospital[]
}

const contactos = contactosRaw as ContactosData

const getDialablePhone = (phone: string) => {
  const normalized = phone.replace(/[^\d+]/g, "")
  return normalized.length >= 3 ? normalized : null
}

const getPhones = (contacto: ContactoBasico) => {
  if (contacto.telefonos && contacto.telefonos.length > 0) {
    return contacto.telefonos
  }
  return contacto.telefono ? [contacto.telefono] : []
}

export default function ContactosPage() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="py-8 lg:py-12 border-b border-border mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Contactos y Referentes</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Directorio oficial para emergencias, organismos provinciales y redes de asistencia.
              </p>
            </section>

            <div className="space-y-10">
              <section aria-labelledby="emergencias-heading" className="bg-emergency/10 rounded-2xl border border-emergency/20 p-6">
                <h2 id="emergencias-heading" className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emergency" aria-hidden="true" />
                  Servicios de Emergencia
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {contactos.emergencias.map((servicio) => {
                    const dialable = getDialablePhone(servicio.telefono)
                    return (
                      <div key={servicio.nombre} className="bg-card border border-border rounded-xl p-4">
                        <p className="font-semibold text-foreground">{servicio.nombre}</p>
                        <p className="text-sm text-emergency font-bold mt-1">{servicio.telefono}</p>
                        {dialable && (
                          <a
                            href={`tel:${dialable}`}
                            className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 hover:underline"
                          >
                            <Phone className="w-3 h-3" aria-hidden="true" />
                            Llamar
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>

              <section id="roles" aria-labelledby="organismos-heading" className="bg-card rounded-2xl border border-border p-6">
                <h2 id="organismos-heading" className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                  Organismos Provinciales
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {contactos.organismos_provinciales.map((organismo) => (
                    <article key={organismo.nombre} className="rounded-xl border border-border bg-muted/20 p-4">
                      <p className="font-semibold text-foreground">{organismo.nombre}</p>
                      {organismo.direccion && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 mt-0.5" aria-hidden="true" />
                          {organismo.direccion}
                        </p>
                      )}

                      <div className="mt-3 space-y-2">
                        {getPhones(organismo).map((phone, index) => {
                          const dialable = getDialablePhone(phone)
                          return dialable ? (
                            <a
                              key={`${organismo.nombre}-${index}`}
                              href={`tel:${dialable}`}
                              className="text-sm text-primary hover:underline block"
                            >
                              {phone}
                            </a>
                          ) : (
                            <p key={`${organismo.nombre}-${index}`} className="text-sm text-muted-foreground">
                              {phone}
                            </p>
                          )
                        })}
                        {organismo.email && (
                          <a href={`mailto:${organismo.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                            {organismo.email}
                          </a>
                        )}
                        {organismo.web && (
                          <a href={organismo.web} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                            Sitio web
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="salud-mental-heading" className="bg-card rounded-2xl border border-border p-6">
                <h2 id="salud-mental-heading" className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                  Salud Mental Infanto Juvenil
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contactos.salud_mental_infanto_juvenil.map((centro) => (
                    <article key={centro.nombre} className="rounded-xl border border-border p-4">
                      <p className="font-semibold text-foreground">{centro.nombre}</p>
                      {centro.departamento && <p className="text-sm text-muted-foreground mt-1">{centro.departamento}</p>}
                      {centro.direccion && <p className="text-sm text-muted-foreground mt-1">{centro.direccion}</p>}
                      {centro.telefono && (
                        <a href={`tel:${getDialablePhone(centro.telefono) ?? ""}`} className="text-sm text-primary hover:underline inline-block mt-3">
                          {centro.telefono}
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="adicciones-heading" className="bg-card rounded-2xl border border-border p-6">
                <h2 id="adicciones-heading" className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" aria-hidden="true" />
                  Centros de Atencion en Adicciones
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contactos.centros_adicciones.map((centro) => (
                    <article key={centro.nombre} className="rounded-xl border border-border p-4">
                      <p className="font-semibold text-foreground">{centro.nombre}</p>
                      {centro.departamento && <p className="text-sm text-muted-foreground mt-1">{centro.departamento}</p>}
                      {centro.direccion && <p className="text-sm text-muted-foreground mt-1">{centro.direccion}</p>}
                      {centro.telefono && (
                        <a href={`tel:${getDialablePhone(centro.telefono) ?? ""}`} className="text-sm text-primary hover:underline inline-block mt-3">
                          {centro.telefono}
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="eti-heading" className="bg-card rounded-2xl border border-border p-6">
                <h2 id="eti-heading" className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                  ETI - Guardias y Sedes
                </h2>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-border p-4">
                    <h3 className="font-semibold text-foreground mb-3">Guardias</h3>
                    <div className="space-y-3">
                      {contactos.eti.guardias.map((guardia) => (
                        <div key={guardia.tipo} className="p-3 bg-muted/40 rounded-lg">
                          <p className="font-medium text-foreground">{guardia.tipo}</p>
                          <p className="text-sm text-muted-foreground">{guardia.horario}</p>
                          <a href={`tel:${getDialablePhone(guardia.telefono) ?? ""}`} className="text-sm text-primary hover:underline">
                            {guardia.telefono}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <h3 className="font-semibold text-foreground mb-3">Sedes</h3>
                    <div className="space-y-3">
                      {contactos.eti.sedes.map((sede) => (
                        <div key={sede.departamento} className="p-3 bg-muted/40 rounded-lg">
                          <p className="font-medium text-foreground">{sede.departamento}</p>
                          {sede.direccion && <p className="text-sm text-muted-foreground">{sede.direccion}</p>}
                          <a href={`tel:${getDialablePhone(sede.telefono) ?? ""}`} className="text-sm text-primary hover:underline">
                            {sede.telefono}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section aria-labelledby="hospitales-heading" className="bg-card rounded-2xl border border-border p-6">
                <h2 id="hospitales-heading" className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" aria-hidden="true" />
                  Hospitales por Departamento
                </h2>

                <div className="space-y-5">
                  {contactos.departamentos.map((departamento) => (
                    <div key={departamento.nombre} className="rounded-xl border border-border p-4">
                      <h3 className="font-semibold text-foreground mb-3">{departamento.nombre}</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {departamento.hospitales.map((hospital) => (
                          <div key={hospital.nombre} className="p-3 bg-muted/40 rounded-lg">
                            <p className="font-medium text-foreground">{hospital.nombre}</p>
                            <a href={`tel:${getDialablePhone(hospital.telefono) ?? ""}`} className="text-sm text-primary hover:underline">
                              {hospital.telefono}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
