import type { CollectionConfig } from 'payload'

export const Profiles: CollectionConfig = {
  slug: 'profiles',
  admin: { useAsTitle: 'name' },
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
      unique: true,
      admin: {
        description: 'The user this profile belongs to. One profile per user.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo/avatar. Square crops work best.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
    },
    {
      name: 'focus',
      type: 'text',
      admin: { description: 'What you focus on. e.g. Full-stack development, Product design' },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'intro',
      type: 'array',
      admin: { description: 'Opening paragraphs shown on the home page.' },
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    {
      name: 'lead',
      type: 'textarea',
      admin: { description: 'Large pull-quote on the About page.' },
    },
    {
      name: 'body',
      type: 'array',
      admin: { description: 'Body paragraphs on the About page.' },
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    {
      name: 'facts',
      type: 'array',
      admin: { description: 'Key/value pairs in the sidebar. e.g. Experience → 4+ years' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'links',
      type: 'array',
      admin: { description: 'Social and external links shown in sidebar and Contact page.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        { name: 'handle', type: 'text', admin: { description: 'Display text. e.g. @mihir' } },
      ],
    },
    {
      name: 'status',
      type: 'group',
      admin: { description: 'The "Currently building" blurb in the sidebar.' },
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Currently building' },
        { name: 'text', type: 'text' },
      ],
    },
    {
      name: 'openToWork',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show "Open to work" badge on portfolio.' },
    },
  ],
}
