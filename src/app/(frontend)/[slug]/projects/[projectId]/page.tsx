import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import './project-detail.css'

type Props = {
  params: Promise<{ slug: string; projectId: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug, projectId } = await params
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!users.docs.length) return notFound()

  const user = users.docs[0]

  const projects = await payload.find({
    collection: 'projects',
    where: {
      id: { equals: projectId },
      user: { equals: user.id },
    },
    limit: 1,
  })

  if (!projects.docs.length) return notFound()

  const project = projects.docs[0]

  return (
    <div className="page-load">
      <div className="container">
        <div className="grid-2col">
          {/* Main content - full case study */}
          <div className="project-detail-main">
            <header className="project-detail-header">
              <h1>{project.title}</h1>
              <p className="project-detail-meta text-secondary font-sans">
                {project.year}
                {project.kind && ` · ${project.kind}`}
                {project.role && ` · ${project.role}`}
              </p>
              {project.summary && (
                <p className="project-detail-summary text-secondary">{project.summary}</p>
              )}
            </header>

            {project.body && project.body.length > 0 && (
              <section className="project-detail-body">
                <div className="prose">
                  {project.body.map((paragraph, i) => (
                    <p key={i}>{paragraph.paragraph}</p>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - stack and meta info */}
          <aside className="project-detail-sidebar">
            {project.stack && project.stack.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title text-xs font-sans text-tertiary">Technologies</h3>
                <ul className="stack-list">
                  {project.stack.map((item, i) => (
                    <li key={i} className="stack-list-item">
                      <span className="text-secondary">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.meta && project.meta.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title text-xs font-sans text-tertiary">Details</h3>
                <ul className="meta-list">
                  {project.meta.map((item, i) => (
                    <li key={i} className="meta-item">
                      <span className="meta-key font-sans text-sm text-tertiary">{item.key}</span>
                      <span className="meta-value text-secondary">{item.value}</span>
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
