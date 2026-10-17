import type { GlobalConfig } from "payload";

import { anyone, authenticated } from "../access/authenticated";
import { rowLabel } from "../fields/rowLabel";
import { urlField } from "../fields/url";

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
                    { name: "startDate", type: "date", label: "Start month", admin: { date: monthPicker } },
                    {
                      name: "endDate",
                      type: "date",
                      label: "End month",
                      admin: {
                        date: monthPicker,
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
                    { name: "issuedDate", type: "date", admin: { date: monthPicker } },
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
