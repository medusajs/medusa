import type { BannerNode, GradientStop } from "./types.js"

/** Element factory for the plain object tree satori consumes. */
export function h(
  type: string,
  props: Record<string, unknown> = {},
  ...children: (BannerNode | string | false | null | undefined)[]
): BannerNode {
  // Conditional children are written inline as `condition && node`, so the
  // falsy ones are dropped here rather than at every call site.
  const kept = children.filter(Boolean) as (BannerNode | string)[]

  return {
    type,
    props: {
      ...props,
      children: (kept.length > 1
        ? kept
        : kept[0]) as BannerNode["props"]["children"],
    },
    key: null,
  }
}

export function linearGradient(
  stops: GradientStop[],
  angle = "180deg"
): string {
  const parts = stops.map(([offset, color]) => `${color} ${offset * 100}%`)

  return `linear-gradient(${angle}, ${parts.join(", ")})`
}
