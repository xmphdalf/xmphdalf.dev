import React from 'react'

export const metadata = {
  title: 'xmphdalf.dev',
  description: 'A platform for thoughtful portfolios.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
