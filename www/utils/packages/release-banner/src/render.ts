import { Resvg } from "@resvg/resvg-js"
import satori from "satori"

import { bannerFor, type BannerInput } from "./banners/index.js"
import { loadFonts } from "./fonts.js"
import { mergeSpec } from "./spec.js"
import type { BaseSpec } from "./types.js"

/** Resolves an input against its definition, spec overrides merged in. */
function prepare(input: BannerInput): {
  spec: BaseSpec & Record<string, unknown>
  tree: unknown
} {
  const definition = bannerFor(input)
  const normalized = definition.normalize(input)
  const spec = mergeSpec(definition.spec, normalized.spec)

  return { spec, tree: definition.build(normalized, spec) }
}

/**
 * Renders a banner to an SVG string.
 *
 * Satori's element type comes from React, which this package does not depend on,
 * so the tree is cast at the boundary.
 */
export async function renderSvg(input: BannerInput): Promise<string> {
  const { spec, tree } = prepare(input)

  return await toSvg(spec, tree)
}

async function toSvg(spec: BaseSpec, tree: unknown): Promise<string> {
  return await satori(tree as never, {
    width: spec.width,
    height: spec.height,
    fonts: await loadFonts(),
  })
}

/**
 * Renders a banner to a PNG buffer.
 *
 * Satori lays the template out and emits SVG; resvg rasterises it. Neither step
 * needs a browser, which keeps this runnable as a plain step in CI.
 */
export async function renderPng(input: BannerInput): Promise<Buffer> {
  const { spec, tree } = prepare(input)
  const svg = await toSvg(spec, tree)

  return new Resvg(svg, {
    fitTo: { mode: "width", value: spec.width },
    // Everything is drawn with the fonts passed to satori; falling back to the
    // host's fonts would make output differ between machines and CI.
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng()
}
