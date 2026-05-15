import ejeCinco from "./ejes/ejeCinco.json";
import ejeCuatro from "./ejes/ejeCuatro.json";
import ejeDos from "./ejes/ejeDos.json";
import ejeOcho from "./ejes/ejeOcho.json";
import ejeSeis from "./ejes/ejeSeis.json";
import ejeSiete from "./ejes/ejeSiete.json";
import ejeTres from "./ejes/ejeTres.json";
import ejeUno from "./ejes/ejeUno.json";

import datosInteresRaw from "./contactos/datos_interes.json";
import capitalData from "./contactos/por-departamento/capital/capital.json";
import godoyCruzData from "./contactos/por-departamento/godoy-cruz/godoy-cruz.json";
import guaymallenData from "./contactos/por-departamento/guaymallen/guaymallen.json";
import juninData from "./contactos/por-departamento/junin/junin.json";
import laPazData from "./contactos/por-departamento/la-paz/la-paz.json";
import lasHerasData from "./contactos/por-departamento/las-heras/las-heras.json";
import lavalleData from "./contactos/por-departamento/lavalle/lavalle.json";
import lujanData from "./contactos/por-departamento/lujan/lujan.json";
import maipuData from "./contactos/por-departamento/maipu/maipu.json";
import malargueData from "./contactos/por-departamento/malargue/malargue.json";
import rivadaviaData from "./contactos/por-departamento/rivadavia/rivadavia.json";
import sanCarlosData from "./contactos/por-departamento/san-carlos/san-carlos.json";
import sanMartinData from "./contactos/por-departamento/san-martin/san-martin.json";
import sanRafaelData from "./contactos/por-departamento/san-rafael/san-rafael.json";
import santaRosaData from "./contactos/por-departamento/santa-rosa/santa-rosa.json";
import tunuyanData from "./contactos/por-departamento/tunuyan/tunuyan.json";
import tupungatoData from "./contactos/por-departamento/tupungato/tupungato.json";

const EJE_DATASETS = [ejeUno, ejeDos, ejeTres, ejeCuatro, ejeCinco, ejeSeis, ejeSiete, ejeOcho];

const DEPARTMENT_SOURCES = [
  { label: "Capital", data: capitalData },
  { label: "Godoy Cruz", data: godoyCruzData },
  { label: "Guaymallen", data: guaymallenData },
  { label: "Junin", data: juninData },
  { label: "La Paz", data: laPazData },
  { label: "Las Heras", data: lasHerasData },
  { label: "Lavalle", data: lavalleData },
  { label: "Lujan", data: lujanData },
  { label: "Maipu", data: maipuData },
  { label: "Malargue", data: malargueData },
  { label: "Rivadavia", data: rivadaviaData },
  { label: "San Carlos", data: sanCarlosData },
  { label: "San Martin", data: sanMartinData },
  { label: "San Rafael", data: sanRafaelData },
  { label: "Santa Rosa", data: santaRosaData },
  { label: "Tunuyan", data: tunuyanData },
  { label: "Tupungato", data: tupungatoData },
];

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function collectNamesFromObject(value, bucket = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectNamesFromObject(item, bucket));
    return bucket;
  }

  if (!isObject(value)) return bucket;

  if (typeof value.nombre === "string" && value.nombre.trim()) {
    bucket.push(value.nombre.trim());
  }

  Object.values(value).forEach((nestedValue) => collectNamesFromObject(nestedValue, bucket));
  return bucket;
}

function buildEjeEntries() {
  const entries = [];

  EJE_DATASETS.forEach((eje, ejeIndex) => {
    const ejeNumero = String(eje?.numero ?? ejeIndex + 1).trim();
    const ejeNombre = String(eje?.nombre ?? "").trim();
    if (!ejeNombre) return;

    entries.push({
      id: `eje-${ejeNumero}-${ejeIndex}`,
      type: "eje",
      title: `Eje ${ejeNumero}: ${ejeNombre}`,
      subtitle: "Eje",
      href: `/protocolos?eje=${encodeURIComponent(ejeNumero)}`,
    });

    toArray(eje?.subejes).forEach((subeje, subejeIndex) => {
      const subejeNumero = String(subeje?.numero ?? "").trim();
      const subejeNombre = String(subeje?.nombre ?? "").trim();
      if (!subejeNumero || !subejeNombre) return;

      entries.push({
        id: `subeje-${ejeNumero}-${subejeNumero}-${subejeIndex}`,
        type: "subeje",
        title: `${subejeNumero} - ${subejeNombre}`,
        subtitle: `Subeje del Eje ${ejeNumero}`,
        href: `/protocolos?eje=${encodeURIComponent(ejeNumero)}&subeje=${encodeURIComponent(subejeNumero)}`,
      });
    });
  });

  return entries;
}

function buildContactoEntries() {
  const entries = [];

  const addContactEntry = (title, subtitle) => {
    const cleanTitle = String(title ?? "").trim();
    if (!cleanTitle) return;

    entries.push({
      id: `contacto-${entries.length}-${normalizeText(cleanTitle).replace(/\s+/g, "-")}`,
      type: "contacto",
      title: cleanTitle,
      subtitle,
      href: `/recursos-contactos?search=${encodeURIComponent(cleanTitle)}`,
    });
  };

  toArray(datosInteresRaw?.datos).forEach((dato) => {
    addContactEntry(dato?.nombre, "Contacto · Datos de interés");
    collectNamesFromObject(dato).forEach((name) => addContactEntry(name, "Contacto · Datos de interés"));
  });

  DEPARTMENT_SOURCES.forEach((department) => {
    toArray(department?.data?.categorias).forEach((categoria) => {
      addContactEntry(categoria?.nombre, `Contacto · ${department.label}`);
      toArray(categoria?.organismos).forEach((organismo) => {
        addContactEntry(organismo?.nombre, `Contacto · ${department.label}`);
      });
    });
  });

  return entries;
}

function dedupeEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const key = `${entry.type}::${normalizeText(entry.title)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const HEADER_SEARCH_INDEX = dedupeEntries([
  ...buildEjeEntries(),
  ...buildContactoEntries(),
]);

export function matchHeaderSearchEntries(query) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return HEADER_SEARCH_INDEX.filter((entry) => {
    const normalizedTitle = normalizeText(entry.title);
    return terms.every((term) => normalizedTitle.includes(term));
  });
}
