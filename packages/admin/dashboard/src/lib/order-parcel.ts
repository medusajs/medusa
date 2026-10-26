import type { HttpTypes } from "@medusajs/types"

export type OrderParcel = {
  weight: number | null
  length: number | null
  width: number | null
  height: number | null
}

type ParcelItem = Pick<
  HttpTypes.AdminOrderLineItem,
  "quantity" | "detail" | "variant"
>

type ParcelDimensions = Pick<OrderParcel, "length" | "width" | "height">

/**
 * Computes a single shipping parcel for the unfulfilled portion of an order.
 *
 * - `weight` is the sum of `variant.weight * remaining quantity` across
 *   unfulfilled items. It is `null` when no unfulfilled item has a weight.
 * - `length`, `width` and `height` come from the unfulfilled item with the
 *   largest volume among items that have all three dimensions set. When no
 *   such item exists, each dimension falls back to the first unfulfilled
 *   item that has it. A dimension is `null` only when no unfulfilled item
 *   has a value for it.
 */
export function computeOrderParcel(items: ParcelItem[]): OrderParcel {
  const unfulfilled = items
    .map((item) => ({
      item,
      remaining: item.quantity - item.detail.fulfilled_quantity,
    }))
    .filter(({ remaining }) => remaining > 0)

  let weight: number | null = null
  for (const { item, remaining } of unfulfilled) {
    const itemWeight = item.variant?.weight
    if (itemWeight === null || itemWeight === undefined) {
      continue
    }
    weight = (weight ?? 0) + itemWeight * remaining
  }

  return {
    weight,
    ...computeDimensions(unfulfilled.map(({ item }) => item.variant)),
  }
}

function computeDimensions(
  variants: (ParcelItem["variant"] | undefined)[]
): ParcelDimensions {
  let largest: ParcelDimensions | null = null
  let largestVolume = -Infinity

  for (const variant of variants) {
    const length = variant?.length
    const width = variant?.width
    const height = variant?.height

    if (
      length === null ||
      length === undefined ||
      width === null ||
      width === undefined ||
      height === null ||
      height === undefined
    ) {
      continue
    }

    const volume = length * width * height
    if (volume > largestVolume) {
      largestVolume = volume
      largest = { length, width, height }
    }
  }

  if (largest) {
    return largest
  }

  return {
    length: firstDefined(variants, (v) => v?.length),
    width: firstDefined(variants, (v) => v?.width),
    height: firstDefined(variants, (v) => v?.height),
  }
}

function firstDefined(
  variants: (ParcelItem["variant"] | undefined)[],
  pick: (
    variant: ParcelItem["variant"] | undefined
  ) => number | null | undefined
): number | null {
  for (const variant of variants) {
    const value = pick(variant)
    if (value !== null && value !== undefined) {
      return value
    }
  }
  return null
}
