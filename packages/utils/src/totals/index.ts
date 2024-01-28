import { CartDTO, CartShippingMethodDTO } from "@medusajs/types"
import { BigNumber } from "./big-number"

type CalculateLineItemInput = {
  id: string
  unit_price: number | BigNumber
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
  tax_lines: any[]
  discount_total: number

  raw_discount_total: number
}

type ShippingMethodTotals = {
  price: number
  tax_total: number
  total: number
  subtotal: number
  original_total: number
  original_tax_total: number
  tax_lines: any[]
}

type GetLineItemTotalsContext = {
  includeTax?: boolean
  taxRate?: number | null
}

type GetShippingMethodTotalsContext = {
  includeTax?: boolean
  taxRate?: number | null
}

type GetLineItemTotalsResult = {
  [lineItemId: string]: LineItemTotals
}

type GetShippingMethodTotalsResult = {
  [shippingMethodId: string]: ShippingMethodTotals
}

export function getShippingMethodTotals(
  shippingMethods: CartShippingMethodDTO | CartShippingMethodDTO[],
  context: GetShippingMethodTotalsContext
  // {
  //   includeTax,
  //   discounts,
  //   taxRate,
  //   calculationContext,
  // }: {
  //   includeTax?: boolean
  //   calculationContext: TaxCalculationContext
  //   discounts?: Discount[]
  //   taxRate?: number | null
  // }
): GetShippingMethodTotalsResult {
  const { includeTax, taxRate } = context

  shippingMethods = Array.isArray(shippingMethods)
    ? shippingMethods
    : [shippingMethods]

  // TODO: Account for tax lines

  const shippingMethodsTotals: GetShippingMethodTotalsResult = {}

  for (const shippingMethod of shippingMethods) {
    shippingMethodsTotals[shippingMethod.id] = getShippingMethodTotals_(
      shippingMethod,
      {
        includeTax,
        taxRate,
      }
    )
  }

  return shippingMethodsTotals
}

export function getShippingMethodTotals_(
  shippingMethod: CartShippingMethodDTO,
  context: GetShippingMethodTotalsContext
): ShippingMethodTotals {
  const totals: ShippingMethodTotals = {
    price: shippingMethod.unit_price,
    original_total: shippingMethod.unit_price,
    total: shippingMethod.unit_price,
    subtotal: shippingMethod.unit_price,
    original_tax_total: 0,
    tax_total: 0,
    tax_lines: shippingMethod.tax_lines ?? [],
  }

  if (totals.tax_lines.length) {
    // TODO: Account for tax lines
    // - Calculate tax total
    // - Calculate original tax total
  }

  // const hasFreeShipping = discounts?.some(
  //   (d) => d.rule.type === DiscountRuleType.FREE_SHIPPING
  // )

  // if (hasFreeShipping) {
  //   totals.total = 0
  //   totals.subtotal = 0
  //   totals.tax_total = 0
  // }

  return totals
}

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

function getLineItemTotals_(
  item: CalculateLineItemInput,
  context: GetLineItemTotalsContext
): LineItemTotals {
  const unitPrice = item.unit_price as number
  const subtotal = unitPrice * item.quantity

  const raw_discount_total = 0
  const discount_total = Math.round(raw_discount_total)

  const totals: LineItemTotals = {
    unit_price: unitPrice,
    quantity: item.quantity,
    subtotal,
    discount_total,
    total: subtotal - discount_total,
    original_total: subtotal,
    original_tax_total: 0,
    tax_total: 0,
    tax_lines: item.tax_lines ?? [],

    raw_discount_total: raw_discount_total,
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

    // totals.tax_total = 0
    // totals.raw_tax_total = 0

    // totals.original_tax_total = 0 // TODO: Should exclude discounts
    // totals.raw_original_tax_total = 0 // TODO: Should exclude discounts

    if (isTaxInclusive) {
      // TODO: Account for tax inclusivity
    }
  }

  return totals
}

export function decorateTotals(
  cart: CartDTO,
  totalsConfig: { includeTaxes?: boolean } = {}
): CartDTO {
  const includeTax = totalsConfig?.includeTaxes
  const cartItems = [...(cart.items ?? [])]
  const cartShippingMethods = [...(cart.shipping_methods ?? [])]

  if (includeTax) {
    // TODO: Account for tax lines
    // - get tax lines for line items
    // - get tax lines for shipping methods
  }

  const itemsTotals = getLineItemTotals(
    cartItems as unknown as CalculateLineItemInput[],
    {
      includeTax,
    }
  )

  // TODO: Account for shipping methods
  // - get shipping method toals (similar to line items)

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

  cart.shipping_methods = (cart.shipping_methods || []).map(
    (shippingMethod) => {
      const methodWithTotals = Object.assign(
        shippingMethod,
        // shippingTotals[shippingMethod.id] ?? {}
        {}
      )

      cart.shipping_total! += 0
      cart.shipping_tax_total! += 0

      return methodWithTotals
    }
  )

  cart.tax_total = cart.item_tax_total + cart.shipping_tax_total

  // cart.raw_discount_total = cart.discount_total
  cart.discount_total = Math.round(cart.discount_total)

  // const giftCardableAmount = this.newTotalsService_.getGiftCardableAmount({
  //   gift_cards_taxable: cart.region?.gift_cards_taxable,
  //   subtotal: cart.subtotal,
  //   discount_total: cart.discount_total,
  //   shipping_total: cart.shipping_total,
  //   tax_total: cart.tax_total,
  // })

  // const giftCardTotal = await this.newTotalsService_.getGiftCardTotals(
  //   giftCardableAmount,
  //   {
  //     region: cart.region,
  //     giftCards: cart.gift_cards,
  //   }
  // )

  // cart.gift_card_total = giftCardTotal.total || 0
  // cart.gift_card_tax_total = giftCardTotal.tax_total || 0

  cart.total = cart.subtotal + cart.shipping_total + cart.tax_total
  // -> subtract (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total)

  return cart as CartDTO
}
