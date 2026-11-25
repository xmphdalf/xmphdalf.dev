# xmphdalf.dev

Personal site of Mihir Lathiya.

Built with Next.js and Payload CMS. The public site lives in `src/app/(frontend)`, and the admin panel and API live in `src/app/(payload)`.

## Content

All profile content sits in one Payload global, `profile`, edited at `/admin`. Field names describe the content rather than any page layout, so the frontend can change without touching the admin or the database.

- Admin: `/admin`
- Profile JSON: `/api/globals/profile`

The home page reads the profile through Payload's Local API and caches it. Saving the profile in the admin clears that cache, so changes show on the site straight away. Empty fields and sections are left out of the page.

## Blog

Posts are a Payload collection, `posts`, with drafts. Write in `/admin/collections/posts`; **Save draft** keeps a post private, **Publish** puts it on the site. The **Preview** button opens the latest draft in the live design (logged-in admins only).

- `/blog`: every published post, newest first. Returns 404 until one is published.
- `/blog/<slug>`: one post, with its own link-preview image.
- `/blog/feed.xml`: RSS feed. Posts are also in the sitemap.
- The home page lists the latest few posts in a Writing section.

Publishing, editing or unpublishing a post clears the cache; saving a draft of an unpublished post doesn't. Visitors and the public API only ever see published posts.

Every design renders the blog its own way. Each one provides `BlogIndex` and `BlogPost` in `src/themes/index.ts` (the build fails if one is missing), and renders the post body with `components/site/PostContent`, which outputs plain HTML for the design to style under `.prose`. Code blocks are highlighted on the server, coloured by `--code-*` CSS variables that each design sets for light and dark.

## Development

Needs Node 24 and a Postgres database.

```bash
cp .env.example .env    # then fill in the values
npm install
npm run dev             # http://localhost:3000
```

Other scripts:

```bash
npm run lint
npm run typecheck
npm run build
npm run generate:types       # after changing collections or globals
npm run generate:importmap   # after adding admin components
```

## Database changes

Local dev pushes schema changes straight to the database. For production, create a migration and commit it:

```bash
npm run payload migrate:create <name>
```

Migrations in `src/migrations` run automatically when the server starts.

## Media

Uploads are stored on local disk for now. On Railway that disk is wiped on every deploy, so uploads need an S3-compatible bucket before they can be relied on.
