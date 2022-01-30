import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

import { LineItemTaxLine } from "../models/line-item-tax-line"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"
import { Order } from "../models/order"
import { Cart } from "../models/cart"
import { ShippingMethod } from "../models/shipping-method"
import { LineItem } from "../models/line-item"
import { Discount } from "../models/discount"
import { DiscountRuleType } from "../models/discount-rule"

import TaxProviderService from "./tax-provider"
import { ITaxCalculationStrategy } from "../interfaces/tax-calculation-strategy"
import { TaxCalculationContext } from "../interfaces/tax-service"
import { isCart } from "../types/cart"
import { isOrder } from "../types/orders"

import {
  SubtotalOptions,
  LineDiscount,
  LineAllocationsMap,
  LineDiscountAmount,
} from "../types/totals"

type ShippingMethodTotals = {
  price: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  tax_lines: ShippingMethodTaxLine[]
}

type GetShippingMethodTotalsOptions = {
  include_tax?: boolean
  use_tax_lines?: boolean
}

type LineItemTotals = {
  unit_price: number
  quantity: number
  subtotal: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  tax_lines: LineItemTaxLine[]
  discount_total: number
  gift_card_total: number
}

type LineItemTotalsOptions = {
  include_tax?: boolean
  use_tax_lines?: boolean
}

type GetLineItemTotalOptions = {
  include_tax?: boolean
  exclude_gift_cards?: boolean
  exclude_discounts?: boolean
}

type TotalsServiceProps = {
  taxProviderService: TaxProviderService
  taxCalculationStrategy: ITaxCalculationStrategy
}

type GetTotalsOptions = {
  force_taxes?: boolean
}

type AllocationMapOptions = {
  exclude_gift_cards?: boolean
  exclude_discounts?: boolean
}

type CalculationContextOptions = {
  is_return?: boolean
  exclude_shipping?: boolean
  exclude_gift_cards?: boolean
  exclude_discounts?: boolean
}

/**
 * A service that calculates total and subtotals for orders, carts etc..
 * @implements {BaseService}
 */
class TotalsService extends BaseService {
  private taxProviderService_: TaxProviderService
  private taxCalculationStrategy_: ITaxCalculationStrategy

  constructor({
    taxProviderService,
    taxCalculationStrategy,
  }: TotalsServiceProps) {
    super()

    this.taxProviderService_ = taxProviderService
    this.taxCalculationStrategy_ = taxCalculationStrategy
  }

  /**
   * Calculates subtotal of a given cart or order.
   * @param cartOrOrder - object to calculate total for
   * @param options - options to calculate by
   * @return the calculated subtotal
   */
  async getTotal(
    cartOrOrder: Cart | Order,
    options: GetTotalsOptions = {}
  ): Promise<number> {
    const subtotal = this.getSubtotal(cartOrOrder)
    const taxTotal =
      (await this.getTaxTotal(cartOrOrder, options.force_taxes)) || 0
    const discountTotal = this.getDiscountTotal(cartOrOrder)
    const giftCardTotal = this.getGiftCardTotal(cartOrOrder)
    const shippingTotal = this.getShippingTotal(cartOrOrder)

    return subtotal + taxTotal + shippingTotal - discountTotal - giftCardTotal
  }

  /**
   * Gets the total payments made on an order
   * @param order - the order to calculate paid amount for
   * @return the total paid amount
   */
  getPaidTotal(order: Order): number {
    const total = order.payments?.reduce((acc, next) => {
      acc += next.amount
      return acc
    }, 0)

    return total
  }

  /**
   * The total paid for swaps. May be negative in case of negative swap
   * difference.
   * @param order - the order to calculate swap total for
   * @return the swap total
   */
  getSwapTotal(order: Order): number {
    let swapTotal = 0
    if (order.swaps && order.swaps.length) {
      for (const s of order.swaps) {
        swapTotal = swapTotal + s.difference_due
      }
    }

    return swapTotal
  }

  /**
   * Gets the totals breakdown for a shipping method. Fetches tax lines if not
   * already provided.
   * @param shippingMethod - the shipping method to get totals breakdown for.
   * @param cartOrOrder - the cart or order to use as context for the breakdown
   * @param opts - options for what should be included
   * @returns An object that breaks down the totals for the shipping method
   */
  async getShippingMethodTotals(
    shippingMethod: ShippingMethod,
    cartOrOrder: Cart | Order,
    opts: GetShippingMethodTotalsOptions = {}
  ): Promise<ShippingMethodTotals> {
    const calculationContext = this.getCalculationContext(cartOrOrder, {
      exclude_shipping: true,
    })
    calculationContext.shipping_methods = [shippingMethod]

    const totals = {
      price: shippingMethod.price,
      original_total: shippingMethod.price,
      total: shippingMethod.price,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: shippingMethod.tax_lines || [],
    }

    if (opts.include_tax) {
      if (isOrder(cartOrOrder) && cartOrOrder.tax_rate !== null) {
        totals.original_tax_total = Math.round(
          totals.original_tax_total * (cartOrOrder.tax_rate / 100)
        )
        totals.tax_total = Math.round(
          totals.original_tax_total * (cartOrOrder.tax_rate / 100)
        )
      } else {
        let taxLines: ShippingMethodTaxLine[]
        if (opts.use_tax_lines || isOrder(cartOrOrder)) {
          if (typeof shippingMethod.tax_lines === "undefined") {
            throw new MedusaError(
              MedusaError.Types.UNEXPECTED_STATE,
              "Tax Lines must be joined on shipping method to calculate taxes"
            )
          }

          taxLines = shippingMethod.tax_lines
        } else {
          const orderLines = await this.taxProviderService_.getTaxLines(
            cartOrOrder.items,
            calculationContext
          )

          console.log(orderLines)

          taxLines = orderLines.filter((ol) => {
            if ("shipping_method_id" in ol) {
              return ol.shipping_method_id === shippingMethod.id
            }
            return false
          }) as ShippingMethodTaxLine[]
        }
        totals.tax_lines = taxLines
      }

      if (totals.tax_lines.length > 0) {
        totals.original_tax_total =
          await this.taxCalculationStrategy_.calculate(
            [],
            totals.tax_lines,
            calculationContext
          )
        totals.tax_total = totals.original_tax_total

        totals.original_total += totals.original_tax_total
        totals.total += totals.tax_total
      }
    }

    if (cartOrOrder.discounts) {
      if (cartOrOrder.discounts.some((d) => d.rule.type === "free_shipping")) {
        totals.total = 0
        totals.tax_total = 0
      }
    }

    return totals
  }

  /**
   * Calculates subtotal of a given cart or order.
   * @param cartOrOrder - cart or order to calculate subtotal for
   * @param opts - options
   * @return the calculated subtotal
   */
  getSubtotal(cartOrOrder: Cart | Order, opts: SubtotalOptions = {}): number {
    let subtotal = 0
    if (!cartOrOrder.items) {
      return subtotal
    }

    cartOrOrder.items.map((item) => {
      if (opts.excludeNonDiscounts) {
        if (item.allow_discounts) {
          subtotal += item.unit_price * item.quantity
        }
      } else {
        subtotal += item.unit_price * item.quantity
      }
    })

    return this.rounded(subtotal)
  }

  /**
   * Calculates shipping total
   * @param cartOrOrder - cart or order to calculate subtotal for
   * @return shipping total
   */
  getShippingTotal(cartOrOrder: Cart | Order): number {
    const { shipping_methods } = cartOrOrder
    return shipping_methods.reduce((acc, next) => {
      return acc + next.price
    }, 0)
  }

  /**
   * Calculates tax total
   * Currently based on the Danish tax system
   * @param cartOrOrder - cart or order to calculate tax total for
   * @param forceTaxes - whether taxes should be calculated regardless
   *   of region settings
   * @return tax total
   */
  async getTaxTotal(
    cartOrOrder: Cart | Order,
    forceTaxes = false
  ): Promise<number | null> {
    if (
      isCart(cartOrOrder) &&
      !forceTaxes &&
      !cartOrOrder.region.automatic_taxes
    ) {
      return null
    }

    const calculationContext = this.getCalculationContext(cartOrOrder)

    let taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[]
    if (isOrder(cartOrOrder)) {
      const taxLinesJoined = cartOrOrder.items.every(
        (i) => typeof i.tax_lines !== "undefined"
      )
      if (!taxLinesJoined) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Order tax calculations must have tax lines joined on line items"
        )
      }

      if (cartOrOrder.tax_rate === null) {
        taxLines = cartOrOrder.items.flatMap((li) => li.tax_lines)

        const shippingTaxLines = cartOrOrder.shipping_methods.flatMap(
          (sm) => sm.tax_lines
        )

        taxLines = taxLines.concat(shippingTaxLines)
      } else {
        const subtotal = this.getSubtotal(cartOrOrder)
        const shippingTotal = this.getShippingTotal(cartOrOrder)
        const discountTotal = this.getDiscountTotal(cartOrOrder)
        const giftCardTotal = this.getGiftCardTotal(cartOrOrder)
        return this.rounded(
          (subtotal - discountTotal - giftCardTotal + shippingTotal) *
            (cartOrOrder.tax_rate / 100)
        )
      }
    } else {
      taxLines = await this.taxProviderService_.getTaxLines(
        cartOrOrder.items,
        calculationContext
      )

      if (cartOrOrder.type === "swap") {
        const returnTaxLines = cartOrOrder.items.flatMap((i) => {
          if (i.is_return) {
            if (typeof i.tax_lines === "undefined") {
              throw new MedusaError(
                MedusaError.Types.UNEXPECTED_STATE,
                "Return Line Items must join tax lines"
              )
            }
            return i.tax_lines
          }

          return []
        })

        taxLines = taxLines.concat(returnTaxLines)
      }
    }

    const toReturn = await this.taxCalculationStrategy_.calculate(
      cartOrOrder.items,
      taxLines,
      calculationContext
    )

    return this.rounded(toReturn)
  }

  /**
   * Gets a map of discounts and gift cards that apply to line items in an
   * order. The function calculates the amount of a discount or gift card that
   * applies to a specific line item.
   * @param orderOrCart - the order or cart to get an allocation map for
   * @param options - controls what should be included in allocation map
   * @return the allocation map for the line items in the cart or order.
   */
  getAllocationMap(
    orderOrCart: Cart | Order,
    options: AllocationMapOptions = {}
  ): LineAllocationsMap {
    const allocationMap: LineAllocationsMap = {}

    if (!options.exclude_discounts) {
      let lineDiscounts: LineDiscountAmount[] = []

      const discount = orderOrCart.discounts.find(
        ({ rule }) => rule.type !== "free_shipping"
      )
      if (discount) {
        lineDiscounts = this.getLineDiscounts(orderOrCart, discount)
      }

      for (const ld of lineDiscounts) {
        if (allocationMap[ld.item.id]) {
          allocationMap[ld.item.id].discount = {
            amount: ld.amount,
            unit_amount: ld.amount / ld.item.quantity,
          }
        } else {
          allocationMap[ld.item.id] = {
            discount: {
              amount: ld.amount,
              unit_amount: ld.amount / ld.item.quantity,
            },
          }
        }
      }
    }

    if (!options.exclude_gift_cards) {
      let lineGiftCards: LineDiscountAmount[] = []
      if (orderOrCart.gift_cards && orderOrCart.gift_cards.length) {
        const subtotal = this.getSubtotal(orderOrCart)
        const giftCardTotal = this.getGiftCardTotal(orderOrCart)

        // If the fixed discount exceeds the subtotal we should
        // calculate a 100% discount
        const nominator = Math.min(giftCardTotal, subtotal)
        const percentage = nominator / subtotal

        lineGiftCards = orderOrCart.items.map((l) => {
          return {
            item: l,
            amount: l.unit_price * l.quantity * percentage,
          }
        })
      }

      for (const lgc of lineGiftCards) {
        if (allocationMap[lgc.item.id]) {
          allocationMap[lgc.item.id].gift_card = {
            amount: lgc.amount,
            unit_amount: lgc.amount / lgc.item.quantity,
          }
        } else {
          allocationMap[lgc.item.id] = {
            discount: {
              amount: lgc.amount,
              unit_amount: lgc.amount / lgc.item.quantity,
            },
          }
        }
      }
    }

    return allocationMap
  }

  /**
   * Gets the total refund amount for an order.
   * @param order - the order to get total refund amount for.
   * @return the total refunded amount for an order.
   */
  getRefundedTotal(order: Order): number {
    if (!order.refunds) {
      return 0
    }

    const total = order.refunds.reduce((acc, next) => acc + next.amount, 0)
    return this.rounded(total)
  }

  /**
   * The amount that can be refunded for a given line item.
   * @param order - order to use as context for the calculation
   * @param lineItem - the line item to calculate the refund amount for.
   * @return the line item refund amount.
   */
  getLineItemRefund(order: Order, lineItem: LineItem): number {
    const allocationMap = this.getAllocationMap(order)

    const discountAmount =
      (allocationMap[lineItem.id]?.discount?.unit_amount || 0) *
      lineItem.quantity
    const lineSubtotal =
      lineItem.unit_price * lineItem.quantity - discountAmount

    /*
     * Used for backcompat with old tax system
     */
    if (order.tax_rate !== null) {
      const taxRate = order.tax_rate / 100
      return this.rounded(lineSubtotal * (1 + taxRate))
    }

    /*
     * New tax system uses the tax lines registerd on the line items
     */
    if (typeof lineItem.tax_lines === "undefined") {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Tax calculation did not receive tax_lines"
      )
    }

    const taxTotal = lineItem.tax_lines.reduce((acc, next) => {
      const taxRate = next.rate / 100
      return acc + this.rounded(lineSubtotal * taxRate)
    }, 0)

    return lineSubtotal + taxTotal
  }

  /**
   * Calculates refund total of line items.
   * If any of the items to return have been discounted, we need to
   * apply the discount again before refunding them.
   * @param order - cart or order to calculate subtotal for
   * @param lineItems - the line items to calculate refund total for
   * @return the calculated subtotal
   */
  getRefundTotal(order: Order, lineItems: LineItem[]): number {
    let itemIds = order.items.map((i) => i.id)

    // in case we swap a swap, we need to include swap items
    if (order.swaps && order.swaps.length) {
      for (const s of order.swaps) {
        const swapItemIds = s.additional_items.map((el) => el.id)
        itemIds = [...itemIds, ...swapItemIds]
      }
    }

    if (order.claims && order.claims.length) {
      for (const c of order.claims) {
        const claimItemIds = c.additional_items.map((el) => el.id)
        itemIds = [...itemIds, ...claimItemIds]
      }
    }

    const refunds = lineItems.map((i) => {
      if (!itemIds.includes(i.id)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Line item does not exist on order"
        )
      }

      return this.getLineItemRefund(order, i)
    })

    return this.rounded(refunds.reduce((acc, next) => acc + next, 0))
  }

  /**
   * Calculates either fixed or percentage discount of a variant
   * @param lineItem - id of line item
   * @param variant - id of variant in line item
   * @param variantPrice - price of the variant based on region
   * @param value - discount value
   * @param discountType - the type of discount (fixed or percentage)
   * @return triples of lineitem, variant and applied discount
   */
  calculateDiscount_(
    lineItem: LineItem,
    variant: string,
    variantPrice: number,
    value: number,
    discountType: DiscountRuleType
  ): LineDiscount {
    if (!lineItem.allow_discounts) {
      return {
        lineItem,
        variant,
        amount: 0,
      }
    }
    if (discountType === DiscountRuleType.PERCENTAGE) {
      return {
        lineItem,
        variant,
        amount: ((variantPrice * lineItem.quantity) / 100) * value,
      }
    } else {
      return {
        lineItem,
        variant,
        amount:
          value >= variantPrice * lineItem.quantity
            ? variantPrice * lineItem.quantity
            : value * lineItem.quantity,
      }
    }
  }

  /**
   * If the rule of a discount has allocation="item", then we need
   * to calculate discount on each item in the cart. Furthermore, we need to
   * make sure to only apply the discount on valid variants. And finally we
   * return ether an array of percentages discounts or fixed discounts
   * alongside the variant on which the discount was applied.
   * @param discount - the discount to which we do the calculation
   * @param cart - the cart to calculate discounts for
   * @return array of triples of lineitem, variant and applied discount
   */
  getAllocationItemDiscounts(
    discount: Discount,
    cart: Cart | Order
  ): LineDiscount[] {
    const discounts: LineDiscount[] = []
    for (const item of cart.items) {
      if (discount.rule.valid_for?.length > 0) {
        discount.rule.valid_for.map(({ id }) => {
          if (item.variant.product_id === id) {
            discounts.push(
              this.calculateDiscount_(
                item,
                item.variant.id,
                item.unit_price,
                discount.rule.value,
                discount.rule.type
              )
            )
          }
        })
      }
    }
    return discounts
  }

  /**
   * Returns the discount amount allocated to the line items of an order.
   * @param cartOrOrder - the cart or order to get line discount allocations for
   * @param discount - the discount to use as context for the calculation
   * @return the allocations that the discount has on the items in the cart or
   *   order
   */
  getLineDiscounts(
    cartOrOrder: Cart | Order,
    discount: Discount
  ): LineDiscountAmount[] {
    const subtotal = this.getSubtotal(cartOrOrder, {
      excludeNonDiscounts: true,
    })

    let merged: LineItem[] = [...cartOrOrder.items]

    // merge items from order with items from order swaps
    if ("swaps" in cartOrOrder && cartOrOrder.swaps.length) {
      for (const s of cartOrOrder.swaps) {
        merged = [...merged, ...s.additional_items]
      }
    }

    if ("claims" in cartOrOrder && cartOrOrder.claims.length) {
      for (const c of cartOrOrder.claims) {
        merged = [...merged, ...c.additional_items]
      }
    }

    const { type, allocation, value } = discount.rule
    if (allocation === "total") {
      let percentage = 0
      if (type === "percentage") {
        percentage = value / 100
      } else if (type === "fixed") {
        // If the fixed discount exceeds the subtotal we should
        // calculate a 100% discount
        const nominator = Math.min(value, subtotal)
        percentage = nominator / subtotal
      }

      return merged.map((item) => {
        const lineTotal = item.unit_price * item.quantity

        return {
          item,
          amount: item.allow_discounts ? lineTotal * percentage : 0,
        }
      })
    } else if (allocation === "item") {
      const allocationDiscounts = this.getAllocationItemDiscounts(
        discount,
        cartOrOrder
      )
      return merged.map((item) => {
        const discounted = allocationDiscounts.find(
          (a) => a.lineItem.id === item.id
        )
        return {
          item,
          amount: discounted ? discounted.amount : 0,
        }
      })
    }

    return merged.map((i) => ({ item: i, amount: 0 }))
  }

  /**
   * Breaks down the totals related to a line item; these are the subtotal, the
   * amount of discount applied to the line item, the amount of a gift card
   * applied to a line item and the amount of tax applied to a line item.
   * @param lineItem - the line item to calculate totals for
   * @param cartOrOrder - the cart or order to use as context for the calculation
   * @param options - the options to evaluate the line item totals for
   * @returns the breakdown of the line item totals
   */
  async getLineItemTotals(
    lineItem: LineItem,
    cartOrOrder: Cart | Order,
    options: LineItemTotalsOptions = {}
  ): Promise<LineItemTotals> {
    const calculationContext = this.getCalculationContext(cartOrOrder, {
      exclude_shipping: true,
    })

    const lineItemAllocation =
      calculationContext.allocation_map[lineItem.id] || {}

    const subtotal = lineItem.unit_price * lineItem.quantity
    const gift_card_total = lineItemAllocation.gift_card?.amount || 0
    const discount_total =
      (lineItemAllocation.discount?.unit_amount || 0) * lineItem.quantity

    const lineItemTotals: LineItemTotals = {
      unit_price: lineItem.unit_price,
      quantity: lineItem.quantity,
      subtotal,
      gift_card_total,
      discount_total,
      total: subtotal - discount_total,
      original_total: subtotal,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: lineItem.tax_lines || [],
    }

    // Tax Information
    if (options.include_tax) {
      // When we have an order with a null'ed tax rate we know that it is an
      // order from the old tax system. The following is a backward compat
      // calculation.
      if (isOrder(cartOrOrder) && cartOrOrder.tax_rate !== null) {
        lineItemTotals.original_tax_total =
          subtotal * (cartOrOrder.tax_rate / 100)
        lineItemTotals.tax_total =
          (subtotal - discount_total) * (cartOrOrder.tax_rate / 100)

        lineItemTotals.total += lineItemTotals.tax_total
        lineItemTotals.original_total += lineItemTotals.original_tax_total
      } else {
        let taxLines: LineItemTaxLine[]

        /*
         * Line Items on orders will already have tax lines. But for cart line
         * items we have to get the line items from the tax provider.
         */
        if (options.use_tax_lines || isOrder(cartOrOrder)) {
          if (typeof lineItem.tax_lines === "undefined") {
            throw new MedusaError(
              MedusaError.Types.UNEXPECTED_STATE,
              "Tax Lines must be joined on items to calculate taxes"
            )
          }

          taxLines = lineItem.tax_lines
        } else {
          if (lineItem.is_return) {
            if (typeof lineItem.tax_lines === "undefined") {
              throw new MedusaError(
                MedusaError.Types.UNEXPECTED_STATE,
                "Return Line Items must join tax lines"
              )
            }
            taxLines = lineItem.tax_lines
          } else {
            const orderLines = await this.taxProviderService_.getTaxLines(
              cartOrOrder.items,
              calculationContext
            )

            taxLines = orderLines.filter((ol) => {
              if ("item_id" in ol) {
                return ol.item_id === lineItem.id
              }
              return false
            }) as LineItemTaxLine[]
          }
        }

        lineItemTotals.tax_lines = taxLines
      }
    }

    if (lineItemTotals.tax_lines.length > 0) {
      lineItemTotals.tax_total = await this.taxCalculationStrategy_.calculate(
        [lineItem],
        lineItemTotals.tax_lines,
        calculationContext
      )
      lineItemTotals.total += lineItemTotals.tax_total

      calculationContext.allocation_map = {} // Don't account for discounts
      lineItemTotals.original_tax_total =
        await this.taxCalculationStrategy_.calculate(
          [lineItem],
          lineItemTotals.tax_lines,
          calculationContext
        )
      lineItemTotals.original_total += lineItemTotals.original_tax_total
    }

    return lineItemTotals
  }

  /**
   * Gets a total for a line item. The total can take gift cards, discounts and
   * taxes into account. This can be controlled through the options.
   * @param lineItem - the line item to calculate a total for
   * @param cartOrOrder - the cart or order to use as context for the calculation
   * @param options - the options to use for the calculation
   * @returns the line item total
   */
  async getLineItemTotal(
    lineItem: LineItem,
    cartOrOrder: Cart | Order,
    options: GetLineItemTotalOptions = {}
  ): Promise<number> {
    const lineItemTotals = await this.getLineItemTotals(lineItem, cartOrOrder, {
      include_tax: options.include_tax,
    })

    let toReturn = lineItemTotals.subtotal
    if (!options.exclude_discounts) {
      toReturn += lineItemTotals.discount_total
    }

    if (!options.exclude_gift_cards) {
      toReturn += lineItemTotals.gift_card_total
    }

    if (options.include_tax) {
      toReturn += lineItemTotals.tax_total
    }

    return toReturn
  }

  /**
   * Gets the gift card amount on a cart or order.
   * @param cartOrOrder - the cart or order to get gift card amount for
   * @return the gift card amount applied to the cart or order
   */
  getGiftCardTotal(cartOrOrder: Cart | Order): number {
    const giftCardable =
      this.getSubtotal(cartOrOrder) - this.getDiscountTotal(cartOrOrder)

    if ("gift_card_transactions" in cartOrOrder) {
      return cartOrOrder.gift_card_transactions.reduce(
        (acc, next) => acc + next.amount,
        0
      )
    }

    if (!cartOrOrder.gift_cards || !cartOrOrder.gift_cards.length) {
      return 0
    }

    const toReturn = cartOrOrder.gift_cards.reduce(
      (acc, next) => acc + next.balance,
      0
    )
    return Math.min(giftCardable, toReturn)
  }

  /**
   * Calculates the total discount amount for each of the different supported
   * discount types. If discounts aren't present or invalid returns 0.
   * @param cartOrOrder - the cart or order to calculate discounts for
   * @return the total discounts amount
   */
  getDiscountTotal(cartOrOrder: Cart | Order): number {
    const subtotal = this.getSubtotal(cartOrOrder, {
      excludeNonDiscounts: true,
    })

    if (!cartOrOrder.discounts || !cartOrOrder.discounts.length) {
      return 0
    }

    // we only support having free shipping and one other discount, so first
    // find the discount, which is not free shipping.
    const discount = cartOrOrder.discounts.find(
      ({ rule }) => rule.type !== "free_shipping"
    )

    if (!discount) {
      return 0
    }

    const { type, allocation, value } = discount.rule
    let toReturn = 0

    if (type === "percentage" && allocation === "total") {
      toReturn = (subtotal / 100) * value
    } else if (type === "percentage" && allocation === "item") {
      const itemPercentageDiscounts = this.getAllocationItemDiscounts(
        discount,
        cartOrOrder
      )
      toReturn = _.sumBy(itemPercentageDiscounts, (d) => d.amount)
    } else if (type === "fixed" && allocation === "total") {
      toReturn = value
    } else if (type === "fixed" && allocation === "item") {
      const itemFixedDiscounts = this.getAllocationItemDiscounts(
        discount,
        cartOrOrder
      )
      toReturn = _.sumBy(itemFixedDiscounts, (d) => d.amount)
    }

    if (subtotal < 0) {
      return this.rounded(Math.max(subtotal, toReturn))
    }

    return this.rounded(Math.min(subtotal, toReturn))
  }

  /**
   * Prepares the calculation context for a tax total calculation.
   * @param cartOrOrder - the cart or order to get the calculation context for
   * @param options - options to gather context by
   * @return the tax calculation context
   */
  getCalculationContext(
    cartOrOrder: Cart | Order,
    options: CalculationContextOptions = {}
  ): TaxCalculationContext {
    const allocationMap = this.getAllocationMap(cartOrOrder, {
      exclude_gift_cards: options.exclude_gift_cards,
      exclude_discounts: options.exclude_discounts,
    })

    let shippingMethods: ShippingMethod[] = []
    // Default to include shipping methods
    if (!options.exclude_shipping) {
      shippingMethods = cartOrOrder.shipping_methods || []
    }

    return {
      shipping_address: cartOrOrder.shipping_address,
      shipping_methods: shippingMethods,
      customer: cartOrOrder.customer,
      region: cartOrOrder.region,
      is_return: options.is_return ?? false,
      allocation_map: allocationMap,
    }
  }

  /**
   * Rounds a number using Math.round.
   * @param value - the value to round
   * @return the rounded value
   */
  rounded(value: number): number {
    return Math.round(value)
  }
}

export default TotalsService
