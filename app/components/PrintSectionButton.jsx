"use client";

export default function PrintSectionButton({
  sectionId,
  title,
  label,
}) {
  const handlePrint = () => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const html = `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${title}</title>
          <style>
            @page { size: A4; margin: 14mm; }
            :root { color-scheme: light; }
            body { font-family: "Plus Jakarta Sans", "Segoe UI", Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; }
            h1, h2, h3, h4 { color: #0f172a; letter-spacing: -0.01em; margin-top: 1.1em; margin-bottom: 0.5em; }
            p, li, td, th { font-size: 14px; line-height: 1.65; }
            ul { padding-left: 22px; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            th, td { border: 1px solid #cbd5e1; text-align: left; padding: 6px 8px; vertical-align: top; }
            a { color: #1d4ed8; text-decoration: underline; }
            .print-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
            .print-header-logo { width: 140px; height: auto; }
.print-header-sep { border: none; border-top: 1px solid #e2e8f0; margin: 0 0 12px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <img src="/logo-dae.png" alt="Logo DAE" class="print-header-logo" />
          </div>
          <hr class="print-header-sep" />
          ${section.innerHTML}
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
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold tracking-tight text-slate-700 transition hover:bg-slate-50"
    >
      {label}
    </button>
  );
}
