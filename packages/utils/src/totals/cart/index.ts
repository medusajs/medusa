import { BigNumberInput, CartLikeWithTotals } from "@medusajs/types"
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

export interface DecorateCartLikeInputDTO {
  items?: {
    id?: string
    unit_price: BigNumberInput
    quantity: BigNumberInput
    adjustments?: { amount: BigNumberInput }[]
    tax_lines?: {
      rate: BigNumberInput
      is_tax_inclusive?: boolean
    }[]
  }[]
  shipping_methods?: {
    id?: string
    amount: BigNumberInput
    adjustments?: { amount: BigNumberInput }[]
    tax_lines?: {
      rate: BigNumberInput
      is_tax_inclusive?: boolean
    }[]
  }[]
  region?: {
    automatic_taxes?: boolean
  }
}

export function decorateCartTotals(
  cartLike: DecorateCartLikeInputDTO,
  config: TotalsConfig = {}
): CartLikeWithTotals {
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
  let discountTaxTotal = MathBN.convert(0)

  let itemsSubtotal = MathBN.convert(0)
  let itemsTotal = MathBN.convert(0)

  let itemsOriginalTotal = MathBN.convert(0)
  let itemsOriginalSubtotal = MathBN.convert(0)

  let itemsTaxTotal = MathBN.convert(0)

  let itemsOriginalTaxTotal = MathBN.convert(0)

  let shippingSubtotal = MathBN.convert(0)
  let shippingTotal = MathBN.convert(0)

  let shippingOriginalTotal = MathBN.convert(0)
  let shippingOriginalSubtotal = MathBN.convert(0)

  let shippingTaxTotal = MathBN.convert(0)
  let shippingTaxSubTotal = MathBN.convert(0)

  let shippingOriginalTaxTotal = MathBN.convert(0)
  let shippingOriginalTaxSubtotal = MathBN.convert(0)

  const cartItems = items.map((item, index) => {
    const itemTotals = Object.assign(item, itemsTotals[item.id ?? index] ?? {})

    const itemSubtotal = itemTotals.subtotal

    const itemTotal = MathBN.convert(itemTotals.total)
    const itemOriginalTotal = MathBN.convert(itemTotals.original_total)

    const itemTaxTotal = MathBN.convert(itemTotals.tax_total)
    const itemOriginalTaxTotal = MathBN.convert(itemTotals.original_tax_total)

    const itemDiscountTotal = MathBN.convert(itemTotals.discount_total)

    const itemDiscountTaxTotal = MathBN.convert(itemTotals.discount_tax_total)

    subtotal = MathBN.add(subtotal, itemSubtotal)

    discountTotal = MathBN.add(discountTotal, itemDiscountTotal)
    discountTaxTotal = MathBN.add(discountTaxTotal, itemDiscountTaxTotal)

    itemsTotal = MathBN.add(itemsTotal, itemTotal)
    itemsOriginalTotal = MathBN.add(itemsOriginalTotal, itemOriginalTotal)
    itemsOriginalSubtotal = MathBN.add(itemsOriginalSubtotal, itemSubtotal)

    itemsSubtotal = MathBN.add(itemsSubtotal, itemSubtotal)

    itemsTaxTotal = MathBN.add(itemsTaxTotal, itemTaxTotal)

    itemsOriginalTaxTotal = MathBN.add(
      itemsOriginalTaxTotal,
      itemOriginalTaxTotal
    )

    return itemTotals
  })

  const cartShippingMethods = shippingMethods.map((shippingMethod, index) => {
    const methodTotals = Object.assign(
      shippingMethod,
      shippingMethodsTotals[shippingMethod.id ?? index] ?? {}
    )

    const methodSubtotal = MathBN.convert(methodTotals.subtotal)

    const methodTotal = MathBN.convert(methodTotals.total)
    const methodOriginalTotal = MathBN.convert(methodTotals.original_total)
    const methodTaxTotal = MathBN.convert(methodTotals.tax_total)
    const methodOriginalTaxTotal = MathBN.convert(
      methodTotals.original_tax_total
    )

    const methodDiscountTotal = MathBN.convert(methodTotals.discount_total)
    const methodDiscountTaxTotal = MathBN.convert(
      methodTotals.discount_tax_total
    )

    shippingSubtotal = MathBN.add(shippingSubtotal, methodSubtotal)
    shippingTotal = MathBN.add(shippingTotal, methodTotal)
    shippingOriginalTotal = MathBN.add(
      shippingOriginalTotal,
      methodOriginalTotal
    )
    shippingOriginalSubtotal = MathBN.add(
      shippingOriginalSubtotal,
      methodSubtotal
    )

    shippingTaxTotal = MathBN.add(shippingTaxTotal, methodTaxTotal)
    shippingOriginalTaxTotal = MathBN.add(
      shippingOriginalTaxTotal,
      methodOriginalTaxTotal
    )
    shippingOriginalTaxSubtotal = MathBN.add(
      shippingOriginalTaxSubtotal,
      methodSubtotal
    )

    discountTotal = MathBN.add(discountTotal, methodDiscountTotal)
    discountTaxTotal = MathBN.add(discountTaxTotal, methodDiscountTaxTotal)

    return methodTotals
  })

  const taxTotal = MathBN.add(itemsTaxTotal, shippingTaxTotal)

  const originalTaxTotal = MathBN.add(
    itemsOriginalTaxTotal,
    shippingOriginalTaxTotal
  )

  // TODO: Gift Card calculations

  const originalTempTotal = MathBN.add(
    subtotal,
    shippingOriginalTotal,
    originalTaxTotal
  )
  const originalTotal = MathBN.sub(originalTempTotal, discountTotal)
  // TODO: subtract (cart.gift_card_total + cart.gift_card_tax_total)
  const tempTotal = MathBN.add(subtotal, shippingTotal, taxTotal)
  const total = MathBN.sub(tempTotal, discountTotal)

  const cart = cartLike as any

  cart.total = new BigNumber(total)
  cart.subtotal = new BigNumber(subtotal)
  cart.tax_total = new BigNumber(taxTotal)

  cart.discount_total = new BigNumber(discountTotal)
  cart.discount_tax_total = new BigNumber(discountTaxTotal)

  // cart.gift_card_total = giftCardTotal.total || 0
  // cart.gift_card_tax_total = giftCardTotal.tax_total || 0

  cart.original_total = new BigNumber(originalTotal)
  cart.original_tax_total = new BigNumber(originalTaxTotal)

  // cart.original_gift_card_total =
  // cart.original_gift_card_tax_total =

  if (cartLike.items) {
    cart.items = cartItems
    cart.item_total = new BigNumber(itemsTotal)
    cart.item_subtotal = new BigNumber(itemsSubtotal)
    cart.item_tax_total = new BigNumber(itemsTaxTotal)

    cart.original_item_total = new BigNumber(itemsOriginalTotal)
    cart.original_item_subtotal = new BigNumber(itemsOriginalSubtotal)
    cart.original_item_tax_total = new BigNumber(itemsOriginalTaxTotal)
  }

  if (cart.shipping_methods) {
    cart.shipping_methods = cartShippingMethods
    cart.shipping_total = new BigNumber(shippingTotal)
    cart.shipping_subtotal = new BigNumber(shippingSubtotal)
    cart.shipping_tax_total = new BigNumber(shippingTaxTotal)

    cart.original_shipping_tax_total = new BigNumber(shippingOriginalTaxTotal)
    cart.original_shipping_tax_subtotal = new BigNumber(
      shippingOriginalTaxSubtotal
    )
    cart.original_shipping_total = new BigNumber(shippingOriginalTotal)
  }

  return cart
}
