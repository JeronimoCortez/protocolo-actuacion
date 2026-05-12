import fs from "fs/promises";
import path from "path";

const DATA_ROOT = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "app",
  "data"
);

function normalizeToken(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

async function resolveFile(reference) {
  if (!reference) return null;

  const cleanedRef = String(reference).replace(/^\.\/+/, "");
  const directCandidates = [
    path.join(DATA_ROOT, cleanedRef),
    path.join(DATA_ROOT, "ejes", cleanedRef),
  ];

  for (const candidate of directCandidates) {
    const resolved = path.resolve(candidate);
    if (!resolved.startsWith(path.resolve(DATA_ROOT))) continue;

    try {
      const info = await fs.stat(resolved);
      if (info.isFile()) return resolved;
    } catch {}
  }

  const fileName = path.basename(cleanedRef);
  const allFiles = await walkFiles(DATA_ROOT);
  const exact = allFiles.find(
    (item) => item.toLowerCase() === path.join(DATA_ROOT, fileName).toLowerCase()
  );
  if (exact) return exact;

  const directByName = allFiles.find(
    (item) => path.basename(item).toLowerCase() === fileName.toLowerCase()
  );
  if (directByName) return directByName;

  const targetToken = normalizeToken(fileName);
  return (
    allFiles.find(
      (item) => normalizeToken(path.basename(item)).includes(targetToken) && targetToken
    ) ?? null
  );
}

function contentTypeFromPath(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".pdf") return "application/pdf";
  if (extension === ".json") return "application/json";
  return "application/octet-stream";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("ref");

  if (!reference) {
    return Response.json(
      { error: "Debe enviar el parámetro ref." },
      { status: 400 }
    );
  }

  const filePath = await resolveFile(reference);
  if (!filePath) {
    return Response.json(
      { error: "No se encontró el archivo solicitado." },
      { status: 404 }
    );
  }

  const fileBuffer = await fs.readFile(filePath);
  const fileName = path.basename(filePath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFromPath(filePath),
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
