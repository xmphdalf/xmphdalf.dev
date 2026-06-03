import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import './projects.css'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProjectsPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!users.docs.length) return notFound()

  const user = users.docs[0]

  // Get all projects, sorted by year (newest first)
  const projects = await payload.find({
    collection: 'projects',
    where: { user: { equals: user.id } },
    sort: '-year',
    limit: 100,
  })

  return (
    <div className="page-load">
      <div className="container">
        <header className="projects-header">
          <h1>Projects</h1>
          <p className="text-secondary">
            {projects.totalDocs} {projects.totalDocs === 1 ? 'project' : 'projects'}
          </p>
        </header>

        <div className="projects-grid-full">
          {projects.docs.map((project) => (
            <article key={project.id} className="project-card-full">
              <div className="project-card-header">
                <h2 className="project-card-title">
                  <a href={`/${slug}/projects/${project.id}`} className="link-underline">
                    {project.title}
                  </a>
                </h2>
                <p className="project-card-meta text-sm text-tertiary font-sans">
                  {project.year}
                  {project.kind && ` · ${project.kind}`}
                  {project.role && ` · ${project.role}`}
                </p>
              </div>

              {project.summary && (
                <p className="project-card-summary text-secondary">{project.summary}</p>
              )}

              {project.stack && project.stack.length > 0 && (
                <div className="project-card-stack">
                  {project.stack.slice(0, 5).map((item, i) => (
                    <span key={i} className="stack-tag text-xs font-sans">
                      {item.name}
                    </span>
                  ))}
                  {project.stack.length > 5 && (
                    <span className="stack-tag text-xs font-sans text-tertiary">
                      +{project.stack.length - 5}
                    </span>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

        {projects.docs.length === 0 && (
          <div className="empty-state text-center text-secondary">
            <p>No projects yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
