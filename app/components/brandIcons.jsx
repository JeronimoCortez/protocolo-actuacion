// Sistema de iconos del Protocolo (DGE Mendoza): ejes, módulos y secciones.

export const SECTION_COLORS = {
  red: "#BC4749",
  yellow: "#FFCD37",
  cyan: "#00ADD2",
  orange: "#F88338",
  purple: "#593BB2",
};

export const EJE_BRAND = {
  1: { color: "#BB4748", modulo: 1, corto: "Violencias" },
  2: { color: "#A7C958", modulo: 2, corto: "Consumos" },
  3: { color: "#6A984D", modulo: 2, corto: "Suicidio" },
  4: { color: "#03045E", modulo: 3, corto: "Trabajo Infantil" },
  5: { color: "#0077B7", modulo: 3, corto: "Ausentismos" },
  6: { color: "#00B4D7", modulo: 3, corto: "Desc. de paradero" },
  7: { color: "#91E0EF", modulo: 3, corto: "Retraso en el retiro" },
  8: { color: "#386640", modulo: 2, corto: "Crisis emocional" },
  9: { color: "#593BB2", modulo: 4, corto: "Fallec. de estudiante" },
  10: { color: "#7E6BFE", modulo: 4, corto: "Armas, explosivos (...)" },
  11: { color: "#B8B0FE", modulo: 4, corto: "Com. Institucional" },
};

// Orden de ejes dentro de cada módulo según el sistema de iconos
export const MODULOS = [
  { numero: 1, color: "#BB4748", ejes: [1] },
  { numero: 2, color: "#A7C958", ejes: [2, 3, 8] },
  { numero: 3, color: "#0077B7", ejes: [4, 5, 6, 7] },
  { numero: 4, color: "#7E6BFE", ejes: [9, 10, 11] },
];

export function getEjeBrand(numero) {
  return EJE_BRAND[Number.parseInt(String(numero ?? ""), 10)] ?? null;
}

export function getModulo(numero) {
  return MODULOS.find((modulo) => modulo.numero === numero) ?? null;
}

function starPoints() {
  const points = [];
  for (let index = 0; index < 16; index += 1) {
    const angle = (index * Math.PI) / 8 - Math.PI / 2;
    const radius = index % 4 === 0 ? 6.4 : index % 2 === 0 ? 4.2 : 1.9;
    points.push(`${(12 + radius * Math.cos(angle)).toFixed(2)},${(12 + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return points.join(" ");
}

const PETAL = "M11.3 11.3H8.6A2.1 2.1 0 0 1 6.5 9.2V8.6A2.1 2.1 0 0 1 8.6 6.5H9.2A2.1 2.1 0 0 1 11.3 8.6Z";

const EJE_GLYPHS = {
  1: <path d="M12 16.6 5.6 10.2A9 9 0 0 1 18.4 10.2Z" fill="white" />,
  2: (
    <g fill="white">
      {[0, 90, 180, 270].map((rotation) => (
        <path key={rotation} d={PETAL} transform={`rotate(${rotation} 12 12)`} />
      ))}
    </g>
  ),
  3: <path d="M6.8 8.2H17.2L12 17.2Z" fill="white" />,
  4: (
    <g fill="white">
      <path d="M7 6.8H17Q17 11.6 12 11.6Q7 11.6 7 6.8Z" />
      <rect x="7" y="13.2" width="10" height="4" rx="0.4" />
    </g>
  ),
  5: (
    <g fill="none" stroke="white" strokeWidth="1.7">
      <circle cx="12" cy="12" r="5.6" />
      <path d="M12 6.4V17.6M6.4 12H17.6" />
      <path d="M12 12H17.6A5.6 5.6 0 0 1 12 17.6Z" fill="white" />
    </g>
  ),
  6: <path d="M8.6 17.4V11.6A3.4 3.4 0 0 1 15.4 11.6V17.4" fill="none" stroke="white" strokeWidth="2.6" />,
  7: (
    <g fill="none" stroke="white" strokeWidth="1.8">
      <circle cx="12" cy="12" r="5.6" />
      <path d="M12 12V8A4 4 0 0 1 16 12Z" fill="white" stroke="none" />
    </g>
  ),
  8: (
    <path
      d="M12 12a1.25 1.25 0 0 1 2.5 0a2.5 2.5 0 0 1-5 0a3.75 3.75 0 0 1 7.5 0a5 5 0 0 1-5 5"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  ),
  9: <path d="M12 6.4 18.2 17H5.8ZM9.2 11.7H14.8L12 16.5Z" fill="white" fillRule="evenodd" />,
  10: <polygon points={starPoints()} fill="white" />,
  11: (
    <path
      d="M12 6.6c-3.3 0-6 2.3-6 5.1 0 1.5.7 2.8 1.9 3.7l-.6 2.6 2.9-1.5c.6.2 1.2.3 1.8.3 3.3 0 6-2.3 6-5.1S15.3 6.6 12 6.6Z"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  ),
};

export function EjeIcon({ numero, className = "h-10 w-10", title, ...props }) {
  const key = Number.parseInt(String(numero ?? ""), 10);
  const brand = EJE_BRAND[key];
  if (!brand) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="12" cy="12" r="12" fill={brand.color} />
      {EJE_GLYPHS[key]}
    </svg>
  );
}

export function ModuloBadge({ numero, className = "h-8 w-8", ...props }) {
  const modulo = getModulo(numero);
  if (!modulo) return null;

  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="11.25" fill="white" stroke={modulo.color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="9.5" fill={modulo.color} />
      <text
        x="12"
        y="16.6"
        textAnchor="middle"
        fontSize="13.5"
        fontWeight="800"
        fill="white"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        {modulo.numero}
      </text>
    </svg>
  );
}

const ACTIVITY_SEGMENTS = ["#A7C958", "#2E8B6F", "#00ADD2", "#E53935", "#F88338", "#FFCD37"];

function ActivitiesGlyph() {
  const radius = 9.6;
  const circumference = 2 * Math.PI * radius;
  const segment = circumference / ACTIVITY_SEGMENTS.length;

  return (
    <>
      {ACTIVITY_SEGMENTS.map((color, index) => (
        <circle
          key={color}
          cx="12"
          cy="12"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4.8"
          strokeDasharray={`${segment} ${circumference - segment}`}
          strokeDashoffset={-segment * index}
          transform="rotate(-90 12 12)"
        />
      ))}
      <circle cx="12" cy="12" r="7.2" fill="white" />
      <g fill="#1E293B">
        <rect x="8.4" y="9" width="1.5" height="1.5" rx="0.4" />
        <rect x="8.4" y="11.25" width="1.5" height="1.5" rx="0.4" />
        <rect x="8.4" y="13.5" width="1.5" height="1.5" rx="0.4" />
        <rect x="10.8" y="9" width="4.8" height="1.5" rx="0.6" />
        <rect x="10.8" y="11.25" width="4.8" height="1.5" rx="0.6" />
        <rect x="10.8" y="13.5" width="4.8" height="1.5" rx="0.6" />
      </g>
    </>
  );
}

const SECTION_ICONS = {
  presentacion: {
    background: SECTION_COLORS.yellow,
    glyph: <path d="M9.6 7.4 16.6 12 9.6 16.6Z" fill={SECTION_COLORS.red} />,
  },
  "hoja-de-ruta": {
    background: SECTION_COLORS.cyan,
    glyph: <rect x="8" y="8" width="8" height="8" rx="1" transform="rotate(45 12 12)" fill="white" />,
  },
  bibliografia: {
    background: SECTION_COLORS.orange,
    glyph: (
      <g stroke="white" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 6.8V17.2M7.5 9.4 16.5 14.6M16.5 9.4 7.5 14.6" />
      </g>
    ),
  },
  actividades: { background: null, glyph: <ActivitiesGlyph /> },
};

export function SectionIcon({ type, className = "h-8 w-8", ...props }) {
  const icon = SECTION_ICONS[type];
  if (!icon) return null;

  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true" {...props}>
      {icon.background ? <circle cx="12" cy="12" r="12" fill={icon.background} /> : null}
      {icon.glyph}
    </svg>
  );
}
