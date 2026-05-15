"use client";

import { useEffect, useMemo, useState } from "react";
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

function isStepBranch(item) {
  return isObject(item) && Array.isArray(item.pasos) && !isStepItem(item);
}

function formatKeyLabel(key) {
  const clean = String(key).replaceAll("_", " ").replaceAll("-", " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function formatIdentifierLabel(value) {
  const clean = String(value ?? "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .trim();
  if (!clean) return "";
  return clean
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
            informacion: eje.informacion,
            condicion: eje.condicion,
            _virtual: true,
          },
        ];

    return {
      ...eje,
      id: `eje-${ejeIndex}-${String(eje.numero ?? ejeIndex)}`,
      hasRealSubejes: subejes.length > 0,
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

function extractConditionBranchesFromPasos(pasosValue) {
  if (!Array.isArray(pasosValue)) return [];
  return pasosValue.filter(isStepBranch);
}

function getConditionEntries(node, path, selections = null) {
  if (!isObject(node)) return [];
  const rawConditionArray = toArray(node.condiciones).filter(isObject);
  const stepBranchConditions = extractConditionBranchesFromPasos(node.pasos);
  const allConditionBlocks = [...rawConditionArray, ...stepBranchConditions];

  if (!allConditionBlocks.length) return [];

  if (!selections || allConditionBlocks.length === 1) {
    return allConditionBlocks.map((condition, index) => ({ condition, index }));
  }

  const selectedKey = selections[path] ?? "0";
  const selectedIndex = Number.parseInt(selectedKey, 10);
  const resolvedIndex = Number.isNaN(selectedIndex) ? 0 : selectedIndex;
  const selectedCondition = allConditionBlocks[resolvedIndex];
  return selectedCondition ? [{ condition: selectedCondition, index: resolvedIndex }] : [];
}

function getActionBranches(node) {
  return toArray(node?.acciones).filter((item) => isObject(item) && (item.pasos || item.condiciones || item.condicion));
}

function shouldUseWeaponTypeSelector(node, actionBranches) {
  return String(node?.numero ?? "") === "7.2.1" && actionBranches.length > 1;
}

function getActionEntries(node, path, selections = null) {
  const actionBranches = getActionBranches(node);
  if (!actionBranches.length) return [];

  if (!shouldUseWeaponTypeSelector(node, actionBranches)) {
    return actionBranches.map((action, index) => ({ action, index }));
  }

  if (!selections) return [];

  const selectedKey = selections[`${path}/acciones-selector`] ?? "";
  if (selectedKey === "") return [];

  const selectedIndex = Number.parseInt(selectedKey, 10);
  const resolvedIndex = Number.isNaN(selectedIndex) ? -1 : selectedIndex;
  const selectedAction = actionBranches[resolvedIndex];
  return selectedAction ? [{ action: selectedAction, index: resolvedIndex }] : [];
}

function collectStepEntries(node, basePath, conditionSelections = null) {
  if (!isObject(node)) return [];
  const entries = [];

  extractStepGroups(node.pasos, `${basePath}/pasos`).forEach((group) => {
    group.steps.forEach((step, index) => entries.push({ id: `${group.id}/step-${index}`, step }));
  });

  if (isObject(node.condicion)) {
    entries.push(...collectStepEntries(node.condicion, `${basePath}/condicion`, conditionSelections));
  }

  getConditionEntries(node, basePath, conditionSelections).forEach(({ condition, index }) => {
    entries.push(...collectStepEntries(condition, `${basePath}/condiciones/${index}`, conditionSelections));
  });

  getActionEntries(node, basePath, conditionSelections).forEach(({ action, index }) => {
    entries.push(...collectStepEntries(action, `${basePath}/acciones/${index}`, conditionSelections));
  });

  CATEGORY_KEYS.forEach((key) => {
    toArray(node[key]).forEach((child, index) => {
      entries.push(...collectStepEntries(child, `${basePath}/${key}/${index}`, conditionSelections));
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

function buildNodeTitle(node) {
  if (!isObject(node)) return "S/N";
  const code = node.numero ?? node.letra ?? "S/N";
  const name = node.nombre ?? "";
  if (name) return code !== "S/N" ? `${code} - ${name}` : name;
  return String(code);
}

function getConditionTitle(condition, index) {
  const rawTitle =
    condition.descripcion ??
    condition.condicion ??
    condition.restriccion ??
    condition.titulo ??
    condition.tipo ??
    condition.numero ??
    `Condicion ${index + 1}`;

  if (rawTitle === condition.tipo) {
    return formatIdentifierLabel(rawTitle);
  }

  return rawTitle;
}

function normalizeSimpleItems(source) {
  if (!source) return [];
  return toArray(source).map((item) => {
    if (typeof item === "string") return { descripcion: item };
    if (isObject(item)) return item;
    return { descripcion: String(item) };
  });
}

function getPanelThemeClasses(theme = "emerald") {
  if (theme === "rose") {
    return {
      container: "border-rose-300 bg-rose-50",
      title: "text-rose-900",
      indicator: "border-rose-300 bg-white text-rose-700",
      bodyText: "text-rose-900",
    };
  }

  if (theme === "sky") {
    return {
      container: "border-sky-200 bg-sky-50",
      title: "text-sky-900",
      indicator: "border-sky-300 bg-white text-sky-700",
      bodyText: "text-sky-900",
    };
  }

  return {
    container: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-900",
    indicator: "border-emerald-300 bg-white text-emerald-700",
    bodyText: "text-emerald-900",
  };
}

function PreventiveActionsPanel({ title, intro, items, defaultOpen = false, wrapperClassName = "", theme = "emerald" }) {
  if (!intro && !items?.length) return null;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const themeClasses = getPanelThemeClasses(theme);

  const handleTogglePanel = (event) => {
    const interactiveTarget = event.target.closest("a, button, input, select, textarea");
    if (interactiveTarget) return;
    setIsOpen((previous) => !previous);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleTogglePanel}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        setIsOpen((previous) => !previous);
      }}
      className={`group cursor-pointer rounded-xl border p-3 shadow-sm ${themeClasses.container} ${wrapperClassName}`.trim()}
    >
      <div className={`flex items-center justify-between gap-3 text-sm font-semibold tracking-tight ${themeClasses.title}`}>
        <span>{title}</span>
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border transition ${themeClasses.indicator} ${isOpen ? "rotate-180" : ""}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      {isOpen ? (
        <div className="mt-3 space-y-2">
          {intro ? <p className={`control-text ${themeClasses.bodyText}`}>{intro}</p> : null}
          {items?.length ? (
            <ul className={`control-text list-disc space-y-2 pl-5 ${themeClasses.bodyText}`}>
              {items.map((item, index) => (
                <li key={index}>{item?.descripcion ?? String(item)}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
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
        className="w-full appearance-none rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 pr-10 text-sm font-medium tracking-tight text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 [&>option]:bg-white [&>option]:py-2 [&>option]:text-sm [&>option]:font-medium [&>option]:text-slate-800 [&>option:checked]:bg-slate-900 [&>option:checked]:text-white"
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
  const allConditionEntries = getConditionEntries(node, path, null);
  const allConditionBlocks = allConditionEntries.map((entry) => entry.condition);
  const hasConditionSelector = allConditionBlocks.length > 1;
  const selectedConditionKey = conditionSelections[path] ?? (allConditionBlocks.length ? "0" : "");
  const conditionEntries = getConditionEntries(node, path, conditionSelections);

  const actionBranches = getActionBranches(node);
  const hasWeaponTypeSelector = shouldUseWeaponTypeSelector(node, actionBranches);
  const selectedWeaponTypeKey = conditionSelections[`${path}/acciones-selector`] ?? "";
  const actionEntries = getActionEntries(node, path, conditionSelections);
  const children = extractChildren(node);

  return (
    <section className="surface-card space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      {title ? (
        <header>
          <h3 className="section-title text-lg">{title}</h3>
          {node.nombre && title !== node.nombre ? <p className="supporting-copy mt-1">{node.nombre}</p> : null}
        </header>
      ) : null}

      <PreventiveActionsPanel
        title="Acciones preventivas"
        intro={actions?.intro}
        items={actions?.items}
      />

      {stepGroups.map((group, groupIndex) => {
        const stepIds = stepIdsByGroup[group.id] ?? [];
        return (
          <article key={`${group.id}-${groupIndex}`} className="space-y-3 rounded-xl border border-slate-200 p-3">
            {group.title ? <p className="card-title text-sm">{group.title}</p> : null}
            <div className="space-y-3">
              {group.steps.map((step, stepIndex) => {
                const stepId = stepIds[stepIndex];
                const order = stepOrderById[stepId];
                const previousId = order > 0 ? stepOrderById.__ordered[order - 1] : null;
                const isChecked = Boolean(completedSteps?.[stepId]);
                const isEnabled = order === 0 || (previousId ? completedSteps?.[previousId] : false);
                const files = getFileRefsFromStep(step);
                const stepConditions = Array.isArray(step.condiciones) ? step.condiciones.filter(isObject) : [];
                const hasStepConditions = stepConditions.length > 0;
                const stepConditionPath = `${stepId ?? `${group.id}/fallback-${stepIndex}`}/condiciones`;
                const stepSelectedConditionKey = conditionSelections[stepConditionPath] ?? "0";
                const stepSelectedConditionIndex = Number.parseInt(stepSelectedConditionKey, 10);
                const resolvedStepConditionIndex = Number.isNaN(stepSelectedConditionIndex) ? 0 : stepSelectedConditionIndex;
                const selectedStepCondition = hasStepConditions
                  ? stepConditions[resolvedStepConditionIndex] ?? stepConditions[0]
                  : null;

                return (
                  <div
                    key={stepId ?? `${group.id}-fallback-${stepIndex}`}
                    onClick={(event) => {
                      const interactiveTarget = event.target.closest("a, button, input, select, textarea, label");
                      if (interactiveTarget || !isEnabled || !stepId) return;
                      onToggleStep(stepId);
                    }}
                    className={`rounded-xl border p-3 ${isEnabled ? "cursor-pointer border-slate-200 bg-white hover:border-slate-300" : "border-slate-200 bg-slate-50 opacity-75"}`}
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
                        <p className="control-text">{step.descripcion}</p>

                        {step.nota ? (
                          <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-900">Nota: {step.nota}</p>
                        ) : null}

                        {Array.isArray(step.acciones) && step.acciones.length ? (
                          <div>
                            <p className="label-text text-slate-500">Acciones</p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                              {step.acciones.map((action, actionIndex) => (
                                <li key={actionIndex}>{String(action)}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {hasStepConditions ? (
                          <div className="space-y-2">
                            <p className="label-text text-slate-500">Condiciones</p>
                            {stepConditions.length > 1 ? (
                              <div className="flex flex-wrap gap-2">
                                {stepConditions.map((condition, conditionIndex) => {
                                  const isActive =
                                    (stepConditions[resolvedStepConditionIndex] ? resolvedStepConditionIndex : 0) ===
                                    conditionIndex;
                                  return (
                                    <button
                                      key={`${stepConditionPath}-option-${conditionIndex}`}
                                      type="button"
                                      aria-pressed={isActive}
                                      onClick={() => onConditionSelection(stepConditionPath, String(conditionIndex))}
                                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                        isActive
                                          ? "border-slate-900 bg-slate-900 text-white"
                                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50"
                                      }`}
                                    >
                                      {getConditionTitle(condition, conditionIndex)}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : null}
                            {selectedStepCondition ? (
                              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                                <p className="card-title text-sm">
                                  {getConditionTitle(
                                    selectedStepCondition,
                                    stepConditions[resolvedStepConditionIndex] ? resolvedStepConditionIndex : 0
                                  )}
                                </p>
                                {Array.isArray(selectedStepCondition.acciones) ? (
                                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                    {selectedStepCondition.acciones.map((action, index) => (
                                      <li key={index}>{String(action)}</li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {Array.isArray(step.criterios) && step.criterios.length ? (
                          <div className="space-y-2">
                            <p className="label-text text-slate-500">Criterios especiales</p>
                            {step.criterios.map((criterion, criterionIndex) => (
                              <div key={criterionIndex} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                                <p className="card-title text-sm">{criterion.tipo ?? `Criterio ${criterionIndex + 1}`}</p>
                                <p className="control-text">{criterion.descripcion}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {files.length ? (
                          <div className="space-y-1">
                            <p className="label-text text-slate-500">Archivos descargables</p>
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
            {allConditionBlocks.map((condition, index) => (
              <option key={`${path}-cond-${index}`} value={String(index)}>
                {getConditionTitle(condition, index)}
              </option>
            ))}
          </StyledSelect>
        </div>
      ) : null}

      {conditionEntries.map(({ condition, index }) => (
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

      {hasWeaponTypeSelector ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Tipo de arma</p>
          <StyledSelect
            id={`${path}-tipo-arma`}
            value={selectedWeaponTypeKey}
            onChange={(event) => onConditionSelection(`${path}/acciones-selector`, event.target.value)}
          >
            <option value="">Selecciona un arma</option>
            {actionBranches.map((action, index) => (
              <option key={`${path}-arma-${index}`} value={String(index)}>
                {action.condicion ?? action.descripcion ?? action.titulo ?? `Opcion ${index + 1}`}
              </option>
            ))}
          </StyledSelect>
        </div>
      ) : null}

      {actionEntries.map(({ action, index }) => (
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEjeId, setSelectedEjeId] = useState("");
  const [selectedSubejeId, setSelectedSubejeId] = useState("");
  const [selectedCategoryBySubeje, setSelectedCategoryBySubeje] = useState({});
  const [selectedSubcategoryByCategoryScope, setSelectedSubcategoryByCategoryScope] = useState({});
  const [conditionSelections, setConditionSelections] = useState({});
  const [completedByScope, setCompletedByScope] = useState({});

  const selectedEje = useMemo(() => ejes.find((eje) => eje.id === selectedEjeId) ?? null, [ejes, selectedEjeId]);
  const subejes = selectedEje?.subejes ?? [];
  const showSubejeSelector = Boolean(selectedEje?.hasRealSubejes && subejes.length);
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
  const allSteps = useMemo(
    () => (protocolNode ? collectStepEntries(protocolNode, `${scopeKey}/root`, conditionSelections) : []),
    [protocolNode, scopeKey, conditionSelections]
  );

  const stepIdsByGroup = useMemo(() => {
    if (!protocolNode) return {};
    const map = {};

    const fillMap = (node, path) => {
      if (!isObject(node)) return;
      extractStepGroups(node.pasos, `${path}/pasos`).forEach((group) => {
        map[group.id] = group.steps.map((_, index) => `${group.id}/step-${index}`);
      });
      if (isObject(node.condicion)) fillMap(node.condicion, `${path}/condicion`);
      getConditionEntries(node, path, conditionSelections).forEach(({ condition, index }) => {
        fillMap(condition, `${path}/condiciones/${index}`);
      });
      getActionEntries(node, path, conditionSelections).forEach(({ action, index }) => {
        fillMap(action, `${path}/acciones/${index}`);
      });
      CATEGORY_KEYS.forEach((key) => toArray(node[key]).forEach((item, index) => fillMap(item, `${path}/${key}/${index}`)));
    };

    fillMap(protocolNode, `${scopeKey}/root`);
    return map;
  }, [protocolNode, scopeKey, conditionSelections]);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ejeParam = String(params.get("eje") ?? "").trim();
    if (!ejeParam) return;

    const matchedEje = ejes.find((item) => String(item?.numero ?? "").trim() === ejeParam);
    if (!matchedEje) return;

    const subejeParam = String(params.get("subeje") ?? "").trim();
    const matchedSubeje = subejeParam
      ? matchedEje.subejes?.find((item) => String(item?.numero ?? "").trim() === subejeParam) ?? null
      : matchedEje.subejes?.[0] ?? null;

    const nextEjeId = matchedEje.id;
    const nextSubejeId = matchedSubeje?.id ?? matchedEje.subejes?.[0]?.id ?? "";

    if (selectedEjeId !== nextEjeId) {
      setSelectedEjeId(nextEjeId);
    }

    if (selectedSubejeId !== nextSubejeId) {
      setSelectedSubejeId(nextSubejeId);
    }
  }, [ejes, selectedEjeId, selectedSubejeId]);

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
  const ejeGeneralCriteria = normalizeSimpleItems(selectedEje?.criterios_generales);
  const ejeConfidentiality = normalizeSimpleItems(selectedEje?.confidencialidad);
  const selectedSubeje911Info = isObject(selectedSubeje?.informacion_911) ? selectedSubeje.informacion_911 : null;
  const info911DataToReport = normalizeSimpleItems(selectedSubeje911Info?.datos_a_informar);
  const info911ArrivalGuidelines = normalizeSimpleItems(selectedSubeje911Info?.aspectos_importantes_cuando_llegue_policia);
  const searchIndex = useMemo(() => {
    const entries = [];
    ejes.forEach((eje) => {
      const ejeTitle = `Eje ${eje.numero}: ${eje.nombre}`;
      entries.push({
        id: `search-${eje.id}`,
        type: "eje",
        title: ejeTitle,
        subtitle: "Ir al eje",
        ejeId: eje.id,
        subejeId: eje.subejes?.[0]?.id ?? "",
        categoryKey: null,
        subcategoryKey: null,
        searchText: `${ejeTitle} ${eje.nombre ?? ""}`.toLowerCase(),
      });

      (eje.subejes ?? []).forEach((subeje) => {
        const subejeTitle = buildNodeTitle(subeje);
        entries.push({
          id: `search-${eje.id}-${subeje.id}`,
          type: "subeje",
          title: subejeTitle,
          subtitle: ejeTitle,
          ejeId: eje.id,
          subejeId: subeje.id,
          categoryKey: null,
          subcategoryKey: null,
          searchText: `${subejeTitle} ${subeje.nombre ?? ""} ${ejeTitle}`.toLowerCase(),
        });

        const categories = extractChildren(subeje);
        categories.forEach((category) => {
          const categoryTitle = buildCategoryTitle(category);
          entries.push({
            id: `search-${subeje.id}-${category.key}`,
            type: "categoria",
            title: categoryTitle,
            subtitle: `${ejeTitle} · ${subejeTitle}`,
            ejeId: eje.id,
            subejeId: subeje.id,
            categoryKey: category.key,
            subcategoryKey: null,
            searchText: `${categoryTitle} ${category.value?.nombre ?? ""} ${subejeTitle} ${ejeTitle}`.toLowerCase(),
          });

          const subcategories = extractChildren(category.value);
          subcategories.forEach((subcategory) => {
            const subcategoryTitle = buildCategoryTitle(subcategory);
            entries.push({
              id: `search-${subeje.id}-${category.key}-${subcategory.key}`,
              type: "subcategoria",
              title: subcategoryTitle,
              subtitle: `${ejeTitle} · ${subejeTitle} · ${categoryTitle}`,
              ejeId: eje.id,
              subejeId: subeje.id,
              categoryKey: category.key,
              subcategoryKey: subcategory.key,
              searchText: `${subcategoryTitle} ${subcategory.value?.nombre ?? ""} ${categoryTitle} ${subejeTitle} ${ejeTitle}`.toLowerCase(),
            });
          });
        });
      });
    });
    return entries;
  }, [ejes]);

  const filteredSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    const terms = query.split(/\s+/).filter(Boolean);
    return searchIndex
      .filter((entry) => terms.every((term) => entry.searchText.includes(term)))
      .slice(0, 12);
  }, [searchIndex, searchQuery]);

  const handleSearchSelection = (entry) => {
    const nextEje = ejes.find((item) => item.id === entry.ejeId);
    const resolvedSubejeId = entry.subejeId || nextEje?.subejes?.[0]?.id || "";

    setSelectedEjeId(entry.ejeId);
    setSelectedSubejeId(resolvedSubejeId);
    setConditionSelections({});

    if (entry.categoryKey) {
      setSelectedCategoryBySubeje((previous) => ({ ...previous, [resolvedSubejeId]: entry.categoryKey }));
    }

    if (entry.categoryKey && entry.subcategoryKey) {
      const subcategoryScope = `${resolvedSubejeId}::${entry.categoryKey}`;
      setSelectedSubcategoryByCategoryScope((previous) => ({ ...previous, [subcategoryScope]: entry.subcategoryKey }));
    }

    setSearchQuery(entry.title);
  };

  return (
    <>

      <Header navItems={navItems} />

      <main id="protocolos-main" className="mx-auto w-full max-w-[1200px] space-y-6 px-4 pb-12 pt-8 md:px-6 md:pt-10">
        <section className="surface-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="page-title">Protocolos</h1>
          <p className="supporting-copy mt-3">
            Selecciona un eje para navegar titulos y pasos. El avance es secuencial: cada paso desbloquea el siguiente.
          </p>
        </section>

        <section className="space-y-4">
          <div className="surface-card w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <label htmlFor="eje-search" className="label-text">
                Buscador de ejes
              </label>
              <input
                id="eje-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Busca por eje, titulo, subtitulo o palabras clave..."
                className="control-text mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              {searchQuery.trim() ? (
                <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white">
                  {filteredSearchResults.length ? (
                    filteredSearchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleSearchSelection(result)}
                        className="flex w-full items-start justify-between gap-2 border-b border-slate-100 px-3 py-2 text-left transition last:border-b-0 hover:bg-slate-50"
                      >
                        <span className="control-text font-medium text-slate-800">{result.title}</span>
                        <span className="text-xs text-slate-500">{result.subtitle}</span>
                      </button>
                    ))
                  ) : (
                    <p className="supporting-copy px-3 py-2">No hay coincidencias para esa busqueda.</p>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Escribe para buscar un eje.</p>
              )}
            </div>

            <label htmlFor="eje-selector" className="label-text">
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

            {selectedEje && showSubejeSelector ? (
              <div className="mt-2 w-full">
                <StyledSelect id="subeje-selector" value={selectedSubeje?.id ?? ""} onChange={(event) => handleSelectSubeje(event.target.value)}>
                  {subejes.map((subeje) => (
                    <option key={`select-${subeje.id}`} value={subeje.id}>
                      {subeje.numero ?? "S/N"} - {subeje.nombre}
                    </option>
                  ))}
                </StyledSelect>
              </div>
            ) : !selectedEje ? (
              <p className="supporting-copy mt-3">Debes seleccionar un eje para ver los titulos y pasos del protocolo.</p>
            ) : null}
          </div>

          {selectedEje && selectedSubeje ? (
            <section className="space-y-4">
              <div className="surface-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <p className="supporting-copy">
                  Eje {selectedEje.numero}: {selectedEje.nombre}
                </p>
                <h2 className="section-title mt-1 text-xl">
                  {selectedSubeje.numero ?? "General"} - {selectedSubeje.nombre}
                </h2>

                {categoryOptions.length ? (
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="label-text">Titulos</p>
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
                        <p className="label-text">Titulos relacionados</p>
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

              {selectedSubeje911Info ? (
                <section className="surface-card space-y-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-sm md:p-5">
                  <h3 className="section-title text-xl text-sky-950">
                    {selectedSubeje911Info.titulo ?? "Información para llamada al 911"}
                  </h3>

                  {info911DataToReport.length ? (
                    <div className="space-y-2">
                      <p className="label-text text-sky-800">Datos a informar</p>
                      <ul className="control-text list-disc space-y-1.5 pl-5 text-sky-950">
                        {info911DataToReport.map((item, index) => (
                          <li key={`info911-datos-${index}`}>{item?.descripcion ?? String(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {info911ArrivalGuidelines.length ? (
                    <div className="space-y-2">
                      <p className="label-text text-sky-800">Aspectos importantes al llegar la policía</p>
                      <ul className="control-text list-disc space-y-1.5 pl-5 text-sky-950">
                        {info911ArrivalGuidelines.map((item, index) => (
                          <li key={`info911-llegada-${index}`}>{item?.descripcion ?? String(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              ) : null}

              <PreventiveActionsPanel
                title="Acciones preventivas del eje"
                intro={ejeActions?.intro}
                items={ejeActions?.items}
                wrapperClassName="rounded-2xl p-4"
              />

              <PreventiveActionsPanel
                title="Criterios generales"
                items={ejeGeneralCriteria}
                wrapperClassName="rounded-2xl p-4"
                theme="sky"
              />

              <PreventiveActionsPanel
                title="Confidencialidad (lineamientos clave)"
                items={ejeConfidentiality}
                wrapperClassName="rounded-2xl p-4"
                theme="rose"
                defaultOpen
              />

              <div className="surface-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <p className="card-title text-sm">Avance de pasos</p>
                <div className="mt-2 space-y-2">
                  <div className="control-text flex items-center justify-between">
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
