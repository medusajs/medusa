import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"
import _ from "lodash"

/**
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({
    discountModel,
    regionService,
    productVariantService,
    totalsService,
  }) {
    super()

    /** @private @const {DiscountModel} */
    this.discountModel_ = discountModel

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

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
      description: Validator.string(),
      type: Validator.string().required(),
      value: Validator.number()
        .positive()
        .required(),
      allocation: Validator.string().required(),
      valid_for: Validator.array().items(Validator.string()),
      regions: Validator.array()
        .items(Validator.string())
        .required(),
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

  normalizeDiscountCode_(discountCode) {
    return discountCode.toUpperCase()
  }

  async create(discount) {
    await this.validateDiscountRule_(discount.discount_rule)
    discount.code = this.normalizeDiscountCode_(discount.code)
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

  async retrieveByCode(discountCode) {
    discountCode = this.normalizeDiscountCode_(discountCode)
    const discount = await this.discountModel_
      .findOne({ code: discountCode })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!discount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Discount with code ${discountCode} was not found`
      )
    }
    return discount
  }

  async update(discountId, update) {
    const discount = await this.retrieve(discountId)

    if (update.discount_rule) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use updateDiscountRule to update the discount rule"
      )
    }

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $set: update },
      { runValidators: true }
    )
  }
  async updateDiscountRule(discountId, update) {
    const discount = await this.retrieve(discountId)

    const validatedDiscountRule = this.validateDiscountRule_(update)

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $set: { discount_rule: validatedDiscountRule } },
      { runValidators: true }
    )
  }

  async delete(discountId) {
    let discount
    try {
      discount = await this.retrieve(discountId)
    } catch (error) {
      // Delete is idempotent, but we return a promise to allow then-chaining
      return Promise.resolve()
    }

    return this.discountModel_.deleteOne({ _id: discount._id }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

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

  async calculateItemDiscounts(discount, cart) {
    let discounts = []
    for (const item of cart.items) {
      discount.discount_rule.valid_for.forEach(async v => {
        if (Array.isArray(item.content)) {
          item.content.forEach(async c => {
            if (c.variant._id === v) {
              const variantRegionPrice = await this.productVariantService_.getRegionPrice(
                v,
                cart.region_id
              )
              discounts.push(
                this.calculateDiscount_(
                  item._id,
                  v,
                  variantRegionPrice,
                  discount.discount_rule.value,
                  discount.discount_rule.type
                )
              )
            }
          })
        } else {
          if (item.content.variant._id === v) {
            const variantRegionPrice = await this.productVariantService_.getRegionPrice(
              v,
              cart.region_id
            )

            discounts.push(
              this.calculateDiscount_(
                item._id,
                v,
                variantRegionPrice,
                discount.discount_rule.value,
                discount.discount_rule.type
              )
            )
          }
        }
      })
    }
    return discounts
  }

  async calculateDiscountTotal(cart) {
    let subTotal = this.totalsService_.getSubTotal(cart)

    if (!cart.discounts) {
      return subTotal
    }

    let discounts = await Promise.all(
      cart.discounts.map(discount => this.retrieve(discount))
    )

    // filter out invalid discounts
    discounts = discounts.filter(d => {
      // !ends_at implies that the discount never expires
      // therefore, we do the check following check
      if (d.ends_at) {
        const parsedEnd = new Date(d.ends_at)
        const now = new Date()
        return (
          parsedEnd.getTime() > now.getTime() &&
          d.discount_rule.regions.includes(cart.region_id)
        )
      } else {
        return d.discount_rule.regions.includes(cart.region_id)
      }
    })

    // we only support having free shipping and one other discount, so first
    // find the discount, which is not free shipping.
    const discount = discounts.find(
      ({ discount_rule }) => discount_rule.type !== "free_shipping"
    )

    if (!discount) {
      return subTotal
    }

    const { type, allocation, value } = discount.discount_rule

    if (type === "percentage" && allocation === "total") {
      subTotal -= (subTotal / 100) * value
      return subTotal
    }

    if (type === "percentage" && allocation === "item") {
      const itemPercentageDiscounts = await this.calculateItemDiscounts(
        discount,
        cart,
        "percentage"
      )
      const totalDiscount = _.sumBy(itemPercentageDiscounts, d => d.amount)
      subTotal -= totalDiscount
      return subTotal
    }

    if (type === "fixed" && allocation === "total") {
      subTotal -= value
      return subTotal
    }

    if (type === "fixed" && allocation === "item") {
      const itemFixedDiscounts = await this.calculateItemDiscounts(
        discount,
        cart,
        "fixed"
      )
      const totalDiscount = _.sumBy(itemFixedDiscounts, d => d.amount)
      subTotal -= totalDiscount
      return subTotal
    }

    return subTotal
  }
}

export default DiscountService
