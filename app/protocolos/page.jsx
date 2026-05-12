"use client";

import { useMemo, useState } from "react";
import Header from "../components/Header";
import { navItems } from "../data/home";
import ejeCinco from "../data/ejes/ejeCinco.json";
import ejeCuatro from "../data/ejes/ejeCuatro.json";
import ejeDos from "../data/ejes/ejeDos.json";
import ejeOcho from "../data/ejes/ejeOcho.json";
import ejeSeis from "../data/ejes/ejeSeis.json";
import ejeSiete from "../data/ejes/ejeSiete.json";
import ejeTres from "../data/ejes/ejeTres.json";
import ejeUno from "../data/ejes/ejeUno.json";

const RAW_EJES = [
  ejeUno,
  ejeDos,
  ejeTres,
  ejeCuatro,
  ejeCinco,
  ejeSeis,
  ejeSiete,
  ejeOcho,
];

const CATEGORY_KEYS = ["categorias", "subcategorias", "subcatergorias"];
const FILE_KEYS = ["archivo", "modelo_acta", "archivos", "files", "file", "adjunto", "adjuntos"];

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isStepItem(item) {
  return isObject(item) && hasOwn(item, "paso");
}

function formatKeyLabel(key) {
  const clean = String(key).replaceAll("_", " ").replaceAll("-", " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function sortByNumero(items) {
  return [...items].sort((a, b) => {
    const left = Number.parseFloat(String(a?.numero ?? "0").replace(",", "."));
    const right = Number.parseFloat(String(b?.numero ?? "0").replace(",", "."));
    return left - right;
  });
}

function normalizeEjes(data) {
  return sortByNumero(data).map((eje, ejeIndex) => {
    const subejes = Array.isArray(eje?.subejes) ? eje.subejes : [];
    const resolvedSubejes = subejes.length
      ? subejes
      : [
          {
            numero: eje.numero,
            nombre: "Protocolo general",
            pasos: eje.pasos,
            categorias: eje.categorias,
            acciones_preventivas: eje.acciones_preventivas,
            informacion: eje.informacion,
            condicion: eje.condicion,
            _virtual: true,
          },
        ];

    return {
      ...eje,
      id: `eje-${ejeIndex}-${String(eje.numero ?? ejeIndex)}`,
      subejes: resolvedSubejes.map((subeje, subejeIndex) => ({
        ...subeje,
        id: `subeje-${ejeIndex}-${subejeIndex}-${String(subeje?.numero ?? subejeIndex)}`,
      })),
    };
  });
}

function normalizePreventiveActions(source) {
  if (!source) return null;
  if (Array.isArray(source)) return { intro: null, items: source };
  if (isObject(source)) return { intro: source.factores_protectores ?? null, items: toArray(source.acciones) };
  return null;
}

function extractStepGroups(pasosValue, pathPrefix) {
  if (!pasosValue) return [];
  const groups = [];

  if (Array.isArray(pasosValue)) {
    const steps = pasosValue.filter(isStepItem);
    if (steps.length) groups.push({ id: `${pathPrefix}/grupo-principal`, title: null, steps });
    return groups;
  }

  if (!isObject(pasosValue)) return groups;

  if (Array.isArray(pasosValue.pasos)) {
    const steps = pasosValue.pasos.filter(isStepItem);
    if (steps.length) {
      groups.push({
        id: `${pathPrefix}/pasos`,
        title: pasosValue.restriccion ?? pasosValue.titulo ?? null,
        steps,
      });
    }
  }

  for (const [key, value] of Object.entries(pasosValue)) {
    if (key === "pasos" || !Array.isArray(value)) continue;
    const steps = value.filter(isStepItem);
    if (!steps.length) continue;
    groups.push({ id: `${pathPrefix}/${key}`, title: formatKeyLabel(key), steps });
  }

  return groups;
}

function collectStepEntries(node, basePath) {
  if (!isObject(node)) return [];
  const entries = [];

  extractStepGroups(node.pasos, `${basePath}/pasos`).forEach((group) => {
    group.steps.forEach((step, index) => entries.push({ id: `${group.id}/step-${index}`, step }));
  });

  if (isObject(node.condicion)) {
    entries.push(...collectStepEntries(node.condicion, `${basePath}/condicion`));
  }

  toArray(node.condiciones).forEach((condition, index) => {
    entries.push(...collectStepEntries(condition, `${basePath}/condiciones/${index}`));
  });

  toArray(node.acciones).forEach((action, index) => {
    entries.push(...collectStepEntries(action, `${basePath}/acciones/${index}`));
  });

  CATEGORY_KEYS.forEach((key) => {
    toArray(node[key]).forEach((child, index) => {
      entries.push(...collectStepEntries(child, `${basePath}/${key}/${index}`));
    });
  });

  return entries;
}

function getFileRefsFromStep(step) {
  const refs = [];
  FILE_KEYS.forEach((key) => {
    const value = step?.[key];
    if (!value) return;
    if (typeof value === "string") {
      refs.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") refs.push(item);
        if (isObject(item) && typeof item.path === "string") refs.push(item.path);
        if (isObject(item) && typeof item.url === "string") refs.push(item.url);
        if (isObject(item) && typeof item.archivo === "string") refs.push(item.archivo);
      });
      return;
    }
    if (isObject(value) && typeof value.path === "string") refs.push(value.path);
    if (isObject(value) && typeof value.url === "string") refs.push(value.url);
  });
  return [...new Set(refs)];
}

function extractChildren(node) {
  const children = [];
  CATEGORY_KEYS.forEach((key) => {
    toArray(node?.[key]).forEach((child, index) => {
      children.push({
        key: `${key}-${index}-${String(child?.numero ?? child?.letra ?? index)}`,
        label: key,
        value: child,
      });
    });
  });
  return children;
}

function buildCategoryTitle(category) {
  if (!category) return "";
  const code = category.value?.numero ?? category.value?.letra ?? "S/N";
  const name = category.value?.nombre ?? "";
  if (name) return code !== "S/N" ? `${code} - ${name}` : name;
  return String(code);
}

function getConditionTitle(condition, index) {
  return (
    condition.descripcion ??
    condition.condicion ??
    condition.tipo ??
    condition.numero ??
    `Condicion ${index + 1}`
  );
}

function StyledSelect({ id, value, onChange, children, disabled = false }) {
  return (
    <div className="relative mt-2">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full appearance-none rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        {children}
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
  );
}

function ProtocolNode({
  node,
  title,
  path,
  stepIdsByGroup,
  stepOrderById,
  completedSteps,
  onToggleStep,
  conditionSelections,
  onConditionSelection,
}) {
  if (!isObject(node)) return null;

  const actions = normalizePreventiveActions(node.acciones_preventivas ?? node.accionesPreventivas);
  const stepGroups = extractStepGroups(node.pasos, `${path}/pasos`);

  const conditionObject = isObject(node.condicion) ? node.condicion : null;
  const rawConditionArray = toArray(node.condiciones).filter(isObject);
  const hasConditionSelector = rawConditionArray.length > 1;
  const selectedConditionKey = conditionSelections[path] ?? (rawConditionArray.length ? "0" : "");
  const selectedConditionIndex = Number.parseInt(selectedConditionKey, 10);
  const conditionArray = hasConditionSelector
    ? [rawConditionArray[Number.isNaN(selectedConditionIndex) ? 0 : selectedConditionIndex]].filter(Boolean)
    : rawConditionArray;

  const actionBranches = toArray(node.acciones).filter((item) => isObject(item) && (item.pasos || item.condiciones || item.condicion));
  const children = extractChildren(node);

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      {title ? (
        <header>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {node.nombre && title !== node.nombre ? <p className="mt-1 text-sm text-slate-600">{node.nombre}</p> : null}
        </header>
      ) : null}

      {actions?.intro || actions?.items?.length ? (
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-sm font-semibold text-emerald-900">Acciones preventivas</p>
          {actions.intro ? <p className="text-sm text-emerald-800">{actions.intro}</p> : null}
          {actions.items?.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-emerald-900">
              {actions.items.map((item, index) => (
                <li key={index}>{item?.descripcion ?? String(item)}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {stepGroups.map((group, groupIndex) => {
        const stepIds = stepIdsByGroup[group.id] ?? [];
        return (
          <article key={`${group.id}-${groupIndex}`} className="space-y-3 rounded-xl border border-slate-200 p-3">
            {group.title ? <p className="text-sm font-semibold text-slate-800">{group.title}</p> : null}
            <div className="space-y-3">
              {group.steps.map((step, stepIndex) => {
                const stepId = stepIds[stepIndex];
                const order = stepOrderById[stepId];
                const previousId = order > 0 ? stepOrderById.__ordered[order - 1] : null;
                const isChecked = Boolean(completedSteps?.[stepId]);
                const isEnabled = order === 0 || (previousId ? completedSteps?.[previousId] : false);
                const files = getFileRefsFromStep(step);

                return (
                  <div
                    key={stepId ?? `${group.id}-fallback-${stepIndex}`}
                    className={`rounded-xl border p-3 ${isEnabled ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-75"}`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        disabled={!isEnabled}
                        onClick={() => onToggleStep(stepId)}
                        aria-pressed={isChecked}
                        aria-label={`Completar paso ${step.paso}`}
                        className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
                          isChecked
                            ? "border-slate-900 bg-slate-900 text-white"
                            : isEnabled
                            ? "border-slate-400 bg-white text-slate-700 hover:border-slate-700"
                            : "border-slate-300 bg-slate-100 text-slate-400"
                        }`}
                      >
                        {step.paso}
                      </button>
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold text-slate-900">Paso {step.paso}</p>
                        <p className="text-sm leading-relaxed text-slate-700">{step.descripcion}</p>

                        {step.nota ? (
                          <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-900">Nota: {step.nota}</p>
                        ) : null}

                        {Array.isArray(step.acciones) && step.acciones.length ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Acciones</p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                              {step.acciones.map((action, actionIndex) => (
                                <li key={actionIndex}>{String(action)}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {Array.isArray(step.condiciones) && step.condiciones.length ? (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Condiciones</p>
                            {step.condiciones.map((condition, conditionIndex) => (
                              <div key={conditionIndex} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                                <p className="text-sm font-semibold text-slate-800">
                                  {condition.tipo ?? condition.condicion ?? condition.descripcion ?? `Condicion ${conditionIndex + 1}`}
                                </p>
                                {Array.isArray(condition.acciones) ? (
                                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                    {condition.acciones.map((action, index) => (
                                      <li key={index}>{String(action)}</li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {Array.isArray(step.criterios) && step.criterios.length ? (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Criterios especiales</p>
                            {step.criterios.map((criterion, criterionIndex) => (
                              <div key={criterionIndex} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                                <p className="text-sm font-semibold text-slate-800">{criterion.tipo ?? `Criterio ${criterionIndex + 1}`}</p>
                                <p className="text-sm text-slate-700">{criterion.descripcion}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {files.length ? (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Archivos descargables</p>
                            <div className="flex flex-wrap gap-2">
                              {files.map((fileRef, fileIndex) => {
                                const fileName = String(fileRef).split("/").filter(Boolean).pop();
                                return (
                                  <a
                                    key={`${fileRef}-${fileIndex}`}
                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                    href={`/api/descargas?ref=${encodeURIComponent(fileRef)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Descargar {fileName ?? `archivo ${fileIndex + 1}`}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}

      {conditionObject ? (
        <ProtocolNode
          node={conditionObject}
          title={conditionObject.condicion ? `Condicion: ${conditionObject.condicion}` : "Condicion"}
          path={`${path}/condicion`}
          stepIdsByGroup={stepIdsByGroup}
          stepOrderById={stepOrderById}
          completedSteps={completedSteps}
          onToggleStep={onToggleStep}
          conditionSelections={conditionSelections}
          onConditionSelection={onConditionSelection}
        />
      ) : null}

      {hasConditionSelector ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Elegi una condicion</p>
          <StyledSelect id={`${path}-condiciones`} value={selectedConditionKey} onChange={(event) => onConditionSelection(path, event.target.value)}>
            {rawConditionArray.map((condition, index) => (
              <option key={`${path}-cond-${index}`} value={String(index)}>
                {getConditionTitle(condition, index)}
              </option>
            ))}
          </StyledSelect>
        </div>
      ) : null}

      {conditionArray.map((condition, index) => (
        <ProtocolNode
          key={`${path}/condiciones/${index}`}
          node={condition}
          title={getConditionTitle(condition, index)}
          path={`${path}/condiciones/${index}`}
          stepIdsByGroup={stepIdsByGroup}
          stepOrderById={stepOrderById}
          completedSteps={completedSteps}
          onToggleStep={onToggleStep}
          conditionSelections={conditionSelections}
          onConditionSelection={onConditionSelection}
        />
      ))}

      {actionBranches.map((action, index) => (
        <ProtocolNode
          key={`${path}/acciones/${index}`}
          node={action}
          title={action.condicion ?? action.descripcion ?? action.titulo ?? `Accion ${index + 1}`}
          path={`${path}/acciones/${index}`}
          stepIdsByGroup={stepIdsByGroup}
          stepOrderById={stepOrderById}
          completedSteps={completedSteps}
          onToggleStep={onToggleStep}
          conditionSelections={conditionSelections}
          onConditionSelection={onConditionSelection}
        />
      ))}

      {children.map((child, index) => (
        <ProtocolNode
          key={child.key}
          node={child.value}
          title={buildCategoryTitle(child)}
          path={`${path}/${child.label}/${index}`}
          stepIdsByGroup={stepIdsByGroup}
          stepOrderById={stepOrderById}
          completedSteps={completedSteps}
          onToggleStep={onToggleStep}
          conditionSelections={conditionSelections}
          onConditionSelection={onConditionSelection}
        />
      ))}
    </section>
  );
}

export default function ProtocolosPage() {
  const ejes = useMemo(() => normalizeEjes(RAW_EJES), []);
  const [selectedEjeId, setSelectedEjeId] = useState("");
  const [selectedSubejeId, setSelectedSubejeId] = useState("");
  const [selectedCategoryBySubeje, setSelectedCategoryBySubeje] = useState({});
  const [selectedSubcategoryByCategoryScope, setSelectedSubcategoryByCategoryScope] = useState({});
  const [conditionSelections, setConditionSelections] = useState({});
  const [completedByScope, setCompletedByScope] = useState({});

  const selectedEje = useMemo(() => ejes.find((eje) => eje.id === selectedEjeId) ?? null, [ejes, selectedEjeId]);
  const subejes = selectedEje?.subejes ?? [];
  const selectedSubeje = useMemo(() => (selectedEje ? subejes.find((subeje) => subeje.id === selectedSubejeId) ?? subejes[0] ?? null : null), [selectedEje, subejes, selectedSubejeId]);

  const categoryOptions = useMemo(() => (selectedSubeje ? extractChildren(selectedSubeje) : []), [selectedSubeje]);
  const categoryScopeKey = selectedSubeje?.id ?? "";
  const selectedCategoryKey = selectedCategoryBySubeje[categoryScopeKey] ?? "";
  const activeCategory = useMemo(() => {
    if (!categoryOptions.length) return null;
    return categoryOptions.find((category) => category.key === selectedCategoryKey) ?? categoryOptions[0];
  }, [categoryOptions, selectedCategoryKey]);

  const subcategoryOptions = useMemo(() => (activeCategory ? extractChildren(activeCategory.value) : []), [activeCategory]);
  const subcategoryScopeKey = `${categoryScopeKey}::${activeCategory?.key ?? "sin-categoria"}`;
  const selectedSubcategoryKey = selectedSubcategoryByCategoryScope[subcategoryScopeKey] ?? "";
  const activeSubcategory = useMemo(() => {
    if (!subcategoryOptions.length) return null;
    return subcategoryOptions.find((subcategory) => subcategory.key === selectedSubcategoryKey) ?? subcategoryOptions[0];
  }, [subcategoryOptions, selectedSubcategoryKey]);

  const protocolNode = useMemo(() => {
    if (!selectedSubeje) return null;
    if (activeSubcategory?.value) return activeSubcategory.value;
    if (activeCategory?.value) return activeCategory.value;
    return selectedSubeje;
  }, [selectedSubeje, activeCategory, activeSubcategory]);

  const protocolTitle = useMemo(() => {
    if (activeSubcategory) return buildCategoryTitle(activeSubcategory);
    if (activeCategory) return buildCategoryTitle(activeCategory);
    const code = selectedSubeje?.numero ?? "General";
    const name = selectedSubeje?.nombre ?? "";
    return name ? `${code} - ${name}` : String(code);
  }, [activeCategory, activeSubcategory, selectedSubeje]);

  const scopeKey = `${selectedEje?.id ?? "sin-eje"}::${selectedSubeje?.id ?? "sin-subeje"}::${activeCategory?.key ?? "all"}::${activeSubcategory?.key ?? "all"}`;
  const allSteps = useMemo(() => (protocolNode ? collectStepEntries(protocolNode, `${scopeKey}/root`) : []), [protocolNode, scopeKey]);

  const stepIdsByGroup = useMemo(() => {
    if (!protocolNode) return {};
    const map = {};

    const fillMap = (node, path) => {
      if (!isObject(node)) return;
      extractStepGroups(node.pasos, `${path}/pasos`).forEach((group) => {
        map[group.id] = group.steps.map((_, index) => `${group.id}/step-${index}`);
      });
      if (isObject(node.condicion)) fillMap(node.condicion, `${path}/condicion`);
      toArray(node.condiciones).forEach((item, index) => fillMap(item, `${path}/condiciones/${index}`));
      toArray(node.acciones).forEach((item, index) => fillMap(item, `${path}/acciones/${index}`));
      CATEGORY_KEYS.forEach((key) => toArray(node[key]).forEach((item, index) => fillMap(item, `${path}/${key}/${index}`)));
    };

    fillMap(protocolNode, `${scopeKey}/root`);
    return map;
  }, [protocolNode, scopeKey]);

  const completedSteps = completedByScope[scopeKey] ?? {};

  const stepOrderById = useMemo(() => {
    const map = { __ordered: allSteps.map((entry) => entry.id) };
    allSteps.forEach((entry, index) => {
      map[entry.id] = index;
    });
    return map;
  }, [allSteps]);

  const completedCount = allSteps.reduce((acc, entry) => acc + (completedSteps[entry.id] ? 1 : 0), 0);
  const progressPercent = allSteps.length ? Math.round((completedCount / allSteps.length) * 100) : 0;

  const handleSelectEje = (ejeId) => {
    const nextEje = ejes.find((item) => item.id === ejeId);
    setSelectedEjeId(ejeId);
    setSelectedSubejeId(nextEje?.subejes?.[0]?.id ?? "");
    setConditionSelections({});
  };

  const handleSelectSubeje = (subejeId) => {
    setSelectedSubejeId(subejeId);
    setConditionSelections({});
  };

  const handleToggleStep = (stepId) => {
    if (!stepId) return;
    setCompletedByScope((previous) => {
      const current = { ...(previous[scopeKey] ?? {}) };
      const currentOrder = stepOrderById[stepId];
      if (currentOrder === undefined) return previous;
      const orderedIds = stepOrderById.__ordered ?? [];
      const currentlyChecked = Boolean(current[stepId]);

      if (currentlyChecked) {
        orderedIds.slice(currentOrder).forEach((id) => {
          delete current[id];
        });
      } else {
        const previousId = currentOrder > 0 ? orderedIds[currentOrder - 1] : null;
        const canCheck = currentOrder === 0 || (previousId && current[previousId]);
        if (!canCheck) return previous;
        current[stepId] = true;
      }

      return { ...previous, [scopeKey]: current };
    });
  };

  const handleConditionSelection = (path, value) => {
    setConditionSelections((previous) => ({ ...previous, [path]: value }));
  };

  const ejeActions = normalizePreventiveActions(selectedEje?.acciones_preventivas);

  return (
    <>

      <Header navItems={navItems} />

      <main id="protocolos-main" className="mx-auto w-full max-w-[1200px] space-y-6 px-4 pb-12 pt-8 md:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-slate-900">Protocolos</h1>
          <p className="mt-2 text-sm text-slate-600">
            Selecciona un eje para navegar titulos y pasos. El avance es secuencial: cada paso desbloquea el siguiente.
          </p>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm w-full">
            <label htmlFor="eje-selector" className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Eje principal
            </label>
            <StyledSelect id="eje-selector" value={selectedEjeId} onChange={(event) => handleSelectEje(event.target.value)}>
              <option value="">Debes seleccionar un eje</option>
              {ejes.map((eje) => (
                <option key={eje.id} value={eje.id}>
                  Eje {eje.numero}: {eje.nombre}
                </option>
              ))}
            </StyledSelect>

            {selectedEje ? (
              <div className="mt-2 w-full">
                <StyledSelect id="subeje-selector" value={selectedSubeje?.id ?? ""} onChange={(event) => handleSelectSubeje(event.target.value)}>
                  {subejes.map((subeje) => (
                    <option key={`select-${subeje.id}`} value={subeje.id}>
                      {subeje.numero ?? "S/N"} - {subeje.nombre}
                    </option>
                  ))}
                </StyledSelect>
              </div>
            ) : (
              <p className="mt-3 text-sm font-medium text-slate-600">Debes seleccionar un eje para ver los titulos y pasos del protocolo.</p>
            )}
          </div>

          {selectedEje && selectedSubeje ? (
            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-600">
                  Eje {selectedEje.numero}: {selectedEje.nombre}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {selectedSubeje.numero ?? "General"} - {selectedSubeje.nombre}
                </h2>

                {categoryOptions.length ? (
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Titulos</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {categoryOptions.map((category) => {
                          const isActive = activeCategory?.key === category.key;
                          return (
                            <button
                              key={category.key}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => {
                                setSelectedCategoryBySubeje((previous) => ({ ...previous, [categoryScopeKey]: category.key }));
                                setConditionSelections({});
                              }}
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                isActive
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              {buildCategoryTitle(category)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {subcategoryOptions.length ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Titulos relacionados</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {subcategoryOptions.map((subcategory) => {
                            const isActive = activeSubcategory?.key === subcategory.key;
                            return (
                              <button
                                key={`${subcategoryScopeKey}-${subcategory.key}`}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => {
                                  setSelectedSubcategoryByCategoryScope((previous) => ({
                                    ...previous,
                                    [subcategoryScopeKey]: subcategory.key,
                                  }));
                                  setConditionSelections({});
                                }}
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                  isActive
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {buildCategoryTitle(subcategory)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {ejeActions?.intro || ejeActions?.items?.length ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-emerald-900">Acciones preventivas del eje</p>
                  {ejeActions.intro ? <p className="mt-2 text-sm text-emerald-800">{ejeActions.intro}</p> : null}
                  {ejeActions.items?.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900">
                      {ejeActions.items.map((item, index) => (
                        <li key={index}>{item?.descripcion ?? String(item)}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">Avance de pasos</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>
                      {completedCount} / {allSteps.length} pasos completados
                    </span>
                    <span className="font-semibold">{progressPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              {protocolNode ? (
                <ProtocolNode
                  node={protocolNode}
                  title={protocolTitle}
                  path={`${scopeKey}/root`}
                  stepIdsByGroup={stepIdsByGroup}
                  stepOrderById={stepOrderById}
                  completedSteps={completedSteps}
                  onToggleStep={handleToggleStep}
                  conditionSelections={conditionSelections}
                  onConditionSelection={handleConditionSelection}
                />
              ) : null}
            </section>
          ) : null}
        </section>
      </main>
    </>
  );
}
