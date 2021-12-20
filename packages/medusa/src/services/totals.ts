import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

import { LineItemTaxLine } from "../models/line-item-tax-line"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"
import { Order } from "../models/order"
import { Cart } from "../models/cart"
import { LineItem } from "../models/line-item"
import { Discount } from "../models/discount"
import { DiscountRuleType } from "../models/discount-rule"

import TaxProviderService from "./tax-provider"
import { ITaxCalculationStrategy } from "../interfaces/tax-calculation-strategy"
import { TaxCalculationContext } from "../interfaces/tax-service"

import {
  SubtotalOptions,
  LineDiscount,
  LineAllocationsMap,
  LineDiscountAmount,
} from "../types/totals"

type TotalsServiceProps = {
  taxProviderService: TaxProviderService
  taxCalculationStrategy: ITaxCalculationStrategy
}

type GetTotalsOptions = {
  force_taxes?: boolean
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
   * @param object - object to calculate total for
   * @param options - options to calculate by
   * @return the calculated subtotal
   */
  async getTotal(
    object: Cart | Order,
    options: GetTotalsOptions = {}
  ): Promise<number> {
    const subtotal = this.getSubtotal(object)
    const taxTotal = (await this.getTaxTotal(object, options.force_taxes)) || 0
    const discountTotal = this.getDiscountTotal(object)
    const giftCardTotal = this.getGiftCardTotal(object)
    const shippingTotal = this.getShippingTotal(object)

    return subtotal + taxTotal + shippingTotal - discountTotal - giftCardTotal
  }

  getPaidTotal(order: Order): number {
    const total = order.payments?.reduce((acc, next) => {
      acc += next.amount
      return acc
    }, 0)

    return total
  }

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
   * Calculates subtotal of a given cart or order.
   * @param object - cart or order to calculate subtotal for
   * @param opts - options
   * @return the calculated subtotal
   */
  getSubtotal(object: Cart | Order, opts: SubtotalOptions = {}): number {
    let subtotal = 0
    if (!object.items) {
      return subtotal
    }

    object.items.map((item) => {
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
   * @param object - cart or order to calculate subtotal for
   * @return shipping total
   */
  getShippingTotal(object: Cart | Order): number {
    const { shipping_methods } = object
    return shipping_methods.reduce((acc, next) => {
      return acc + next.price
    }, 0)
  }

  /**
   * Calculates tax total
   * Currently based on the Danish tax system
   * @param object - cart or order to calculate tax total for
   * @param forceTaxes - whether taxes should be calculated regardless
   *   of region settings
   * @return tax total
   */
  async getTaxTotal(
    object: Cart | Order,
    forceTaxes = false
  ): Promise<number | null> {
    if (
      !object.region.automatic_taxes &&
      !forceTaxes &&
      "payment_session" in object
    ) {
      return null
    }

    const allocationMap = this.getAllocationMap(object)
    const calculationContext: TaxCalculationContext = {
      shipping_address: object.shipping_address,
      shipping_methods: object.shipping_methods || [],
      customer: object.customer,
      region: object.region,
      allocation_map: allocationMap,
    }

    let taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[]
    // Only Orders have a tax_rate
    if ("tax_rate" in object) {
      if (object.tax_rate === null) {
        taxLines = object.items.flatMap((li) => li.tax_lines)

        const shippingTaxLines = object.shipping_methods.flatMap(
          (sm) => sm.tax_lines
        )

        taxLines = taxLines.concat(shippingTaxLines)
      } else {
        const subtotal = this.getSubtotal(object)
        const shippingTotal = this.getShippingTotal(object)
        const discountTotal = this.getDiscountTotal(object)
        const giftCardTotal = this.getGiftCardTotal(object)
        return this.rounded(
          (subtotal - discountTotal - giftCardTotal + shippingTotal) *
            (object.tax_rate / 100)
        )
      }
    } else {
      taxLines = await this.taxProviderService_.getTaxLines(
        object,
        calculationContext
      )
    }

    const toReturn = await this.taxCalculationStrategy_.calculate(
      object.items,
      taxLines,
      calculationContext
    )

    return this.rounded(toReturn)
  }

  getAllocationMap(order: Cart | Order): LineAllocationsMap {
    let lineDiscounts: LineDiscountAmount[] = []

    const discount = order.discounts.find(
      ({ rule }) => rule.type !== "free_shipping"
    )
    if (discount) {
      lineDiscounts = this.getLineDiscounts(order, discount)
    }

    let lineGiftCards: LineDiscountAmount[] = []
    if (order.gift_cards && order.gift_cards.length) {
      const subtotal = this.getSubtotal(order)
      const giftCardTotal = this.getGiftCardTotal(order)

      // If the fixed discount exceeds the subtotal we should
      // calculate a 100% discount
      const nominator = Math.min(giftCardTotal, subtotal)
      const percentage = nominator / subtotal

      lineGiftCards = order.items.map((l) => {
        return {
          item: l,
          amount: l.unit_price * l.quantity * percentage,
        }
      })
    }

    const allocationMap: LineAllocationsMap = {}

    for (const ld of lineDiscounts) {
      if (allocationMap[ld.item.id]) {
        allocationMap[ld.item.id].discount = {
          amount: ld.amount,
        }
      } else {
        allocationMap[ld.item.id] = {
          discount: {
            amount: ld.amount,
          },
        }
      }
    }

    for (const lgc of lineGiftCards) {
      if (allocationMap[lgc.item.id]) {
        allocationMap[lgc.item.id].gift_card = {
          amount: lgc.amount,
        }
      } else {
        allocationMap[lgc.item.id] = {
          discount: {
            amount: lgc.amount,
          },
        }
      }
    }

    return allocationMap
  }

  getRefundedTotal(object: Order): number {
    if (!object.refunds) {
      return 0
    }

    const total = object.refunds.reduce((acc, next) => acc + next.amount, 0)
    return this.rounded(total)
  }

  getLineItemRefund(object: Cart | Order, lineItem: LineItem): number {
    const { discounts } = object
    const tax_rate =
      "tax_rate" in object ? object.tax_rate : object.region.tax_rate

    const taxRate = (tax_rate || 0) / 100

    const discount = discounts.find(({ rule }) => rule.type !== "free_shipping")

    if (!discount || !lineItem.allow_discounts) {
      return lineItem.unit_price * lineItem.quantity * (1 + taxRate)
    }

    const lineDiscounts = this.getLineDiscounts(object, discount)
    const discountedLine = lineDiscounts.find(
      (line) => line.item.id === lineItem.id
    ) as LineDiscountAmount

    const discountAmount =
      (discountedLine.amount / discountedLine.item.quantity) * lineItem.quantity

    return this.rounded(
      (lineItem.unit_price * lineItem.quantity - discountAmount) * (1 + taxRate)
    )
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

  getLineDiscounts(
    cart: Cart | Order,
    discount: Discount
  ): LineDiscountAmount[] {
    const subtotal = this.getSubtotal(cart, { excludeNonDiscounts: true })

    let merged: LineItem[] = [...cart.items]

    // merge items from order with items from order swaps
    if ("swaps" in cart && cart.swaps.length) {
      for (const s of cart.swaps) {
        merged = [...merged, ...s.additional_items]
      }
    }

    if ("claims" in cart && cart.claims.length) {
      for (const c of cart.claims) {
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
          amount: lineTotal * percentage,
        }
      })
    } else if (allocation === "item") {
      const allocationDiscounts = this.getAllocationItemDiscounts(
        discount,
        cart
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

  getGiftCardTotal(cart: Cart | Order): number {
    const giftCardable = this.getSubtotal(cart) - this.getDiscountTotal(cart)

    if ("gift_card_transactions" in cart) {
      return cart.gift_card_transactions.reduce(
        (acc, next) => acc + next.amount,
        0
      )
    }

    if (!cart.gift_cards || !cart.gift_cards.length) {
      return 0
    }

    const toReturn = cart.gift_cards.reduce(
      (acc, next) => acc + next.balance,
      0
    )
    return Math.min(giftCardable, toReturn)
  }

  /**
   * Calculates the total discount amount for each of the different supported
   * discount types. If discounts aren't present or invalid returns 0.
   * @param cart - the cart to calculate discounts for
   * @return the total discounts amount
   */
  getDiscountTotal(cart: Cart | Order): number {
    const subtotal = this.getSubtotal(cart, { excludeNonDiscounts: true })

    if (!cart.discounts || !cart.discounts.length) {
      return 0
    }

    // we only support having free shipping and one other discount, so first
    // find the discount, which is not free shipping.
    const discount = cart.discounts.find(
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
        cart
      )
      toReturn = _.sumBy(itemPercentageDiscounts, (d) => d.amount)
    } else if (type === "fixed" && allocation === "total") {
      toReturn = value
    } else if (type === "fixed" && allocation === "item") {
      const itemFixedDiscounts = this.getAllocationItemDiscounts(discount, cart)
      toReturn = _.sumBy(itemFixedDiscounts, (d) => d.amount)
    }

    if (subtotal < 0) {
      return this.rounded(Math.max(subtotal, toReturn))
    }

    return this.rounded(Math.min(subtotal, toReturn))
  }

  rounded(value: number): number {
    return Math.round(value)
  }
}

export default TotalsService
