import { CartDTO } from "@medusajs/types"
import { BigNumber } from "../big-number"
import { getLineItemsTotals } from "../line-item"
import { MathBN } from "../math"
import { getShippingMethodsTotals } from "../shipping-method"
import { transformPropertiesToBigNumber } from "../transform-properties-to-bignumber"

interface TotalsConfig {
  includeTaxes?: boolean
}

export interface DecorateCartTotalsInputDTO {
  items?: any[]
  shipping_methods?: any[]
}

export function decorateCartTotals(
  cartLike: DecorateCartTotalsInputDTO,
  config: TotalsConfig = {}
): CartDTO {
  transformPropertiesToBigNumber(cartLike)

  const includeTax = config?.includeTaxes

  const cartItems = cartLike.items ?? []
  const cartShippingMethods = cartLike.shipping_methods ?? []

  const itemsTotals = getLineItemsTotals(cartItems, {
    includeTax,
  })

  const shippingMethodsTotals = getShippingMethodsTotals(cartShippingMethods, {
    includeTax,
  })

  let subtotal = MathBN.convert(0)
  let discountTotal = MathBN.convert(0)
  let itemsTaxTotal = MathBN.convert(0)
  let shippingTotal = MathBN.convert(0)
  let shippingTaxTotal = MathBN.convert(0)

  cartLike.items = cartItems.map((item) => {
    const itemTotals = Object.assign(item, itemsTotals[item.id] ?? {})

    const itemSubtotal = MathBN.convert(itemTotals.subtotal)
    const itemDiscountTotal = MathBN.convert(itemTotals.discount_total)
    const itemTaxTotal = MathBN.convert(itemTotals.tax_total)

    subtotal = MathBN.add(subtotal, itemSubtotal)
    discountTotal = MathBN.add(discountTotal, itemDiscountTotal)
    itemsTaxTotal = MathBN.add(itemsTaxTotal, itemTaxTotal)

    return itemTotals
  })

  cartLike.shipping_methods = cartShippingMethods.map((shippingMethod) => {
    const methodTotals = Object.assign(
      shippingMethod,
      shippingMethodsTotals[shippingMethod.id] ?? {}
    )

    const total = MathBN.convert(methodTotals.total)
    const methodTaxTotal = MathBN.convert(methodTotals.tax_total)

    shippingTotal = MathBN.add(shippingTotal, total)
    shippingTaxTotal = MathBN.add(shippingTaxTotal, methodTaxTotal)

    return methodTotals
  })

  const taxTotal = MathBN.add(itemsTaxTotal, shippingTaxTotal)

  // TODO: Discount + Gift Card calculations

  // TODO: subtract (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total)
  const total = subtotal.plus(shippingTotal).plus(shippingTotal).plus(taxTotal)

  const cart = { ...cartLike } as CartDTO

  cart.total = new BigNumber(total).numeric
  cart.subtotal = new BigNumber(subtotal).numeric
  cart.discount_total = new BigNumber(discountTotal).numeric
  cart.item_tax_total = new BigNumber(itemsTaxTotal).numeric
  cart.shipping_total = new BigNumber(shippingTotal).numeric
  cart.shipping_tax_total = new BigNumber(shippingTaxTotal).numeric
  cart.tax_total = new BigNumber(taxTotal).numeric

  // cart.discount_total = Math.round(cart.discount_total)
  // cart.gift_card_total = giftCardTotal.total || 0
  // cart.gift_card_tax_total = giftCardTotal.tax_total || 0

  return cartLike as CartDTO
}
