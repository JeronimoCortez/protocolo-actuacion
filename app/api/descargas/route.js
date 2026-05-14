import fs from "fs/promises";
import path from "path";

const DATA_ROOT = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "app",
  "data"
);

function stripFrontmatter(markdownText) {
  return markdownText.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function splitTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseMarkdownBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines = [];

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }

      const [headerLine, separatorLine, ...bodyLines] = tableLines;
      const isSeparator = separatorLine ? /^[:\-\s|]+$/.test(separatorLine) : false;
      const rows = isSeparator ? bodyLines : tableLines.slice(1);

      blocks.push({
        type: "table",
        headers: splitTableRow(headerLine),
        rows: rows.map(splitTableRow),
      });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, "").trim());
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length) {
      const current = lines[index].trim();
      if (!current) break;
      if (/^#{1,6}\s+/.test(current) || /^[-*]\s+/.test(current) || current.startsWith("|")) {
        break;
      }
      paragraphLines.push(current);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function normalizeInlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapCellText(text, width) {
  const clean = normalizeInlineMarkdown(text);
  if (!clean) return [""];
  return wrapText(clean, width);
}

function padRight(text, width) {
  if (text.length >= width) return text;
  return text + " ".repeat(width - text.length);
}

function renderTableLines(headers, rows, pageWidthChars = 96) {
  const tableRows = [headers, ...rows];
  const colCount = tableRows.reduce((max, row) => Math.max(max, row.length), 0);
  const normalizedRows = tableRows.map((row) => {
    const out = [...row];
    while (out.length < colCount) out.push("");
    return out.map((cell) => normalizeInlineMarkdown(cell));
  });

  const minColWidth = 8;
  const maxColWidth = 34;
  const colWidths = new Array(colCount).fill(minColWidth);

  for (let col = 0; col < colCount; col += 1) {
    let maxWidth = minColWidth;
    for (const row of normalizedRows) {
      maxWidth = Math.max(maxWidth, row[col].length);
    }
    colWidths[col] = Math.min(maxWidth, maxColWidth);
  }

  const getTotalWidth = () => colWidths.reduce((sum, w) => sum + w, 0) + (colCount * 3 + 1);
  while (getTotalWidth() > pageWidthChars) {
    let indexLargest = 0;
    for (let i = 1; i < colWidths.length; i += 1) {
      if (colWidths[i] > colWidths[indexLargest]) indexLargest = i;
    }
    if (colWidths[indexLargest] <= minColWidth) break;
    colWidths[indexLargest] -= 1;
  }

  const separator = `+${colWidths.map((w) => "-".repeat(w + 2)).join("+")}+`;
  const lines = [separator];

  function renderRow(row, isHeader = false) {
    const wrappedCells = row.map((cell, idx) => wrapCellText(cell, colWidths[idx]));
    const rowHeight = wrappedCells.reduce((max, cellLines) => Math.max(max, cellLines.length), 1);

    for (let lineIndex = 0; lineIndex < rowHeight; lineIndex += 1) {
      const parts = [];
      for (let col = 0; col < colCount; col += 1) {
        const cellLine = wrappedCells[col][lineIndex] ?? "";
        parts.push(` ${padRight(cellLine, colWidths[col])} `);
      }
      lines.push(`|${parts.join("|")}|`);
    }
    lines.push(separator);
    if (isHeader) {
      lines.push("");
    }
  }

  renderRow(normalizedRows[0], true);
  for (let i = 1; i < normalizedRows.length; i += 1) {
    renderRow(normalizedRows[i], false);
  }

  return lines;
}

function markdownToPlainText(markdownText) {
  const withoutFrontmatter = stripFrontmatter(markdownText);
  const blocks = parseMarkdownBlocks(withoutFrontmatter);
  const lines = [];

  for (const block of blocks) {
    if (block.type === "heading") {
      const text = normalizeInlineMarkdown(block.text);
      if (block.level === 1) {
        lines.push(text.toUpperCase());
      } else if (block.level === 2) {
        lines.push(text);
        lines.push("-".repeat(Math.max(12, Math.min(72, text.length))));
      } else {
        lines.push(text);
      }
      lines.push("");
      continue;
    }

    if (block.type === "paragraph") {
      lines.push(normalizeInlineMarkdown(block.text));
      lines.push("");
      continue;
    }

    if (block.type === "list") {
      for (const item of block.items) {
        lines.push(`- ${normalizeInlineMarkdown(item)}`);
      }
      lines.push("");
      continue;
    }

    if (block.type === "table") {
      lines.push(...renderTableLines(block.headers, block.rows));
      lines.push("");
      continue;
    }
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const wrapped = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const next = words[i];
    if (`${currentLine} ${next}`.length <= maxCharsPerLine) {
      currentLine += ` ${next}`;
      continue;
    }
    wrapped.push(currentLine);
    currentLine = next;
  }

  wrapped.push(currentLine);
  return wrapped;
}

function escapePdfText(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "")
    .replace(/\n/g, " ");
}

function createSimplePdfFromText(text, title = "Documento") {
  const normalized = text.replace(/\u00A0/g, " ").replace(/\t/g, "  ");
  const sourceLines = normalized.split(/\r?\n/);
  const printableLines = [];

  for (const sourceLine of sourceLines) {
    if (!sourceLine.trim()) {
      printableLines.push("");
      continue;
    }

    const wrapped = wrapText(sourceLine.trim(), 96);
    printableLines.push(...wrapped);
  }

  const linesPerPage = 44;
  const pages = [];
  for (let i = 0; i < printableLines.length; i += linesPerPage) {
    pages.push(printableLines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) pages.push([""]);

  let nextObjectId = 3;
  const pageIds = [];
  const contentIds = [];
  const objects = new Map();

  for (const pageLines of pages) {
    const pageId = nextObjectId++;
    const contentId = nextObjectId++;
    pageIds.push(pageId);
    contentIds.push(contentId);

    const contentOps = ["BT", "/F1 11 Tf", "56 790 Td", "14 TL"];
    for (const line of pageLines) {
      const safe = escapePdfText(Buffer.from(line, "latin1").toString("latin1"));
      contentOps.push(`(${safe}) Tj`);
      contentOps.push("T*");
    }
    contentOps.push("ET");

    const streamContent = contentOps.join("\n");
    const streamBuffer = Buffer.from(streamContent, "latin1");
    const contentObject =
      `${contentId} 0 obj\n` +
      `<< /Length ${streamBuffer.length} >>\n` +
      "stream\n" +
      streamContent +
      "\nendstream\nendobj\n";

    const pageObject =
      `${pageId} 0 obj\n` +
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] " +
      "/Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> " +
      `/Contents ${contentId} 0 R >>\n` +
      "endobj\n";

    objects.set(contentId, contentObject);
    objects.set(pageId, pageObject);
  }

  const titleAscii = Buffer.from(title, "latin1").toString("latin1");
  const escapedTitle = escapePdfText(titleAscii);

  objects.set(
    1,
    "1 0 obj\n" +
      "<< /Type /Catalog /Pages 2 0 R >>\n" +
      "endobj\n"
  );

  objects.set(
    2,
    "2 0 obj\n" +
      `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>\n` +
      "endobj\n"
  );

  const infoId = nextObjectId++;
  objects.set(
    infoId,
    `${infoId} 0 obj\n` +
      `<< /Title (${escapedTitle}) /Producer (Protocolo Actuacion) >>\n` +
      "endobj\n"
  );

  const maxId = infoId;
  const buffers = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
  const offsets = new Array(maxId + 1).fill(0);
  let currentOffset = buffers[0].length;

  for (let id = 1; id <= maxId; id += 1) {
    offsets[id] = currentOffset;
    const objectBuffer = Buffer.from(objects.get(id), "latin1");
    buffers.push(objectBuffer);
    currentOffset += objectBuffer.length;
  }

  const xrefStart = currentOffset;
  let xref = `xref\n0 ${maxId + 1}\n`;
  xref += "0000000000 65535 f \n";
  for (let id = 1; id <= maxId; id += 1) {
    xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }

  const trailer =
    "trailer\n" +
    `<< /Size ${maxId + 1} /Root 1 0 R /Info ${infoId} 0 R >>\n` +
    "startxref\n" +
    `${xrefStart}\n` +
    "%%EOF";

  buffers.push(Buffer.from(xref + trailer, "latin1"));
  return Buffer.concat(buffers);
}

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
  if (extension === ".md") return "text/markdown; charset=utf-8";
  if (extension === ".json") return "application/json";
  return "application/octet-stream";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("ref");
  const format = searchParams.get("format");
  const requestedFilename = searchParams.get("filename");

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

  if (format === "pdf") {
    const extension = path.extname(filePath).toLowerCase();
    const baseName =
      String(requestedFilename || "documento")
        .replace(/\.pdf$/i, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "documento";
    const outputName = `${baseName}.pdf`;

    if (extension === ".pdf") {
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${outputName}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    if (extension === ".md" || extension === ".txt") {
      const text = markdownToPlainText(fileBuffer.toString("utf8"));
      const pdfBuffer = createSimplePdfFromText(text, baseName);

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${outputName}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return Response.json(
      { error: "El archivo solicitado no se puede convertir a PDF." },
      { status: 400 }
    );
  }

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFromPath(filePath),
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
