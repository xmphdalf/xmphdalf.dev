import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "../access/authenticated";

// Files are stored on local disk for now. On Railway that disk is wiped on
// every deploy, so move this to an S3-compatible bucket before relying on it.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
  },
  versions: false,
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt text",
      required: true,
      admin: { description: "Describe the file for screen readers, e.g. \"Portrait of Mihir\"." },
    },
  ],
};
