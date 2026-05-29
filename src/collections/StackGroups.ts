import type { CollectionConfig } from 'payload'

export const StackGroups: CollectionConfig = {
  slug: 'stack-groups',
  admin: {
    useAsTitle: 'groupName',
    defaultColumns: ['groupName', 'order'],
  },
  fields: [
    // `tenant` relationship injected by multi-tenant plugin
    { name: 'groupName', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
