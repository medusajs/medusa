import _ from "lodash"
import { BaseService } from "medusa-interfaces"

/**
 * A service that calculates total and subtotals for orders, carts etc..
 * @implements BaseService
 */
class TotalsService extends BaseService {
  constructor({ productVariantService }) {
    super()
    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService
  }
  /**
   * Calculates subtotal of a given cart
   * @param {Cart} Cart - the cart to calculate subtotal for
   * @return {int} the calculated subtotal
   */
  getSubtotal(cart) {
    let subtotal = 0
    if (!cart.items) {
      return subtotal
    }

    cart.items.map(item => {
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
        amount: (variantPrice / 100) * value,
      }
    } else {
      return {
        lineItem,
        variant,
        amount: value >= variantPrice ? variantPrice : value,
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
        discount.discount_rule.valid_for.map(v => {
          // Discounts do not apply to bundles, hence:
          if (Array.isArray(item.content)) {
            return discounts
          } else {
            if (item.content.variant._id === v) {
              discounts.push(
                this.calculateDiscount_(
                  item._id,
                  v,
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
   * Calculates discount total of a cart using the discounts provided in the
   * cart.discounts array. This will be subtracted from the cart subtotal,
   * which is returned from the function.
   * @param {Cart} Cart - the cart to calculate discounts for
   * @return {int} the subtotal after discounts are applied
   */
  async getDiscountTotal(cart) {
    let subtotal = this.getSubtotal(cart)

    if (!cart.discounts) {
      return subtotal
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
      return subtotal
    }

    const { type, allocation, value } = discount.discount_rule

    if (type === "percentage" && allocation === "total") {
      subtotal -= (subtotal / 100) * value
      return subtotal
    }

    if (type === "percentage" && allocation === "item") {
      const itemPercentageDiscounts = await this.getAllocationItemDiscounts(
        discount,
        cart,
        "percentage"
      )
      const totalDiscount = _.sumBy(itemPercentageDiscounts, d => d.amount)
      subtotal -= totalDiscount
      return subtotal
    }

    if (type === "fixed" && allocation === "total") {
      subtotal -= value
      return subtotal
    }

    if (type === "fixed" && allocation === "item") {
      const itemFixedDiscounts = await this.getAllocationItemDiscounts(
        discount,
        cart,
        "fixed"
      )
      const totalDiscount = _.sumBy(itemFixedDiscounts, d => d.amount)
      subtotal -= totalDiscount
      return subtotal
    }

    return subtotal
  }
}

export default TotalsService
