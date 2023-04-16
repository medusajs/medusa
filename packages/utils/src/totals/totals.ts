// import {
//   ClaimOrder,
//   Discount,
//   DiscountRuleType,
//   GiftCard,
//   LineItem,
//   LineItemTaxLine,
//   Region,
//   ShippingMethod,
//   ShippingMethodTaxLine,
//   Swap,
// } from "@medusajs/medusa"
import { LineAllocationsMap, TaxTypes } from "@medusajs/types"
import { MedusaError, isDefined } from "medusa-core-utils"
import { calculatePriceTaxAmount } from "../tax"

type LineItemTotals = {
  unit_price: number
  quantity: number
  subtotal: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  tax_lines: any // LineItemTaxLine[]
  discount_total: number

  raw_discount_total: number
}

/**
 * Associates a line item and discount allocation.
 */
export type LineDiscount = {
  lineItem: any // LineItem
  variant: string
  amount: number
}

/**
 * Associates a line item and discount allocation.
 */
export type LineDiscountAmount = {
  item: any // LineItem
  amount: number
  customAdjustmentsAmount: number
}

type AllocationMapOptions = {
  exclude_gift_cards?: boolean
  exclude_discounts?: boolean
}

type GetLineItemTotalsContext = {
  includeTax?: boolean
  calculationContext: TaxTypes.TaxCalculationContext
  lineItemsTaxLinesMap: {
    [lineItemId: string]: any // LineItemTaxLine[]
  }
}

type GetShippingMethodTotalsContext = {
  includeTax?: boolean
  calculationContext: TaxTypes.TaxCalculationContext
  discounts?: any // Discount[]
  shippingMethodsTaxLinesMap: {
    [shippingMethodId: string]: any // ShippingMethodTaxLine[]
  }
}

type GiftCardTransaction = {
  tax_rate: number | null
  is_taxable: boolean | null
  amount: number
  gift_card: any // GiftCard
}

type ShippingMethodTotals = {
  price: number
  tax_total: number
  total: number
  subtotal: number
  original_total: number
  original_tax_total: number
  tax_lines: any // ShippingMethodTaxLine[]
}

export default class TotalsService {
  /**
   * Calculate and return the items totals for either the legacy calculation or the new calculation
   * @param items
   * @param includeTax
   * @param calculationContext
   * @param taxRate
   */
  static async getLineItemTotals(
    // items: LineItem | LineItem[],
    items: any[],
    {
      includeTax,
      calculationContext,
      lineItemsTaxLinesMap,
    }: GetLineItemTotalsContext
  ): Promise<{ [lineItemId: string]: LineItemTotals }> {
    items = Array.isArray(items) ? items : [items]

    // TODO: These should be retrieve as a preliminary step and passed to the method
    // let lineItemsTaxLinesMap: { [lineItemId: string]: LineItemTaxLine[] } = {}

    // if (!taxRate && includeTax) {
    //   // Use existing tax lines if they are present
    //   const itemContainsTaxLines = items.some((item) => item.tax_lines?.length)
    //   if (itemContainsTaxLines) {
    //     items.forEach((item) => {
    //       lineItemsTaxLinesMap[item.id] = item.tax_lines ?? []
    //     })
    //   } else {
    //     const { lineItemsTaxLines } = await this.taxProviderService_
    //       .withTransaction(this.activeManager_)
    //       .getTaxLinesMap(items, calculationContext)
    //     lineItemsTaxLinesMap = lineItemsTaxLines
    //   }
    // }

    const itemsTotals: { [lineItemId: string]: LineItemTotals } = {}

    for (const item of items) {
      const lineItemAllocation =
        calculationContext.allocation_map[item.id] || {}

      itemsTotals[item.id] = await this.getLineItemTotals_(item, {
        includeTax,
        lineItemAllocation,
        taxLines: lineItemsTaxLinesMap[item.id],
        calculationContext,
      })
    }

    return itemsTotals
  }

  /**
   * Calculate and return the totals for an item
   * @param item
   * @param includeTax
   * @param lineItemAllocation
   * @param taxLines Only needed to force the usage of the specified tax lines, often in the case where the item does not hold the tax lines
   * @param calculationContext
   */
  protected static async getLineItemTotals_(
    item: any, // LineItem,
    {
      includeTax,
      lineItemAllocation,
      taxLines,
      calculationContext,
    }: {
      includeTax?: boolean
      lineItemAllocation: LineAllocationsMap[number]
      taxLines?: any // LineItemTaxLine[]
      calculationContext: TaxTypes.TaxCalculationContext
    }
  ): Promise<LineItemTotals> {
    let subtotal = item.unit_price * item.quantity
    if (item.includes_tax) {
      subtotal = 0 // in that case we need to know the tax rate to compute it later
    }

    const raw_discount_total = lineItemAllocation.discount?.amount ?? 0
    const discount_total = Math.round(raw_discount_total)

    const totals: LineItemTotals = {
      unit_price: item.unit_price,
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

    if (includeTax) {
      totals.tax_lines = totals.tax_lines.length
        ? totals.tax_lines
        // : (taxLines as LineItemTaxLine[])
        : (taxLines as any[])

      if (!totals.tax_lines && item.variant_id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Tax Lines must be joined to calculate taxes"
        )
      }
    }

    if (item.is_return) {
      if (!isDefined(item.tax_lines) && item.variant_id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Return Line Items must join tax lines"
        )
      }
    }

    if (totals.tax_lines?.length > 0) {
      const taxCalculationStrategy =
        calculationContext?.tax_calculation_strategy

      totals.tax_total =
        (await taxCalculationStrategy.calculate(
          [item],
          totals.tax_lines,
          calculationContext
        )) ?? 0

      const noDiscountContext = {
        ...calculationContext,
        allocation_map: {}, // Don't account for discounts
      }

      totals.original_tax_total =
        (await taxCalculationStrategy.calculate(
          [item],
          totals.tax_lines,
          noDiscountContext
        )) ?? 0

      if (item.includes_tax) {
        totals.subtotal +=
          totals.unit_price * totals.quantity - totals.original_tax_total
        totals.total += totals.subtotal
        totals.original_total += totals.subtotal
      }

      totals.total += totals.tax_total
      totals.original_total += totals.original_tax_total
    }

    return totals
  }

  /**
   * Return the amount that can be refund on a line item
   * @param lineItem
   * @param calculationContext
   * @param taxRate
   */
  static getLineItemRefund(
    lineItem: {
      id: string
      unit_price: number
      includes_tax: boolean
      quantity: number
      tax_lines: any // LineItemTaxLine[]
    },
    {
      calculationContext,
      taxRate,
    }: {
      calculationContext: TaxTypes.TaxCalculationContext
      taxRate?: number | null
    }
  ): number {
    const includesTax = lineItem.includes_tax

    const discountAmount =
      (calculationContext.allocation_map[lineItem.id]?.discount?.unit_amount ||
        0) * lineItem.quantity

    if (!isDefined(lineItem.tax_lines)) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Cannot compute line item refund amount, tax lines are missing from the line item"
      )
    }

    const totalTaxRate = lineItem.tax_lines.reduce((acc, next) => {
      return acc + next.rate / 100
    }, 0)

    const taxAmountIncludedInPrice = !includesTax
      ? 0
      : Math.round(
          calculatePriceTaxAmount({
            price: lineItem.unit_price,
            taxRate: totalTaxRate,
            includesTax,
          })
        )

    const lineSubtotal =
      (lineItem.unit_price - taxAmountIncludedInPrice) * lineItem.quantity -
      discountAmount

    const taxTotal = lineItem.tax_lines.reduce((acc, next) => {
      return acc + Math.round(lineSubtotal * (next.rate / 100))
    }, 0)

    return lineSubtotal + taxTotal
  }

  /**
   * Calculate and return the gift cards totals
   * @param giftCardableAmount
   * @param giftCardTransactions
   * @param region
   * @param giftCards
   */
  static async getGiftCardTotals(
    giftCardableAmount: number,
    {
      giftCardTransactions,
      region,
      giftCards,
    }: {
      region: any // Region
      giftCardTransactions?: GiftCardTransaction[]
      giftCards?: any // GiftCard[]
    }
  ): Promise<{
    total: number
    tax_total: number
  }> {
    if (!giftCards && !giftCardTransactions) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Cannot calculate the gift cart totals. Neither the gift cards or gift card transactions have been provided"
      )
    }

    if (giftCardTransactions?.length) {
      return this.getGiftCardTransactionsTotals({
        giftCardTransactions,
        region,
      })
    }

    const result = {
      total: 0,
      tax_total: 0,
    }

    if (!giftCards?.length) {
      return result
    }

    // If a gift card is not taxable, the tax_rate for the giftcard will be null
    const { totalGiftCardBalance, totalTaxFromGiftCards } = giftCards.reduce(
      (acc, giftCard) => {
        let taxableAmount = 0

        acc.totalGiftCardBalance += giftCard.balance

        taxableAmount = Math.min(acc.giftCardableBalance, giftCard.balance)
        // skip tax, if the taxable amount is not a positive number or tax rate is not set
        if (taxableAmount <= 0 || !giftCard.tax_rate) {
          return acc
        }

        const taxAmountFromGiftCard = Math.round(
          taxableAmount * (giftCard.tax_rate / 100)
        )

        acc.totalTaxFromGiftCards += taxAmountFromGiftCard
        // Update the balance, pass it over to the next gift card (if any) for calculating tax on balance.
        acc.giftCardableBalance -= taxableAmount

        return acc
      },
      {
        totalGiftCardBalance: 0,
        totalTaxFromGiftCards: 0,
        giftCardableBalance: giftCardableAmount,
      }
    )

    result.tax_total = Math.round(totalTaxFromGiftCards)
    result.total = Math.min(giftCardableAmount, totalGiftCardBalance)

    return result
  }

  /**
   * Calculate and return the gift cards totals based on their transactions
   * @param gift_card_transactions
   * @param region
   */
  static getGiftCardTransactionsTotals({
    giftCardTransactions,
    region,
  }: {
    giftCardTransactions: GiftCardTransaction[]
    region: { gift_cards_taxable: boolean; tax_rate: number }
  }): { total: number; tax_total: number } {
    return giftCardTransactions.reduce(
      (acc, next) => {
        let taxMultiplier = (next.tax_rate || 0) / 100

        // Previously we did not record whether a gift card was taxable or not.
        // All gift cards where is_taxable === null are from the old system,
        // where we defaulted to taxable gift cards.
        //
        // This is a backwards compatability fix for orders that were created
        // before we added the gift card tax rate.
        // We prioritize the giftCard.tax_rate as we create a snapshot of the tax
        // on order creation to create gift cards on the gift card itself.
        // If its created outside of the order, we refer to the region tax
        if (next.is_taxable === null) {
          if (region?.gift_cards_taxable || next.gift_card?.tax_rate) {
            taxMultiplier = (next.gift_card?.tax_rate ?? region.tax_rate) / 100
          }
        }

        return {
          total: acc.total + next.amount,
          tax_total: Math.round(acc.tax_total + next.amount * taxMultiplier),
        }
      },
      {
        total: 0,
        tax_total: 0,
      }
    )
  }

  /**
   * Calculate and return the shipping methods totals for either the legacy calculation or the new calculation
   * @param shippingMethods
   * @param includeTax
   * @param discounts
   * @param taxRate
   * @param calculationContext
   */
  static async getShippingMethodTotals(
    shippingMethods: any, // ShippingMethod | ShippingMethod[],
    {
      includeTax,
      discounts,
      calculationContext,
      shippingMethodsTaxLinesMap,
    }: GetShippingMethodTotalsContext
  ): Promise<{ [shippingMethodId: string]: ShippingMethodTotals }> {
    shippingMethods = Array.isArray(shippingMethods)
      ? shippingMethods
      : [shippingMethods]

    // TODO: These should be retrieve as a preliminary step and passed to the method
    // let shippingMethodsTaxLinesMap: {
    //   [shippingMethodId: string]: ShippingMethodTaxLine[]
    // } = {}

    // if (!taxRate && includeTax) {
    //   // Use existing tax lines if they are present
    //   const shippingMethodContainsTaxLines = shippingMethods.some(
    //     (method) => method.tax_lines?.length
    //   )
    //   if (shippingMethodContainsTaxLines) {
    //     shippingMethods.forEach((sm) => {
    //       shippingMethodsTaxLinesMap[sm.id] = sm.tax_lines ?? []
    //     })
    //   } else {
    //     const calculationContextWithGivenMethod = {
    //       ...calculationContext,
    //       shipping_methods: shippingMethods,
    //     }
    //     const { shippingMethodsTaxLines } = await this.taxProviderService_
    //       .withTransaction(this.activeManager_)
    //       .getTaxLinesMap([], calculationContextWithGivenMethod)
    //     shippingMethodsTaxLinesMap = shippingMethodsTaxLines
    //   }
    // }

    const shippingMethodsTotals: {
      [lineItemId: string]: ShippingMethodTotals
    } = {}
    for (const shippingMethod of shippingMethods) {
      shippingMethodsTotals[shippingMethod.id] =
        await this.getShippingMethodTotals_(shippingMethod, {
          includeTax,
          calculationContext,
          taxLines: shippingMethodsTaxLinesMap[shippingMethod.id],
          discounts,
        })
    }

    return shippingMethodsTotals
  }

  /**
   * Calculate and return the shipping method totals
   * @param shippingMethod
   * @param includeTax
   * @param calculationContext
   * @param taxLines
   * @param discounts
   */
  protected static async getShippingMethodTotals_(
    shippingMethod: any, // ShippingMethod,
    {
      includeTax,
      calculationContext,
      taxLines,
      discounts,
    }: {
      includeTax?: boolean
      calculationContext: TaxTypes.TaxCalculationContext
      taxLines?: any // ShippingMethodTaxLine[]
      discounts?: any // Discount[]
    }
  ) {
    const totals: ShippingMethodTotals = {
      price: shippingMethod.price,
      original_total: shippingMethod.price,
      total: shippingMethod.price,
      subtotal: shippingMethod.price,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: shippingMethod.tax_lines ?? [],
    }

    if (includeTax) {
      totals.tax_lines = totals.tax_lines.length
        ? totals.tax_lines
        // : (taxLines as ShippingMethodTaxLine[])
        : (taxLines as any[])

      if (!totals.tax_lines) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Tax Lines must be joined to calculate taxes"
        )
      }
    }

    const calculationContext_: TaxTypes.TaxCalculationContext = {
      ...calculationContext,
      shipping_methods: [shippingMethod],
    }

    if (totals.tax_lines.length) {
      const includesTax = shippingMethod.includes_tax

      const taxCalculationStrategy =
        calculationContext?.tax_calculation_strategy

      totals.original_tax_total =
        (await taxCalculationStrategy.calculate(
          [],
          totals.tax_lines,
          calculationContext_
        )) ?? 0

      totals.tax_total = totals.original_tax_total

      if (includesTax) {
        totals.subtotal -= totals.tax_total
      } else {
        totals.original_total += totals.original_tax_total
        totals.total += totals.tax_total
      }
    }

    const hasFreeShipping = discounts?.some(
      // (d) => d.rule.type === DiscountRuleType.FREE_SHIPPING
      (d) => d.rule.type === "free_shipping"
    )

    if (hasFreeShipping) {
      totals.total = 0
      totals.subtotal = 0
      totals.tax_total = 0
    }

    return totals
  }

  /**
   * Returns the discount amount allocated to the line items of an order.
   * @param cartOrOrder - the cart or order to get line discount allocations for
   * @param discount - the discount to use as context for the calculation
   * @return the allocations that the discount has on the items in the cart or
   *   order
   */
  static getLineDiscounts(
    cartOrOrder: {
      items: any // LineItem[]
      swaps?: any // Swap[]
      claims?: any // ClaimOrder[]
    },
    discount?: any // Discount
  ): LineDiscountAmount[] {
    // let merged: LineItem[] = [...(cartOrOrder.items ?? [])]
    let merged: any[] = [...(cartOrOrder.items ?? [])]

    // merge items from order with items from order swaps
    if ("swaps" in cartOrOrder && cartOrOrder.swaps?.length) {
      for (const s of cartOrOrder.swaps) {
        merged = [...merged, ...s.additional_items]
      }
    }

    if ("claims" in cartOrOrder && cartOrOrder.claims?.length) {
      for (const c of cartOrOrder.claims) {
        merged = [...merged, ...c.additional_items]
      }
    }

    return merged.map((item) => {
      const adjustments = item?.adjustments || []
      const discountAdjustments = discount
        ? adjustments.filter(
            (adjustment) => adjustment.discount_id === discount.id
          )
        : []

      const customAdjustments = adjustments.filter(
        (adjustment) => adjustment.discount_id === null
      )

      const sumAdjustments = (total, adjustment) => total + adjustment.amount

      return {
        item,
        amount: item.allow_discounts
          ? discountAdjustments.reduce(sumAdjustments, 0)
          : 0,
        customAdjustmentsAmount: customAdjustments.reduce(sumAdjustments, 0),
      }
    })
  }

  /**
   * Gets a map of discounts and gift cards that apply to line items in an
   * order. The function calculates the amount of a discount or gift card that
   * applies to a specific line item.
   * @param orderOrCart - the order or cart to get an allocation map for
   * @param options - controls what should be included in allocation map
   * @return the allocation map for the line items in the cart or order.
   */
  static async getAllocationMap(
    orderOrCart: {
      discounts?: any // Discount[]
      items: any // LineItem[]
      swaps?: any // Swap[]
      claims?: any // ClaimOrder[]
    },
    options: AllocationMapOptions = {}
  ): Promise<LineAllocationsMap> {
    const allocationMap: LineAllocationsMap = {}

    if (!options.exclude_discounts) {
      const discount = orderOrCart.discounts?.find(
        // ({ rule }) => rule.type !== DiscountRuleType.FREE_SHIPPING
        ({ rule }) => rule.type !== "free_shipping"
      )

      const lineDiscounts: LineDiscountAmount[] = this.getLineDiscounts(
        orderOrCart,
        discount
      )

      for (const ld of lineDiscounts) {
        const adjustmentAmount = ld.amount + ld.customAdjustmentsAmount

        if (allocationMap[ld.item.id]) {
          allocationMap[ld.item.id].discount = {
            amount: adjustmentAmount,
            /**
             * Used for the refund computation
             */
            unit_amount: adjustmentAmount / ld.item.quantity,
          }
        } else {
          allocationMap[ld.item.id] = {
            discount: {
              amount: adjustmentAmount,
              /**
               * Used for the refund computation
               */
              unit_amount: Math.round(adjustmentAmount / ld.item.quantity),
            },
          }
        }
      }
    }

    return allocationMap
  }
}
