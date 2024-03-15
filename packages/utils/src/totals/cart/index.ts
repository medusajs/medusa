import {
  CartDTO,
  CartLineItemDTO,
  CartShippingMethodDTO,
  RegionDTO,
} from "@medusajs/types"
import { BigNumber } from "../big-number"
import { GetItemTotalInput, getLineItemsTotals } from "../line-item"
import { MathBN } from "../math"
import {
  GetShippingMethodTotalInput,
  getShippingMethodsTotals,
} from "../shipping-method"
import { transformPropertiesToBigNumber } from "../transform-properties-to-bignumber"

interface TotalsConfig {
  includeTaxes?: boolean
}

export interface DecorateCartTotalsInputDTO {
  items?: CartLineItemDTO[]
  shipping_methods?: CartShippingMethodDTO[]
  region?: RegionDTO
}

export function decorateCartTotals(
  cartLike: DecorateCartTotalsInputDTO,
  config: TotalsConfig = {}
): CartDTO {
  transformPropertiesToBigNumber(cartLike)

  const items = (cartLike.items ?? []) as unknown as GetItemTotalInput[]
  const shippingMethods = (cartLike.shipping_methods ??
    []) as unknown as GetShippingMethodTotalInput[]

  const includeTax = config?.includeTaxes || cartLike.region?.automatic_taxes

  const itemsTotals = getLineItemsTotals(items, {
    includeTax,
  })

  const shippingMethodsTotals = getShippingMethodsTotals(shippingMethods, {
    includeTax,
  })

  let subtotal = MathBN.convert(0)
  let discountTotal = MathBN.convert(0)
  let itemsTotal = MathBN.convert(0)
  let itemsTaxTotal = MathBN.convert(0)
  let shippingTotal = MathBN.convert(0)
  let shippingTaxTotal = MathBN.convert(0)

  const cartItems = items.map((item) => {
    const itemTotals = Object.assign(item, itemsTotals[item.id] ?? {})

    const itemTotal = MathBN.convert(itemTotals.total)
    const itemSubtotal = MathBN.convert(itemTotals.subtotal)
    const itemDiscountTotal = MathBN.convert(itemTotals.discount_total)
    const itemTaxTotal = MathBN.convert(itemTotals.tax_total)

    subtotal = MathBN.add(subtotal, itemSubtotal)
    discountTotal = MathBN.add(discountTotal, itemDiscountTotal)
    itemsTotal = MathBN.add(itemsTotal, itemTotal)
    itemsTaxTotal = MathBN.add(itemsTaxTotal, itemTaxTotal)

    return itemTotals
  })

  const cartShippingMethods = shippingMethods.map((shippingMethod) => {
    const methodTotals = Object.assign(
      shippingMethod,
      shippingMethodsTotals[shippingMethod.id] ?? {}
    )

    const total = MathBN.convert(methodTotals.total)
    const methodTaxTotal = MathBN.convert(methodTotals.tax_total)
    const methodDiscountTotal = MathBN.convert(methodTotals.discount_total)

    shippingTotal = MathBN.add(shippingTotal, total)
    discountTotal = MathBN.add(discountTotal, methodDiscountTotal)
    shippingTaxTotal = MathBN.add(shippingTaxTotal, methodTaxTotal)

    return methodTotals
  })

  const taxTotal = MathBN.add(itemsTaxTotal, shippingTaxTotal)

  // TODO: Gift Card calculations

  const tempTotal = MathBN.add(subtotal, shippingTotal, taxTotal)
  // TODO: subtract (cart.gift_card_total + cart.gift_card_tax_total)
  const total = MathBN.sub(tempTotal, discountTotal)

  const cart = { ...cartLike } as unknown as CartDTO

  cart.items = cartItems
  cart.shipping_methods = cartShippingMethods

  cart.total = new BigNumber(total) as unknown as number
  cart.subtotal = new BigNumber(subtotal) as unknown as number
  cart.discount_total = new BigNumber(discountTotal) as unknown as number
  cart.item_total = new BigNumber(itemsTotal) as unknown as number
  cart.item_tax_total = new BigNumber(itemsTaxTotal) as unknown as number
  cart.shipping_total = new BigNumber(shippingTotal) as unknown as number
  cart.shipping_tax_total = new BigNumber(shippingTaxTotal) as unknown as number
  cart.tax_total = new BigNumber(taxTotal) as unknown as number

  // cart.gift_card_total = giftCardTotal.total || 0
  // cart.gift_card_tax_total = giftCardTotal.tax_total || 0

  return cart as CartDTO
}
