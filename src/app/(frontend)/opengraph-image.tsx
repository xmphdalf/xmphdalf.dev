import { slugify } from "@/lib/format";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";
import { getProfile } from "@/lib/profile";

export const alt = "xmphdalf.dev";
export const size = OG_SIZE;
export const contentType = "image/png";

// Built on request (the database isn't reachable during the build); the
// profile itself comes from the shared data cache.
export const dynamic = "force-dynamic";

export default async function OpengraphImage() {
  const profile = await getProfile();
  return renderOgImage({
    path: `~/${slugify(profile.name)}`,
    tab: "README.md",
    kicker: profile.headline,
    title: profile.name,
  });
}
