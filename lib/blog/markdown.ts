export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function stripFrontmatter(source: string) {
  if (!source.startsWith("---")) {
    return source.trim();
  }

  const end = source.indexOf("\n---", 3);
  if (end === -1) {
    return source.trim();
  }

  return source.slice(end + 4).trim();
}

export function slugifyHeading(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getTableOfContents(content: string): BlogHeading[] {
  const counts = new Map<string, number>();

  return content
    .split(/\r?\n/)
    .map((line) => {
      const match = /^(##|###)\s+(.+)$/.exec(line.trim());
      if (!match) {
        return null;
      }

      const baseId = slugifyHeading(match[2]);
      const count = counts.get(baseId) ?? 0;
      counts.set(baseId, count + 1);

      return {
        id: count ? `${baseId}-${count + 1}` : baseId,
        text: match[2],
        level: match[1] === "##" ? 2 : 3
      } satisfies BlogHeading;
    })
    .filter((heading): heading is BlogHeading => Boolean(heading));
}
