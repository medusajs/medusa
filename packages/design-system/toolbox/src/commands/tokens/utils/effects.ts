import { Effect } from "@/figma"
import { colorToRGBA } from "./colors"

/**
 * We know that we will need to correct the Y value of the inset shadows
 * on these effects due to the difference in the way Figma and CSS
 * handle shadows.
 */
const SPECIAL_IDENTIFIERS = [
  "--buttons-colored",
  "--buttons-neutral",
  "--buttons-neutral-focus",
  "--buttons-colored-focus",
]

function createDropShadowVariable(effects: Effect[], identifier: string) {
  const shadows = effects.filter(
    (effect) => effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW"
  )

  if (shadows.length === 0) {
    return null
  }

  const value = shadows
    .map((shadow) => {
      const { color, offset, radius, spread, type } = shadow

      const x = offset?.x ?? 0
      let y = offset?.y ?? 0

      if (
        SPECIAL_IDENTIFIERS.includes(identifier) &&
        type === "INNER_SHADOW" &&
        y > 0
      ) {
        y = y - 1
      }

      const b = radius
      const s = spread ?? 0

      const c = color ? colorToRGBA(color) : ""

      const t = type === "INNER_SHADOW" ? "inset" : ""

      return `${x}px ${y}px ${b}px ${s}px ${c} ${t}`.trim()
    })
    .join(", ")

  if (value.length === 0) {
    return null
  }

  return value
}

export { createDropShadowVariable }
