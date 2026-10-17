import { notFound } from "next/navigation";

import { getProfile } from "@/lib/profile";
import TerminalTheme from "@/themes/terminal";

// The home page is rendered on its first request rather than at build time
// (the database isn't reachable during the build), then served from the
// cache. Saving the profile in the admin regenerates it; the daily
// revalidate is only a fallback.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams(): { path?: string[] }[] {
  return [];
}

type PageProps = { params: Promise<{ path?: string[] }> };

export default async function Home({ params }: PageProps) {
  // Only the root path is a page; anything else is a 404.
  if ((await params).path?.length) notFound();

  const profile = await getProfile();
  return <TerminalTheme profile={profile} />;
}
