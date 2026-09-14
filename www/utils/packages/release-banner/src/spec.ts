import type { BaseSpec, DeepPartial } from "./types.js"

function isSection(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Merges overrides into a default spec, section by section.
 *
 * Specs are one or two levels deep — a canvas, and a section per part of the
 * design — so overriding `content.fontSize` has to leave the rest of `content`
 * alone. Arrays are replaced rather than merged; see {@link DeepPartial}.
 */
export function mergeSpec<T extends object>(
  base: T,
  overrides: DeepPartial<T> = {}
): T {
  const merged = { ...base } as Record<string, unknown>

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      continue
    }

    const current = merged[key]

    merged[key] =
      isSection(current) && isSection(value) ? mergeSpec(current, value) : value
  }

  return merged as T
}

/**
 * Builds a scaler that maps values measured at a design's reference resolution
 * onto whatever width the spec is being rendered at.
 *
 * Every distance in a spec is authored at its reference width, so overriding
 * `width` scales the whole design instead of leaving it stranded at one size.
 */
export function scaler(
  spec: BaseSpec,
  reference: BaseSpec
): (value: number) => number {
  const scale = spec.width / reference.width

  return (value: number): number => value * scale
}
