# xmphdalf.dev

Personal site of Mihir Lathiya.

Built with Next.js and Payload CMS. The public site lives in `src/app/(frontend)`, and the admin panel and API live in `src/app/(payload)`.

## Content

All profile content sits in one Payload global, `profile`, edited at `/admin`. Field names describe the content rather than any page layout, so the frontend can change without touching the admin or the database.

- Admin: `/admin`
- Profile JSON: `/api/globals/profile`

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
