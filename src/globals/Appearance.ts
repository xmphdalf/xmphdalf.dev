import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "../access/authenticated";
import { revalidateAppearance } from "../hooks/revalidateSite";
import { validateAppearance } from "../hooks/validateAppearance";
import { DEFAULT_THEME } from "../themes/manifest";

/**
 * Which site designs are turned on and which one visitors see. The designs
 * themselves live in code (src/themes/manifest.ts); ids are stored as plain
 * text, not a database enum, so adding a design needs no migration.
 * Light/dark mode stays a visitor setting and isn't stored here.
 */
export const Appearance: GlobalConfig = {
  slug: "appearance",
  label: "Designs",
  admin: {
    description: "Choose how your public site looks. Your content stays the same in every design.",
  },
  access: {
    read: anyone,
    update: authenticated,
    readVersions: authenticated,
  },
  versions: {
    max: 50,
    drafts: false,
  },
  fields: [
    {
      name: "designs",
      type: "ui",
      admin: { components: { Field: "/components/admin/DesignsField#DesignsField" } },
    },
    {
      name: "activeTheme",
      label: "Active design",
      type: "text",
      required: true,
      defaultValue: DEFAULT_THEME,
      admin: { hidden: true },
    },
    {
      name: "enabledThemes",
      label: "Turned-on designs",
      type: "text",
      hasMany: true,
      defaultValue: [DEFAULT_THEME],
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeValidate: [validateAppearance],
    afterChange: [revalidateAppearance],
  },
};
