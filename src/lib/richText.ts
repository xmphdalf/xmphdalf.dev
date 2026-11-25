/**
 * Small helpers for Lexical rich-text JSON that work on the server and in
 * Payload hooks, with no editor code imported.
 */

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
  fields?: { code?: string | null } | null;
};

type LexicalState = { root?: LexicalNode } | null | undefined;

/** Plain text of a node and everything inside it. */
export function nodeText(node: LexicalNode | null | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (node.type === "block" && typeof node.fields?.code === "string") return node.fields.code;
  return (node.children ?? []).map(nodeText).join(node.type === "root" ? "\n" : " ");
}

/** All the words in a post, code included. */
export function wordCount(state: LexicalState): number {
  const text = nodeText(state?.root);
  return text.split(/\s+/).filter(Boolean).length;
}

/** About 220 words a minute, rounded up, never less than one. */
export function readingMinutes(state: LexicalState): number {
  return Math.max(1, Math.ceil(wordCount(state) / 220));
}
