import type { Metadata } from "next";

import { FEED_PATH } from "./posts";

type Alternates = NonNullable<Metadata["alternates"]>;

/**
 * The RSS <link> for every page once there are posts. Pages that set their
 * own `alternates` (canonical) replace the layout's, so they add this too.
 */
export const feedLinks = (name: string, hasPosts: boolean): Alternates["types"] =>
  hasPosts ? { "application/rss+xml": [{ url: FEED_PATH, title: `${name} — Blog` }] } : undefined;
