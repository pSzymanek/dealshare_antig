import { getTableOfContents } from "@/lib/blog/markdown";

type MarkdownRendererProps = {
  content: string;
};

type Block =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

function parseMarkdown(content: string): Block[] {
  const headings = getTableOfContents(content);
  const blocks: Block[] = [];
  const lines = content.split(/\r?\n/);
  let index = 0;
  let headingIndex = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const headingMatch = /^(##|###)\s+(.+)$/.exec(line);
    if (headingMatch) {
      const heading = headings[headingIndex];
      headingIndex += 1;
      blocks.push({
        type: "heading",
        level: headingMatch[1] === "##" ? 2 : 3,
        text: headingMatch[2],
        id: heading?.id ?? ""
      });
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const paragraphLine = lines[index].trim();
      if (!paragraphLine || /^(##|###)\s+/.test(paragraphLine) || /^>\s+/.test(paragraphLine) || /^-\s+/.test(paragraphLine) || /^\d+\.\s+/.test(paragraphLine)) {
        break;
      }
      paragraphLines.push(paragraphLine);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className="article-content">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = block.level === 2 ? "h2" : "h3";
          return (
            <HeadingTag key={`${block.id}-${index}`} id={block.id} className="scroll-mt-28">
              {block.text}
            </HeadingTag>
          );
        }

        if (block.type === "blockquote") {
          return <blockquote key={index}>{block.text}</blockquote>;
        }

        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "paragraph") {
          return <p key={index}>{block.text}</p>;
        }

        return null;
      })}
    </div>
  );
}
