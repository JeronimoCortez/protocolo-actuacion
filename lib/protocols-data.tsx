import type { ReactNode } from "react"
import {
  AlertTriangle,
  Building2,
  CloudRain,
  Flame,
  Heart,
  Shield,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react"

export type ProtocolPriority = "critical" | "high" | "medium" | "low"

export interface ProtocolCatalogItem {
  id: string
  title: string
  description: string
  icon: ReactNode
  priority: ProtocolPriority
  estimatedTime: string
  responsibleRole: string
  href: string
  status: "available" | "coming-soon"
}

export interface ProtocolStep {
  id: string
  title: string
  description: string
  details?: string[]
  responsible?: string
  duration?: string
  isOptional?: boolean
  warning?: string
}

export interface ProtocolResource {
  title: string
  description: string
  href: string
}

export interface ProtocolDetail {
  slug: string
  title: string
  description: string
  priority: ProtocolPriority
  estimatedTime: string
  responsibleTeam: string
  lastUpdated: string
  icon: ReactNode
  emergencyNumber: string
  doList: string[]
  dontList: string[]
  steps: ProtocolStep[]
  relatedResources: ProtocolResource[]
}

export const protocolsCatalog: ProtocolCatalogItem[] = [
  {
    id: "abuso-maltrato",
    title: "Abuso o Maltrato",
    description:
      "Actuacion ante situaciones de abuso, maltrato o vulneracion de derechos de ninas, ninos y adolescentes.",
    icon: <ShieldAlert className="w-10 h-10 text-emergency" aria-hidden="true" />,
    priority: "critical",
    estimatedTime: "Denuncia en 24 h",
    responsibleRole: "Directivo / Docente",
    href: "/protocolos/abuso-maltrato",
    status: "available",
  },
  {
    id: "evacuacion",
    title: "Evacuacion General",
    description:
      "Protocolo para evacuar el edificio de forma segura y ordenada ante emergencias.",
    icon: <Building2 className="w-10 h-10 text-emergency" aria-hidden="true" />,
    priority: "critical",
    estimatedTime: "5-10 min",
    responsibleRole: "Todo el personal",
    href: "/protocolos/evacuacion",
    status: "available",
  },
  {
    id: "incendio",
    title: "Incendio",
    description:
      "Acciones inmediatas ante fuego, humo o activacion de alarmas contra incendio.",
    icon: <Flame className="w-10 h-10 text-emergency" aria-hidden="true" />,
    priority: "critical",
    estimatedTime: "Inmediato",
    responsibleRole: "Brigada contra incendios",
    href: "/protocolos/incendio",
    status: "available",
  },
  {
    id: "medica",
    title: "Emergencia Medica",
    description:
      "Primeros auxilios y actuacion ante lesiones, accidentes o cuadros de salud agudos.",
    icon: <Heart className="w-10 h-10 text-warning" aria-hidden="true" />,
    priority: "high",
    estimatedTime: "Variable",
    responsibleRole: "Enfermeria / Primeros auxilios",
    href: "/protocolos/medica",
    status: "available",
  },
  {
    id: "confinamiento",
    title: "Confinamiento",
    description:
      "Resguardo interno ante amenazas externas o situaciones en las que no es seguro evacuar.",
    icon: <Shield className="w-10 h-10 text-warning" aria-hidden="true" />,
    priority: "high",
    estimatedTime: "Hasta nuevo aviso",
    responsibleRole: "Coordinadores de zona",
    href: "/protocolos/confinamiento",
    status: "coming-soon",
  },
  {
    id: "sismo",
    title: "Sismo / Temblor",
    description:
      "Acciones durante y despues de un sismo, con resguardo y evacuacion posterior.",
    icon: <AlertTriangle className="w-10 h-10 text-warning" aria-hidden="true" />,
    priority: "high",
    estimatedTime: "Durante evento + evacuacion",
    responsibleRole: "Todo el personal",
    href: "/protocolos/sismo",
    status: "coming-soon",
  },
  {
    id: "intruso",
    title: "Intruso / Amenaza",
    description:
      "Protocolo de seguridad ante personas no autorizadas o amenazas a la comunidad escolar.",
    icon: <Users className="w-10 h-10 text-emergency" aria-hidden="true" />,
    priority: "critical",
    estimatedTime: "Hasta indicacion oficial",
    responsibleRole: "Seguridad / Direccion",
    href: "/protocolos/intruso",
    status: "coming-soon",
  },
  {
    id: "electrica",
    title: "Falla Electrica",
    description:
      "Procedimientos para cortes prolongados de energia y uso de sistemas de respaldo.",
    icon: <Zap className="w-10 h-10 text-primary" aria-hidden="true" />,
    priority: "medium",
    estimatedTime: "Variable",
    responsibleRole: "Mantenimiento",
    href: "/protocolos/electrica",
    status: "coming-soon",
  },
  {
    id: "inundacion",
    title: "Inundacion",
    description:
      "Respuesta ante lluvias intensas, filtraciones o anegamientos con riesgo para personas.",
    icon: <CloudRain className="w-10 h-10 text-primary" aria-hidden="true" />,
    priority: "low",
    estimatedTime: "Variable",
    responsibleRole: "Brigada de emergencia",
    href: "/protocolos/inundacion",
    status: "coming-soon",
  },
  {
    id: "persona-perdida",
    title: "Persona Perdida",
    description:
      "Busqueda y coordinacion inmediata ante reporte de estudiante o persona extraviada.",
    icon: <Users className="w-10 h-10 text-primary" aria-hidden="true" />,
    priority: "medium",
    estimatedTime: "Inmediato",
    responsibleRole: "Direccion / Seguridad",
    href: "/protocolos/persona-perdida",
    status: "coming-soon",
  },
]

export const protocolDetails: Record<string, ProtocolDetail> = {
  evacuacion: {
    slug: "evacuacion",
    title: "Protocolo de Evacuacion General",
    description:
      "Procedimiento estandar para evacuar el edificio de manera segura y ordenada.",
    priority: "critical",
    estimatedTime: "5-10 minutos para evacuacion completa",
    responsibleTeam: "Todo el personal",
    lastUpdated: "Marzo 2026",
    icon: <Building2 className="w-8 h-8" aria-hidden="true" />,
    emergencyNumber: "911",
    doList: [
      "Mantener la calma en todo momento",
      "Seguir la ruta de evacuacion asignada",
      "Caminar ordenadamente en fila",
      "Ayudar a personas con movilidad reducida",
      "Permanecer en el punto de reunion",
    ],
    dontList: [
      "Usar elevadores",
      "Correr o empujar",
      "Regresar por pertenencias",
      "Separarse del grupo",
      "Volver al edificio sin autorizacion",
    ],
    steps: [
      {
        id: "1",
        title: "Escuchar la alarma",
        description: "Detener toda actividad al escuchar la alarma de evacuacion.",
        responsible: "Todos",
        duration: "Inmediato",
      },
      {
        id: "2",
        title: "Prepararse para salir",
        description: "Tomar solo lo esencial y ordenar la salida.",
        responsible: "Docentes y estudiantes",
        duration: "30 seg - 1 min",
      },
      {
        id: "3",
        title: "Seguir la ruta asignada",
        description: "Avanzar por la ruta senalizada para cada sector.",
        responsible: "Brigada de evacuacion",
        duration: "2-4 min",
        warning: "Si hay humo, agacharse y usar ruta alternativa segura.",
      },
      {
        id: "4",
        title: "Llegar al punto de reunion",
        description: "Ubicarse en el punto designado y mantener el grupo unido.",
        responsible: "Todos",
        duration: "1-2 min",
      },
      {
        id: "5",
        title: "Conteo de personas",
        description: "Pasar lista y reportar ausentes al coordinador.",
        responsible: "Docentes",
        duration: "3-5 min",
      },
      {
        id: "6",
        title: "Esperar autorizacion",
        description: "Permanecer en el punto de reunion hasta nueva indicacion.",
        responsible: "Coordinador de emergencia",
        duration: "Variable",
      },
    ],
    relatedResources: [
      {
        title: "Mapas y rutas",
        description: "Ver recursos de ubicacion y facilidades",
        href: "/recursos#mapas",
      },
      {
        title: "Contactos de emergencia",
        description: "Numeros y roles para coordinacion",
        href: "/contactos",
      },
      {
        title: "Brigadas",
        description: "Ver responsables y equipos",
        href: "/contactos#roles",
      },
    ],
  },
  incendio: {
    slug: "incendio",
    title: "Protocolo de Incendio",
    description:
      "Respuesta inmediata ante deteccion de fuego, humo o activacion de alarmas.",
    priority: "critical",
    estimatedTime: "5-10 minutos para evacuacion completa",
    responsibleTeam: "Brigada contra incendios",
    lastUpdated: "Marzo 2026",
    icon: <Flame className="w-8 h-8" aria-hidden="true" />,
    emergencyNumber: "911",
    doList: [
      "Mantener la calma y alertar",
      "Activar la alarma manual",
      "Llamar a emergencias",
      "Evacuar por rutas habilitadas",
      "Esperar instrucciones de bomberos",
    ],
    dontList: [
      "Usar elevadores",
      "Regresar por objetos personales",
      "Abrir puertas calientes",
      "Volver al edificio sin autorizacion",
      "Combatir fuego grande sin capacitacion",
    ],
    steps: [
      {
        id: "1",
        title: "Detectar y alertar",
        description: "Identificar el foco y activar alarma cercana.",
        responsible: "Cualquier persona",
        duration: "30 seg",
      },
      {
        id: "2",
        title: "Llamar a emergencias",
        description: "Contactar 911 e informar ubicacion exacta.",
        responsible: "Personal administrativo",
        duration: "1-2 min",
      },
      {
        id: "3",
        title: "Iniciar evacuacion",
        description: "Guiar salida ordenada por rutas seguras.",
        responsible: "Brigada de evacuacion",
        duration: "3-5 min",
        warning: "Si la ruta esta bloqueada por humo o fuego, usar alternativa.",
      },
      {
        id: "4",
        title: "Punto de reunion",
        description: "Concentrar grupos y evitar retorno al edificio.",
        responsible: "Docentes / Coordinadores",
        duration: "2-3 min",
      },
      {
        id: "5",
        title: "Conteo y reporte",
        description: "Verificar asistentes y reportar faltantes.",
        responsible: "Docentes",
        duration: "3-5 min",
      },
      {
        id: "6",
        title: "Esperar instrucciones",
        description: "Seguir indicaciones de servicios de emergencia.",
        responsible: "Direccion",
        duration: "Variable",
      },
    ],
    relatedResources: [
      {
        title: "Mapas y recursos",
        description: "Portales y recursos externos",
        href: "/recursos#mapas",
      },
      {
        title: "Contactos",
        description: "Numeros para coordinacion inmediata",
        href: "/contactos",
      },
      {
        title: "Roles y brigadas",
        description: "Responsables por area",
        href: "/contactos#roles",
      },
    ],
  },
  medica: {
    slug: "medica",
    title: "Emergencia Medica",
    description:
      "Primeros auxilios y coordinacion ante lesiones, accidentes o descompensaciones.",
    priority: "high",
    estimatedTime: "Variable segun el caso",
    responsibleTeam: "Enfermeria / Primeros auxilios",
    lastUpdated: "Marzo 2026",
    icon: <Heart className="w-8 h-8" aria-hidden="true" />,
    emergencyNumber: "911",
    doList: [
      "Verificar seguridad del area",
      "Solicitar ayuda de inmediato",
      "Aplicar primeros auxilios basicos",
      "Contener a la persona afectada",
      "Documentar lo ocurrido",
    ],
    dontList: [
      "Mover a la victima si hay riesgo de lesion de columna",
      "Administrar medicamentos sin autorizacion",
      "Dejar sola a la persona",
      "Aplicar tecnicas no entrenadas",
      "Omitir comunicacion a familia y direccion",
    ],
    steps: [
      {
        id: "1",
        title: "Evaluar la situacion",
        description: "Confirmar que el area sea segura y valorar estado inicial.",
        responsible: "Primer respondedor",
        duration: "30 seg",
      },
      {
        id: "2",
        title: "Solicitar ayuda",
        description: "Avisar a enfermeria y llamar 911 si corresponde.",
        responsible: "Testigo cercano",
        duration: "1 min",
      },
      {
        id: "3",
        title: "Aplicar primeros auxilios",
        description: "Intervenir solo en maniobras para las que hay capacitacion.",
        responsible: "Personal capacitado",
        duration: "Hasta llegada de ayuda",
      },
      {
        id: "4",
        title: "Documentar y comunicar",
        description: "Registrar acciones tomadas y notificar a responsables.",
        responsible: "Enfermeria / Administracion",
        duration: "Despues de estabilizar",
      },
      {
        id: "5",
        title: "Seguimiento",
        description: "Completar reportes y acompanar traslado si aplica.",
        responsible: "Personal designado",
        duration: "Variable",
      },
    ],
    relatedResources: [
      {
        title: "Recursos de salud",
        description: "Portales y guias oficiales",
        href: "/recursos#mapas",
      },
      {
        title: "Contactos medicos",
        description: "Hospitales y lineas de emergencia",
        href: "/contactos",
      },
      {
        title: "Roles de respuesta",
        description: "Brigadas y referentes",
        href: "/contactos#roles",
      },
    ],
  },
  "abuso-maltrato": {
    slug: "abuso-maltrato",
    title: "Abuso o Maltrato",
    description:
      "Actuacion institucional ante indicios o relato de abuso/maltrato de estudiantes.",
    priority: "critical",
    estimatedTime: "Denuncia obligatoria en 24 h",
    responsibleTeam: "Directivo / Docente",
    lastUpdated: "Marzo 2026",
    icon: <ShieldAlert className="w-8 h-8" aria-hidden="true" />,
    emergencyNumber: "102",
    doList: [
      "Escuchar y contener sin juzgar",
      "Comunicar de inmediato a direccion",
      "Preservar confidencialidad",
      "Registrar hechos de forma objetiva",
      "Activar canales oficiales de proteccion",
    ],
    dontList: [
      "Interrogar en profundidad al estudiante",
      "Confrontar al presunto agresor",
      "Exponer el caso a personal no interviniente",
      "Demorar la comunicacion institucional",
      "Tomar medidas por fuera del marco legal",
    ],
    steps: [
      {
        id: "1",
        title: "Escucha inicial y contencion",
        description: "Recibir el relato, proteger y dar tranquilidad.",
        responsible: "Docente / Directivo",
        duration: "Inmediato",
      },
      {
        id: "2",
        title: "Resguardo y confidencialidad",
        description: "Limitar difusion a las autoridades competentes.",
        responsible: "Personal interviniente",
        duration: "Permanente",
      },
      {
        id: "3",
        title: "Comunicacion a direccion",
        description: "Escalar la situacion de forma inmediata.",
        responsible: "Docente receptor",
        duration: "Inmediato",
      },
      {
        id: "4",
        title: "Registro objetivo",
        description: "Documentar hechos observables sin interpretaciones.",
        responsible: "Equipo directivo",
        duration: "30-60 min",
      },
      {
        id: "5",
        title: "Activacion de organismos",
        description: "Dar intervencion a asesorias/organismos segun normativa.",
        responsible: "Direccion",
        duration: "Dentro de 24 h",
        warning: "La denuncia no puede demorarse cuando hay indicadores especificos.",
      },
      {
        id: "6",
        title: "Seguimiento institucional",
        description: "Sostener acompanamiento y articulacion con equipos tecnicos.",
        responsible: "Escuela + equipos de apoyo",
        duration: "Continuo",
      },
    ],
    relatedResources: [
      {
        title: "Documentos y actas",
        description: "Modelos y material institucional",
        href: "/recursos#actas",
      },
      {
        title: "Contactos y asesorias",
        description: "Canales de consulta y denuncia",
        href: "/contactos#roles",
      },
      {
        title: "Recursos institucionales",
        description: "Canales de comunicacion y orientacion",
        href: "/recursos#comunicacion",
      },
    ],
  },
}

export const getProtocolFromCatalog = (slug: string) =>
  protocolsCatalog.find((protocol) => protocol.id === slug)

export const getProtocolDetail = (slug: string) => protocolDetails[slug]
