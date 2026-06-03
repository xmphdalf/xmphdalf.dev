import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import './contact.css'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ContactPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!users.docs.length) return notFound()

  const user = users.docs[0]

  const profiles = await payload.find({
    collection: 'profiles',
    where: { user: { equals: user.id } },
    limit: 1,
  })

  const profile = profiles.docs[0] ?? null

  return (
    <div className="page-load">
      <div className="container">
        <div className="contact-layout">
          <header className="contact-header">
            <h1>Get in touch</h1>
            {profile?.name && (
              <p className="text-secondary">
                {profile.role && `${profile.role} `}
                {profile.location && `based in ${profile.location}`}
              </p>
            )}
          </header>

          {profile?.links && profile.links.length > 0 && (
            <section className="contact-links-section">
              <ul className="contact-links-list">
                {profile.links.map((link, i) => (
                  <li key={i} className="contact-link-item">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      <span className="contact-link-label font-sans">{link.label}</span>
                      {link.handle && (
                        <span className="contact-link-handle text-secondary">{link.handle}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile?.status && (
            <section className="contact-status-section">
              <h2 className="contact-status-title text-xs font-sans text-tertiary">
                {profile.status.label || 'Currently building'}
              </h2>
              {profile.status.text && (
                <p className="contact-status-text text-secondary">{profile.status.text}</p>
              )}
            </section>
          )}

          {profile?.openToWork && (
            <section className="contact-open-to-work">
              <span className="badge badge-success">Open to work</span>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
