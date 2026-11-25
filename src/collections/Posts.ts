import {
  BlocksFeature,
  CodeBlock,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";
import { revalidatePostAfterChange, revalidatePostAfterDelete } from "../hooks/revalidatePosts";
import { CODE_LANGUAGES } from "../lib/codeLanguages";
import { slugify } from "../lib/format";
import { readingMinutes } from "../lib/richText";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Blog posts. Drafts stay private to logged-in users until published; the
 * public site and API only ever see published posts. Like the profile, fields
 * describe the writing, not a layout, so every design reads the same data.
 */
export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Post", plural: "Posts" },
  access: {
    // Visitors (and the public API) only get published posts.
    read: ({ req: { user } }) => (user ? true : { _status: { equals: "published" } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    readVersions: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedAt", "updatedAt"],
    listSearchableFields: ["title", "slug", "excerpt"],
    description: "Your blog. Save a draft to keep writing in private; publish to put it on the site.",
    // Opens the post in the live design, including unpublished changes.
    preview: (doc) => (doc?.id ? `/preview?post=${doc.id}` : null),
  },
  defaultSort: "-publishedAt",
  versions: {
    maxPerDoc: 50,
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePostAfterChange],
    afterDelete: [revalidatePostAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "excerpt",
      type: "textarea",
      maxLength: 300,
      admin: {
        description: "One or two plain sentences. Shown in post lists, search results and link previews.",
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      admin: { description: "Optional. A wide image (about 2:1) works in every design." },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          // Swap the default heading, link, upload and relationship features
          // for versions that fit a blog: links to other posts, images with a
          // caption, and no relationship blocks the site wouldn't show.
          // The post title is the page's h1, so headings start at h2.
          ...defaultFeatures.filter(
            (feature) => !["heading", "link", "upload", "relationship"].includes(feature.key),
          ),
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
          LinkFeature({ enabledCollections: ["posts"] }),
          UploadFeature({
            collections: {
              media: { fields: [{ name: "caption", type: "text" }] },
            },
          }),
          BlocksFeature({
            blocks: [CodeBlock({ languages: CODE_LANGUAGES, defaultLanguage: "typescript" })],
          }),
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "The address: /blog/<slug>. Made from the title when left empty. Changing it later breaks old links.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = typeof value === "string" && value.trim() ? value : data?.title;
            return typeof source === "string" ? slugify(source) : value;
          },
        ],
      },
      validate: (value: string | null | undefined) =>
        !value || SLUG_PATTERN.test(value) || "Use lowercase letters, numbers and single hyphens, e.g. my-first-post.",
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Publish date",
      index: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, HH:mm" },
        description: "Set when you first publish. Change it to backdate a post.",
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value || (siblingData?._status === "published" ? new Date().toISOString() : value),
        ],
      },
    },
    {
      name: "tags",
      type: "text",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Type a tag and press Enter to add it.",
      },
    },
    {
      name: "readingMinutes",
      label: "Reading time (minutes)",
      type: "number",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Worked out from the text when you save.",
      },
      hooks: {
        beforeChange: [({ siblingData }) => readingMinutes(siblingData?.content)],
      },
    },
  ],
};
