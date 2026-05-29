import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Projects } from './collections/Projects'
import { Credentials } from './collections/Credentials'
import { Profiles } from './collections/Profiles'
import { StackGroups } from './collections/StackGroups'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET ?? '',

  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— xmphdalf.dev' },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  editor: lexicalEditor(),

  collections: [Tenants, Users, Projects, Credentials, Profiles, StackGroups],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? '',
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [
    multiTenantPlugin({
      tenantsSlug: 'tenants',
      collections: {
        projects: {},
        credentials: {},
        profiles: { isGlobal: true },
        'stack-groups': {},
      },
      userHasAccessToAllTenants: (user) => (user as { role?: string })?.role === 'super-admin',
    }),
  ],
})
