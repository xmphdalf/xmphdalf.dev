import type { CollectionConfig } from 'payload'

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  admin: { useAsTitle: 'title' },
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
        description: 'The user this credential belongs to.',
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
