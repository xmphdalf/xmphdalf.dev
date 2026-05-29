import type { CollectionConfig } from 'payload'

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  admin: { useAsTitle: 'title' },
  fields: [
    // `tenant` relationship injected by multi-tenant plugin
    { name: 'seal', type: 'text', admin: { description: 'Short identifier shown on the badge, e.g. GCP.' } },
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
    { name: 'short', type: 'text', admin: { description: 'Abbreviation shown on the index, e.g. ACE.' } },
    { name: 'description', type: 'textarea' },
    { name: 'issued', type: 'date' },
    { name: 'validity', type: 'text', admin: { description: 'e.g. "3 years" or "Lifetime".' } },
    { name: 'credentialId', type: 'text' },
    { name: 'verifyUrl', type: 'text' },
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
