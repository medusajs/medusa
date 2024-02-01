import {
  BigNumberRawValue,
  CartDTO,
  CartLineItemDTO,
  CartShippingMethodDTO,
} from "@medusajs/types"
import { BigNumber as BigNumberJs } from "bignumber.js"
import { BigNumber } from "./big-number"

type GetLineItemTotalsContext = {
  includeTax?: boolean
  taxRate?: number | null
}

interface GetShippingMethodTotalInput extends CartShippingMethodDTO {
  raw_amount: BigNumberRawValue
}

interface GetItemTotalInput extends CartLineItemDTO {
  raw_unit_price: BigNumberRawValue
}

interface GetItemTotalOutput {
  quantity: number

  unit_price: number
  raw_unit_price?: BigNumberRawValue

  subtotal: number
  raw_subtotal?: BigNumberRawValue

  total: number
  raw_total?: BigNumberRawValue

  original_total: number
  raw_original_total?: BigNumberRawValue

  discount_total: number
  raw_discount_total?: BigNumberRawValue

  tax_total: number
  raw_tax_total?: BigNumberRawValue

  original_tax_total: number
  raw_original_tax_total?: BigNumberRawValue
}

export function getShippingMethodTotals(
  shippingMethods: GetShippingMethodTotalInput[],
  context: { includeTax?: boolean }
) {
  const { includeTax } = context

  const shippingMethodsTotals = {}

  for (const shippingMethod of shippingMethods) {
    shippingMethodsTotals[shippingMethod.id] = getShippingMethodTotals_(
      shippingMethod,
      {
        includeTax,
      }
    )
  }

  return shippingMethodsTotals
}

export function getShippingMethodTotals_(
  shippingMethod: GetShippingMethodTotalInput,
  context: { includeTax?: boolean }
) {
  const shippingMethodPrice = BigNumberJs(shippingMethod.raw_amount.value)
  const taxTotal = BigNumberJs(shippingMethod.tax_total ?? 0)
  const originalTaxTotal = BigNumberJs(shippingMethod.original_tax_total ?? 0)

  const totals = {
    amount: shippingMethodPrice.toNumber(),
    raw_amount: new BigNumber(shippingMethodPrice).raw,

    total: shippingMethodPrice.toNumber(),
    raw_total: new BigNumber(shippingMethodPrice),

    original_total: shippingMethodPrice.toNumber(),
    raw_original_total: new BigNumber(shippingMethodPrice),

    subtotal: shippingMethodPrice.toNumber(),
    raw_subtotal: new BigNumber(shippingMethodPrice),

    tax_total: taxTotal.toNumber(),
    raw_tax_total: new BigNumber(taxTotal),

    original_tax_total: originalTaxTotal.toNumber(),
    raw_original_tax_total: new BigNumber(originalTaxTotal),
  }

  const isTaxInclusive = context.includeTax ?? shippingMethod.is_tax_inclusive

  if (isTaxInclusive) {
    const subtotal = BigNumberJs(shippingMethod.subtotal).minus(taxTotal)
    totals.subtotal = subtotal.toNumber()
    totals.raw_subtotal = new BigNumber(subtotal)
  } else {
    const originalTotal = BigNumberJs(shippingMethod.original_subtotal).plus(
      totals.original_tax_total
    )
    const total = BigNumberJs(shippingMethod.total).plus(totals.tax_total)

    totals.original_total = originalTotal.toNumber()
    totals.raw_original_total = new BigNumber(originalTotal)

    totals.total = total.toNumber()
    totals.raw_total = new BigNumber(total)
  }

  return totals
}

export function getLineItemTotals(
  items: GetItemTotalInput[],
  context: GetLineItemTotalsContext
) {
  const itemsTotals = {}

  for (const item of items) {
    itemsTotals[item.id] = getTotalsForSingleLineItem(item, {
      includeTax: context.includeTax,
    })
  }

  return itemsTotals
}

function adjustLineItemTotalForTaxInclusive(totals: GetItemTotalInput) {
  const unitPrice = BigNumberJs(totals.raw_unit_price.value)
  const originalTaxTotal = BigNumberJs(
    totals.original_tax_total.value ?? original_tax_total.numeric
  )
  const subtotal = unitPrice.times(quantity).minus(originalTaxTotal)

  totals.subtotal = subtotal.toNumber()
  totals.raw_subtotal = new BigNumber(subtotal)

  totals.total = subtotal.toNumber()
  totals.raw_total = new BigNumber(subtotal)

  totals.original_total = subtotal.toNumber()
  totals.raw_original_total = new BigNumber(subtotal)

  return totals
}

function getTotalsForSingleLineItem(
  item: GetItemTotalInput,
  context: GetLineItemTotalsContext
) {
  const unitPrice = BigNumberJs(item.raw_unit_price.value)
  const subtotal = unitPrice.times(item.quantity)
  const taxTotal = BigNumberJs(item.tax_total ?? 0)
  const originalTaxTotal = BigNumberJs(item.original_tax_total ?? 0)

  const discountTotal = BigNumberJs(0)

  const total = subtotal.minus(discountTotal)

  const totals: GetItemTotalOutput = {
    quantity: item.quantity,

    unit_price: unitPrice.toNumber(),
    raw_unit_price: new BigNumber(unitPrice).raw,

    subtotal: subtotal.toNumber(),
    raw_subtotal: new BigNumber(subtotal).raw,

    total: total.toNumber(),
    raw_total: new BigNumber(total).raw,

    original_total: subtotal.toNumber(),
    raw_original_total: new BigNumber(subtotal).raw,

    discount_total: discountTotal.toNumber(),
    raw_discount_total: new BigNumber(discountTotal).raw,

    tax_total: taxTotal.toNumber(),
    raw_tax_total: new BigNumber(taxTotal).raw,

    original_tax_total: originalTaxTotal.toNumber(),
    raw_original_tax_total: new BigNumber(originalTaxTotal).raw,
  }

  const isTaxInclusive = context.includeTax ?? item.is_tax_inclusive

  if (isTaxInclusive) {
    adjustLineItemTotalForTaxInclusive(totals)
  } else {
    const newTotal = total.plus(taxTotal)
    const originalTotal = subtotal.plus(totals.original_tax_total)

    totals.total = newTotal.toNumber()
    totals.raw_total = new BigNumber(newTotal)

    totals.original_total = originalTotal.toNumber()
    totals.raw_original_total = new BigNumber(originalTotal)
  }

  return totals
}

export function decorateCartTotals(
  cart: CartDTO,
  totalsConfig: { includeTaxes?: boolean } = {}
): CartDTO {
  const includeTax = totalsConfig?.includeTaxes
  const cartItems = [...(cart.items ?? [])]
  const cartShippingMethods = [...(cart.shipping_methods ?? [])]

  const itemsTotals = getLineItemTotals(cartItems as GetItemTotalInput[], {
    includeTax,
  })

  const shippingMethodsTotals = getShippingMethodTotals(
    cartShippingMethods as GetShippingMethodTotalInput[],
    {
      includeTax,
    }
  )

  const subtotal = BigNumberJs(0)
  const discountTotal = BigNumberJs(0)
  const itemTaxTotal = BigNumberJs(0)
  const shippingTotal = BigNumberJs(0)
  const shippingTaxTotal = BigNumberJs(0)

  cart.items = (cart.items || []).map((item) => {
    const itemWithTotals = Object.assign(item, itemsTotals[item.id] ?? {})

    subtotal.plus(itemWithTotals.raw_subtotal)
    discountTotal.plus(itemWithTotals.raw_discount_total)
    itemTaxTotal.plus(itemWithTotals.tax_total)

    return itemWithTotals
  })

  cart.shipping_methods = (cart.shipping_methods || []).map(
    (shippingMethod) => {
      const methodWithTotals = Object.assign(
        shippingMethod,
        shippingMethodsTotals[shippingMethod.id] ?? {}
      )

      shippingTotal.plus(methodWithTotals.raw_total)
      shippingTaxTotal.plus(methodWithTotals.raw_tax_total)

      return methodWithTotals
    }
  )

  const taxTotal = itemTaxTotal.plus(shippingTaxTotal)

  // TODO: Discount + Gift Card calculations

  // TODO: subtract (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total)
  const total = subtotal.plus(shippingTotal).plus(shippingTotal).plus(taxTotal)

  cart.total = total.toNumber()
  cart.subtotal = subtotal.toNumber()
  cart.discount_total = discountTotal.toNumber()
  cart.item_tax_total = itemTaxTotal.toNumber()
  cart.shipping_total = shippingTotal.toNumber()
  cart.shipping_tax_total = shippingTaxTotal.toNumber()
  cart.tax_total = taxTotal.toNumber()

  // cart.discount_total = Math.round(cart.discount_total)
  // cart.gift_card_total = giftCardTotal.total || 0
  // cart.gift_card_tax_total = giftCardTotal.tax_total || 0

  return cart as CartDTO
}
