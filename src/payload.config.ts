import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Credentials } from './collections/Credentials'
import { Media } from './collections/Media'
import { Profiles } from './collections/Profiles'
import { Projects } from './collections/Projects'
import { StackGroups } from './collections/StackGroups'
import { Users } from './collections/Users'

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

  collections: [Users, Projects, Credentials, Profiles, StackGroups, Media],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? '',
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [],
})
