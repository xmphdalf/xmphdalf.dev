import Link from 'next/link'
import './layout.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function PortfolioLayout({ children, params }: Props) {
  const { slug } = await params

  return (
    <div className="portfolio-layout">
      <header className="portfolio-header">
        <nav className="portfolio-nav">
          <Link href={`/${slug}`} className="nav-logo">
            {slug}
          </Link>
          <ul className="nav-links">
            <li>
              <Link href={`/${slug}`}>Home</Link>
            </li>
            <li>
              <Link href={`/${slug}/about`}>About</Link>
            </li>
            <li>
              <Link href={`/${slug}/projects`}>Projects</Link>
            </li>
            <li>
              <Link href={`/${slug}/credentials`}>Credentials</Link>
            </li>
            <li>
              <Link href={`/${slug}/contact`}>Contact</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="portfolio-main">{children}</main>

      <footer className="portfolio-footer">
        <p className="text-sm text-tertiary">
          &copy; {new Date().getFullYear()} {slug}.xmphdalf.dev
        </p>
      </footer>
    </div>
  )
}
