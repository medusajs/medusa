import { BaseService } from "medusa-interfaces"
import { Validator } from "medusa-core-utils"
import _ from "lodash"

/**
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({
    discountModel,
    cartService,
    regionService,
    productVariantService,
  }) {
    super()

    /** @private @const {DiscountModel} */
    this.discountModel_ = discountModel

    /** @private @const {CartService} */
    this.cartService_ = cartService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService
  }

  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The discount id could not be casted to an ObjectId"
      )
    }

    return value
  }

  validateDiscountRule_(discountRule) {
    const schema = Validator.object().keys({
      description: Validator.string().required(),
      type: Validator.string().required(),
      value: Validator.number()
        .positive()
        .required(),
      allocation: Validator.string().required(),
      valid_for: Validator.array().items(Validator.string()),
      regions: Validator.array().items(Validator.string()),
      user_limit: Validator.number(),
      total_limit: Validator.number(),
    })

    const { value, error } = schema.validate(discountRule)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        error.details[0].message
      )
    }

    if (value.type === "percentage" && value.value > 100) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Discount value above 100 is not allowed when type is percentage"
      )
    }

    return value
  }

  async createDiscount(discount) {
    await this.validateDiscountRule_(discount.discount_rule)
    return this.discountModel_.create(discount).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  async retrieve(discountId) {
    const validatedId = this.validateId_(discountId)
    const discount = await this.discountModel_
      .findOne({ _id: validatedId })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!discount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Discount with ${discountId} was not found`
      )
    }
    return discount
  }

  async update(discountId, update) {
    const discount = this.retrieve(discountId)

    if (update.discountType) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use updateDiscountType to update the discount type"
      )
    }

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $set: update },
      { runValidators: true }
    )
  }

  async calculateItemDiscounts(discount, items, discountType) {
    return items.forEach(({ content }) => {
      return Promise.all(discount.valid_for.forEach(v => {
        if (content.variant._id === v) {
          const variantRegionPrice = await this.productVariantService_.getRegionPrice(
            v._id,
            cart.region_id
          )

          if (discountType === "percentage") {
            return {
              v,
              amount: (variantRegionPrice / 100) * v.d.value,
            }
          } else {
            return {
              v,
              amount:
                d.value >= variantRegionPrice ? variantRegionPrice : d.value,
            }
          }
        }
      }))
    })
  }

  async calculateDiscountTotal(cart) {
    let subTotal = _.sum(cart.items, ({ content }) => content.amount)
    let discounts = await Promise.all(cart.discounts.map(discount => this.retrieve(discount._id)))

    // filter out invalid discounts
    discounts = discounts.filter(d => {
      const parsedEnd = new Date(d.ends_at)
      const now = new Date()
      return (
        parsedEnd.getTime() > now.getTime() &&
        d.regions.includes(cart.region_id)
      )
    })

    // we only support having free shipping and one other discount, so first
    // find the discount, which is not free shipping.
    const discount = discounts.find(
      ({ discount_rule }) => discount_rule !== "free_shipping"
    )

    if (!discount) {
      return subTotal
    }

    const type = discount.discount_rule.type
    const allocation = discount.discount_rule.allocation
    const value = discount.discount_rule.value

    if (type === "percentage" && allocation === "total") {
      subTotal -= (subTotal / 100) * value
      return subTotal
    }

    if (type === "percentage" && allocation === "item") {
      const itemPercentageDiscounts = await this.calculateItemDiscounts(
        discount,
        cart.items,
        "percentage"
      )
      const totalDiscount = _.sum(itemPercentageDiscounts, d => d.amount)
      subTotal -= totalDiscount
      return subTotal
    }

    if (type === "fixed" && allocation === "total") {
      subTotal -= subTotal - value
      return subTotal
    }

    if (type === "fixed" && allocation === "item") {
      const itemFixedDiscounts = await this.calculateDiscountTotal(discount, cart.items, "fixed")
      const totalDiscount = _.sum(itemFixedDiscounts, d => d.amount)
      subTotal -= subTotal - totalDiscount
      return subTotal
    }

    return subTotal
  }
}

export default DiscountService
