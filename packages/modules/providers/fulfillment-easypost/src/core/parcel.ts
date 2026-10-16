import { CartPropsForFulfillment } from "@medusajs/types"

export type ParcelDimensions = {
  weight: number
  length: number
  width: number
  height: number
}

/**
 * Builds a single EasyPost-ratable parcel from a cart's real line items.
 *
 * This is a deliberately simple v1 packing heuristic -- the plan's non-goals
 * don't call for real bin-packing, and nothing downstream needs more
 * precision than "a parcel EasyPost will quote a rate for":
 *
 * - Weight: summed across every item, multiplied by that item's quantity.
 *   Weight genuinely adds up when multiple items travel in one parcel, so
 *   summing is the correct behavior (unlike dimensions, below).
 * - Dimensions (length/width/height): NOT summed. Summing unrelated items'
 *   dimensions would produce an absurd box for a multi-item order (e.g. two
 *   small boxes placed end to end is not "one box with their combined
 *   length"). Instead, this takes the dimensions of whichever single item
 *   has the largest volume (length * width * height) and uses that item's
 *   own length/width/height as the parcel's dimensions. This under-sizes
 *   the parcel for large multi-item orders, but is good enough to get a
 *   real, defensible rate quote from EasyPost for a v1.
 * - Fallback is per-field, not per-item: an item missing just one dimension
 *   (e.g. `height`) still uses its own real weight/length/width, falling
 *   back to the configured default only for the specific field that's
 *   missing. An item missing every field falls back to the full default
 *   parcel for that item's contribution.
 */
export function buildParcel(
  items: CartPropsForFulfillment["items"],
  defaults: ParcelDimensions
): ParcelDimensions {
  if (!items?.length) {
    return { ...defaults }
  }

  let totalWeight = 0
  let largestVolume = -1
  let largestDimensions: Omit<ParcelDimensions, "weight"> = {
    length: defaults.length,
    width: defaults.width,
    height: defaults.height,
  }

  for (const item of items ?? []) {
    const variant = item?.variant
    // `quantity` is typed as `BigNumberValue` (number | string | BigNumber),
    // not a plain number -- every real-world case (number, numeric string,
    // or a BigNumber-like object with `valueOf(): number`) converts
    // correctly via `Number()`.
    const quantity = item?.quantity != null ? Number(item.quantity) : 1

    const weight = variant?.weight ?? defaults.weight
    const length = variant?.length ?? defaults.length
    const width = variant?.width ?? defaults.width
    const height = variant?.height ?? defaults.height

    totalWeight += quantity * weight

    const volume = length * width * height
    if (volume > largestVolume) {
      largestVolume = volume
      largestDimensions = { length, width, height }
    }
  }

  return {
    weight: totalWeight,
    ...largestDimensions,
  }
}
