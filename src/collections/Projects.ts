import type { CollectionConfig } from 'payload'

const ownOrAdmin = ({ req }: { req: any }) => {
  if (!req.user) return false
  if (req.user.role === 'super-admin') return true
  return { user: { equals: req.user.id } }
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'kind', 'order'],
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
        description: 'The user this project belongs to.',
        condition: (_, __, { user }: any) => user?.role === 'super-admin',
      },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'year', type: 'number' },
    {
      name: 'kind',
      type: 'text',
      admin: { description: 'e.g. Web app, Mobile app, Design system' },
    },
    {
      name: 'role',
      type: 'text',
      admin: { description: 'Your role. e.g. Solo developer, UI designer' },
    },
    {
      name: 'stack',
      type: 'array',
      admin: { description: 'Technologies used in this project.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'summary', type: 'textarea', admin: { description: 'One or two sentence overview.' } },
    {
      name: 'body',
      type: 'array',
      admin: { description: 'Full case study paragraphs.' },
      fields: [{ name: 'paragraph', type: 'textarea', required: true }],
    },
    {
      name: 'meta',
      type: 'array',
      admin: { description: 'Key/value pairs shown in the sidebar. e.g. Scale → 1.2M passages.' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first.' },
    },
  ],
}
