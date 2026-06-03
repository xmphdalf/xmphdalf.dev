import { type NextRequest, NextResponse } from 'next/server'

const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? 'xmphdalf.dev'

export function proxy(request: NextRequest): NextResponse {
  const host = request.headers.get('host') ?? ''
  const hostname = host.split(':')[0]

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || hostname === 'localhost') {
    return NextResponse.next()
  }

  const subdomain = hostname.endsWith(`.${ROOT_DOMAIN}`)
    ? hostname.slice(0, hostname.length - ROOT_DOMAIN.length - 1)
    : null

  if (!subdomain) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${subdomain}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
