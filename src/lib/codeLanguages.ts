/**
 * Languages offered for code blocks in posts. Keys are the editor's (Monaco)
 * ids, which are stored with each block; values are the labels in the menu.
 * Plain data, so the Payload config and the site can both read it.
 */
export const CODE_LANGUAGES = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  json: "JSON",
  shell: "Shell",
  python: "Python",
  go: "Go",
  rust: "Rust",
  sql: "SQL",
  yaml: "YAML",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  graphql: "GraphQL",
  dockerfile: "Dockerfile",
  markdown: "Markdown",
  java: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  php: "PHP",
  ruby: "Ruby",
  csharp: "C#",
  cpp: "C++",
  plaintext: "Plain text",
} as const;

export type CodeLanguage = keyof typeof CODE_LANGUAGES;

/** Highlighter grammar for each editor id. TypeScript also covers TSX. */
export const HIGHLIGHT_GRAMMAR: Record<CodeLanguage, string> = {
  typescript: "tsx",
  javascript: "jsx",
  json: "json",
  shell: "shellscript",
  python: "python",
  go: "go",
  rust: "rust",
  sql: "sql",
  yaml: "yaml",
  html: "html",
  css: "css",
  scss: "scss",
  graphql: "graphql",
  dockerfile: "dockerfile",
  markdown: "markdown",
  java: "java",
  kotlin: "kotlin",
  swift: "swift",
  php: "php",
  ruby: "ruby",
  csharp: "csharp",
  cpp: "cpp",
  plaintext: "text",
};

/** Short label shown on a code block, e.g. "ts", "sh". */
export const CODE_LABEL: Record<CodeLanguage, string> = {
  typescript: "ts",
  javascript: "js",
  json: "json",
  shell: "sh",
  python: "py",
  go: "go",
  rust: "rs",
  sql: "sql",
  yaml: "yaml",
  html: "html",
  css: "css",
  scss: "scss",
  graphql: "graphql",
  dockerfile: "dockerfile",
  markdown: "md",
  java: "java",
  kotlin: "kt",
  swift: "swift",
  php: "php",
  ruby: "rb",
  csharp: "cs",
  cpp: "cpp",
  plaintext: "text",
};

export const isCodeLanguage = (value: unknown): value is CodeLanguage =>
  typeof value === "string" && value in CODE_LANGUAGES;
