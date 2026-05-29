import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data?.slug) {
          data.slug = data.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-]/g, '')
        }
        return data
      },
    ],
  },
  access: {
    create: ({ req }) => req.user?.role === 'super-admin',
    update: ({ req }) => req.user?.role === 'super-admin',
    delete: ({ req }) => req.user?.role === 'super-admin',
    read: () => true,
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
      admin: { description: 'Auto-generated from name. Subdomain — lowercase, no spaces.', readOnly: true },
      validate: (val: unknown) => {
        if (typeof val === 'string' && /^[a-z0-9-]+$/.test(val)) return true
        return 'Must be lowercase letters, numbers, and hyphens only.'
      },
    },
    {
      name: 'theme',
      type: 'select',
      required: true,
      defaultValue: 'editorial',
      options: [{ label: 'Editorial', value: 'editorial' }],
    },
    {
      name: 'domain',
      type: 'text',
      admin: { description: 'Optional custom domain (e.g. mihirlathiya.com). Leave empty to use subdomain.' },
    },
  ],
}
