import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

/**
 * A service that calculates total and subtotals for orders, carts etc..
 * @implements BaseService
 */
class TotalsService extends BaseService {
  constructor({ productVariantService, regionService }) {
    super()
    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {RegionService} */
    this.regionService_ = regionService
  }

  /**
   * Calculates subtotal of a given cart or order.
   * @param {Cart || Order} object - cart or order to calculate subtotal for
   * @return {int} the calculated subtotal
   */
  async getTotal(object) {
    const subtotal = await this.getSubtotal(object)
    const taxTotal = await this.getTaxTotal(object)
    const discountTotal = await this.getDiscountTotal(object)
    const shippingTotal = await this.getShippingTotal(object)

    return subtotal + taxTotal + shippingTotal - discountTotal
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
      if (Array.isArray(item.content)) {
        const temp = _.sumBy(item.content, c => c.unit_price * c.quantity)
        subtotal += temp * item.quantity
      } else {
        if (opts.excludeNonDiscounts) {
          if (!item.no_discount) {
            subtotal +=
              item.content.unit_price * item.content.quantity * item.quantity
          }
        } else {
          subtotal +=
            item.content.unit_price * item.content.quantity * item.quantity
        }
      }
    })
    return this.rounded(subtotal)
  }

  /**
   * Calculates shipping total
   * @param {Cart | Object} object - cart or order to calculate subtotal for
   * @return {int} shipping total
   */
  getShippingTotal(order) {
    const { shipping_methods } = order
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
  async getTaxTotal(object) {
    const subtotal = this.getSubtotal(object)
    const shippingTotal = this.getShippingTotal(object)
    const discountTotal = await this.getDiscountTotal(object)
    const region = await this.regionService_.retrieve(object.region_id)
    const { tax_rate } = region
    return this.rounded((subtotal - discountTotal + shippingTotal) * tax_rate)
  }

  getRefundedTotal(object) {
    const total = object.refunds.reduce((acc, next) => acc + next.amount, 0)
    return this.rounded(total)
  }

  getLineItemRefund(order, lineItem) {
    const { tax_rate, discounts } = order
    const taxRate = tax_rate || 0

    const discount = discounts.find(
      ({ discount_rule }) => discount_rule.type !== "free_shipping"
    )

    if (!discount) {
      return lineItem.content.unit_price * lineItem.quantity * (1 + taxRate)
    }

    const lineDiscounts = this.getLineDiscounts(order, discount)
    const discountedLine = lineDiscounts.find(line =>
      line.item._id.equals(lineItem._id)
    )

    const discountAmount =
      (discountedLine.amount / discountedLine.item.quantity) * lineItem.quantity

    return this.rounded(
      (lineItem.content.unit_price * lineItem.quantity - discountAmount) *
        (1 + taxRate)
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
    const refunds = lineItems.map(i => this.getLineItemRefund(order, i))
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
    if (lineItem.no_discount) {
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
   * If the discount_rule of a discount has allocation="item", then we need
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
      if (discount.discount_rule.valid_for.length > 0) {
        discount.discount_rule.valid_for.map(variant => {
          // Discounts do not apply to bundles, hence:
          if (Array.isArray(item.content)) {
            return discounts
          } else {
            if (item.content.variant._id === variant) {
              discounts.push(
                this.calculateDiscount_(
                  item,
                  variant,
                  item.content.unit_price,
                  discount.discount_rule.value,
                  discount.discount_rule.type
                )
              )
            }
          }
        })
      }
    }
    return discounts
  }

  getLineDiscounts(cart, discount) {
    const subtotal = this.getSubtotal(cart)
    const { type, allocation, value } = discount.discount_rule
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

      return cart.items.map(item => {
        const lineTotal = item.content.unit_price * item.quantity

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
      return cart.items.map(item => {
        const discounted = allocationDiscounts.find(a =>
          a.lineItem._id.equals(item._id)
        )
        return {
          item,
          amount: !!discounted ? discounted.amount : 0,
        }
      })
    }

    return cart.items.map(i => ({ item: i, amount: 0 }))
  }

  /**
   * Calculates the total discount amount for each of the different supported
   * discount types. If discounts aren't present or invalid returns 0.
   * @param {Cart} Cart - the cart to calculate discounts for
   * @return {int} the total discounts amount
   */
  async getDiscountTotal(cart) {
    let subtotal = this.getSubtotal(cart, { excludeNonDiscounts: true })

    if (!cart.discounts || !cart.discounts.length) {
      return 0
    }

    // filter out invalid discounts
    cart.discounts = cart.discounts.filter(d => {
      // !ends_at implies that the discount never expires
      // therefore, we do the check following check
      if (d.ends_at) {
        const parsedEnd = new Date(d.ends_at)
        const now = new Date()
        return (
          parsedEnd.getTime() > now.getTime() &&
          d.regions.includes(cart.region_id)
        )
      } else {
        return d.regions && d.regions.includes(cart.region_id)
      }
    })

    // we only support having free shipping and one other discount, so first
    // find the discount, which is not free shipping.
    const discount = cart.discounts.find(
      ({ discount_rule }) => discount_rule.type !== "free_shipping"
    )

    if (!discount) {
      return 0
    }

    const { type, allocation, value } = discount.discount_rule
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

    return this.rounded(Math.min(subtotal, toReturn))
  }

  rounded(value) {
    const decimalPlaces = 4
    return Number(
      Math.round(parseFloat(value + "e" + decimalPlaces)) + "e-" + decimalPlaces
    )
  }
}

export default TotalsService
