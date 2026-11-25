import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedHeadingNode,
  SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import { type JSXConvertersFunction, LinkJSXConverter, RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";

import { CODE_LABEL, isCodeLanguage } from "@/lib/codeLanguages";
import { slugify } from "@/lib/format";
import { highlight } from "@/lib/highlight";
import { postPath, type PostDetail } from "@/lib/posts";
import { asMedia } from "@/lib/profile";
import { nodeText } from "@/lib/richText";

type CodeFields = { language?: string | null; code?: string | null };
type Nodes = DefaultNodeTypes | SerializedBlockNode<CodeFields>;

/** A code block, highlighted on the server. Each design styles .post-code. */
async function CodeBlock({ code, language }: CodeFields) {
  if (!code?.trim()) return null;
  const html = await highlight(code.replace(/\n+$/, ""), language);
  const label = isCodeLanguage(language) ? CODE_LABEL[language] : null;
  return (
    <figure className="post-code" data-language={label ?? undefined}>
      {label ? <figcaption className="post-code-lang">{label}</figcaption> : null}
      <div className="post-code-body" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}

/**
 * The body of a post as plain, semantic HTML inside one wrapper. It carries
 * no styling of its own: each design styles .prose (and .post-code,
 * .post-figure) under its own data-site-theme, so a post takes on the look
 * of whichever design is live.
 */
export function PostContent({ content, className = "prose" }: { content: PostDetail["content"]; className?: string }) {
  // Headings get ids so sections can be linked to; repeats get a number.
  const ids = new Map<string, number>();
  const headingId = (node: SerializedHeadingNode) => {
    const base = slugify(nodeText(node)) || "section";
    const seen = ids.get(base) ?? 0;
    ids.set(base, seen + 1);
    return seen ? `${base}-${seen + 1}` : base;
  };

  const converters: JSXConvertersFunction<Nodes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const doc = linkNode.fields.doc?.value;
        return typeof doc === "object" && doc && "slug" in doc && typeof doc.slug === "string" ? postPath(doc.slug) : "#";
      },
    }),
    heading: ({ node, nodesToJSX }) => {
      const Tag = (["h2", "h3", "h4", "h5", "h6"].includes(node.tag) ? node.tag : "h2") as "h2";
      return <Tag id={headingId(node)}>{nodesToJSX({ nodes: node.children })}</Tag>;
    },
    upload: ({ node }: { node: SerializedUploadNode }) => {
      const file = asMedia(typeof node.value === "object" ? (node.value as Parameters<typeof asMedia>[0]) : null);
      if (!file) return null;
      if (!file.mimeType?.startsWith("image")) {
        return (
          <p>
            <a href={file.url}>{file.filename ?? file.alt}</a>
          </p>
        );
      }
      const caption = typeof node.fields?.caption === "string" ? node.fields.caption.trim() : "";
      return (
        <figure className="post-figure">
          {file.width && file.height ? (
            <Image src={file.url} alt={file.alt} width={file.width} height={file.height} sizes="(max-width: 860px) 100vw, 820px" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- size unknown (e.g. SVG)
            <img src={file.url} alt={file.alt} />
          )}
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      );
    },
    blocks: {
      Code: ({ node }: { node: SerializedBlockNode<CodeFields> }) => (
        <CodeBlock code={node.fields.code} language={node.fields.language} />
      ),
    },
  });

  return <RichText className={className} data={content as never} converters={converters} disableIndent disableTextAlign />;
}
