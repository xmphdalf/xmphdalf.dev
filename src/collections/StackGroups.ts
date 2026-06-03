import type { CollectionConfig } from 'payload'

export const StackGroups: CollectionConfig = {
  slug: 'stack-groups',
  admin: {
    useAsTitle: 'groupName',
    defaultColumns: ['groupName', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user this stack group belongs to.',
      },
    },
    { name: 'groupName', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
