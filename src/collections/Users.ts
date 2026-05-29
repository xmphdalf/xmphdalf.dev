import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'super-admin') return true
      return { id: { equals: req.user?.id } }
    },
    create: ({ req }) => req.user?.role === 'super-admin',
    update: ({ req }) => {
      if (req.user?.role === 'super-admin') return true
      return { id: { equals: req.user?.id } }
    },
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tenant-admin',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Tenant Admin', value: 'tenant-admin' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'super-admin',
      },
    },
    // The multi-tenant plugin injects the `tenants` array field automatically
  ],
}
