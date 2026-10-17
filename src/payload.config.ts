import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { Profile } from "./globals/Profile";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "";

// Origins allowed to make cookie-authenticated requests to the API.
const allowedOrigins = [
  serverURL,
  "https://xmphdalf.dev",
  "https://www.xmphdalf.dev",
  "https://xmphdalf-production.up.railway.app",
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:3000"]),
].filter((origin, index, list) => origin && list.indexOf(origin) === index);

export default buildConfig({
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: "Admin",
      titleSuffix: "| xmphdalf.dev",
    },
    components: {
      views: {
        dashboard: {
          Component: "/components/admin/Dashboard#Dashboard",
        },
      },
    },
  },
  collections: [Users, Media],
  globals: [Profile],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    migrationDir: path.resolve(dirname, "migrations"),
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
});
