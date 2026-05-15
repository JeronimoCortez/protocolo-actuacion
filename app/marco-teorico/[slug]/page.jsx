import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import DownloadMarcoTeoricoPdfButton from "../../components/DownloadMarcoTeoricoPdfButton";
import PrintSectionButton from "../../components/PrintSectionButton";
import { navItems } from "../../data/home";

const MARCO_TEORICO_DIR = path.join(process.cwd(), "app/data/marco-teorico");

function parseFrontmatter(markdown) {
  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!frontmatterMatch) {
    return { metadata: {}, content: markdown };
  }

  const metadata = {};
  const frontmatter = frontmatterMatch[1];

  frontmatter.split(/\r?\n/).forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1");
    metadata[key] = value;
  });

  return {
    metadata,
    content: markdown.slice(frontmatterMatch[0].length),
  };
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
      if (/^#{1,6}\s+/.test(current) || /^[-*]\s+/.test(current) || current.startsWith("|")) break;
      paragraphLines.push(current);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function renderInlineMarkdown(text) {
  function renderStrongText(input, keyPrefix) {
    const strongParts = [];
    const strongRegex = /\*\*(.+?)\*\*/g;
    let strongLastIndex = 0;
    let strongMatch = strongRegex.exec(input);

    while (strongMatch) {
      if (strongMatch.index > strongLastIndex) {
        strongParts.push(input.slice(strongLastIndex, strongMatch.index));
      }

      strongParts.push(
        <strong key={`${keyPrefix}-strong-${strongMatch.index}`} className="font-semibold text-slate-900">
          {strongMatch[1]}
        </strong>
      );

      strongLastIndex = strongMatch.index + strongMatch[0].length;
      strongMatch = strongRegex.exec(input);
    }

    if (strongLastIndex < input.length) {
      strongParts.push(input.slice(strongLastIndex));
    }

    return strongParts;
  }

  const parts = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match = linkRegex.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      parts.push(...renderStrongText(text.slice(lastIndex, match.index), `plain-${match.index}`));
    }

    const [, label, href] = match;
    parts.push(
      <a
        key={`${href}-${match.index}`}
        href={href}
        className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
      >
        {renderStrongText(label, `link-${match.index}`)}
      </a>
    );

    lastIndex = match.index + match[0].length;
    match = linkRegex.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(...renderStrongText(text.slice(lastIndex), `tail-${lastIndex}`));
  }

  return parts;
}

function renderMarkdownBlocks(blocks) {
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      if (block.level === 1) {
        return (
          <h2 key={`h1-${index}`} className="section-title">
            {renderInlineMarkdown(block.text)}
          </h2>
        );
      }

      if (block.level === 2) {
        return (
          <h3 key={`h2-${index}`} className="pt-3 text-xl font-semibold leading-8 tracking-tight text-[var(--heading)]">
            {renderInlineMarkdown(block.text)}
          </h3>
        );
      }

      return (
        <h4 key={`h3-${index}`} className="pt-2 text-lg font-semibold leading-7 tracking-tight text-[var(--heading)]">
          {renderInlineMarkdown(block.text)}
        </h4>
      );
    }

    if (block.type === "paragraph") {
      return (
        <p key={`p-${index}`} className="body-copy">
          {renderInlineMarkdown(block.text)}
        </p>
      );
    }

    if (block.type === "list") {
      return (
        <ul key={`ul-${index}`} className="body-copy list-disc space-y-2 pl-6">
          {block.items.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "table") {
      return (
        <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                {block.headers.map((header, headerIndex) => (
                  <th key={`th-${index}-${headerIndex}`} className="border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-800">
                    {renderInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`tr-${index}-${rowIndex}`} className="align-top odd:bg-white even:bg-slate-50/50">
                  {row.map((cell, cellIndex) => (
                    <td key={`td-${index}-${rowIndex}-${cellIndex}`} className="border-t border-slate-200 px-3 py-2 text-slate-700">
                      {renderInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  });
}

async function getMarcoSlugList() {
  const files = await readdir(MARCO_TEORICO_DIR);
  return files
    .filter((fileName) => fileName.endsWith(".md") && fileName !== "index.md")
    .map((fileName) => fileName.replace(/\.md$/i, ""));
}

function sanitizeSlug(rawSlug) {
  return String(rawSlug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function buildDisplayTitle(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const slugs = await getMarcoSlugList();
  return slugs.map((slug) => ({ slug }));
}

export default async function MarcoTeoricoEjePage({ params }) {
  const resolvedParams = await params;
  const slug = sanitizeSlug(resolvedParams?.slug);
  if (!slug) notFound();

  const availableSlugs = await getMarcoSlugList();
  if (!availableSlugs.includes(slug)) notFound();

  const markdownPath = path.join(MARCO_TEORICO_DIR, `${slug}.md`);
  const markdownRaw = await readFile(markdownPath, "utf8");
  const { metadata, content } = parseFrontmatter(markdownRaw);
  const blocks = parseMarkdownBlocks(content);
  const pageTitle = metadata.title ?? buildDisplayTitle(slug);

  return (
    <>
      <Header navItems={navItems} />
      <main className="mx-auto w-full max-w-[1200px] space-y-6 px-4 pb-12 pt-8 md:px-6 md:pt-10">
        <section className="surface-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="kicker">
            Marco Teórico por Eje
          </p>
          <h1 className="page-title mt-2">
            {pageTitle}
          </h1>
          <p className="supporting-copy mt-3">
            {metadata.description ?? "Desarrollo conceptual del eje seleccionado."}
          </p>
        </section>

        <section className="surface-card space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-wrap justify-end gap-2 [&>*]:w-full sm:[&>*]:w-auto">
            <Link
              href="/marco-teorico"
              className="rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:underline"
            >
              Volver a Marco Teórico General
            </Link>
            <DownloadMarcoTeoricoPdfButton
              blocks={blocks}
              title={pageTitle}
              filename={`marco-teorico-${slug}.pdf`}
            />
            <PrintSectionButton
              sectionId="marco-teorico-eje-content"
              title={pageTitle}
              label="Imprimir Marco Teórico"
            />
          </div>

          <article id="marco-teorico-eje-content" className="space-y-4 md:space-y-5">
            {renderMarkdownBlocks(blocks)}
          </article>
        </section>
      </main>
    </>
  );
}
