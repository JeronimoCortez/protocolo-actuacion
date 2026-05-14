import { readFile } from "node:fs/promises";
import path from "node:path";
import Header from "../components/Header";
import DownloadMarcoTeoricoPdfButton from "../components/DownloadMarcoTeoricoPdfButton";
import PrintSectionButton from "../components/PrintSectionButton";
import { navItems } from "../data/home";

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

    if (/^#{1,3}\s+/.test(line)) {
      const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
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

    if (line.startsWith("- ")) {
      const items = [];

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2).trim());
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines = [];

    while (index < lines.length) {
      const current = lines[index].trim();
      if (!current) break;
      if (/^#{1,3}\s+/.test(current) || current.startsWith("- ") || current.startsWith("|")) break;
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
          <h2 key={`h1-${index}`} className="font-serif text-2xl text-slate-900">
            {renderInlineMarkdown(block.text)}
          </h2>
        );
      }

      if (block.level === 2) {
        return (
          <h3 key={`h2-${index}`} className="pt-3 text-xl font-semibold text-slate-900">
            {renderInlineMarkdown(block.text)}
          </h3>
        );
      }

      return (
        <h4 key={`h3-${index}`} className="pt-2 text-lg font-semibold text-slate-800">
          {renderInlineMarkdown(block.text)}
        </h4>
      );
    }

    if (block.type === "paragraph") {
      return (
        <p key={`p-${index}`} className="leading-7 text-slate-700">
          {renderInlineMarkdown(block.text)}
        </p>
      );
    }

    if (block.type === "list") {
      return (
        <ul key={`ul-${index}`} className="list-disc space-y-2 pl-6 text-slate-700">
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

export default async function MarcoTeoricoPage() {
  const markdownPath = path.join(process.cwd(), "app/data/marco-teorico/index.md");
  const markdownRaw = await readFile(markdownPath, "utf8");
  const { metadata, content } = parseFrontmatter(markdownRaw);
  const blocks = parseMarkdownBlocks(content);

  return (
    <>
      <Header navItems={navItems} />
      <main
        id="marco-teorico-main"
        className="mx-auto w-full max-w-[1200px] space-y-6 px-4 pb-12 pt-8 md:px-6"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-slate-900">
            Marco Teórico
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {metadata.description ??
              "Muestra cada uno de los marcos teóricos y conceptuales utilizados para el desarrollo del protocolo."}
          </p>
        </section>

        <section
          id="marco-teorico-general"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap justify-end gap-2">
            <DownloadMarcoTeoricoPdfButton
              blocks={blocks}
              title={metadata.title ?? "Marco Teórico General"}
              filename="marco-teorico-general.pdf"
            />
            <PrintSectionButton
              sectionId="marco-teorico-general-content"
              title={metadata.title ?? "Marco Teórico General"}
              label="Imprimir Marco Teórico General"
            />
          </div>

          <article id="marco-teorico-general-content" className="space-y-4">
            {renderMarkdownBlocks(blocks)}
          </article>
        </section>
      </main>
    </>
  );
}
