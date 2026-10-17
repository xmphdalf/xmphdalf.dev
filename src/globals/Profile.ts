import type { GlobalConfig, NumberField } from "payload";

import { anyone, authenticated } from "../access/authenticated";
import { rowLabel } from "../fields/rowLabel";
import { urlField } from "../fields/url";
import { revalidateSite } from "../hooks/revalidateSite";

const yearField = (
  name: string,
  label: string,
  condition?: NonNullable<NumberField["admin"]>["condition"],
): NumberField => ({
  name,
  label,
  type: "number",
  min: 1900,
  max: 2100,
  admin: { step: 1, placeholder: "e.g. 2023", ...(condition ? { condition } : {}) },
});

const monthPicker = {
  pickerAppearance: "monthOnly",
  displayFormat: "MMM yyyy",
} as const;

/**
 * Everything the public site shows about Mihir, kept in one document.
 * Field names describe the content, not how a page lays it out, so any
 * future frontend or theme can read the same data.
 */
export const Profile: GlobalConfig = {
  slug: "profile",
  label: "Profile",
  admin: {
    description: "Everything shown on your public site.",
  },
  access: {
    read: anyone,
    update: authenticated,
    readVersions: authenticated,
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  versions: {
    max: 50,
    drafts: false,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "About",
          fields: [
            {
              type: "row",
              fields: [
                { name: "name", type: "text", required: true },
                {
                  name: "headline",
                  type: "text",
                  admin: { description: "One line under your name, e.g. your current title." },
                },
              ],
            },
            {
              name: "bio",
              type: "textarea",
              admin: {
                description: "A short introduction in plain text. Leave a blank line to start a new paragraph.",
              },
            },
            {
              type: "row",
              fields: [
                { name: "location", type: "text", admin: { placeholder: "City, Country" } },
                { name: "email", type: "email", admin: { description: "Public contact address." } },
              ],
            },
            {
              name: "availability",
              type: "select",
              required: true,
              defaultValue: "notLooking",
              options: [
                { label: "Open to roles", value: "roles" },
                { label: "Open to freelance", value: "freelance" },
                { label: "Open to roles and freelance", value: "both" },
                { label: "Not looking", value: "notLooking" },
              ],
            },
            {
              name: "photo",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
              admin: { description: "Square images work best." },
            },
            {
              name: "languages",
              type: "array",
              labels: { singular: "Language", plural: "Languages" },
              admin: {
                initCollapsed: true,
                components: { RowLabel: rowLabel(["language", "level"], "Language") },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "language", type: "text", required: true },
                    { name: "level", type: "text", admin: { placeholder: "e.g. Fluent" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Links",
          fields: [
            {
              type: "row",
              fields: [
                urlField({ name: "github", label: "GitHub" }),
                urlField({ name: "linkedin", label: "LinkedIn" }),
              ],
            },
            {
              type: "row",
              fields: [
                urlField({
                  name: "credly",
                  label: "Credly profile",
                  description: "Your Credly profile page",
                }),
                urlField({ name: "website" }),
              ],
            },
            {
              name: "resume",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { equals: "application/pdf" } },
              admin: { description: "PDF only." },
            },
          ],
        },
        {
          label: "Experience",
          fields: [
            {
              name: "experience",
              type: "array",
              labels: { singular: "Role", plural: "Roles" },
              admin: {
                description: "Newest first. Drag rows to reorder.",
                initCollapsed: true,
                components: { RowLabel: rowLabel(["role", "company"], "Role") },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "company", type: "text", required: true },
                    urlField({ name: "companyUrl", label: "Company website" }),
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "role", type: "text", required: true },
                    { name: "location", type: "text" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    yearField("startYear", "Start year"),
                    yearField("endYear", "End year", (_, siblingData) => !siblingData?.current),
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "startDate",
                      type: "date",
                      label: "Start month",
                      admin: { date: monthPicker, description: "Optional. Shown instead of the year when set." },
                    },
                    {
                      name: "endDate",
                      type: "date",
                      label: "End month",
                      admin: {
                        date: monthPicker,
                        description: "Optional. Shown instead of the year when set.",
                        condition: (_, siblingData) => !siblingData?.current,
                      },
                    },
                  ],
                },
                { name: "current", type: "checkbox", label: "I currently work here" },
                {
                  name: "highlights",
                  type: "array",
                  labels: { singular: "Highlight", plural: "Highlights" },
                  admin: { components: { RowLabel: rowLabel(["text"], "Highlight") } },
                  fields: [
                    {
                      name: "text",
                      type: "textarea",
                      required: true,
                      admin: { description: "One plain sentence about what you did." },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Client work",
          fields: [
            {
              name: "clients",
              type: "array",
              labels: { singular: "Client", plural: "Clients" },
              admin: {
                description: "Newest first. Drag rows to reorder.",
                initCollapsed: true,
                components: { RowLabel: rowLabel(["name", "years"], "Client") },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", required: true },
                    {
                      name: "years",
                      type: "text",
                      admin: {
                        placeholder: "e.g. 2022 – 2023",
                        description: "Years, or Mon YYYY – Mon YYYY if known",
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "role", type: "text" },
                    urlField({ name: "url", label: "Website" }),
                  ],
                },
                { name: "summary", type: "textarea" },
                {
                  name: "tech",
                  type: "text",
                  hasMany: true,
                  admin: { description: "Type a technology and press Enter to add it." },
                },
              ],
            },
          ],
        },
        {
          label: "Education",
          fields: [
            {
              name: "education",
              type: "array",
              labels: { singular: "Qualification", plural: "Qualifications" },
              admin: {
                initCollapsed: true,
                components: { RowLabel: rowLabel(["degree", "institution"], "Qualification") },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "institution", type: "text", required: true },
                    { name: "degree", type: "text" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "score", type: "text", label: "Score", admin: { placeholder: "e.g. 8.62 CGPA" } },
                    {
                      name: "note",
                      type: "text",
                      label: "Note (e.g. rank)",
                      admin: { placeholder: "e.g. 3rd rank" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Certifications",
          fields: [
            {
              name: "certifications",
              type: "array",
              labels: { singular: "Certification", plural: "Certifications" },
              admin: {
                initCollapsed: true,
                components: { RowLabel: rowLabel(["name", "issuer"], "Certification") },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "issuer", type: "text" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    urlField({
                      name: "credlyUrl",
                      label: "Credly badge link",
                      description: "Public link to this badge",
                    }),
                  ],
                },
                {
                  type: "row",
                  fields: [
                    yearField("issuedYear", "Issued year"),
                    {
                      name: "issuedDate",
                      type: "date",
                      label: "Issued month",
                      admin: { date: monthPicker, description: "Optional. Shown instead of the year when set." },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Skills",
          fields: [
            {
              name: "skills",
              type: "array",
              labels: { singular: "Skill group", plural: "Skill groups" },
              admin: {
                initCollapsed: true,
                components: { RowLabel: rowLabel(["group"], "Skill group") },
              },
              fields: [
                {
                  name: "group",
                  type: "text",
                  required: true,
                  admin: { placeholder: "e.g. Backend" },
                },
                {
                  name: "items",
                  type: "text",
                  hasMany: true,
                  label: "Skills",
                  admin: { description: "Type a skill and press Enter to add it." },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
