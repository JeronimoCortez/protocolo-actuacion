"use client"

import { AccessibilityProvider } from "@/lib/accessibility-context"
import { EmergencyHeader } from "@/components/emergency/emergency-header"
import { FloatingWidget } from "@/components/emergency/floating-widget"
import { ProcedureHeader } from "@/components/emergency/procedure-header"
import { ProcedureTimeline } from "@/components/emergency/procedure-timeline"
import { ViewToggle } from "@/components/emergency/view-toggle"
import { QuickSummary } from "@/components/emergency/quick-summary"
import { useState } from "react"
import {
  AlertTriangle,
  Phone,
  FileText,
  Users,
  Scale,
  BookOpen,
  ExternalLink,
  Shield,
  Eye,
  MessageSquare,
  Building,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Pasos del procedimiento según Ley 9054 y Decreto 1187/18
const procedureSteps = [
  {
    id: "step-1",
    title: "Recibir y escuchar al estudiante",
    description: "Brindar contención emocional inmediata sin emitir juicios ni realizar preguntas invasivas.",
    responsible: "Docente / Directivo",
    duration: "Inmediato",
    details: [
      "Escuchar atentamente sin interrumpir",
      "No hacer preguntas que puedan revictimizar (evitar '¿por qué no lo dijiste antes?')",
      "Creer en el relato del niño/a o adolescente",
      "Transmitir calma y seguridad",
      "No prometer confidencialidad absoluta (explicar que debemos protegerlo/a)",
      "No confrontar al presunto agresor bajo ninguna circunstancia",
    ],
    warning:
      "NUNCA interrogar al estudiante ni solicitar que repita su relato múltiples veces. Esto puede revictimizarlo.",
  },
  {
    id: "step-2",
    title: "Preservar la confidencialidad",
    description: "Mantener reserva absoluta sobre la situación. Solo comunicar a autoridades competentes.",
    responsible: "Todo el personal interviniente",
    duration: "Permanente",
    details: [
      "No comentar la situación con otros docentes no involucrados",
      "No divulgar información en pasillos o espacios comunes",
      "Evitar que el estudiante deba repetir su relato",
      "Proteger la identidad del niño/a o adolescente",
      "No tomar fotografías ni grabar testimonios",
    ],
    warning: "La divulgación no autorizada puede generar responsabilidades legales y daño adicional a la víctima.",
  },
  {
    id: "step-3",
    title: "Comunicar a la Dirección",
    description: "Informar inmediatamente a un miembro del equipo directivo de la institución.",
    responsible: "Docente que recepciona",
    duration: "Inmediato",
    details: [
      "Comunicar verbalmente los hechos percibidos",
      "Evitar pasar información por escrito en espacios no seguros",
      "Si el directivo no está disponible, contactar supervisor de zona",
      "No demorar la comunicación bajo ningún pretexto",
    ],
  },
  {
    id: "step-4",
    title: "Evaluar indicadores",
    description:
      "Determinar si existen indicadores específicos (relato directo, evidencia física) o indicadores genéricos (cambios de conducta, señales inespecíficas).",
    responsible: "Directivo / DOAITE",
    duration: "15-30 min",
    details: [
      "Indicadores ESPECÍFICOS: relato directo del estudiante, lesiones físicas evidentes, testimonio de testigos",
      "Indicadores GENÉRICOS: cambios bruscos de conducta, aislamiento, bajo rendimiento repentino, miedos inexplicables",
      "En caso de DUDA, consultar urgentemente a DOAITE (Dirección de Orientación y Apoyo Interdisciplinario)",
      "Documentar las observaciones de manera objetiva",
    ],
  },
  {
    id: "step-5a",
    title: "Con indicadores ESPECÍFICOS: Labrar acta y denunciar",
    description: "Preparar el acta oficial según Anexo I del Decreto 1187 y realizar la denuncia inmediata.",
    responsible: "Directivo con docente interviniente",
    duration: "1-2 horas",
    details: [
      "Completar el modelo de acta aprobado como Anexo I del Decreto 1187",
      "Incluir datos de la institución, fecha, hora y descripción objetiva de los hechos",
      "Firmar el acta todos los intervinientes",
      "Enviar INMEDIATAMENTE a:",
      "• Asesor/a de Personas Menores e Incapaces del departamento correspondiente",
      "• Organismo Administrativo Local (OAL)",
      "Medios de envío: email, teléfono, presencial, u otro medio idóneo",
    ],
    warning:
      "La denuncia debe realizarse dentro de las 24 horas. No hacerlo implica responsabilidad penal para el funcionario público.",
  },
  {
    id: "step-5b",
    title: "Con indicadores GENÉRICOS: Intervención profesional",
    description: "Solicitar evaluación urgente a equipos técnicos especializados.",
    responsible: "Directivo",
    duration: "24-48 horas",
    isOptional: true,
    details: [
      "Escuelas públicas: solicitar intervención urgente de DOAITE",
      "Escuelas privadas: intervención del servicio de orientación propio o profesional contratado",
      "El equipo técnico realizará la evaluación y determinará si corresponde denuncia",
      "Si la evaluación confirma indicadores específicos, proceder con el paso 5a",
    ],
  },
  {
    id: "step-6",
    title: "Proteger al estudiante en la escuela",
    description: "Garantizar la seguridad del niño/a o adolescente dentro del ámbito escolar.",
    responsible: "Equipo directivo",
    duration: "Permanente",
    details: [
      "Evitar que el estudiante quede solo o en situaciones de vulnerabilidad",
      "Si el presunto agresor es personal de la escuela: separación preventiva inmediata",
      "No forzar encuentros ni careos con el presunto agresor",
      "Mantener la rutina escolar en la medida de lo posible",
      "Asignar un adulto de referencia de confianza para el estudiante",
    ],
  },
  {
    id: "step-7",
    title: "Articular con organismos de protección",
    description: "Coordinar acciones con los organismos intervinientes (OAL, Asesoría de Menores, DOAITE).",
    responsible: "Directivo / Supervisor",
    duration: "Continuo",
    details: [
      "Mantener comunicación fluida con Asesoría de Menores",
      "Facilitar información requerida por los organismos",
      "Coordinar estrategias de acompañamiento escolar",
      "Solicitar orientación ante dudas sobre el proceso",
      "Respetar las directivas de los organismos especializados",
    ],
  },
  {
    id: "step-8",
    title: "Acompañamiento posterior",
    description: "Brindar contención y seguimiento al estudiante y la comunidad educativa.",
    responsible: "Equipo escolar / DOAITE",
    duration: "Largo plazo",
    details: [
      "Garantizar la continuidad educativa del estudiante",
      "Derivar a atención psicológica si es necesario",
      "Realizar seguimiento del bienestar del estudiante",
      "Contener al equipo docente interviniente",
      "Trabajar con el grupo de pares si fuera necesario (sin revelar detalles)",
      "Documentar todas las acciones de seguimiento",
    ],
  },
]

const quickActions = [
  {
    number: 1,
    title: "Escuchar y contener",
    description: "Sin interrogar ni juzgar. Creer en el relato.",
    icon: <MessageSquare className="w-6 h-6 text-primary" />,
  },
  {
    number: 2,
    title: "Comunicar a Dirección",
    description: "Informar inmediatamente al equipo directivo.",
    icon: <Building className="w-6 h-6 text-primary" />,
  },
  {
    number: 3,
    title: "Labrar acta y denunciar",
    description: "Usar modelo Anexo I. Enviar a OAL y Asesoría de Menores.",
    icon: <FileText className="w-6 h-6 text-emergency" />,
  },
]

const contactosOAL = [
  { departamento: "Capital", telefono: "(261) 449-5374" },
  { departamento: "Godoy Cruz", telefono: "(261) 424-2503" },
  { departamento: "Las Heras", telefono: "(261) 448-8989" },
  { departamento: "Guaymallén", telefono: "(261) 431-1700" },
  { departamento: "Maipú", telefono: "(261) 497-5700" },
  { departamento: "Luján de Cuyo", telefono: "(261) 498-6500" },
]

export default function AbusoMaltratoPage() {
  const [viewMode, setViewMode] = useState<"quick" | "detailed">("quick")

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <ProcedureHeader
              title="Abuso Sexual o Maltrato Extrafamiliar"
              subtitle="Protocolo según Ley 9054 y Decreto Reglamentario 1187/18"
              priority="critical"
              estimatedTime="Denuncia en 24hs"
              icon={<Shield className="w-12 h-12" />}
            />

            {/* Legal Framework Banner */}
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Scale className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-foreground">Marco Legal</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Este protocolo se rige por la <strong>Ley Provincial Nº 9054</strong> y su
                    <strong> Decreto Reglamentario Nº 1187/18</strong> de la Provincia de Mendoza. Todo funcionario
                    público está obligado a denunciar según el Art. 72 del Código Penal.
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Alert */}
            <div className="mt-6 p-5 bg-emergency/10 border-2 border-emergency/30 rounded-xl">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-emergency shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-emergency">Importante - Qué NO hacer</h2>
                  <ul className="mt-3 space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-emergency font-bold">✕</span>
                      <span>
                        <strong>NO</strong> interrogar al niño/a ni hacerlo repetir su relato
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emergency font-bold">✕</span>
                      <span>
                        <strong>NO</strong> confrontar al presunto agresor
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emergency font-bold">✕</span>
                      <span>
                        <strong>NO</strong> citar a los padres si son sospechosos del abuso
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emergency font-bold">✕</span>
                      <span>
                        <strong>NO</strong> prometer confidencialidad absoluta al estudiante
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emergency font-bold">✕</span>
                      <span>
                        <strong>NO</strong> tomar decisiones sin consultar a autoridades competentes
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="mt-8">
              <ViewToggle mode={viewMode} onChange={setViewMode} />
            </div>

            {/* Quick Summary View */}
            {viewMode === "quick" && (
              <div className="mt-8">
                <QuickSummary actions={quickActions} emergencyNumber="102" showEmergencyCall={false} />

                {/* Quick Contact Cards */}
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  <Card className="border-2 border-emergency/20 bg-emergency/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Phone className="w-5 h-5 text-emergency" />
                        DOAITE (Consultas urgentes)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href="tel:2614495000" className="text-2xl font-bold text-emergency hover:underline">
                        (261) 449-5000
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dirección de Orientación y Apoyo Interdisciplinario
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-warning/20 bg-warning/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Phone className="w-5 h-5 text-warning" />
                        Línea 102 - Niñez
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href="tel:102" className="text-2xl font-bold text-warning hover:underline">
                        102
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Atención a niños, niñas y adolescentes en situación de riesgo
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Indicadores Section */}
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5 text-emergency" />
                        Indicadores Específicos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Requieren denuncia inmediata:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emergency shrink-0 mt-0.5" />
                          Relato directo del estudiante
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emergency shrink-0 mt-0.5" />
                          Lesiones físicas compatibles
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emergency shrink-0 mt-0.5" />
                          Testimonio de testigos directos
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emergency shrink-0 mt-0.5" />
                          Evidencia material o documental
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5 text-warning" />
                        Indicadores Genéricos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Requieren evaluación de DOAITE:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          Cambios bruscos de conducta
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          Aislamiento o retraimiento social
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          Bajo rendimiento repentino
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          Miedos inexplicables, pesadillas
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          Conductas sexualizadas impropias para la edad
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Detailed View */}
            {viewMode === "detailed" && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Procedimiento Paso a Paso
                </h2>
                <ProcedureTimeline steps={procedureSteps} allowCheckoff={true} />
              </div>
            )}

            {/* OAL Contact List */}
            <section className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Organismos Administrativos Locales (OAL)
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contactosOAL.map((oal) => (
                      <div key={oal.departamento} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-foreground">{oal.departamento}</p>
                        <a
                          href={`tel:${oal.telefono.replace(/[^0-9]/g, "")}`}
                          className="text-primary hover:underline font-mono"
                        >
                          {oal.telefono}
                        </a>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Para otros departamentos, consultar el listado completo en el sitio de la DGE.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Resources */}
            <section className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Documentos y Recursos
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Modelo de Acta (Anexo I)
                    </h3>
                    <p className="text-sm text-muted-foreground">Decreto 1187/18 - Formato oficial</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </a>

                <a
                  href="https://www.mendoza.edu.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Ley 9054 - Texto completo
                    </h3>
                    <p className="text-sm text-muted-foreground">Normativa provincial vigente</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Guía de Indicadores
                    </h3>
                    <p className="text-sm text-muted-foreground">Manual para identificación de situaciones</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Directorio de Asesores de Menores
                    </h3>
                    <p className="text-sm text-muted-foreground">Por departamento - DGE</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </a>
              </div>
            </section>

            {/* Print Button */}
            <div className="mt-12 flex justify-center gap-4">
              <Button variant="outline" size="lg" onClick={() => window.print()} className="gap-2">
                <FileText className="w-5 h-5" />
                Imprimir procedimiento
              </Button>
              <Link href="/procedimientos">
                <Button variant="ghost" size="lg">
                  Ver todos los procedimientos
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  )
}
