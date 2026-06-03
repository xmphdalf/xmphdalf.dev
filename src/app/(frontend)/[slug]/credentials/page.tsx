import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import './credentials.css'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CredentialsPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!users.docs.length) return notFound()

  const user = users.docs[0]

  const credentials = await payload.find({
    collection: 'credentials',
    where: { user: { equals: user.id } },
    sort: '-issued',
    limit: 100,
  })

  return (
    <div className="page-load">
      <div className="container">
        <header className="credentials-header">
          <h1>Certifications</h1>
          <p className="text-secondary">
            {credentials.totalDocs} {credentials.totalDocs === 1 ? 'credential' : 'credentials'}
          </p>
        </header>

        {credentials.docs.length > 0 && (
          <div className="credentials-list">
            {credentials.docs.map((cred) => (
              <article key={cred.id} className="credential-card">
                <div className="credential-header">
                  <div className="credential-top">
                    {cred.seal && (
                      <span className="credential-seal font-sans text-xs">{cred.seal}</span>
                    )}
                    {cred.tier && (
                      <span className={`credential-tier font-sans text-xs tier-${cred.tier}`}>
                        {cred.tier}
                      </span>
                    )}
                  </div>
                  {cred.status && (
                    <span className={`credential-status text-xs font-sans status-${cred.status}`}>
                      {cred.status}
                    </span>
                  )}
                </div>

                <h2 className="credential-title">{cred.title}</h2>
                <p className="credential-issuer text-secondary">{cred.issuer}</p>

                {cred.description && (
                  <p className="credential-description text-secondary">{cred.description}</p>
                )}

                <div className="credential-meta font-sans text-sm">
                  {cred.issued && (
                    <span className="credential-issued">
                      Issued:{' '}
                      {new Date(cred.issued).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  )}
                  {cred.validity && <span className="credential-validity">· {cred.validity}</span>}
                </div>

                {cred.verifyUrl && (
                  <a
                    href={cred.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="credential-verify-link text-sm link-underline"
                  >
                    Verify credential
                  </a>
                )}
              </article>
            ))}
          </div>
        )}

        {credentials.docs.length === 0 && (
          <div className="empty-state text-center text-secondary">
            <p>No certifications yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
