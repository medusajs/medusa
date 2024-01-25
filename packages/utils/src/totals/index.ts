import { BigNumber } from "./bignum"

type CalculateLineItemInput = {
  id: string
  unit_price: number
  raw_unit_price: Record<string, any>
  quantity: number
  tax_lines: any[]
  adjustments: any[]
  is_tax_inclusive: boolean
}

type LineItemTotals = {
  unit_price: number
  raw_unit_price: BigNumber

  subtotal: number
  raw_subtotal: BigNumber

  total: number
  raw_total: BigNumber
  original_total: number
  raw_original_total: BigNumber

  tax_total?: number
  raw_tax_total?: BigNumber
  original_tax_total?: number
  raw_original_tax_total?: BigNumber

  quantity: number

  discount_total: number
  raw_discount_total?: string | BigNumber
  tax_lines: any[] // TODO: Define type
}

type GetLineItemTotalsContext = {
  includeTax?: boolean
  taxRate?: number | null
}

type GetLineItemTotalsResult = {
  [lineItemId: string]: LineItemTotals
}

/**
 * Calculate and return the totals for an item
 * @param item
 * @param param1
 * @returns
 */
export function getLineItemTotals(
  items: CalculateLineItemInput | CalculateLineItemInput[],
  context: GetLineItemTotalsContext
): GetLineItemTotalsResult {
  items = Array.isArray(items) ? items : [items]

  // TODO: Account for tax lines

  const itemsTotals: GetLineItemTotalsResult = {}

  for (const item of items) {
    itemsTotals[item.id] = getLineItemTotals_(item, {
      taxRate: context.taxRate,
      includeTax: context.includeTax,
    })
  }

  return itemsTotals
}

// function getRawAdjustmentTotal(item: CalculateLineItemInput) {
//   return BigNumber(0)
// }

// function getRawTaxTotal() {
//   return BigNumber(0)
// }

function getLineItemTotals_(
  item: CalculateLineItemInput,
  context: GetLineItemTotalsContext
): LineItemTotals {
  // const rawDiscountTotal = getRawAdjustmentTotal(item)
  const rawUnitPrice = item.raw_unit_price as any

  const discountTotal = 0

  const rawSubtotal = rawUnitPrice.multipliedBy(item.quantity)
  const rawTotal = rawSubtotal

  const totals: LineItemTotals = {
    unit_price: item.unit_price,
    raw_unit_price: rawUnitPrice,

    subtotal: rawSubtotal.toNumber(),
    raw_subtotal: rawSubtotal,

    total: rawTotal.toNumber(),
    original_total: rawSubtotal.toNumber(),
    raw_original_total: rawSubtotal,
    raw_total: rawTotal,

    discount_total: discountTotal,
    // raw_discount_total: rawDiscountTotal,

    tax_lines: item.tax_lines ?? [],

    quantity: item.quantity,
  }

  if (totals.tax_lines?.length > 0) {
    // TODO: Account for tax lines
    // - Calculate tax total
    // - Calculate original tax total
    // - Re-calculate original total
    // - Re-calculate total
    // - Re-calculate subtotal

    const isTaxInclusive = context.includeTax ?? item.is_tax_inclusive

    const rawTaxTotal = 0

    // totals.tax_total = rawTaxTotal.toNumber()
    // totals.raw_tax_total = rawTaxTotal

    // totals.original_tax_total = rawTaxTotal.toNumber() // TODO: Should exclude discounts
    // totals.raw_original_tax_total = rawTaxTotal // TODO: Should exclude discounts

    if (isTaxInclusive) {
      // TODO: Account for tax inclusivity
    }
  }

  return totals
}

// export function decorateTotals(
//   cart: CartDTO & { raw_total: BigNumber },
//   totalsConfig: { includeTaxes?: boolean } = {}
// ): CartDTO {
//   const includeTax = totalsConfig?.includeTaxes
//   const cartItems = [...(cart.items ?? [])]
//   const cartShippingMethods = [...(cart.shipping_methods ?? [])]

//   if (includeTax) {
//     // TODO: Account for tax lines
//     // - get tax lines for line items
//     // - get tax lines for shipping methods
//   }

//   const itemsTotals = getLineItemTotals(
//     cartItems as unknown as CalculateLineItemInput[],
//     {
//       includeTax,
//     }
//   )

//   // TODO: Account for shipping methods
//   // - get shipping method toals (similar to line items)

//   const rawSubtotal = BigNumber(0)
//   const rawDiscountTotal = BigNumber(0)
//   const rawItemTaxTotal = BigNumber(0)
//   const rawShippingTotal = BigNumber(0)
//   const rawShippingTaxTotal = BigNumber(0)

//   cart.items = (cart.items || []).map((item) => {
//     const itemWithTotals = Object.assign(item, itemsTotals[item.id] ?? {})

//     rawSubtotal.plus(itemWithTotals.raw_subtotal)
//     rawDiscountTotal.plus(itemWithTotals.raw_discount_total)

//     if (itemWithTotals.raw_tax_total) {
//       rawItemTaxTotal.plus(itemWithTotals.raw_tax_total)
//     }

//     return itemWithTotals
//   })

//   // TODO: Do the same exercise with shipping method totals

//   cart.subtotal = rawSubtotal.toNumber()
//   cart.discount_total = rawDiscountTotal.toNumber()
//   cart.item_tax_total = rawItemTaxTotal.toNumber()
//   cart.shipping_total = 0
//   cart.shipping_tax_total = 0

//   cart.tax_total = rawItemTaxTotal.plus(rawShippingTaxTotal).toNumber()
//   // cart.raw_tax_total = rawItemTaxTotal.plus(rawShippingTaxTotal)

//   cart.raw_discount_total = rawDiscountTotal
//   cart.discount_total = rawDiscountTotal.toNumber()

//   // TODO: Calculate gift card totals

//   const rawGiftCardTotal = BigNumber(0)
//   const rawGiftCardTaxTotal = BigNumber(0)

//   const toSubtract = rawGiftCardTotal
//     .plus(rawDiscountTotal)
//     .plus(rawGiftCardTotal)
//   const total = rawSubtotal.plus(rawShippingTotal).plus(rawItemTaxTotal)

//   cart.total = total.minus(toSubtract).toNumber()
//   cart.raw_total = total.minus(toSubtract)

//   return cart as CartDTO
// }
