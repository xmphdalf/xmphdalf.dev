import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "src/assets/fonts");
const loadFont = (file: string) => readFile(path.join(fontDir, file));

const colors = {
  bg: "#f6f4ef",
  ink: "#262523",
  muted: "#6b6860",
  line: "#dedad1",
  acc: "#4f6e52",
};

type Card = {
  /** Top bar, e.g. "~/mihir-lathiya". */
  path: string;
  /** File tab, e.g. "README.md". */
  tab: string;
  /** Small line above the title. */
  kicker?: string | null;
  title: string;
};

/**
 * The link-preview card: a file tab, a kicker and a large title, in the
 * site's neutral palette so it reads the same whichever design is live.
 */
export async function renderOgImage({ path: barPath, tab, kicker, title }: Card): Promise<ImageResponse> {
  const [sans, mono, monoMedium] = await Promise.all([
    loadFont("IBMPlexSans-Medium.ttf"),
    loadFont("IBMPlexMono-Regular.ttf"),
    loadFont("IBMPlexMono-Medium.ttf"),
  ]);

  // Long post titles step down so they fit in three lines.
  const titleSize = title.length > 70 ? 64 : title.length > 40 ? 80 : 112;

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
          {barPath}
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
              {tab}
            </div>
          </div>
          {kicker ? <div style={{ display: "flex", marginTop: 44, fontSize: 32, color: colors.muted }}>{kicker}</div> : null}
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontFamily: "Plex Sans",
              fontSize: titleSize,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", fontSize: 28 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: colors.acc, marginRight: 16 }} />
            <div style={{ display: "flex", color: colors.acc, fontWeight: 500 }}>xmphdalf.dev</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Plex Sans", data: sans, weight: 500, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 400, style: "normal" },
        { name: "Plex Mono", data: monoMedium, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
    },
  );
}
