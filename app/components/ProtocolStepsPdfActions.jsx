"use client";

import { useRef, useEffect } from "react";
import { jsPDF } from "jspdf";

const PAGE_MARGIN = 44;
const TOP_OFFSET = 20;

function normalizeInlineText(text) {
  return String(text || "")
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

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderListHtml(items, className = "") {
  if (!Array.isArray(items) || !items.length) return "";

  return `
    <ul class="print-list ${className}">
      ${items
        .map((item) => `<li><span class="print-bullet"></span><span>${escapeHtml(item)}</span></li>`)
        .join("")}
    </ul>
  `;
}

function renderBlockHtml(block) {
  if (block.type === "heading") {
    const level = Math.min(6, Number(block.level || 2));
    return `<h${level} class="print-heading level-${level}">${escapeHtml(block.text)}</h${level}>`;
  }

  if (block.type === "paragraph") {
    const className = block.fontStyle === "italic" ? "print-paragraph print-italic" : "print-paragraph";
    return `<p class="${className}">${escapeHtml(block.text)}</p>`;
  }

  if (block.type === "list") {
    return renderListHtml(block.items || []);
  }

  if (block.type === "step") {
    return `
      <section class="print-step">
        <div class="print-step-row">
          <span class="print-checkbox" aria-hidden="true"></span>
          <div class="print-step-body">
            <div class="print-step-title">${escapeHtml(block.stepLabel)}</div>
            ${block.description ? `<p class="print-step-text">${escapeHtml(block.description)}</p>` : ""}
            ${block.note ? `<p class="print-step-note">Nota: ${escapeHtml(block.note)}</p>` : ""}
            ${block.actions?.length ? `<div class="print-step-subtitle">Acciones</div>${renderListHtml(block.actions, "print-indent")}` : ""}
            ${
              block.condition
                ? `<div class="print-step-subtitle">${escapeHtml(block.condition.title)}</div>${renderListHtml(
                    block.condition.actions || [],
                    "print-indent"
                  )}`
                : ""
            }
            ${
              block.criteria?.length
                ? `<div class="print-step-subtitle">Criterios especiales</div>${renderListHtml(
                    block.criteria.map((criterion) =>
                      criterion.description ? `${criterion.title}: ${criterion.description}` : criterion.title
                    ),
                    "print-indent"
                  )}`
                : ""
            }
            ${block.files?.length ? `<div class="print-step-subtitle">Archivos descargables</div>${renderListHtml(block.files, "print-indent")}` : ""}
          </div>
        </div>
      </section>
    `;
  }

  if (block.type === "spacer") {
    return `<div style="height:${Number(block.height || 8)}px"></div>`;
  }

  return "";
}

function buildPrintableHtml({ documentTitle, blocks }) {
  const content = blocks.map((block) => renderBlockHtml(block)).join("");
  const escapedTitle = escapeHtml(documentTitle || "Documento");

  const headerHtml = `
    <div class="print-header">
      <img src="/logo-dae.png" alt="Logo DAE" class="print-header-logo" />
    </div>
    <hr class="print-header-sep" />
  `;

  const footerHtml = `<div class="print-footer">PROTOCOLO DE ACTUACION - DAE</div>`;

  return `<!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapedTitle}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            background: #ffffff;
            color: #1e293b;
            font-family: "Segoe UI", Arial, sans-serif;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 4px;
          }
          .print-header-logo {
            width: 140px;
            height: auto;
          }
          .print-header-sep {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 0 0 12px;
          }
          .sheet {
            width: 100%;
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
          .print-title {
            margin: 0 0 6px;
            font-size: 22px;
            line-height: 1.2;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.02em;
          }
          .print-heading {
            margin: 0 0 8px;
            color: #0f172a;
            letter-spacing: -0.01em;
          }
          .print-heading.level-2 { font-size: 16px; }
          .print-heading.level-3 { font-size: 14px; }
          .print-heading.level-4,
          .print-heading.level-5,
          .print-heading.level-6 { font-size: 12px; }
          .print-paragraph {
            margin: 0 0 8px;
            font-size: 11px;
            line-height: 1.5;
          }
          .print-italic { font-style: italic; }
          .print-list {
            margin: 0 0 8px;
            padding: 0;
            list-style: none;
          }
          .print-list li {
            display: flex;
            gap: 8px;
            align-items: flex-start;
            margin: 0 0 4px;
            font-size: 11px;
            line-height: 1.45;
            break-inside: avoid;
            overflow-wrap: anywhere;
            word-break: break-word;
          }
          .print-bullet {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #475569;
            margin-top: 6px;
            flex: 0 0 auto;
          }
          .print-indent {
            margin-left: 18px;
          }
          .print-step {
            margin: 0 0 12px;
            padding: 10px 12px 8px;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            background: #ffffff;
          }
          .print-step-row {
            display: flex;
            gap: 10px;
            align-items: flex-start;
          }
          .print-checkbox {
            width: 14px;
            height: 14px;
            border: 1.6px solid #334155;
            border-radius: 3px;
            flex: 0 0 auto;
            margin-top: 3px;
            background: #fff;
          }
          .print-step-body {
            flex: 1 1 auto;
            min-width: 0;
          }
          .print-step-title {
            margin: 0 0 4px;
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
          }
          .print-step-text,
          .print-step-note {
            margin: 0 0 6px;
            font-size: 11px;
            line-height: 1.5;
          }
          .print-step-note {
            padding: 6px 8px;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            background: #fffbeb;
            color: #92400e;
          }
          .print-step-subtitle {
            margin: 8px 0 4px;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .print-meta {
            margin: 0 0 10px;
            font-size: 11px;
            color: #475569;
          }
          .print-footer {
            text-align: center;
            font-size: 8px;
            color: #64748b;
          }
          @media print {
            body { padding-top: 16mm; padding-bottom: 10mm; }
            .print-header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              padding: 6mm 14mm 0;
              background: #ffffff;
              z-index: 1000;
            }
            .print-header-sep {
              position: fixed;
              top: 14mm;
              left: 14mm;
              right: 14mm;
              z-index: 1000;
            }
            .print-footer {
              position: fixed;
              bottom: 4mm;
              left: 0;
              right: 0;
              z-index: 1000;
            }
            .print-step,
            .print-list li,
            .print-heading {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <main class="sheet">
          ${headerHtml}
          <h1 class="print-title">${escapedTitle}</h1>
          ${content}
        </main>
        ${footerHtml}
        <script>
          window.addEventListener("load", () => {
            setTimeout(() => {
              window.focus();
              window.print();
            }, 200);
          });
          window.addEventListener("afterprint", () => window.close());
        </script>
      </body>
    </html>`;
}

function createPdfDocument({ documentTitle, blocks, logoData }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;

  let y = PAGE_MARGIN + TOP_OFFSET;

  function drawPageHeader() {
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", PAGE_MARGIN, 12, 140, 28);
      } catch {}
    }
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(PAGE_MARGIN, 42, pageWidth - PAGE_MARGIN, 42);
  }

  function drawPageFooter() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("PROTOCOLO DE ACTUACION - DAE", pageWidth / 2, pageHeight - 18, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  drawPageHeader();
  drawPageFooter();

  function ensureSpace(minHeight = 24) {
    if (y + minHeight > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      drawPageHeader();
      drawPageFooter();
      y = PAGE_MARGIN + TOP_OFFSET;
    }
  }

  function drawTextBlock(text, options = {}) {
    const {
      fontSize = 11,
      fontStyle = "normal",
      lineHeight = 1.5,
      spaceAfter = 10,
      indent = 0,
    } = options;

    const clean = normalizeInlineText(text);
    if (!clean) {
      y += spaceAfter;
      return;
    }

    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);

    const maxWidth = Math.max(80, contentWidth - indent);
    const lines = doc.splitTextToSize(clean, maxWidth);
    const lineHeightPt = fontSize * lineHeight;

    for (const line of lines) {
      ensureSpace(lineHeightPt + 4);
      doc.setFont("helvetica", fontStyle);
      doc.setFontSize(fontSize);
      doc.setTextColor(30, 41, 59);
      doc.text(line, PAGE_MARGIN + indent, y);
      y += lineHeightPt;
    }

    y += spaceAfter;
  }

  function drawHeading(text, level = 2) {
    if (level <= 1) {
      drawTextBlock(text, { fontSize: 18, fontStyle: "bold", lineHeight: 1.2, spaceAfter: 18 });
      return;
    }

    if (level === 2) {
      drawTextBlock(text, { fontSize: 14, fontStyle: "bold", lineHeight: 1.25, spaceAfter: 10 });
      return;
    }

    if (level === 3) {
      drawTextBlock(text, { fontSize: 12, fontStyle: "bold", lineHeight: 1.3, spaceAfter: 8 });
      return;
    }

    drawTextBlock(text, { fontSize: 11, fontStyle: "bold", lineHeight: 1.35, spaceAfter: 6 });
  }

  function drawList(items, options = {}) {
    const listItems = Array.isArray(items) ? items : [];
    listItems.forEach((item) => {
      drawTextBlock(`- ${item}`, {
        fontSize: options.fontSize || 11,
        lineHeight: options.lineHeight || 1.45,
        spaceAfter: options.spaceAfter ?? 6,
        indent: options.indent || 12,
      });
    });
  }

  function drawStepBlock(block) {
    const title = normalizeInlineText(block.stepLabel || "Paso");
    const checkboxSize = 12;
    const titleIndent = 18;
    const titleFontSize = 12;
    const titleLineHeight = titleFontSize * 1.3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(titleFontSize);
    const titleLines = doc.splitTextToSize(title, Math.max(80, contentWidth - titleIndent));

    ensureSpace((titleLines.length + 1) * titleLineHeight + 40);
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(1);
    doc.rect(PAGE_MARGIN, y + 2, checkboxSize, checkboxSize);

    titleLines.forEach((line) => {
      ensureSpace(titleLineHeight + 4);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(titleFontSize);
      doc.setTextColor(30, 41, 59);
      doc.text(line, PAGE_MARGIN + titleIndent, y);
      y += titleLineHeight;
    });

    y += 2;

    if (block.description) {
      drawTextBlock(block.description, { fontSize: 11, lineHeight: 1.5, spaceAfter: 6, indent: titleIndent });
    }

    if (block.note) {
      drawTextBlock(`Nota: ${block.note}`, { fontSize: 10, lineHeight: 1.45, spaceAfter: 8, indent: titleIndent });
    }

    if (block.actions?.length) {
      drawTextBlock("Acciones", { fontSize: 10, fontStyle: "bold", lineHeight: 1.25, spaceAfter: 4, indent: titleIndent });
      drawList(block.actions, { indent: titleIndent + 6, spaceAfter: 4 });
    }

    if (block.condition) {
      drawTextBlock(block.condition.title, {
        fontSize: 10,
        fontStyle: "bold",
        lineHeight: 1.25,
        spaceAfter: 4,
        indent: titleIndent,
      });
      drawList(block.condition.actions || [], { indent: titleIndent + 6, spaceAfter: 4 });
    }

    if (block.criteria?.length) {
      drawTextBlock("Criterios especiales", {
        fontSize: 10,
        fontStyle: "bold",
        lineHeight: 1.25,
        spaceAfter: 4,
        indent: titleIndent,
      });
      drawList(
        block.criteria.map((criterion) =>
          criterion.description ? `${criterion.title}: ${criterion.description}` : criterion.title
        ),
        { indent: titleIndent + 6, spaceAfter: 4 }
      );
    }

    if (block.files?.length) {
      drawTextBlock("Archivos descargables", {
        fontSize: 10,
        fontStyle: "bold",
        lineHeight: 1.25,
        spaceAfter: 4,
        indent: titleIndent,
      });
      drawList(block.files, { indent: titleIndent + 6, spaceAfter: 4 });
    }

    y += 10;
  }

  doc.setProperties({ title: normalizeInlineText(documentTitle) || "Documento" });
  drawHeading(documentTitle, 1);

  for (const block of blocks) {
    if (block.type === "heading") {
      drawHeading(block.text, Number(block.level || 2));
      continue;
    }

    if (block.type === "paragraph") {
      drawTextBlock(block.text, {
        fontSize: block.fontSize || 11,
        fontStyle: block.fontStyle || "normal",
        lineHeight: block.lineHeight || 1.5,
        spaceAfter: block.spaceAfter ?? 10,
        indent: block.indent || 0,
      });
      continue;
    }

    if (block.type === "list") {
      drawList(block.items, block);
      continue;
    }

    if (block.type === "step") {
      drawStepBlock(block);
      y += block.after ?? 0;
      continue;
    }

    if (block.type === "spacer") {
      y += block.height ?? 8;
    }
  }

  return doc;
}

export default function ProtocolStepsPdfActions({
  documentTitle,
  filename,
  blocks = [],
  disabled = false,
}) {
  const logoDataRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      logoDataRef.current = canvas.toDataURL("image/png");
    };
    img.src = "/logo-dae.png";
  }, []);

  const handleDownload = () => {
    if (disabled || !blocks.length) return;
    const doc = createPdfDocument({ documentTitle, blocks, logoData: logoDataRef.current });
    doc.save(filename);
  };

  const handlePrint = () => {
    if (disabled || !blocks.length) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      const doc = createPdfDocument({ documentTitle, blocks, logoData: logoDataRef.current });
      doc.save(filename);
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintableHtml({ documentTitle, blocks }));
    printWindow.document.close();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || !blocks.length}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Descargar PDF
      </button>
      <button
        type="button"
        onClick={handlePrint}
        disabled={disabled || !blocks.length}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Imprimir PDF
      </button>
    </div>
  );
}
