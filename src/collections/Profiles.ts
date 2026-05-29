import type { CollectionConfig } from 'payload'

// One profile per tenant (enforced by isGlobal: true in plugin config).
// Merges "about" content and site settings — they are logically one document.
export const Profiles: CollectionConfig = {
  slug: 'profiles',
  admin: { useAsTitle: 'name' },
  fields: [
    // `tenant` relationship injected by multi-tenant plugin
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'focus', type: 'text' },
    { name: 'location', type: 'text' },
    {
      name: 'intro',
      type: 'array',
      admin: { description: 'Opening paragraphs shown on the home view.' },
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    { name: 'lead', type: 'textarea', admin: { description: 'Large pull-quote on the About page.' } },
    {
      name: 'body',
      type: 'array',
      admin: { description: 'Body paragraphs on the About page.' },
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    {
      name: 'facts',
      type: 'array',
      admin: { description: 'Key/value pairs in the About sidebar (e.g. Experience → 4+ years).' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'links',
      type: 'array',
      admin: { description: 'Social / external links shown in the sidebar and Contact page.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        { name: 'handle', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'group',
      admin: { description: 'The "Currently building" blurb in the sidebar.' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'text', type: 'text' },
      ],
    },
    { name: 'openToWork', type: 'checkbox', defaultValue: false },
  ],
}
