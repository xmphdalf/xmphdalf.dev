import config from '@payload-config'
import { getPayload } from 'payload'

async function seed() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.totalDocs > 0) {
    console.log('Already seeded. Exiting.')
    process.exit(0)
  }

  const superAdmin = await payload.create({
    collection: 'users',
    data: {
      name: process.env.SEED_SUPER_ADMIN_NAME ?? 'Admin',
      email: process.env.SEED_SUPER_ADMIN_EMAIL ?? 'admin@xmphdalf.dev',
      password: process.env.SEED_SUPER_ADMIN_PASSWORD ?? 'changeme',
      role: 'super-admin',
      slug: process.env.SEED_SUPER_ADMIN_SLUG ?? 'admin',
    },
  })

  console.log('Created super-admin:', superAdmin.email, 'with slug:', superAdmin.slug)
  console.log('Seed complete. Create users via the admin panel.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
