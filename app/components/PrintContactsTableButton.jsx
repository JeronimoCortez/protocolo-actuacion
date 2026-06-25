"use client";

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
    subtitle: contact.subtitle || "",
    phone: extractField(contact.details, [
      "telefono",
      "telefonos",
      "numero",
      "numeros",
      "whatsapp",
    ]),
    email: extractField(contact.details, [
      "correo",
      "correos",
      "email",
      "mail",
    ]),
    address: extractField(contact.details, ["direccion"]),
  }));
}

function buildPrintHtml(contacts, title) {
  const rows = buildContactRows(contacts);
  const escapedTitle = escapeHtml(title);
  const date = new Date().toLocaleDateString("es-AR");
  const dash = '<span class="no-data">-</span>';

  const tableRows = rows
    .map(
      (row) => `<tr>
        <td class="col-name">${escapeHtml(row.name)}</td>
        <td class="col-cat">${escapeHtml(row.subtitle)}</td>
        <td class="col-phone">${escapeHtml(row.phone) || dash}</td>
        <td class="col-email">${escapeHtml(row.email) || dash}</td>
        <td class="col-addr">${escapeHtml(row.address) || dash}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapedTitle}</title>
    <style>
      @page { size: A4 landscape; margin: 10mm 12mm; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        background: #fff;
        color: #1e293b;
        font-family: "Segoe UI", Arial, sans-serif;
        font-size: 11px;
        line-height: 1.4;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .print-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }
      .print-header-logo { width: 120px; height: auto; }
      .print-header-sep {
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 0 0 10px;
      }
      h1 {
        margin: 0 0 4px;
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.02em;
      }
      .meta {
        margin: 0 0 10px;
        font-size: 9px;
        color: #64748b;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9px;
        line-height: 1.35;
      }
      th {
        background: #f1f5f9;
        color: #0f172a;
        font-weight: 700;
        text-align: left;
        padding: 5px 6px;
        border: 1px solid #cbd5e1;
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
      }
      td {
        padding: 4px 6px;
        border: 1px solid #e2e8f0;
        vertical-align: top;
        color: #334155;
        word-break: break-word;
      }
      tr:nth-child(even) td { background: #f8fafc; }
      .no-data { color: #94a3b8; }
      .col-name { width: 22%; font-weight: 600; color: #0f172a; }
      .col-cat  { width: 22%; }
      .col-phone { width: 16%; }
      .col-email { width: 20%; }
      .col-addr  { width: 20%; }
      .print-footer {
        text-align: center;
        font-size: 8px;
        color: #64748b;
        margin-top: 10px;
      }
      @media print {
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; }
        thead { display: table-header-group; }
      }
    </style>
  </head>
  <body>
    <div class="print-header">
      <img src="/logo-dae.png" alt="Logo DAE" class="print-header-logo" />
    </div>
    <hr class="print-header-sep" />
    <h1>${escapedTitle}</h1>
    <p class="meta">${contacts.length} contacto${contacts.length === 1 ? "" : "s"} &middot; Generado el ${date}</p>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoria</th>
          <th>Telefono</th>
          <th>Correo</th>
          <th>Direccion</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <div class="print-footer">PROTOCOLO DE ACTUACION - DAE</div>
    <script>
      window.addEventListener("load", function() {
        setTimeout(function() {
          window.focus();
          window.print();
        }, 200);
      });
      window.addEventListener("afterprint", function() { window.close(); });
    </script>
  </body>
</html>`;
}

export default function PrintContactsTableButton({
  contacts = [],
  title = "Contactos",
  label = "Imprimir tabla",
}) {
  const handlePrint = () => {
    if (!contacts.length) return;

    const printWindow = window.open("", "_blank", "width=1100,height=700");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(buildPrintHtml(contacts, title));
    printWindow.document.close();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={!contacts.length}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
