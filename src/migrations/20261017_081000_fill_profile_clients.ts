import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import type { Profile } from "../payload-types";

/** Client work done through Techholding, newest first. */
const clients: NonNullable<Profile["clients"]> = [
  {
    name: "WME",
    years: "2026 – Present",
    role: "Software Engineer, then Senior Software Engineer from July 2026",
    summary:
      "Modernising the platform and building search with Algolia.",
    tech: ["Algolia"],
    url: "https://www.wmeagency.com",
  },
  {
    name: "Vine Financial",
    years: "2026",
    role: "Senior Software Engineer",
    summary:
      "Built a RAG chatbot for financial analysis on AWS Bedrock and OpenSearch with a Node.js backend, and embedded Amazon QuickSight dashboards on the company's website.",
    tech: ["AWS Bedrock", "OpenSearch", "Node.js", "Amazon QuickSight"],
  },
  {
    name: "LIV Golf",
    years: "2025",
    role: "Software Engineer",
    summary:
      "Built ETL jobs for moving data from a third-party vendor to Google Cloud, and checked that the migrated data matched the vendor's output.",
    tech: ["ETL", "Google Cloud"],
    url: "https://www.livgolf.com",
  },
  {
    name: "CourseKey (now part of Portico)",
    years: "2024 – 2025",
    role: "Software Engineer",
    summary:
      "Built a payment module with Google Pay and Apple Pay.",
    tech: ["Google Pay", "Apple Pay"],
    url: "https://porticoedu.com",
  },
  {
    name: "HomeTown Ticketing",
    years: "2023 – 2024",
    role: "Software Engineer",
    summary:
      "Worked on ticketing features and internal services.",
    tech: [],
    url: "https://www.hometownticketing.com",
  },
  {
    name: "Westfield (URW)",
    years: "2022 – 2023",
    role: "Associate Software Engineer",
    summary:
      "Maintained legacy backend services and helped migrate legacy Rails services to Node.js and TypeScript.",
    tech: ["Node.js", "TypeScript", "Ruby on Rails (legacy)"],
    url: "https://www.westfield.com",
  },
];

/** Adds the client list, but only when the profile has no clients yet. */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const current = await payload.findGlobal({ slug: "profile", depth: 0, overrideAccess: true, req });

  if (current.clients?.length) {
    payload.logger.info("Profile already has clients, nothing to fill.");
    return;
  }

  await payload.updateGlobal({
    slug: "profile",
    data: { clients },
    overrideAccess: true,
    context: { skipRevalidate: true },
    req,
  });
  payload.logger.info("Filled profile clients.");
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Clients may have been edited since, so nothing is removed on rollback.
  payload.logger.info("Client fill rollback is a no-op.");
}
