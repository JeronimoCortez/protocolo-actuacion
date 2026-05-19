export function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/["'`´]/g, "")
    .replace(/[^a-z0-9@+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const TOKEN_ALIASES = {
  tel: "telefono",
  telef: "telefono",
  telefonico: "telefono",
  telefono: "telefono",
  telefonos: "telefono",
  celu: "celular",
  cel: "celular",
  celular: "celular",
  celulares: "celular",
  wsp: "whatsapp",
  wpp: "whatsapp",
  wp: "whatsapp",
  wasap: "whatsapp",
  wassap: "whatsapp",
  guasap: "whatsapp",
  whatsapp: "whatsapp",
  mail: "correo",
  email: "correo",
  correo: "correo",
  correos: "correo",
  nro: "numero",
  nros: "numero",
  num: "numero",
  nums: "numero",
  numero: "numero",
  numeros: "numero",
  direccion: "domicilio",
  domicilio: "domicilio",
  ubicacion: "domicilio",
  comisaria: "comisaria",
  seccional: "comisaria",
  policia: "policia",
  policial: "policia",
  hospital: "hospital",
  guardia: "guardia",
  emergencia: "emergencia",
};

const SYNONYM_GROUPS = [
  ["telefono", "celular", "whatsapp", "numero"],
  ["correo", "email", "mail"],
  ["domicilio", "direccion", "ubicacion"],
  ["comisaria", "seccional"],
  ["policia", "policial"],
  ["hospital", "guardia", "emergencia"],
  ["nna", "nino", "nina", "adolescente"],
];

const SYNONYM_LOOKUP = buildSynonymLookup(SYNONYM_GROUPS);

function buildSynonymLookup(groups) {
  const lookup = new Map();

  groups.forEach((group) => {
    const canonicalGroup = new Set();
    group.forEach((token) => canonicalGroup.add(canonicalizeToken(token)));

    canonicalGroup.forEach((token) => {
      lookup.set(token, canonicalGroup);
    });
  });

  return lookup;
}

function canonicalizeToken(token) {
  return TOKEN_ALIASES[token] ?? token;
}

function tokenize(text) {
  if (!text) return [];
  return text
    .split(/\s+/)
    .map((token) => canonicalizeToken(token.trim()))
    .filter(Boolean);
}

function uniqueTokens(tokens) {
  return [...new Set(tokens)];
}

function maxTyposForTerm(term) {
  if (term.length <= 4) return 1;
  if (term.length <= 8) return 2;
  return 2;
}

function boundedLevenshtein(left, right, maxDistance) {
  const a = left;
  const b = right;

  if (a === b) return 0;
  if (!a.length) return b.length <= maxDistance ? b.length : maxDistance + 1;
  if (!b.length) return a.length <= maxDistance ? a.length : maxDistance + 1;
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;

  const previous = new Array(b.length + 1);
  const current = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) previous[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    let minInRow = current[0];

    for (let j = 1; j <= b.length; j += 1) {
      const insertion = current[j - 1] + 1;
      const deletion = previous[j] + 1;
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      const next = Math.min(insertion, deletion, substitution);
      current[j] = next;
      if (next < minInRow) minInRow = next;
    }

    if (minInRow > maxDistance) return maxDistance + 1;

    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }

  return previous[b.length];
}

function termScoreAgainstText(term, tokenPool, normalizedText) {
  if (!term || !normalizedText) return Number.NEGATIVE_INFINITY;

  if (normalizedText === term) return 160;

  if (tokenPool.includes(term)) return 140;

  const prefixToken = tokenPool.find((token) => token.startsWith(term));
  if (prefixToken) {
    const penalty = Math.max(0, prefixToken.length - term.length);
    return 118 - Math.min(18, penalty * 2);
  }

  if (normalizedText.startsWith(term)) return 104;

  if (normalizedText.includes(term)) return 90;

  if (term.length < 3) return Number.NEGATIVE_INFINITY;

  const typoAllowance = maxTyposForTerm(term);
  let bestFuzzyScore = Number.NEGATIVE_INFINITY;

  tokenPool.forEach((candidate) => {
    if (!candidate) return;
    if (Math.abs(candidate.length - term.length) > typoAllowance) return;
    const distance = boundedLevenshtein(term, candidate, typoAllowance);
    if (distance > typoAllowance) return;

    const score = 72 - distance * 18 - Math.abs(candidate.length - term.length) * 2;
    if (score > bestFuzzyScore) bestFuzzyScore = score;
  });

  return bestFuzzyScore;
}

function expandTermVariants(rawTerm) {
  const term = canonicalizeToken(rawTerm);
  const variants = new Set([rawTerm, term]);

  const synonymGroup = SYNONYM_LOOKUP.get(term);
  if (synonymGroup) {
    synonymGroup.forEach((item) => variants.add(item));
  }

  return [...variants].filter(Boolean);
}

function scoreTerm(entry, termVariants) {
  const primaryScore = Math.max(
    ...termVariants.map((variant) => termScoreAgainstText(variant, entry.primaryTokens, entry.primaryText))
  );
  const secondaryScore = Math.max(
    ...termVariants.map((variant) => termScoreAgainstText(variant, entry.secondaryTokens, entry.secondaryText))
  );
  const keywordScore = Math.max(
    ...termVariants.map((variant) => termScoreAgainstText(variant, entry.keywordTokens, entry.keywordText))
  );

  const weightedPrimary = Number.isFinite(primaryScore) ? primaryScore * 1.0 : Number.NEGATIVE_INFINITY;
  const weightedSecondary = Number.isFinite(secondaryScore) ? secondaryScore * 0.72 : Number.NEGATIVE_INFINITY;
  const weightedKeyword = Number.isFinite(keywordScore) ? keywordScore * 0.58 : Number.NEGATIVE_INFINITY;

  return Math.max(weightedPrimary, weightedSecondary, weightedKeyword);
}

function buildEntryFromFields(item, fields) {
  const normalizedPrimary = normalizeSearchText(fields.primary ?? "");
  const normalizedSecondary = normalizeSearchText(fields.secondary ?? "");
  const normalizedKeywords = normalizeSearchText(fields.keywords ?? "");

  const primaryTokens = uniqueTokens(tokenize(normalizedPrimary));
  const secondaryTokens = uniqueTokens(tokenize(normalizedSecondary));
  const keywordTokens = uniqueTokens(tokenize(normalizedKeywords));

  return {
    item,
    primaryText: normalizedPrimary,
    secondaryText: normalizedSecondary,
    keywordText: normalizedKeywords,
    primaryTokens,
    secondaryTokens,
    keywordTokens,
  };
}

export function prepareFlexibleSearchIndex(items, getFields) {
  return items.map((item) => buildEntryFromFields(item, getFields(item)));
}

export function searchFlexibleIndex(index, query, { limit } = {}) {
  const normalizedQuery = normalizeSearchText(query);
  const queryTerms = uniqueTokens(tokenize(normalizedQuery));
  if (!queryTerms.length) return [];

  const expandedTerms = queryTerms.map((term) => expandTermVariants(term));
  const scored = [];

  index.forEach((entry) => {
    let totalScore = 0;

    for (const variants of expandedTerms) {
      const termScore = scoreTerm(entry, variants);
      if (!Number.isFinite(termScore)) return;
      totalScore += termScore;
    }

    if (entry.primaryText === normalizedQuery) totalScore += 120;
    else if (entry.primaryText.startsWith(normalizedQuery)) totalScore += 80;

    scored.push({
      item: entry.item,
      score: totalScore,
    });
  });

  scored.sort((left, right) => right.score - left.score);

  const resolved = scored.map((entry) => entry.item);
  return typeof limit === "number" ? resolved.slice(0, limit) : resolved;
}

export function buildSearchKeywords(...parts) {
  return parts
    .flatMap((part) => {
      if (part === null || part === undefined) return [];
      if (Array.isArray(part)) return part;
      if (typeof part === "object") return [JSON.stringify(part)];
      return [String(part)];
    })
    .join(" ");
}
