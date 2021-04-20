import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

/**
 * A service that calculates total and subtotals for orders, carts etc..
 * @implements BaseService
 */
class TotalsService extends BaseService {
  constructor() {
    super()
  }

  /**
   * Calculates subtotal of a given cart or order.
   * @param {object} object - object to calculate total for
   * @return {int} the calculated subtotal
   */
  getTotal(object) {
    const subtotal = this.getSubtotal(object)
    const taxTotal = this.getTaxTotal(object)
    const discountTotal = this.getDiscountTotal(object)
    const giftCardTotal = this.getGiftCardTotal(object)
    const shippingTotal = this.getShippingTotal(object)

    return subtotal + taxTotal + shippingTotal - discountTotal - giftCardTotal
  }

  getPaidTotal(order) {
    const total = order.payments?.reduce((acc, next) => {
      acc += next.amount
      return acc
    }, 0)

    return total
  }

  getSwapTotal(order) {
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
   * @param {Cart || Order} object - cart or order to calculate subtotal for
   * @return {int} the calculated subtotal
   */
  getSubtotal(object, opts = {}) {
    let subtotal = 0
    if (!object.items) {
      return subtotal
    }

    object.items.map(item => {
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
   * @param {Cart | Object} object - cart or order to calculate subtotal for
   * @return {int} shipping total
   */
  getShippingTotal(object) {
    const { shipping_methods } = object
    return shipping_methods.reduce((acc, next) => {
      return acc + next.price
    }, 0)
  }

  /**
   * Calculates tax total
   * Currently based on the Danish tax system
   * @param {Cart | Object} object - cart or order to calculate subtotal for
   * @return {int} tax total
   */
  getTaxTotal(object) {
    const subtotal = this.getSubtotal(object)
    const shippingTotal = this.getShippingTotal(object)
    const discountTotal = this.getDiscountTotal(object)
    const giftCardTotal = this.getGiftCardTotal(object)
    const tax_rate =
      typeof object.tax_rate !== "undefined"
        ? object.tax_rate
        : object.region.tax_rate
    return this.rounded(
      (subtotal - discountTotal - giftCardTotal + shippingTotal) *
        (tax_rate / 100)
    )
  }

  getRefundedTotal(object) {
    if (!object.refunds) {
      return 0
    }

    const total = object.refunds.reduce((acc, next) => acc + next.amount, 0)
    return this.rounded(total)
  }

  getLineItemRefund(object, lineItem) {
    const { discounts } = object
    const tax_rate =
      typeof object.tax_rate !== "undefined"
        ? object.tax_rate
        : object.region.tax_rate
    const taxRate = (tax_rate || 0) / 100

    const discount = discounts.find(({ rule }) => rule.type !== "free_shipping")

    if (!discount) {
      return lineItem.unit_price * lineItem.quantity * (1 + taxRate)
    }

    const lineDiscounts = this.getLineDiscounts(object, discount)
    const discountedLine = lineDiscounts.find(
      line => line.item.id === lineItem.id
    )

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
   * @param {Order} order - cart or order to calculate subtotal for
   * @param {[LineItem]} lineItems -
   * @return {int} the calculated subtotal
   */
  getRefundTotal(order, lineItems) {
    let itemIds = order.items.map(i => i.id)

    // in case we swap a swap, we need to include swap items
    if (order.swaps && order.swaps.length) {
      for (const s of order.swaps) {
        const swapItemIds = s.additional_items.map(el => el.id)
        itemIds = [...itemIds, ...swapItemIds]
      }
    }

    const refunds = lineItems.map(i => {
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
   * @param {string} lineItem - id of line item
   * @param {string} variant - id of variant in line item
   * @param {int} variantPrice - price of the variant based on region
   * @param {int} valye - discount value
   * @param {string} discountType - the type of discount (fixed or percentage)
   * @return {{ string, string, int }} triples of lineitem, variant and
   *    applied discount
   */
  calculateDiscount_(lineItem, variant, variantPrice, value, discountType) {
    if (!lineItem.allow_discounts) {
      return {
        lineItem,
        variant,
        amount: 0,
      }
    }
    if (discountType === "percentage") {
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
   * @param {Discount} discount - the discount to which we do the calculation
   * @param {Cart} cart - the cart to calculate discounts for
   * @return {[{ string, string, int }]} array of triples of lineitem, variant
   *    and applied discount
   */
  getAllocationItemDiscounts(discount, cart) {
    const discounts = []
    for (const item of cart.items) {
      if (discount.rule.valid_for.length > 0) {
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

  getLineDiscounts(cart, discount) {
    const subtotal = this.getSubtotal(cart, { excludeNonDiscounts: true })

    let merged = [...cart.items]

    // merge items from order with items from order swaps
    if (cart.swaps && cart.swaps.length) {
      for (const s of cart.swaps) {
        merged = [...merged, ...s.additional_items]
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

      return merged.map(item => {
        const lineTotal = item.unit_price * item.quantity

        return {
          item,
          amount: lineTotal * percentage,
        }
      })
    } else if (allocation === "item") {
      const allocationDiscounts = this.getAllocationItemDiscounts(
        discount,
        cart,
        type
      )
      return merged.map(item => {
        const discounted = allocationDiscounts.find(
          a => a.lineItem.id === item.id
        )
        return {
          item,
          amount: !!discounted ? discounted.amount : 0,
        }
      })
    }

    return merged.map(i => ({ item: i, amount: 0 }))
  }

  getGiftCardTotal(cart) {
    const giftCardable = this.getSubtotal(cart) - this.getDiscountTotal(cart)

    if (cart.gift_card_transactions) {
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
   * @param {Cart} Cart - the cart to calculate discounts for
   * @return {int} the total discounts amount
   */
  getDiscountTotal(cart) {
    let subtotal = this.getSubtotal(cart, { excludeNonDiscounts: true })

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
        cart,
        "percentage"
      )
      toReturn = _.sumBy(itemPercentageDiscounts, d => d.amount)
    } else if (type === "fixed" && allocation === "total") {
      toReturn = value
    } else if (type === "fixed" && allocation === "item") {
      const itemFixedDiscounts = this.getAllocationItemDiscounts(
        discount,
        cart,
        "fixed"
      )
      toReturn = _.sumBy(itemFixedDiscounts, d => d.amount)
    }

    if (subtotal < 0) {
      return this.rounded(Math.max(subtotal, toReturn))
    }

    return this.rounded(Math.min(subtotal, toReturn))
  }

  rounded(value) {
    return Math.round(value)
  }
}

export default TotalsService
