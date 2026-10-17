import type { Profile } from "../payload-types";

type ProfileSeed = Omit<Profile, "id" | "createdAt" | "updatedAt">;

const techholding = {
  company: "Techholding",
  companyUrl: "https://techholding.co",
};

/**
 * Initial profile content, taken from the resume. Only used to fill an empty
 * profile; edits made in the admin are never overwritten.
 *
 * Dates are only set where the month is known. Year-only ranges from the
 * resume (e.g. "2021 – 2022") are left for editing in the admin.
 */
export const profileSeed: ProfileSeed = {
  name: "Mihir Lathiya",
  headline: "Senior Software Engineer — GenAI & Full Stack",
  bio: "Senior software engineer with 4+ years at Techholding, working mainly in Node.js and TypeScript. I build RAG and LLM applications on AWS Bedrock, after years of moving legacy Rails services to Node.js and React.",
  email: "mihirlathiya.work@gmail.com",
  availability: "both",
  github: "https://github.com/MihirLathiya510",
  linkedin: "https://www.linkedin.com/in/mihirlathiya5/",
  website: "https://xmphdalf.dev",
  experience: [
    {
      ...techholding,
      role: "Senior Software Engineer",
      startDate: "2026-07-01T00:00:00.000Z",
      current: true,
      highlights: [
        { text: "Built a RAG chatbot for financial analysis on AWS Bedrock and OpenSearch, with a Node.js backend." },
        { text: "Wrote the ingestion, embedding, retrieval and synthesis stages so answers come from the relevant source data." },
        { text: "Automated multi-step reasoning for calculation-heavy questions, including stress-testing scenarios, replacing manual analysis work." },
        { text: "Streamed responses so users see answers forming during long, computation-heavy queries." },
        { text: "Kept the chatbot restricted to its domain to handle sensitive financial data safely." },
      ],
    },
    {
      ...techholding,
      role: "Software Engineer",
      endDate: "2026-07-01T00:00:00.000Z",
      current: false,
      highlights: [
        { text: "Built QuickSight dashboards and data views for real-time and near-real-time reporting." },
        { text: "Helped migrate legacy Rails services to Node.js and TypeScript, which cut code size and improved performance." },
        { text: "Created a Rails-style Node.js template so new services start with a consistent structure." },
      ],
    },
    {
      ...techholding,
      role: "Associate Software Engineer",
      current: false,
      highlights: [
        { text: "Worked across 25+ microservices during the platform's move from Ruby on Rails to Node.js and React." },
        { text: "Delivered a live video streaming feature for a client-facing platform ahead of schedule." },
        { text: "Fixed long-standing issues in 6+-year-old legacy services, making them more stable and faster." },
      ],
    },
    {
      ...techholding,
      role: "Software Engineer Intern",
      current: false,
      highlights: [
        { text: "Built task assignment, employee tracking and project workflow features for a project management platform." },
        { text: "Worked in Node.js, TypeScript, React, GraphQL and PostgreSQL, integrating APIs and fixing bugs with the team." },
      ],
    },
  ],
  education: [
    {
      institution: "GLS Institute of Computer Technology",
      degree: "Master of Computer Applications (MCA)",
      score: "8.62 CGPA",
      note: "3rd rank",
    },
    {
      institution: "Kamani Science and Prataprai Arts College",
      degree: "Bachelor of Computer Applications (BCA)",
      score: "8.22 CGPA",
      note: "2nd rank",
    },
  ],
  certifications: [
    {
      name: "Claude Certified Architect – Professional",
      issuer: "Anthropic",
      credlyUrl: "https://www.credly.com/badges/832d06db-3a03-44b0-9be4-fe464e08735c/public_url",
    },
    {
      name: "AWS Certified Generative AI Developer – Professional",
      issuer: "AWS",
      credlyUrl: "https://www.credly.com/badges/8c0d684e-6007-41f9-a01d-03de486b0bb3/public_url",
    },
    {
      name: "Google Cloud Certified – Generative AI Leader",
      issuer: "Google Cloud",
      credlyUrl: "https://www.credly.com/badges/0ae659ce-95ea-43d4-b324-3964b8b4fa5c/public_url",
    },
    {
      name: "Google Cloud Certified – Associate Cloud Engineer",
      issuer: "Google Cloud",
      credlyUrl: "https://www.credly.com/badges/80feed65-bf34-48ae-8d86-4930c27d34b6/public_url",
    },
  ],
  skills: [
    { group: "GenAI", items: ["RAG", "Embeddings and vector search", "AWS Bedrock", "Claude"] },
    { group: "Backend", items: ["Node.js", "TypeScript", "Express", "GraphQL", "REST", "Prisma"] },
    { group: "Frontend", items: ["React", "Next.js"] },
    { group: "Data", items: ["PostgreSQL", "MongoDB", "OpenSearch"] },
    { group: "Cloud", items: ["AWS", "GCP", "QuickSight"] },
    {
      group: "Also",
      items: [
        "Python", "Svelte", "MySQL", "SQLite", "Sequelize", "Drizzle", "Tailwind",
        "MUI", "shadcn/ui", "Untitled UI", "Jest", "Mocha", "Chai",
      ],
    },
  ],
};
