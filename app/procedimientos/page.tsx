import { AccessibilityProvider } from "@/lib/accessibility-context";
import { EmergencyHeader } from "@/components/emergency/emergency-header";
import { FloatingWidget } from "@/components/emergency/floating-widget";
import { ProcedureCard } from "@/components/emergency/procedure-card";
import {
  Flame,
  Heart,
  Shield,
  AlertTriangle,
  Building2,
  Users,
  Zap,
  CloudRain,
  ShieldAlert,
} from "lucide-react";
import { Procedure } from "../utils/types/Procedure";

export const procedures: Procedure[] = [
  {
    id: "maltrato-intrafamiliar",
    title: "Maltrato Intrafamiliar",
    description:
      "Actuación ante situaciones de violencia ejercida por padres, madres, tutores o convivientes que colocan a niños, niñas y adolescentes en estado de desprotección.",
    icon: (
      <ShieldAlert className="w-10 h-10 text-emergency" aria-hidden="true" />
    ),
    priority: "critical" as const,
    estimatedTime: "Inmediato",
    responsibleRole: "Directivo / Docente",
    href: "/procedimientos/maltrato-intrafamiliar",
    actions: [
      "Privilegiar el relato y la toma de conocimiento de la situación.",
      "Realizar una escucha adecuada. No realizar careo ni constatar lesiones.",
      "Contactar al sistema de emergencias médicas para evaluar la necesidad de asistencia.",
      "Comunicar la situación al/la Asesor/a de Personas Menores de Edad e Incapaces para denuncia y acciones urgentes.",
      "Comunicar la situación a ETI u organismo correspondiente para su intervención.",
      "Establecer contacto con profesionales de DOAITE o Equipos Técnicos según corresponda para acompañamiento escolar.",
    ],
  },
  {
    id: "evacuacion",
    title: "Evacuación General",
    description:
      "Protocolo para evacuar el edificio de manera segura y ordenada ante cualquier emergencia que requiera abandonar las instalaciones.",
    icon: <Building2 className="w-10 h-10 text-emergency" aria-hidden="true" />,
    priority: "critical" as const,
    estimatedTime: "5-10 min",
    responsibleRole: "Todo el personal",
    href: "/procedimientos/evacuacion",
  },
  {
    id: "incendio",
    title: "Incendio",
    description:
      "Acciones inmediatas ante detección de fuego, humo o activación de alarmas contra incendio en las instalaciones.",
    icon: <Flame className="w-10 h-10 text-emergency" aria-hidden="true" />,
    priority: "critical" as const,
    estimatedTime: "Inmediato",
    responsibleRole: "Brigada contra incendios",
    href: "/procedimientos/incendio",
  },
  {
    id: "medica",
    title: "Emergencia Médica",
    description:
      "Protocolo de primeros auxilios y procedimientos ante lesiones, enfermedades súbitas, accidentes o situaciones que requieran atención médica.",
    icon: <Heart className="w-10 h-10 text-warning" aria-hidden="true" />,
    priority: "high" as const,
    estimatedTime: "Variable",
    responsibleRole: "Enfermería / Primeros auxilios",
    href: "/procedimientos/medica",
  },
  {
    id: "confinamiento",
    title: "Confinamiento",
    description:
      "Protocolo de resguardo interno ante amenazas externas, situaciones de riesgo o cuando no es seguro evacuar el edificio.",
    icon: <Shield className="w-10 h-10 text-warning" aria-hidden="true" />,
    priority: "high" as const,
    estimatedTime: "Hasta nuevo aviso",
    responsibleRole: "Coordinadores de zona",
    href: "/procedimientos/confinamiento",
  },
  {
    id: "sismo",
    title: "Sismo / Temblor",
    description:
      "Acciones durante y después de un sismo. Incluye protocolo de resguardo y evacuación posterior si es necesario.",
    icon: (
      <AlertTriangle className="w-10 h-10 text-warning" aria-hidden="true" />
    ),
    priority: "high" as const,
    estimatedTime: "Durante el evento + evacuación",
    responsibleRole: "Todo el personal",
    href: "/procedimientos/sismo",
  },
  {
    id: "intruso",
    title: "Intruso / Amenaza",
    description:
      "Protocolo de seguridad ante presencia de personas no autorizadas o situaciones de amenaza a la integridad de la comunidad escolar.",
    icon: <Users className="w-10 h-10 text-emergency" aria-hidden="true" />,
    priority: "critical" as const,
    estimatedTime: "Hasta que las autoridades lo indiquen",
    responsibleRole: "Seguridad / Dirección",
    href: "/procedimientos/intruso",
  },
  {
    id: "electrica",
    title: "Falla Eléctrica",
    description:
      "Procedimientos ante cortes de energía prolongados, incluye uso de iluminación de emergencia y sistemas de respaldo.",
    icon: <Zap className="w-10 h-10 text-primary" aria-hidden="true" />,
    priority: "medium" as const,
    estimatedTime: "Variable",
    responsibleRole: "Mantenimiento",
    href: "/procedimientos/electrica",
  },
  {
    id: "inundacion",
    title: "Inundación",
    description:
      "Protocolo ante lluvias intensas, inundaciones o filtraciones de agua que pongan en riesgo las instalaciones o personas.",
    icon: <CloudRain className="w-10 h-10 text-primary" aria-hidden="true" />,
    priority: "low" as const,
    estimatedTime: "Variable",
    responsibleRole: "Brigada de emergencia",
    href: "/procedimientos/inundacion",
  },
];

export default function ProcedimientosPage() {
  const criticalProcedures = procedures.filter(
    (p) => p.priority === "critical"
  );
  const highProcedures = procedures.filter((p) => p.priority === "high");
  const otherProcedures = procedures.filter(
    (p) => p.priority === "medium" || p.priority === "low"
  );

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <section className="py-8 lg:py-12 border-b border-border mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Procedimientos de Emergencia
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Consulta los protocolos establecidos para cada tipo de situación
                de emergencia. Selecciona un procedimiento para ver el paso a
                paso detallado.
              </p>
            </section>

            {/* Critical Priority */}
            <section aria-labelledby="critical-heading" className="mb-12">
              <h2
                id="critical-heading"
                className="text-xl font-bold text-foreground mb-6 flex items-center gap-3"
              >
                <span
                  className="w-3 h-8 bg-emergency rounded-full"
                  aria-hidden="true"
                ></span>
                Prioridad Crítica
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  Requieren acción inmediata
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {criticalProcedures.map((proc) => (
                  <ProcedureCard key={proc.id} {...proc} />
                ))}
              </div>
            </section>

            {/* High Priority */}
            <section aria-labelledby="high-heading" className="mb-12">
              <h2
                id="high-heading"
                className="text-xl font-bold text-foreground mb-6 flex items-center gap-3"
              >
                <span
                  className="w-3 h-8 bg-warning rounded-full"
                  aria-hidden="true"
                ></span>
                Prioridad Alta
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  Situaciones que requieren respuesta rápida
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {highProcedures.map((proc) => (
                  <ProcedureCard key={proc.id} {...proc} />
                ))}
              </div>
            </section>

            {/* Other Procedures */}
            <section aria-labelledby="other-heading">
              <h2
                id="other-heading"
                className="text-xl font-bold text-foreground mb-6 flex items-center gap-3"
              >
                <span
                  className="w-3 h-8 bg-primary rounded-full"
                  aria-hidden="true"
                ></span>
                Otros Procedimientos
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProcedures.map((proc) => (
                  <ProcedureCard key={proc.id} {...proc} />
                ))}
              </div>
            </section>
          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  );
}
