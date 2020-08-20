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
    const subtotal = this.getSubtotal(object)
    const taxTotal = await this.getTaxTotal(object)
    const discountTotal = await this.getDiscountTotal(object)
    const shippingTotal = this.getShippingTotal(object)

    return subtotal + taxTotal + shippingTotal - discountTotal
  }

  /**
   * Calculates subtotal of a given cart or order.
   * @param {Cart || Order} object - cart or order to calculate subtotal for
   * @return {int} the calculated subtotal
   */
  getSubtotal(object) {
    let subtotal = 0
    if (!object.items) {
      return subtotal
    }

    object.items.map(item => {
      if (Array.isArray(item.content)) {
        const temp = _.sumBy(item.content, c => c.unit_price * c.quantity)
        subtotal += temp * item.quantity
      } else {
        subtotal +=
          item.content.unit_price * item.content.quantity * item.quantity
      }
    })
    return subtotal
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
    const region = await this.regionService_.retrieve(object.region_id)
    const { tax_rate } = region
    return (subtotal + shippingTotal) * tax_rate
  }

  /**
   * Calculates refund total of line items.
   * If any of the items to return have been discounted, we need to
   * apply the discount again before refunding them.
   * @param {Order} order - cart or order to calculate subtotal for
   * @param {[LineItem]} lineItems -
   * @return {int} the calculated subtotal
   */
  async getRefundTotal(order, lineItems) {
    const discount = order.discounts.find(
      ({ discount_rule }) => discount_rule.type !== "free_shipping"
    )

    if (_.differenceBy(lineItems, order.items, "_id").length !== 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Line items does not exist on order"
      )
    }

    const subtotal = this.getSubtotal({ items: lineItems })

    const region = await this.regionService_.retrieve(order.region_id)

    // if nothing is discounted, return the subtotal of line items
    if (!discount) {
      return subtotal * (1 + region.tax_rate)
    }

    const { value, type, allocation } = discount.discount_rule

    if (type === "percentage" && allocation === "total") {
      const discountTotal = (subtotal / 100) * value
      return subtotal - discountTotal
    }

    if (type === "fixed" && allocation === "total") {
      return subtotal - value
    }

    if (type === "percentage" && allocation === "item") {
      // Find discounted items
      const itemPercentageDiscounts = await this.getAllocationItemDiscounts(
        discount,
        { items: lineItems },
        "percentage"
      )

      // Find discount total by taking each discounted item, reducing it by
      // its discount value. Then summing all those items together.
      const discountRefundTotal = _.sumBy(
        itemPercentageDiscounts,
        d => d.lineItem.content.unit_price * d.lineItem.quantity - d.amount
      )

      // Find the items that weren't discounted
      const notDiscountedItems = _.differenceBy(
        lineItems,
        Array.from(itemPercentageDiscounts, el => el.lineItem),
        "_id"
      )

      // If all items were discounted, we return the total of the discounted
      // items
      if (!notDiscountedItems) {
        return discountRefundTotal
      }

      // Otherwise, we find the total those not discounted
      const notDiscRefundTotal = this.getSubtotal({ items: notDiscountedItems })

      // Finally, return the sum of discounted and not discounted items
      return notDiscRefundTotal + discountRefundTotal
    }

    // See immediate `if`-statement above for a elaboration on the following
    // calculations. This time with fixed discount type.
    if (type === "fixed" && allocation === "item") {
      const itemPercentageDiscounts = await this.getAllocationItemDiscounts(
        discount,
        { items: lineItems },
        "fixed"
      )

      const discountRefundTotal = _.sumBy(
        itemPercentageDiscounts,
        d => d.lineItem.content.unit_price * d.lineItem.quantity - d.amount
      )

      const notDiscountedItems = _.differenceBy(
        lineItems,
        Array.from(itemPercentageDiscounts, el => el.lineItem),
        "_id"
      )

      if (!notDiscountedItems) {
        return notDiscRefundTotal
      }

      const notDiscRefundTotal = this.getSubtotal({ items: notDiscountedItems })

      return notDiscRefundTotal + discountRefundTotal
    }
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
  async getAllocationItemDiscounts(discount, cart) {
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

  /**
   * Calculates the total discount amount for each of the different supported
   * discount types. If discounts aren't present or invalid returns 0.
   * @param {Cart} Cart - the cart to calculate discounts for
   * @return {int} the total discounts amount
   */
  async getDiscountTotal(cart) {
    let subtotal = this.getSubtotal(cart)

    if (!cart.discounts) {
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

    if (type === "percentage" && allocation === "total") {
      return (subtotal / 100) * value
    }

    if (type === "percentage" && allocation === "item") {
      const itemPercentageDiscounts = await this.getAllocationItemDiscounts(
        discount,
        cart,
        "percentage"
      )
      const totalDiscount = _.sumBy(itemPercentageDiscounts, d => d.amount)
      return totalDiscount
    }

    if (type === "fixed" && allocation === "total") {
      return value
    }

    if (type === "fixed" && allocation === "item") {
      const itemFixedDiscounts = await this.getAllocationItemDiscounts(
        discount,
        cart,
        "fixed"
      )
      const totalDiscount = _.sumBy(itemFixedDiscounts, d => d.amount)
      return totalDiscount
    }

    return 0
  }
}

export default TotalsService
