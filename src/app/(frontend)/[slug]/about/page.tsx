import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import './about.css'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function AboutPage({ params }: Props) {
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

  if (!profile) return notFound()

  return (
    <div className="page-load">
      <div className="container">
        <div className="grid-2col">
          {/* Main content - lead quote and bio */}
          <div className="about-main">
            {/* Lead quote - large, centered feel */}
            {profile.lead && (
              <section className="lead-section">
                <blockquote className="lead-quote">&ldquo;{profile.lead}&rdquo;</blockquote>
              </section>
            )}

            {/* Bio paragraphs */}
            {profile.body && profile.body.length > 0 && (
              <section className="bio-section">
                <div className="prose">
                  {profile.body.map((paragraph, i) => (
                    <p key={i}>{paragraph.paragraph}</p>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - facts and links */}
          <aside className="about-sidebar">
            {profile.facts && profile.facts.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title text-xs font-sans text-tertiary">Facts</h3>
                <ul className="facts-list">
                  {profile.facts.map((fact, i) => (
                    <li key={i} className="fact-item">
                      <span className="fact-key font-sans text-sm">{fact.key}</span>
                      <span className="fact-value text-secondary">{fact.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile.links && profile.links.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title text-xs font-sans text-tertiary">Links</h3>
                <ul className="links-list">
                  {profile.links.map((link, i) => (
                    <li key={i} className="link-item">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
