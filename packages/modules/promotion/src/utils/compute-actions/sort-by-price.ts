import { MathBN } from "@zjedene-medusa/framework/utils"
import {
    ComputeActionItemLine,
    ComputeActionShippingLine,
} from "@zjedene-medusa/types"

export function sortLineItemByPriceAscending(
  a: ComputeActionItemLine,
  b: ComputeActionItemLine
) {
  const priceA = MathBN.div(a.subtotal, a.quantity)
  const priceB = MathBN.div(b.subtotal, b.quantity)
  return MathBN.lt(priceA, priceB) ? -1 : 1
}

export function sortShippingLineByPriceAscending(
  a: ComputeActionShippingLine,
  b: ComputeActionShippingLine
) {
  const priceA = a.subtotal ?? 0
  const priceB = b.subtotal ?? 0
  return MathBN.lt(priceA, priceB) ? -1 : 1
}
