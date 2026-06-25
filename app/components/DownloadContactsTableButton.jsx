"use client";

import { useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function extractField(details, keys) {
  for (const key of keys) {
    const value = details?.[key];
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      const joined = value.filter(Boolean).map(String).join(", ");
      if (joined) return joined;
      continue;
    }
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

function buildContactRows(contacts) {
  return contacts.map((contact) => ({
    name: contact.name || "",
    category: contact.subtitle || "",
    phone: extractField(contact.details, ["telefono", "telefonos", "numero", "numeros", "whatsapp"]),
    email: extractField(contact.details, ["correo", "correos", "email", "mail"]),
    address: extractField(contact.details, ["direccion"]),
  }));
}

export default function DownloadContactsTableButton({
  contacts = [],
  title = "Contactos",
  filename = "contactos.pdf",
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
    if (!contacts.length) return;

    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;

    const rows = buildContactRows(contacts);
    const logoData = logoDataRef.current;
    const date = new Date().toLocaleDateString("es-AR");

    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", margin, 10, 120, 24);
      } catch {}
    }

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, 38, pageWidth - margin, 38);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`${rows.length} contacto${rows.length === 1 ? "" : "s"} · Generado el ${date}`, margin, 74);

    autoTable(doc, {
      startY: 84,
      head: [["Nombre", "Categoría", "Teléfono", "Correo", "Dirección"]],
      body: rows.map((row) => [row.name, row.category, row.phone || "-", row.email || "-", row.address || "-"]),
      theme: "grid",
      margin: { left: margin, right: margin },
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 5,
        overflow: "linebreak",
        textColor: [51, 65, 85],
        valign: "top",
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        0: { cellWidth: "auto", fontStyle: "bold", textColor: [15, 23, 42] },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
      },
    });

    const finalY = doc.lastAutoTable?.finalY ?? 84;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("PROTOCOLO DE ACTUACION - DAE", pageWidth / 2, pageHeight - 14, { align: "center" });

    doc.save(filename);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!contacts.length}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Descargar PDF
    </button>
  );
}
