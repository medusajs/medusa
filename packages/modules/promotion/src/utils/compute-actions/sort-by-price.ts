import { MathBN } from "@medusajs/framework/utils"
import {
    ComputeActionItemLine,
    ComputeActionShippingLine,
} from "@medusajs/types"

export function sortLineItemByPriceAscending(
  a: ComputeActionItemLine,
  b: ComputeActionItemLine
) {
  const priceA = MathBN.div(a.subtotal, a.quantity)
  const priceB = MathBN.div(b.subtotal, b.quantity)

  // Returning a non-zero value for equal prices makes this an inconsistent
  // comparator, which leaves the order of equally priced lines up to the
  // sort implementation rather than keeping it stable.
  if (MathBN.eq(priceA, priceB)) {
    return 0
  }

  return MathBN.lt(priceA, priceB) ? -1 : 1
}

export function sortShippingLineByPriceAscending(
  a: ComputeActionShippingLine,
  b: ComputeActionShippingLine
) {
  const priceA = a.subtotal ?? 0
  const priceB = b.subtotal ?? 0

  if (MathBN.eq(priceA, priceB)) {
    return 0
  }

  return MathBN.lt(priceA, priceB) ? -1 : 1
}
