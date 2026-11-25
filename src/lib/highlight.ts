import { createCssVariablesTheme, createHighlighter, type Highlighter } from "shiki";

import { HIGHLIGHT_GRAMMAR, isCodeLanguage } from "./codeLanguages";

/**
 * Code is highlighted on the server into spans coloured by CSS variables
 * (--code-foreground, --code-token-keyword, ...). Each design sets its own
 * values, so the same post gets that design's code colours, in light and dark.
 */
const theme = createCssVariablesTheme({
  name: "site",
  variablePrefix: "--code-",
  variableDefaults: {},
  fontStyle: true,
});

const grammars = [...new Set(Object.values(HIGHLIGHT_GRAMMAR))].filter((lang) => lang !== "text");

let highlighter: Promise<Highlighter> | undefined;
const getHighlighter = () => (highlighter ??= createHighlighter({ themes: [theme], langs: grammars }));

/** Highlighted HTML for a block of code. Unknown languages come out as plain text. */
export async function highlight(code: string, language: unknown): Promise<string> {
  const lang = isCodeLanguage(language) ? HIGHLIGHT_GRAMMAR[language] : "text";
  return (await getHighlighter()).codeToHtml(code, { lang, theme: "site" });
}
