import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'kind', 'order'],
  },
  fields: [
    // `tenant` relationship injected by multi-tenant plugin
    { name: 'title', type: 'text', required: true },
    { name: 'year', type: 'number' },
    { name: 'kind', type: 'text' },
    { name: 'role', type: 'text' },
    {
      name: 'stack',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'summary', type: 'textarea' },
    {
      name: 'body',
      type: 'array',
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    {
      name: 'meta',
      type: 'array',
      admin: { description: 'Key/value pairs shown in the sidebar (e.g. Scale → 1.2M passages).' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
