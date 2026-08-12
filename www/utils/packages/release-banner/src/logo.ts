import type { GradientStop } from "./types.js"

/**
 * The Medusa logomark, taken from `@medusajs/icons`
 * (packages/design-system/icons/src/components/medusa.tsx).
 *
 * The banner fills it with the same top-to-bottom sheen as the version text, so
 * the fill is a gradient reference rather than a flat colour.
 */
export const LOGO_PATH =
  "M12.184 2.941 9.127 1.183a3.22 3.22 0 0 0-3.226 0L2.83 2.94a3.25 3.25 0 0 0-1.606 2.786V9.26c0 1.153.62 2.209 1.606 2.786l3.057 1.772c1 .577 2.226.577 3.226 0l3.057-1.772a3.2 3.2 0 0 0 1.606-2.786V5.727c.028-1.14-.592-2.209-1.592-2.786m-4.677 7.697A3.14 3.14 0 0 1 4.365 7.5a3.14 3.14 0 0 1 3.142-3.138c1.733 0 3.155 1.407 3.155 3.138a3.145 3.145 0 0 1-3.155 3.138"

/**
 * Tight bounding box of `LOGO_PATH` inside its authored 15x15 viewBox.
 *
 * Cropping the viewBox to the ink means the width and height handed to satori
 * are the *visible* dimensions, with no invisible padding to compensate for.
 */
export const LOGO_INK = { x: 1.215, y: 0.75, width: 12.57, height: 13.5 }

export const LOGO_ASPECT = LOGO_INK.width / LOGO_INK.height

export type Logo = {
  width: number
  height: number
  src: string
}

/**
 * Builds a standalone SVG of the logomark, filled with a vertical gradient, as a
 * data URI — which is how satori takes SVG.
 */
export function logoDataUri({
  height,
  gradient,
}: {
  height: number
  gradient: GradientStop[]
}): Logo {
  const width = height * LOGO_ASPECT
  const { x, y, width: w, height: h } = LOGO_INK

  const stops = gradient
    .map(
      ([offset, color]) => `<stop offset="${offset}" stop-color="${color}"/>`
    )
    .join("")

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" ` +
    `height="${height}" viewBox="${x} ${y} ${w} ${h}">` +
    `<defs><linearGradient id="m" x1="0" y1="${y}" x2="0" y2="${y + h}" ` +
    `gradientUnits="userSpaceOnUse">${stops}</linearGradient></defs>` +
    `<path fill="url(#m)" d="${LOGO_PATH}"/>` +
    `</svg>`

  return {
    width,
    height,
    src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
  }
}
