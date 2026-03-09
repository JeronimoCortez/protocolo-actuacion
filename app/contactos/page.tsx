import { AccessibilityProvider } from "@/lib/accessibility-context";
import { EmergencyHeader } from "@/components/emergency/emergency-header";
import { FloatingWidget } from "@/components/emergency/floating-widget";
import {
  Phone,
  Mail,
  Shield,
  Heart,
  Flame,
  Building2,
  Users,
  Gavel,
} from "lucide-react";

const emergencyServices = [
  {
    name: "Emergencias Generales",
    number: "911",
    description: "Policía, bomberos, ambulancia",
  },
  {
    name: "Bomberos",
    number: "(55) 5768-3700",
    description: "Emergencias de incendio",
  },
  {
    name: "Cruz Roja",
    number: "(55) 5557-5757",
    description: "Emergencias médicas",
  },
  {
    name: "Protección Civil",
    number: "(55) 5683-2222",
    description: "Desastres naturales",
  },
  {
    name: "Policía",
    number: "(55) 5200-9000",
    description: "Seguridad pública",
  },
  {
    name: "Centro de Intoxicaciones",
    number: "(55) 5800-0123",
    description: "Envenenamientos",
  },
];

const asesoresMenores = [
  {
    name: "Capital",
    role: "Asesor menores",
    phone: "2613878710",
    email: "abusosCAPITAL@jus.mendoza.gov.ar",
    extension: "101",
    isCoordinator: true,
  },
  {
    name: "Roberto Méndez Sánchez",
    role: "Coordinador de Seguridad",
    phone: "(55) 1234-5679",
    email: "seguridad@escuela.edu.mx",
    extension: "102",
    isCoordinator: true,
  },
  {
    name: "Ana López Hernández",
    role: "Enfermería",
    phone: "(55) 1234-5680",
    email: "enfermeria@escuela.edu.mx",
    extension: "103",
  },
  {
    name: "Carlos Rodríguez Pérez",
    role: "Subdirector Académico",
    phone: "(55) 1234-5681",
    email: "subdireccion@escuela.edu.mx",
    extension: "104",
    isCoordinator: true,
  },
  {
    name: "Vigilancia",
    role: "Caseta de Entrada",
    phone: "(55) 1234-5682",
    extension: "100",
  },
  {
    name: "Mantenimiento",
    role: "Servicios Generales",
    phone: "(55) 1234-5683",
    extension: "105",
  },
];

const brigades = [
  {
    id: "asesores-menores",
    name: "Asesores de menores",
    icon: <Gavel className="w-10 h-10 text-primary-foreground" />,
    color: "bg-primary text-primary-foreground",
    description:
      "Intervienen ante maltrato, abuso o vulneración de derechos y promueven las medidas de protección necesarias .",
    members: [
      {
        name: "Capital",
        mail: "abusosCAPITAL@jus.mendoza.gov.ar",
        phone: "2613878710",
      },

      {
        name: "Lavalle",
        mail: "abusosLAVALLE@jus.mendoza.gov.ar",
        phone: "2613878710",
      },

      {
        name: "Guaymallén",
        mail: "abusosGUAYMALLEN@jus.mendoza.gov.ar",
        phone: "2613878710",
      },

      {
        name: "Godoy Cruz",
        mail: "abusosGODOYCRUZ@jus.mendoza.gov.ar",
        phone: "2612098665",
      },

      {
        name: "Las Heras",
        mail: "abusosLASHERAS@jus.mendoza.gov.ar",
        phone: "2615097845",
      },

      {
        name: "Maipú",
        mail: "abusosMAIPU@jus.mendoza.gov.ar",
        phone: "2616290733",
      },

      {
        name: "Luján",
        mail: "abusosLUJAN@jus.mendoza.gov.ar",
        phone: "2613878672",
      },

      {
        name: "San Martín",
        mail: "abusosSANMARTIN@jus.mendoza.gov.ar",
        phone: "2634688890 / 2634532293",
      },

      {
        name: "La Paz",
        mail: "abusosLAPAZ@jus.mendoza.gov.ar",
        phone: "2634688890 / 2634532293",
      },

      {
        name: "Santa Rosa",
        mail: "abusosSANTAROSA@jus.mendoza.gov.ar",
        phone: "2634688890 / 2634532293",
      },

      {
        name: "Junín",
        mail: "abusosJUNIN@jus.mendoza.gov.ar",
        phone: "2614177171",
      },

      {
        name: "Rivadavia",
        mail: "abusosRIVADAVIA@jus.mendoza.gov.ar",
        phone: "2614177171",
      },

      {
        name: "Tunuyán",
        mail: "abusosTUNUYAN@jus.mendoza.gov.ar",
        phone: "2616016212",
      },

      {
        name: "San Carlos",
        mail: "abusosSANCARLOS@jus.mendoza.gov.ar",
        phone: "2616016212",
      },

      {
        name: "Tupungato",
        mail: "abusosTUPUNGATO@jus.mendoza.gov.ar",
        phone: "2613860853",
      },

      {
        name: "San Rafael",
        mail: "abusosSANRAFAEL@jus.mendoza.gov.ar",
        phone: "2604277658",
      },

      {
        name: "Gral. Alvear",
        mail: "abusosALVEAR@jus.mendoza.gov.ar",
        phone: "2615566578",
      },

      {
        name: "Malargüe",
        mail: "abusosMALARGUE@jus.mendoza.gov.ar",
        phone: "2604277654",
      },
    ],
  },
  // {
  //   id: "primeros-auxilios",
  //   name: "Brigada de Primeros Auxilios",
  //   icon: <Heart className="w-6 h-6" aria-hidden="true" />,
  //   color: "bg-warning text-warning-foreground",
  //   description: "Atención médica inicial mientras llega ayuda profesional",
  //   members: [
  //     { name: "Ana López", role: "Líder de Brigada", zone: "Enfermería" },
  //     { name: "Carmen Díaz", role: "Auxiliar", zone: "Edificio A" },
  //     { name: "José Morales", role: "Auxiliar", zone: "Edificio B" },
  //     { name: "Patricia Ruiz", role: "Apoyo", zone: "Áreas deportivas" },
  //   ],
  // },
  // {
  //   id: "incendios",
  //   name: "Brigada Contra Incendios",
  //   icon: <Flame className="w-6 h-6" aria-hidden="true" />,
  //   color: "bg-emergency text-emergency-foreground",
  //   description: "Control inicial de fuego y uso de extintores",
  //   members: [
  //     { name: "Carlos Hernández", role: "Líder de Brigada", zone: "General" },
  //     { name: "Fernando López", role: "Operador", zone: "Edificio A" },
  //     { name: "Ricardo Soto", role: "Operador", zone: "Edificio B" },
  //     { name: "Manuel García", role: "Operador", zone: "Cocina y laboratorios" },
  //   ],
  // },
  // {
  //   id: "comunicacion",
  //   name: "Brigada de Comunicación",
  //   icon: <Phone className="w-6 h-6" aria-hidden="true" />,
  //   color: "bg-success text-success-foreground",
  //   description: "Coordinación de comunicaciones y notificaciones",
  //   members: [
  //     { name: "María García", role: "Líder de Brigada", zone: "Dirección" },
  //     { name: "Andrea Martínez", role: "Comunicación Interna", zone: "Administración" },
  //     { name: "Luis Sánchez", role: "Comunicación Externa", zone: "Recepción" },
  //   ],
  // },
];

export default function ContactosPage() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <EmergencyHeader />

        <main id="main-content" className="pt-20 lg:pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <section className="py-8 lg:py-12 border-b border-border mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Contactos y Roles de Emergencia
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Directorio de contactos de emergencia, personal escolar clave y
                brigadas de respuesta. Guarde estos números en un lugar
                accesible.
              </p>
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Emergency Numbers */}
              <div className="lg:col-span-1 space-y-6">
                {/* Emergency Services */}
                <section
                  aria-labelledby="emergency-services-heading"
                  className="bg-emergency/10 rounded-2xl border border-emergency/20 p-6"
                >
                  <h2
                    id="emergency-services-heading"
                    className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"
                  >
                    <Phone
                      className="w-5 h-5 text-emergency"
                      aria-hidden="true"
                    />
                    Servicios de Emergencia
                  </h2>

                  <div className="space-y-3">
                    {emergencyServices.map((service, index) => (
                      <a
                        key={index}
                        href={`tel:${service.number.replace(/[^\d+]/g, "")}`}
                        className="flex items-center justify-between p-3 bg-card rounded-xl hover:bg-accent transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-emergency transition-colors">
                            {service.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-emergency">
                          {service.number}
                        </span>
                      </a>
                    ))}
                  </div>
                </section>

               
              </div>

              {/* Right Column - School Contacts & Brigades */}
              <div className="lg:col-span-2 space-y-8">
                {/* School Staff */}
                <section
                  aria-labelledby="school-contacts-heading"
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h2
                    id="school-contacts-heading"
                    className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"
                  >
                    <Users
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    Personal Escolar Clave
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {asesoresMenores.map((asesor, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl ${
                          asesor.isCoordinator
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">
                              {asesor.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {asesor.role}
                            </p>
                            {asesor.extension && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Ext. {asesor.extension}
                              </p>
                            )}
                          </div>
                          {asesor.isCoordinator && (
                            <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                              Coordinador
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <a
                            href={`tel:${asesor.phone.replace(/[^\d+]/g, "")}`}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <Phone className="w-3 h-3" aria-hidden="true" />
                            {asesor.phone}
                          </a>
                          {asesor.email && (
                            <a
                              href={`mailto:${asesor.email}`}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Mail className="w-3 h-3" aria-hidden="true" />
                              Email
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Brigades */}
                <section id="roles" aria-labelledby="brigades-heading">

                  <div className="space-y-6">
                    {brigades.map((brigade) => (
                      <div
                        key={brigade.id}
                        className="bg-card rounded-2xl border border-border overflow-hidden"
                      >
                        <div
                          className={`${brigade.color} p-4 flex items-center gap-3`}
                        >
                          {brigade.icon}
                          <div>
                            <h3 className="font-bold">{brigade.name}</h3>
                            <p className="text-sm opacity-90">
                              {brigade.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-muted-foreground">
                                <th className="pb-2 font-medium">Nombre</th>
                                <th className="pb-2 font-medium">Contacto</th>
                                <th className="pb-2 font-medium"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {brigade.members.map((member, index) => (
                                <tr key={index}>
                                  <td className="py-2 font-medium text-foreground">
                                    {member.name}
                                  </td>
                                  <td className="py-2 text-muted-foreground">
                                    <a
                                      href={`mailto:${member.mail}`}
                                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                      <Mail
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                      />
                                      Email
                                    </a>
                                  </td>
                                  <td className="py-2 text-muted-foreground">
                                    <a className="text-primary" href={`tel:${member.phone}`}>
                                      {member.phone}
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Organizational Chart
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Organigrama de Emergencias
              </h2>

              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="flex flex-col items-center">
                  {/* Top Level 
                  <div className="p-4 bg-primary text-primary-foreground rounded-xl text-center mb-4">
                    <p className="font-bold">Coordinador General</p>
                    <p className="text-sm opacity-90">
                      Directora - María García
                    </p>
                  </div>

                  <div className="w-px h-8 bg-border" aria-hidden="true"></div>

                  {/* Second Level 
                  <div className="p-4 bg-secondary text-secondary-foreground rounded-xl text-center mb-4">
                    <p className="font-bold">Coordinador de Seguridad</p>
                    <p className="text-sm">Roberto Méndez</p>
                  </div>

                  <div className="w-px h-8 bg-border" aria-hidden="true"></div>

                  {/* Brigades Level 
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                    <div className="p-3 bg-primary/10 rounded-xl text-center">
                      <Building2
                        className="w-6 h-6 mx-auto mb-2 text-primary"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-sm">Evacuación</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-xl text-center">
                      <Heart
                        className="w-6 h-6 mx-auto mb-2 text-warning"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-sm">Primeros Auxilios</p>
                    </div>
                    <div className="p-3 bg-emergency/10 rounded-xl text-center">
                      <Flame
                        className="w-6 h-6 mx-auto mb-2 text-emergency"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-sm">Contra Incendios</p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-xl text-center">
                      <Phone
                        className="w-6 h-6 mx-auto mb-2 text-success"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-sm">Comunicación</p>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}

          </div>
        </main>

        <FloatingWidget />
      </div>
    </AccessibilityProvider>
  );
}
