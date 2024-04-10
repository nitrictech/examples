import { readdir, readFile, stat } from "fs/promises";
import { basename, dirname, join } from "path";
import { createHash } from "crypto";

export async function walk(
  dir: string,
  parentPath?: string
): Promise<WalkEntry[]> {
  const immediateFiles = await readdir(dir);

  const recursiveFiles = await Promise.all(
    immediateFiles.map(async (file) => {
      const path = join(dir, file);
      const stats = await stat(path);
      if (stats.isDirectory()) {
        const docPath = `${basename(path)}.md`;

        return walk(
          path,
          immediateFiles.includes(docPath)
            ? join(dirname(path), docPath)
            : parentPath
        );
      } else if (stats.isFile()) {
        return [
          {
            path: path,
            parentPath,
          },
        ];
      } else {
        return [];
      }
    })
  );

  const flattenedFiles = recursiveFiles.reduce(
    (all, folderContents) => all.concat(folderContents),
    []
  );

  return flattenedFiles.sort((a, b) => a.path.localeCompare(b.path));
}

type WalkEntry = {
  path: string;
  parentPath?: string;
};

export function processMdOptimized(input) {
  const checksum = createHash("sha256").update(input).digest("base64");
  const sectionRegex = /^##\s*(.*)$/;
  const lines = input.split("\n").slice(4);
  const sections = [];

  let section = null;
  let content = "";

  lines.forEach((line) => {
    const match = line.match(sectionRegex);
    if (match) {
      if (content.trim()) {
        sections.push({ heading: section, content });
        content = "";
      }
      section = match[1];
    } else {
      content += `\n${line}`;
    }
  });

  if (content.trim() || section) {
    sections.push({ heading: section, content });
  }

  return { checksum, sections };
}

type Section = {
  content: string;
  heading?: string;
  slug?: string;
};

abstract class BaseEmbeddingSource {
  checksum?: string;
  sections?: Section[];

  constructor(
    public source: string,
    public path: string,
    public parentPath?: string
  ) {}

  abstract load(): Promise<{
    checksum: string;
    sections: Section[];
  }>;
}

export type EmbeddingSource = MarkdownEmbeddingSource;

export class MarkdownEmbeddingSource extends BaseEmbeddingSource {
  type: "markdown" = "markdown";

  constructor(
    source: string,
    public filePath: string,
    public parentFilePath?: string
  ) {
    const path = filePath.replace(/^pages/, "").replace(/\.md?$/, "");
    const parentPath = parentFilePath
      ?.replace(/^pages/, "")
      .replace(/\.md?$/, "");

    super(source, path, parentPath);
  }

  async load() {
    const contents = await readFile(this.filePath, "utf8");

    const { checksum, sections } = processMdOptimized(contents);

    this.checksum = checksum;
    this.sections = sections;

    return {
      checksum,
      sections,
    };
  }
}
