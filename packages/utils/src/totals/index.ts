import { CartDTO } from "@medusajs/types"

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
  quantity: number
  subtotal: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  tax_lines: any[] // TODO: Define type
  discount_total: number

  raw_discount_total: number
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

function getAdjustmentTotals(item: CalculateLineItemInput) {
  return item.adjustments.reduce((acc, next) => {
    return acc + next.amount
  }, 0)
}

function getLineItemTotals_(
  item: CalculateLineItemInput,
  context: GetLineItemTotalsContext
): LineItemTotals {
  let subtotal = item.unit_price * item.quantity

  const isTaxInclusive = context.includeTax ?? item.is_tax_inclusive
  if (isTaxInclusive) {
    subtotal = 0 // in that case we need to know the tax rate to compute it later
  }

  const raw_discount_total = getAdjustmentTotals(item)
  const discount_total = Math.round(raw_discount_total)

  const totals: LineItemTotals = {
    unit_price: item.unit_price,

    quantity: item.quantity,

    subtotal,
    total: subtotal - discount_total,

    discount_total,
    raw_discount_total: raw_discount_total,

    original_total: subtotal,
    original_tax_total: 0,
    tax_total: 0,
    tax_lines: item.tax_lines ?? [],
  }

  if (totals.tax_lines?.length > 0) {
    // TODO: Account for tax lines
    // - Calculate tax total
    // - Calculate original tax total
    // - Re-calculate original total
    // - Re-calculate total
    // - Re-calculate subtotal
  }

  return totals
}

export function decorateTotals(
  cart: CartDTO,
  totalsConfig: { forceTaxes?: boolean } = {}
): CartDTO {
  const includeTax = totalsConfig?.forceTaxes
  const cartItems = [...(cart.items ?? [])]
  const cartShippingMethods = [...(cart.shipping_methods ?? [])]

  if (includeTax) {
    // TODO: Account for tax lines
  }

  const itemsTotals = getLineItemTotals(
    cartItems as unknown as CalculateLineItemInput[],
    {
      includeTax,
    }
  )

  // TODO: Account for shipping methods

  cart.subtotal = 0
  cart.discount_total = 0
  cart.item_tax_total = 0
  cart.shipping_total = 0
  cart.shipping_tax_total = 0

  cart.items = (cart.items || []).map((item) => {
    const itemWithTotals = Object.assign(item, itemsTotals[item.id] ?? {})

    cart.subtotal! += itemWithTotals.subtotal ?? 0
    cart.discount_total! += itemWithTotals.raw_discount_total ?? 0
    cart.item_tax_total! += itemWithTotals.tax_total ?? 0

    return itemWithTotals
  })

  // TODO: Calculate shipping totals

  cart.tax_total = cart.item_tax_total + cart.shipping_tax_total

  cart.raw_discount_total = cart.discount_total
  cart.discount_total = Math.round(cart.discount_total)

  // TODO: Calculate gift card totals

  cart.gift_card_total = 0
  cart.gift_card_tax_total = 0

  cart.total =
    cart.subtotal +
    cart.shipping_total +
    cart.tax_total -
    (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total)

  return cart as CartDTO
}
