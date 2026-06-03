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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'Your portfolio URL. Auto-generated from name. Lowercase, numbers, hyphens only.',
        readOnly: false,
      },
      validate: (val: unknown) => {
        if (typeof val === 'string' && /^[a-z0-9-]+$/.test(val)) return true
        return 'Must be lowercase letters, numbers, and hyphens only.'
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'User', value: 'user' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'super-admin',
      },
    },
  ],
}
