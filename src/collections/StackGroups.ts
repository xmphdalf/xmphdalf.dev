import type { CollectionConfig } from 'payload'

const ownOrAdmin = ({ req }: { req: any }) => {
  if (!req.user) return false
  if (req.user.role === 'super-admin') return true
  return { user: { equals: req.user.id } }
}

export const StackGroups: CollectionConfig = {
  slug: 'stack-groups',
  admin: {
    useAsTitle: 'groupName',
    defaultColumns: ['groupName', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ownOrAdmin,
    delete: ownOrAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && !data.user) {
          data.user = req.user?.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        create: ({ req }) => req.user?.role === 'super-admin',
        update: ({ req }) => req.user?.role === 'super-admin',
      },
      admin: {
        description: 'The user this stack group belongs to.',
        condition: (_, __, { user }: any) => user?.role === 'super-admin',
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
