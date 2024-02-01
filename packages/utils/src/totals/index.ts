import {
  BigNumberRawValue,
  CartDTO,
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

interface GetItemTotalInput {
  id: string
  unit_price: BigNumber
  quantity: number
  is_tax_inclusive?: boolean
  tax_total?: BigNumber
  original_tax_total?: BigNumber
}

interface GetItemTotalOutput {
  quantity: number
  unit_price: BigNumber

  subtotal: BigNumber
  total: BigNumber
  original_total: BigNumber
  discount_total: BigNumber
  tax_total: BigNumber
  original_tax_total: BigNumber
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
): { [itemId: string]: GetItemTotalOutput } {
  const itemsTotals: { [itemId: string]: GetItemTotalOutput } = {}

  for (const item of items) {
    itemsTotals[item.id] = getTotalsForSingleLineItem(item, {
      includeTax: context.includeTax,
    })
  }

  return itemsTotals
}

function getTotalsForSingleLineItem(
  item: GetItemTotalInput,
  context: GetLineItemTotalsContext
) {
  const unitPrice = BigNumberJs(
    item.unit_price.raw?.value ?? item.unit_price.numeric
  )
  const subtotal = unitPrice.times(item.quantity)
  const taxTotal = BigNumberJs(
    item.tax_total?.raw?.value ?? item.tax_total?.numeric ?? 0
  )
  const originalTaxTotal = BigNumberJs(
    item.original_tax_total?.raw?.value ?? item.original_tax_total?.numeric ?? 0
  )

  const discountTotal = BigNumberJs(0)

  const total = subtotal.minus(discountTotal)

  const totals: GetItemTotalOutput = {
    quantity: item.quantity,
    unit_price: item.unit_price,

    subtotal: new BigNumber(subtotal),
    total: new BigNumber(total),
    original_total: new BigNumber(subtotal),
    discount_total: new BigNumber(discountTotal),
    tax_total: new BigNumber(taxTotal),
    original_tax_total: new BigNumber(originalTaxTotal),
  }

  const isTaxInclusive = context.includeTax ?? item.is_tax_inclusive

  if (isTaxInclusive) {
    const subtotal = unitPrice.times(totals.quantity).minus(originalTaxTotal)

    const subtotalBn = new BigNumber(subtotal)
    totals.subtotal = subtotalBn
    totals.total = subtotalBn
    totals.original_total = subtotalBn
  } else {
    const newTotal = total.plus(taxTotal)
    const originalTotal = subtotal.plus(originalTaxTotal)
    totals.total = new BigNumber(newTotal)
    totals.original_total = new BigNumber(originalTotal)
  }

  return totals
}

export function decorateCartTotals(
  {
    shippingMethods = [],
    items = [],
  }: {
    items: GetItemTotalInput[]
    shippingMethods: GetShippingMethodTotalInput[]
  },
  totalsConfig: { includeTaxes?: boolean } = {}
): CartDTO {
  let cart: any = {}

  const includeTax = totalsConfig?.includeTaxes

  const itemsTotals = getLineItemTotals(items, {
    includeTax,
  })

  const shippingMethodsTotals = getShippingMethodTotals(shippingMethods, {
    includeTax,
  })

  const subtotal = BigNumberJs(0)
  const discountTotal = BigNumberJs(0)
  const itemTaxTotal = BigNumberJs(0)
  const shippingTotal = BigNumberJs(0)
  const shippingTaxTotal = BigNumberJs(0)

  cart.items = items.map((item) => {
    const itemTotals = Object.assign(item, itemsTotals[item.id] ?? {})

    const subtotal = BigNumberJs(itemTotals.subtotal.raw!.value)
    const discountTotal = BigNumberJs(itemTotals.discount_total.raw!.value)
    const itemTaxTotal = BigNumberJs(itemTotals.tax_total.raw!.value)

    subtotal.plus(subtotal)
    discountTotal.plus(discountTotal)
    itemTaxTotal.plus(itemTaxTotal)

    return itemTotals
  })

  // cart.shipping_methods = (cart.shipping_methods || []).map(
  //   (shippingMethod) => {
  //     const methodWithTotals = Object.assign(
  //       shippingMethod,
  //       shippingMethodsTotals[shippingMethod.id] ?? {}
  //     )

  //     shippingTotal.plus(methodWithTotals.raw_total)
  //     shippingTaxTotal.plus(methodWithTotals.raw_tax_total)

  //     return methodWithTotals
  //   }
  // )

  const taxTotal = itemTaxTotal.plus(shippingTaxTotal)

  // TODO: Discount + Gift Card calculations

  // TODO: subtract (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total)
  const total = subtotal.plus(shippingTotal).plus(shippingTotal).plus(taxTotal)

  cart.total = new BigNumber(total)
  cart.subtotal = new BigNumber(subtotal)
  cart.discount_total = new BigNumber(discountTotal)
  cart.item_tax_total = new BigNumber(itemTaxTotal)
  cart.shipping_total = new BigNumber(shippingTotal)
  cart.shipping_tax_total = new BigNumber(shippingTaxTotal)
  cart.tax_total = new BigNumber(taxTotal)

  // cart.discount_total = Math.round(cart.discount_total)
  // cart.gift_card_total = giftCardTotal.total || 0
  // cart.gift_card_tax_total = giftCardTotal.tax_total || 0

  return cart as CartDTO
}
