export const navItems = [
  { label: "Inicio", active: true },
  { label: "Protocolos", active: false },
  { label: "Marco Teorico", active: false },
  { label: "Recursos y Contactos", active: false },
];

export const actionCards = [
  {
    id: "urgent",
    label: "Urgente",
    title: "Actuar",
    description: "Procedimiento ante emergentes",
    color: "red",
    disabled: false,
  },
  {
    id: "conceptual",
    label: "Conceptual",
    title: "Comprender",
    description: "Marcos conceptuales",
    color: "blue",
    disabled: true,
  },
  {
    id: "resources",
    label: "Recursos",
    title: "Recursos",
    description: "Contactos y redes",
    color: "green",
    disabled: true,
  },
];

export const contacts = [
  {
    name: "Policia / Emergencias",
    number: "911",
    icon: "phone",
    iconBg: "bg-[oklch(0.97_0.01_25)]",
    iconStroke: "oklch(0.55 0.22 25)",
  },
  {
    name: "Emergencia Medica",
    number: "911",
    icon: "medical",
    iconBg: "bg-[oklch(0.97_0.01_150)]",
    iconStroke: "oklch(0.45 0.18 150)",
  },
  {
    name: "DAE Central",
    number: "4231473",
    icon: "device",
    iconBg: "bg-[oklch(0.95_0.01_250)]",
    iconStroke: "var(--primary)",
  },
];

export const quickAccess = [
  {
    label: "Llamar 911",
    href: "tel:911",
    colorClass: "bg-[oklch(0.25_0.08_15)] text-[oklch(0.75_0.2_20)]",
    iconBgClass: "bg-[oklch(0.55_0.22_25)]",
    icon: "alert",
  },
  {
    label: "Emergencia Medica",
    href: "tel:911",
    colorClass: "bg-[oklch(0.18_0.06_150)] text-[oklch(0.7_0.18_150)]",
    iconBgClass: "bg-[oklch(0.45_0.18_150)]",
    icon: "medical",
  },
  {
    label: "Llamar a DAE",
    href: "tel:4231473",
    colorClass: "bg-[oklch(0.2_0.04_250)] text-[oklch(0.75_0.1_250)]",
    iconBgClass: "bg-[var(--primary)]",
    icon: "phone",
  },
  {
    label: "Ver Recursos",
    href: "#",
    colorClass: "bg-[oklch(0.2_0.02_250)] text-[oklch(0.7_0.06_250)]",
    iconBgClass: "bg-[oklch(0.3_0.03_250)]",
    icon: "globe",
    disabled: true,
  },
];