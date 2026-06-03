import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility and SEO.',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'center',
        crop: 'cover',
      },
      {
        name: 'square',
        width: 600,
        height: 600,
        position: 'center',
        crop: 'cover',
      },
      {
        name: 'large',
        width: 1200,
        height: undefined,
        position: 'center',
        crop: 'cover',
      },
    ],
    mimeTypes: ['image/*'],
  },
}
