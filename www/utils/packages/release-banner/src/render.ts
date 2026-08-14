import { Resvg } from "@resvg/resvg-js"
import satori from "satori"

import { loadFonts } from "./fonts.js"
import { banner } from "./template.js"
import { SPEC } from "./spec.js"
import type { RenderOptions } from "./types.js"

/**
 * Renders the banner to an SVG string.
 *
 * Satori's element type comes from React, which this package does not depend on,
 * so the tree is cast at the boundary.
 */
export async function renderSvg(options: RenderOptions): Promise<string> {
  const width = options.spec?.width ?? SPEC.width
  const height = options.spec?.height ?? SPEC.height

  return await satori(banner(options) as never, {
    width,
    height,
    fonts: await loadFonts(),
  })
}

/**
 * Renders the banner to a PNG buffer.
 *
 * Satori lays the template out and emits SVG; resvg rasterises it. Neither step
 * needs a browser, which keeps this runnable as a plain step in CI.
 */
export async function renderPng(options: RenderOptions): Promise<Buffer> {
  const width = options.spec?.width ?? SPEC.width
  const svg = await renderSvg(options)

  return new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    // Everything is drawn with the fonts passed to satori; falling back to the
    // host's fonts would make output differ between machines and CI.
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng()
}

/** Normalises a version so the banner always shows the `v` prefix. */
export function normalizeVersion(version: string): string {
  return version.startsWith("v") ? version : `v${version}`
}
