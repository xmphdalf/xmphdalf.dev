import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";

// The bold design's own fonts, exposed as CSS variables on its root element.
// preload is off because every design's fonts are imported on every page;
// they still load as soon as the bold design uses them.
export const archivo = Archivo({
  variable: "--font-bold-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
});

export const instrumentSerif = Instrument_Serif({
  variable: "--font-bold-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-bold-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

export const fontVariables = `${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`;
