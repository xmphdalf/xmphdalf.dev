import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ tenant: string }>
}

export default async function TenantPage({ params }: Props) {
  const { tenant: slug } = await params
  const payload = await getPayload({ config })

  const tenants = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!tenants.docs.length) return notFound()

  const tenant = tenants.docs[0]!

  const profiles = await payload.find({
    collection: 'profiles',
    where: { tenant: { equals: tenant.id } },
    limit: 1,
  })

  const profile = profiles.docs[0] ?? null

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>{profile?.name ?? tenant.name}</h1>
      {profile?.role && <p>{profile.role}</p>}
      {profile?.location && <p>{profile.location}</p>}
      {profile?.intro?.map((p, i) => <p key={i}>{p.paragraph}</p>)}
      <hr />
      <pre style={{ fontSize: '0.75rem', opacity: 0.5 }}>
        tenant: {slug} | theme: {tenant.theme}
      </pre>
    </main>
  )
}
