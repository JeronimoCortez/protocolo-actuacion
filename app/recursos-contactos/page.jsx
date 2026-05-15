"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { navItems } from "../data/home";
import datosInteresRaw from "../data/contactos/datos_interes.json";
import capitalData from "../data/contactos/por-departamento/capital/capital.json";
import godoyCruzData from "../data/contactos/por-departamento/godoy-cruz/godoy-cruz.json";
import guaymallenData from "../data/contactos/por-departamento/guaymallen/guaymallen.json";
import juninData from "../data/contactos/por-departamento/junin/junin.json";
import laPazData from "../data/contactos/por-departamento/la-paz/la-paz.json";
import lasHerasData from "../data/contactos/por-departamento/las-heras/las-heras.json";
import lavalleData from "../data/contactos/por-departamento/lavalle/lavalle.json";
import lujanData from "../data/contactos/por-departamento/lujan/lujan.json";
import maipuData from "../data/contactos/por-departamento/maipu/maipu.json";
import malargueData from "../data/contactos/por-departamento/malargue/malargue.json";
import rivadaviaData from "../data/contactos/por-departamento/rivadavia/rivadavia.json";
import sanCarlosData from "../data/contactos/por-departamento/san-carlos/san-carlos.json";
import sanMartinData from "../data/contactos/por-departamento/san-martin/san-martin.json";
import sanRafaelData from "../data/contactos/por-departamento/san-rafael/san-rafael.json";
import santaRosaData from "../data/contactos/por-departamento/santa-rosa/santa-rosa.json";
import tunuyanData from "../data/contactos/por-departamento/tunuyan/tunuyan.json";
import tupungatoData from "../data/contactos/por-departamento/tupungato/tupungato.json";

const DEPARTMENT_SOURCES = [
  { id: "capital", label: "Capital", data: capitalData },
  { id: "godoy-cruz", label: "Godoy Cruz", data: godoyCruzData },
  { id: "guaymallen", label: "Guaymallen", data: guaymallenData },
  { id: "junin", label: "Junin", data: juninData },
  { id: "la-paz", label: "La Paz", data: laPazData },
  { id: "las-heras", label: "Las Heras", data: lasHerasData },
  { id: "lavalle", label: "Lavalle", data: lavalleData },
  { id: "lujan", label: "Lujan", data: lujanData },
  { id: "maipu", label: "Maipu", data: maipuData },
  { id: "malargue", label: "Malargue", data: malargueData },
  { id: "rivadavia", label: "Rivadavia", data: rivadaviaData },
  { id: "san-carlos", label: "San Carlos", data: sanCarlosData },
  { id: "san-martin", label: "San Martin", data: sanMartinData },
  { id: "san-rafael", label: "San Rafael", data: sanRafaelData },
  { id: "santa-rosa", label: "Santa Rosa", data: santaRosaData },
  { id: "tunuyan", label: "Tunuyan", data: tunuyanData },
  { id: "tupungato", label: "Tupungato", data: tupungatoData },
];

const PHONE_KEYS = new Set(["telefono", "telefonos", "numero", "numeros", "whatsapp", "fax"]);
const LINK_KEYS = new Set(["enlace", "fuente", "url", "sitio_web"]);
const EMAIL_KEYS = new Set(["correo", "correos", "coreo", "email", "e-mail", "mail"]);
const HIDDEN_DETAIL_KEYS = new Set(["nombre", "origen"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function formatLabel(label) {
  return String(label).replaceAll("_", " ").replaceAll("-", " ").replace(/\s+/g, " ").trim();
}

function collectPhones(value, currentKey = "", bucket = []) {
  if (value === null || value === undefined) return bucket;

  if (typeof value === "string" || typeof value === "number") {
    if (PHONE_KEYS.has(currentKey)) bucket.push(String(value));
    return bucket;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectPhones(item, currentKey, bucket));
    return bucket;
  }

  if (isObject(value)) {
    Object.entries(value).forEach(([key, nestedValue]) => collectPhones(nestedValue, key, bucket));
  }

  return bucket;
}

function collectLinks(value, currentKey = "", bucket = []) {
  if (value === null || value === undefined) return bucket;

  if (typeof value === "string") {
    const looksLikeUrl = value.startsWith("http://") || value.startsWith("https://");
    if (LINK_KEYS.has(currentKey) || looksLikeUrl) bucket.push(value);
    return bucket;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectLinks(item, currentKey, bucket));
    return bucket;
  }

  if (isObject(value)) {
    Object.entries(value).forEach(([key, nestedValue]) => collectLinks(nestedValue, key, bucket));
  }

  return bucket;
}

function getPrimaryPhone(...sources) {
  for (const source of sources) {
    const phones = collectPhones(source);
    const clean = phones.find((phone) => String(phone).trim().length > 0);
    if (clean) return clean;
  }
  return "";
}

function getPrimaryLink(...sources) {
  for (const source of sources) {
    const links = collectLinks(source);
    const clean = links.find((link) => String(link).trim().length > 0);
    if (clean) return clean;
  }
  return "";
}

function collectEmails(value, currentKey = "", bucket = []) {
  if (value === null || value === undefined) return bucket;

  if (typeof value === "string") {
    const looksLikeEmail = value.includes("@");
    if (EMAIL_KEYS.has(currentKey) || looksLikeEmail) bucket.push(value);
    return bucket;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectEmails(item, currentKey, bucket));
    return bucket;
  }

  if (isObject(value)) {
    Object.entries(value).forEach(([key, nestedValue]) => collectEmails(nestedValue, key, bucket));
  }

  return bucket;
}

function getPrimaryEmail(...sources) {
  for (const source of sources) {
    const emails = collectEmails(source);
    const clean = emails.find((email) => String(email).trim().length > 0);
    if (clean) return clean;
  }
  return "";
}

function resolvePrimaryAccess(...sources) {
  const phone = getPrimaryPhone(...sources);
  if (phone) {
    return {
      kind: "phone",
      label: phone,
      href: `tel:${String(phone).replace(/\s+/g, "")}`,
    };
  }

  const email = getPrimaryEmail(...sources);
  if (email) {
    return {
      kind: "email",
      label: email,
      href: `mailto:${email}`,
    };
  }

  const link = getPrimaryLink(...sources);
  if (link) {
    return {
      kind: "link",
      label: link,
      href: link,
    };
  }

  return {
    kind: "none",
    label: "Sin dato principal",
    href: "",
  };
}

function looksLikePhone(value) {
  const text = String(value).trim();
  if (!text) return false;
  const digits = text.replace(/\D/g, "");
  return digits.length >= 6;
}

function toPhoneHref(value) {
  return `tel:${String(value).replace(/[^\d+]/g, "")}`;
}

function buildContactSearchText(contact) {
  const detailsText = Object.entries(contact.details)
    .map(([key, value]) => `${key} ${JSON.stringify(value)}`)
    .join(" ");
  return `${contact.name} ${contact.subtitle} ${contact.primaryAccess.label} ${detailsText}`.toLowerCase();
}

function findContactsByQuery(searchableContacts, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  return searchableContacts.filter((entry) => terms.every((term) => entry.searchText.includes(term)));
}

function normalizeDepartmentContacts() {
  const contacts = [];

  DEPARTMENT_SOURCES.forEach((department) => {
    const categorias = toArray(department.data?.categorias).filter(isObject);
    categorias.forEach((categoria, categoryIndex) => {
      const organismos = toArray(categoria.organismos).filter(isObject);
      organismos.forEach((organismo, orgIndex) => {
        contacts.push({
          id: `${department.id}-${categoryIndex}-${orgIndex}`,
          name: organismo.nombre ?? "Contacto sin nombre",
          primaryAccess: resolvePrimaryAccess(organismo),
          subtitle: `${department.label} · ${categoria.nombre ?? "Categoria"}`,
          details: {
            departamento: department.label,
            categoria: categoria.nombre ?? "Categoria",
            ...organismo,
          },
        });
      });
    });
  });

  return contacts;
}

function normalizeInteresContacts() {
  const contacts = [];
  const datos = toArray(datosInteresRaw?.datos).filter(isObject);

  datos.forEach((dato, datoIndex) => {
    const groupedKeys = ["centros", "equipos", "guardias", "numeros"];
    const groupedItems = groupedKeys.flatMap((key) =>
      toArray(dato[key]).map((item, index) => ({ item, key, index })).filter(({ item }) => isObject(item))
    );

    if (groupedItems.length) {
      groupedItems.forEach(({ item, key, index }) => {
        contacts.push({
          id: `interes-${datoIndex}-${key}-${index}`,
          name: item.nombre ?? dato.nombre ?? "Contacto sin nombre",
          primaryAccess: resolvePrimaryAccess(item, dato),
          subtitle: `Datos de interes · ${dato.nombre ?? "Referencia"}`,
          details: {
            referencia: dato.nombre ?? "",
            ...item,
          },
        });
      });
      return;
    }

    contacts.push({
      id: `interes-${datoIndex}`,
      name: dato.nombre ?? "Contacto sin nombre",
      primaryAccess: resolvePrimaryAccess(dato),
      subtitle: "Datos de interes",
      details: {
        ...dato,
      },
    });
  });

  return contacts;
}

function DetailValue({ value, fieldKey = "" }) {
  const normalizedKey = String(fieldKey).toLowerCase();

  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-500">No informado</span>;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const textValue = String(value).trim();

    if (textValue.startsWith("http://") || textValue.startsWith("https://")) {
      return (
        <a href={textValue} target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-2">
          {textValue}
        </a>
      );
    }

    if (EMAIL_KEYS.has(normalizedKey) || textValue.includes("@")) {
      return (
        <a href={`mailto:${textValue}`} className="text-blue-700 underline underline-offset-2">
          {textValue}
        </a>
      );
    }

    if (PHONE_KEYS.has(normalizedKey) && looksLikePhone(textValue)) {
      return (
        <a href={toPhoneHref(textValue)} className="text-blue-700 underline underline-offset-2">
          {textValue}
        </a>
      );
    }

    return <span className="text-slate-700">{textValue}</span>;
  }

  if (Array.isArray(value)) {
    if (!value.length) return <span className="text-slate-500">No informado</span>;

    if (
      (PHONE_KEYS.has(normalizedKey) || EMAIL_KEYS.has(normalizedKey)) &&
      value.every((item) => typeof item === "string" || typeof item === "number")
    ) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <DetailValue key={`${normalizedKey}-${index}`} value={item} fieldKey={normalizedKey} />
          ))}
        </div>
      );
    }

    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return <span className="text-slate-700">{value.map((item) => String(item)).join(" · ")}</span>;
    }

    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-2">
            <DetailValue value={item} fieldKey={normalizedKey} />
          </div>
        ))}
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className="space-y-1.5">
        {Object.entries(value).map(([key, nestedValue]) => (
          <div key={key} className="text-sm">
            <span className="font-semibold text-slate-700">{formatLabel(key)}: </span>
            <DetailValue value={nestedValue} fieldKey={key} />
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-slate-700">{String(value)}</span>;
}

function ContactCard({ contact, isOpen, onToggle }) {
  return (
    <article className="surface-card rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left" aria-expanded={isOpen}>
        <div>
          <p className="card-title text-sm">{contact.name}</p>
          <p className="text-xs text-slate-500">{contact.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={contact.primaryAccess.kind !== "none" ? contact.primaryAccess.href : undefined}
            target={contact.primaryAccess.kind === "link" ? "_blank" : undefined}
            rel={contact.primaryAccess.kind === "link" ? "noreferrer" : undefined}
            onClick={(event) => {
              event.stopPropagation();
              if (contact.primaryAccess.kind === "none") event.preventDefault();
            }}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              contact.primaryAccess.kind === "none"
                ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500"
                : "max-w-[190px] truncate border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
            }`}
            title={contact.primaryAccess.label}
          >
            {contact.primaryAccess.label}
          </a>
          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-600 transition ${isOpen ? "rotate-180" : ""}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </button>

      {isOpen ? (
        <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
          {Object.entries(contact.details)
            .filter(([key, value]) => !HIDDEN_DETAIL_KEYS.has(key) && value !== null && value !== undefined && value !== "")
            .map(([key, value]) => (
              <div key={`${contact.id}-${key}`} className="rounded-md border border-slate-200 p-2 text-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{formatLabel(key)}</p>
                <DetailValue value={value} fieldKey={key} />
              </div>
            ))}
        </div>
      ) : null}
    </article>
  );
}

export default function RecursosContactosPage() {
  const [activeFilter, setActiveFilter] = useState("interes");
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENT_SOURCES[0]?.id ?? "");
  const [openContactId, setOpenContactId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [selectedSearchContactId, setSelectedSearchContactId] = useState("");
  const [isSearchPreviewOpen, setIsSearchPreviewOpen] = useState(false);

  const contactosInteres = useMemo(() => normalizeInteresContacts(), []);
  const contactosDepartamento = useMemo(() => normalizeDepartmentContacts(), []);
  const allContacts = useMemo(() => [...contactosInteres, ...contactosDepartamento], [contactosInteres, contactosDepartamento]);
  const searchableContacts = useMemo(
    () => allContacts.map((contact) => ({ contact, searchText: buildContactSearchText(contact) })),
    [allContacts]
  );
  const searchPreviewResults = useMemo(
    () => findContactsByQuery(searchableContacts, searchInput).slice(0, 8).map((entry) => entry.contact),
    [searchableContacts, searchInput]
  );
  const appliedSearchResults = useMemo(
    () => findContactsByQuery(searchableContacts, appliedSearchQuery).map((entry) => entry.contact),
    [appliedSearchQuery, searchableContacts]
  );

  const visibleContacts = useMemo(() => {
    if (selectedSearchContactId) {
      return allContacts.filter((contact) => contact.id === selectedSearchContactId);
    }
    if (appliedSearchQuery.trim()) return appliedSearchResults;
    if (activeFilter === "interes") return contactosInteres;
    return contactosDepartamento.filter((contact) => contact.id.startsWith(`${selectedDepartment}-`));
  }, [
    activeFilter,
    allContacts,
    appliedSearchQuery,
    appliedSearchResults,
    contactosDepartamento,
    contactosInteres,
    selectedDepartment,
    selectedSearchContactId,
  ]);

  const visibleContactColumns = useMemo(() => {
    const left = [];
    const right = [];

    visibleContacts.forEach((contact, index) => {
      if (index % 2 === 0) left.push(contact);
      else right.push(contact);
    });

    return { left, right };
  }, [visibleContacts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const headerSearch = String(params.get("search") ?? "").trim();
    if (!headerSearch) return;

    setSearchInput(headerSearch);
    setAppliedSearchQuery(headerSearch);
    setSelectedSearchContactId("");
    setOpenContactId("");
    setIsSearchPreviewOpen(false);
  }, []);

  const applyGlobalSearch = () => {
    const query = searchInput.trim();
    if (!query) {
      setAppliedSearchQuery("");
      setSelectedSearchContactId("");
      setOpenContactId("");
      setIsSearchPreviewOpen(false);
      return;
    }

    setAppliedSearchQuery(query);
    setSelectedSearchContactId("");
    setOpenContactId("");
    setIsSearchPreviewOpen(false);
  };

  const handleSelectPreviewContact = (contact) => {
    setSearchInput(contact.name);
    setAppliedSearchQuery("");
    setSelectedSearchContactId(contact.id);
    setOpenContactId(contact.id);
    setIsSearchPreviewOpen(false);
  };

  return (
    <>
      <Header navItems={navItems} />

      <main id="recursos-contactos-main" className="mx-auto w-full max-w-[1200px] space-y-6 px-4 pb-12 pt-8 md:px-6 md:pt-10">
        <section className="surface-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="page-title">Recursos y contactos</h1>
          <p className="supporting-copy mt-3">
            Filtra por datos de interes o por departamento. Cada tarjeta muestra un numero o enlace principal y el resto de la informacion en desplegable.
          </p>
        </section>

        <section className="surface-card space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setActiveFilter("interes");
                setOpenContactId("");
              }}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                activeFilter === "interes"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:border-slate-500 hover:bg-slate-50"
              }`}
            >
              <p className={`text-base font-semibold leading-6 tracking-tight ${activeFilter === "interes" ? "text-white" : "text-[var(--heading)]"}`}>
                Datos de interes
              </p>
              <p className={`mt-1 text-sm ${activeFilter === "interes" ? "text-slate-200" : "text-slate-500"}`}>
                Ver todos los contactos de referencia general.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveFilter("departamento");
                setOpenContactId("");
              }}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                activeFilter === "departamento"
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:border-slate-500 hover:bg-slate-50"
              }`}
            >
              <p className={`text-base font-semibold leading-6 tracking-tight ${activeFilter === "departamento" ? "text-white" : "text-[var(--heading)]"}`}>
                Por departamento
              </p>
              <p className={`mt-1 text-sm ${activeFilter === "departamento" ? "text-emerald-100" : "text-slate-500"}`}>
                Buscar organismos segun el departamento.
              </p>
            </button>
          </div>

          <div className="grid w-full gap-3 md:grid-cols-2 md:items-start">
            <div className="w-full">
              <label htmlFor="contact-search" className="label-text">
                Buscar contactos
              </label>
              <div className="relative mt-2">
                <input
                  id="contact-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setSearchInput(nextValue);
                    setIsSearchPreviewOpen(true);
                    if (!nextValue.trim()) {
                      setAppliedSearchQuery("");
                      setSelectedSearchContactId("");
                      setOpenContactId("");
                      setIsSearchPreviewOpen(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchInput.trim()) setIsSearchPreviewOpen(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    applyGlobalSearch();
                  }}
                  placeholder="Nombre, telefono, correo o direccion"
                  className="control-text w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-10 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="button"
                  onClick={applyGlobalSearch}
                  aria-label="Buscar en todos los contactos"
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 transition hover:text-slate-700"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path
                      fillRule="evenodd"
                      d="M8.5 3a5.5 5.5 0 104.474 8.702l3.662 3.662a.75.75 0 101.06-1.06l-3.661-3.662A5.5 5.5 0 008.5 3zm-4 5.5a4 4 0 118 0 4 4 0 01-8 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isSearchPreviewOpen && searchInput.trim() ? (
                  <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {searchPreviewResults.length ? (
                      searchPreviewResults.map((contact) => (
                        <button
                          key={`preview-${contact.id}`}
                          type="button"
                          onClick={() => handleSelectPreviewContact(contact)}
                          className="w-full border-b border-slate-100 px-3 py-2 text-left transition last:border-b-0 hover:bg-slate-50"
                        >
                          <p className="card-title text-sm">{contact.name}</p>
                          <p className="text-xs text-slate-500">{contact.subtitle}</p>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-slate-500">Sin coincidencias.</p>
                    )}
                  </div>
                ) : null}
              </div>
              {selectedSearchContactId ? (
                <p className="mt-1 text-xs text-slate-500">Mostrando un contacto seleccionado desde la vista previa.</p>
              ) : appliedSearchQuery.trim() ? (
                <p className="mt-1 text-xs text-slate-500">Mostrando todos los resultados de la busqueda global.</p>
              ) : null}
            </div>

            <div className="w-full">
              {activeFilter === "departamento" ? (
                <>
                  <label htmlFor="department-select" className="label-text">
                    Selecciona un departamento
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="department-select"
                      value={selectedDepartment}
                      onChange={(event) => {
                        setSelectedDepartment(event.target.value);
                        setOpenContactId("");
                      }}
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 [&>option]:bg-white [&>option]:py-2 [&>option]:text-sm [&>option]:font-medium"
                    >
                      {DEPARTMENT_SOURCES.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <p className="card-title text-sm text-slate-700">
            {visibleContacts.length} contacto{visibleContacts.length === 1 ? "" : "s"} encontrados
          </p>

          {visibleContacts.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-3">
                {visibleContactColumns.left.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    isOpen={openContactId === contact.id}
                    onToggle={() => setOpenContactId((previous) => (previous === contact.id ? "" : contact.id))}
                  />
                ))}
              </div>
              <div className="space-y-3">
                {visibleContactColumns.right.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    isOpen={openContactId === contact.id}
                    onToggle={() => setOpenContactId((previous) => (previous === contact.id ? "" : contact.id))}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="surface-card rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              No hay contactos para el filtro seleccionado.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
