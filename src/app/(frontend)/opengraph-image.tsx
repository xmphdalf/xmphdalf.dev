import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { slugify } from "@/lib/format";
import { getProfile } from "@/lib/profile";

export const alt = "xmphdalf.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Built on request (the database isn't reachable during the build); the
// profile itself comes from the shared data cache.
export const dynamic = "force-dynamic";

const fontDir = path.join(process.cwd(), "src/assets/fonts");
const loadFont = (file: string) => readFile(path.join(fontDir, file));

const colors = {
  bg: "#f6f4ef",
  panel: "#efece5",
  ink: "#262523",
  muted: "#6b6860",
  line: "#dedad1",
  acc: "#4f6e52",
};

export default async function OpengraphImage() {
  const [profile, sans, mono, monoMedium] = await Promise.all([
    getProfile(),
    loadFont("IBMPlexSans-Medium.ttf"),
    loadFont("IBMPlexMono-Regular.ttf"),
    loadFont("IBMPlexMono-Medium.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: colors.bg,
          color: colors.ink,
          fontFamily: "Plex Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 72,
            padding: "0 64px",
            borderBottom: `2px solid ${colors.line}`,
            color: colors.muted,
            fontSize: 26,
          }}
        >
          ~/{slugify(profile.name)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 64px 56px" }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: colors.muted,
                padding: "6px 22px",
                border: `2px solid ${colors.line}`,
                borderBottom: `2px solid ${colors.acc}`,
                borderRadius: "10px 10px 0 0",
              }}
            >
              README.md
            </div>
          </div>
          {profile.headline ? (
            <div style={{ display: "flex", marginTop: 44, fontSize: 32, color: colors.muted }}>{profile.headline}</div>
          ) : null}
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontFamily: "Plex Sans",
              fontSize: 112,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {profile.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", fontSize: 28 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: colors.acc, marginRight: 16 }} />
            <div style={{ display: "flex", color: colors.acc, fontWeight: 500 }}>xmphdalf.dev</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plex Sans", data: sans, weight: 500, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 400, style: "normal" },
        { name: "Plex Mono", data: monoMedium, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
    },
  );
}
