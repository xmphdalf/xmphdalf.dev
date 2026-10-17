import { Instrument_Sans, Newsreader } from "next/font/google";

// The editorial design's fonts, both from Google Fonts under the SIL Open Font
// License 1.1. They are exposed as CSS variables on the design's wrapper only.
// Not preloaded: every design is imported on every page, so preloading would
// make other designs download these files too.
const serif = Newsreader({
  variable: "--editorial-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
});

const sans = Instrument_Sans({
  variable: "--editorial-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const fontVariables = `${serif.variable} ${sans.variable}`;
