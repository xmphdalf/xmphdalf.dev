import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import './home.css'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function HomePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Find the user by their slug - this is their portfolio
  const users = await payload.find({
    collection: 'users',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!users.docs.length) return notFound()

  const user = users.docs[0]

  // Get the user's profile - one profile per user
  const profiles = await payload.find({
    collection: 'profiles',
    where: { user: { equals: user.id } },
    limit: 1,
  })

  const profile = profiles.docs[0] ?? null

  // Get projects for the "Selected Work" section
  // Sorted by order field so user can control what appears first
  const projects = await payload.find({
    collection: 'projects',
    where: { user: { equals: user.id } },
    sort: 'order',
    limit: 6,
  })

  return (
    <div className="page-load">
      <div className="container">
        <div className="grid-2col">
          {/* Main content - hero and selected work */}
          <div className="home-main">
            {/* Hero section */}
            <section className="hero-section">
              <h1>{profile?.name ?? user.name}</h1>
              {profile?.role && (
                <p className="hero-role text-secondary font-sans">{profile.role}</p>
              )}
              {profile?.location && (
                <p className="hero-location text-tertiary text-sm">{profile.location}</p>
              )}
              {profile?.intro?.[0]?.paragraph && (
                <div className="hero-intro prose">
                  <p>{profile.intro[0].paragraph}</p>
                </div>
              )}
            </section>

            {/* Selected work section */}
            {projects.docs.length > 0 && (
              <section className="work-section">
                <h2>Selected Work</h2>
                <div className="projects-grid">
                  {projects.docs.map((project) => (
                    <article key={project.id} className="project-card">
                      <h3 className="project-title">
                        <a href={`/${slug}/projects/${project.id}`} className="link-underline">
                          {project.title}
                        </a>
                      </h3>
                      <p className="project-meta text-sm text-tertiary font-sans">
                        {project.year} {project.kind && `· ${project.kind}`}
                      </p>
                      {project.summary && (
                        <p className="project-summary text-secondary">{project.summary}</p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - facts, status, links */}
          <aside className="home-sidebar">
            {profile?.facts && profile.facts.length > 0 && (
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

            {profile?.status?.text && (
              <div className="sidebar-section">
                <h3 className="sidebar-title text-xs font-sans text-tertiary">
                  {profile.status.label || 'Currently building'}
                </h3>
                <p className="status-text text-secondary">{profile.status.text}</p>
              </div>
            )}

            {profile?.openToWork && (
              <div className="sidebar-section">
                <span className="badge badge-success">Open to work</span>
              </div>
            )}

            {profile?.links && profile.links.length > 0 && (
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
