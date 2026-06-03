import type { CollectionConfig } from 'payload'

const ownOrAdmin = ({ req }: { req: any }) => {
  if (!req.user) return false
  if (req.user.role === 'super-admin') return true
  return { user: { equals: req.user.id } }
}

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  admin: { useAsTitle: 'title' },
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
        description: 'The user this credential belongs to.',
        condition: (_, __, { user }: any) => user?.role === 'super-admin',
      },
    },
    {
      name: 'seal',
      type: 'text',
      admin: { description: 'Short identifier shown on the badge. e.g. GCP, AWS' },
    },
    { name: 'issuer', type: 'text', required: true },
    {
      name: 'tier',
      type: 'select',
      options: [
        { label: 'Foundational', value: 'foundational' },
        { label: 'Associate', value: 'associate' },
        { label: 'Professional', value: 'professional' },
        { label: 'Expert', value: 'expert' },
        { label: 'Specialty', value: 'specialty' },
      ],
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'short',
      type: 'text',
      admin: { description: 'Abbreviation shown on the index. e.g. ACE, GCP-PCA' },
    },
    { name: 'description', type: 'textarea' },
    { name: 'issued', type: 'date' },
    {
      name: 'validity',
      type: 'text',
      admin: { description: 'e.g. "3 years" or "Lifetime"' },
    },
    { name: 'credentialId', type: 'text', admin: { description: 'Credential ID or number' } },
    { name: 'verifyUrl', type: 'text', admin: { description: 'URL to verify this credential' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Revoked', value: 'revoked' },
      ],
    },
  ],
}
