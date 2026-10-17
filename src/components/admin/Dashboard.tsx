import type { AdminViewServerProps } from "payload";

import { Gutter } from "@payloadcms/ui";
import Link from "next/link";
import { redirect } from "next/navigation";

const formatDate = (value?: string | null): string => {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
};

export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult;
  const { payload, user } = req;

  // The dashboard already sits behind the admin login, but check anyway.
  if (!user) redirect("/admin/login");

  const [profile, media] = await Promise.all([
    payload.findGlobal({ slug: "profile", depth: 0, overrideAccess: false, req }),
    payload.count({ collection: "media", overrideAccess: false, req }),
  ]);

  const counts = [
    { label: "Roles", value: profile.experience?.length ?? 0 },
    { label: "Education", value: profile.education?.length ?? 0 },
    { label: "Certifications", value: profile.certifications?.length ?? 0 },
    { label: "Skill groups", value: profile.skills?.length ?? 0 },
    { label: "Media files", value: media.totalDocs },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || "/";

  return (
    <Gutter className="mini-dashboard">
      <header className="mini-dashboard__header">
        <p className="mini-dashboard__eyebrow">Profile</p>
        <h1 className="mini-dashboard__title">{profile.name || "Untitled profile"}</h1>
        {profile.headline ? <p className="mini-dashboard__headline">{profile.headline}</p> : null}
        <p className="mini-dashboard__meta">Last updated: {formatDate(profile.updatedAt)}</p>
      </header>

      <dl className="mini-dashboard__counts">
        {counts.map((item) => (
          <div className="mini-dashboard__count" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mini-dashboard__actions">
        <Link className="mini-dashboard__button mini-dashboard__button--primary" href="/admin/globals/profile">
          Edit profile
        </Link>
        <a className="mini-dashboard__button" href={siteUrl} rel="noopener noreferrer" target="_blank">
          View site
        </a>
      </div>
    </Gutter>
  );
}
