"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const PAGE_MARGIN = 44;

function normalizeInlineMarkdown(text) {
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

export default function DownloadMarcoTeoricoPdfButton({
  blocks = [],
  title = "Marco Teórico General",
  filename = "marco-teorico-general.pdf",
}) {
  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - PAGE_MARGIN * 2;

    let y = PAGE_MARGIN;

    function ensureSpace(minHeight = 24) {
      if (y + minHeight > pageHeight - PAGE_MARGIN) {
        doc.addPage();
        y = PAGE_MARGIN;
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

      const clean = normalizeInlineMarkdown(text);
      if (!clean) {
        y += spaceAfter;
        return;
      }

      doc.setFont("times", fontStyle);
      doc.setFontSize(fontSize);

      const maxWidth = Math.max(80, contentWidth - indent);
      const lines = doc.splitTextToSize(clean, maxWidth);
      const lineHeightPt = fontSize * lineHeight;

      for (const line of lines) {
        ensureSpace(lineHeightPt + 4);
        doc.text(line, PAGE_MARGIN + indent, y);
        y += lineHeightPt;
      }

      y += spaceAfter;
    }

    drawTextBlock(title, { fontSize: 18, fontStyle: "bold", lineHeight: 1.2, spaceAfter: 16 });

    for (const block of blocks) {
      if (block.type === "heading") {
        const level = Number(block.level || 3);
        if (level <= 1) {
          drawTextBlock(block.text, { fontSize: 16, fontStyle: "bold", lineHeight: 1.25, spaceAfter: 12 });
        } else if (level === 2) {
          drawTextBlock(block.text, { fontSize: 13, fontStyle: "bold", lineHeight: 1.3, spaceAfter: 10 });
        } else {
          drawTextBlock(block.text, { fontSize: 11, fontStyle: "bold", lineHeight: 1.35, spaceAfter: 8 });
        }
        continue;
      }

      if (block.type === "paragraph") {
        drawTextBlock(block.text, { fontSize: 11, lineHeight: 1.5, spaceAfter: 10 });
        continue;
      }

      if (block.type === "list") {
        for (const item of block.items || []) {
          drawTextBlock(`• ${item}`, { fontSize: 11, lineHeight: 1.45, spaceAfter: 6, indent: 10 });
        }
        y += 4;
        continue;
      }

      if (block.type === "table") {
        const headers = (block.headers || []).map((cell) => normalizeInlineMarkdown(cell));
        const rows = (block.rows || []).map((row) =>
          row.map((cell) => normalizeInlineMarkdown(cell))
        );

        ensureSpace(80);
        autoTable(doc, {
          startY: y,
          head: [headers],
          body: rows,
          theme: "grid",
          margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
          styles: {
            font: "times",
            fontSize: 9,
            cellPadding: 4,
            overflow: "linebreak",
            textColor: [30, 41, 59],
            valign: "top",
          },
          headStyles: {
            fillColor: [241, 245, 249],
            textColor: [15, 23, 42],
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
          },
        });

        y = (doc.lastAutoTable?.finalY ?? y) + 14;
      }
    }

    doc.save(filename);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Descargar Marco Teórico
    </button>
  );
}
