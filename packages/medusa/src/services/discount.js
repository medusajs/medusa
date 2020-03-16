import { BaseService } from "medusa-interfaces"
import { Validator } from "medusa-core-utils"

/**
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({ discountModel, cartService, regionService }) {
    super()

    /** @private @const {DiscountModel} */
    this.discountModel_ = discountModel

    /** @private @const {CartService} */
    this.cartService_ = cartService

    /** @private @const {RegionService} */
    this.regionService_ = regionService
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

  // DOES IT EVEN MAKE SENSE TO UPDATE DISCOUNT TYPE?
  async updateDiscountType(discountId, discountType) {
    const discount = this.retrieve(discountId)
    const validatedDiscountType = this.validateDiscountType_(discountType)

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $set: { discountType: validatedDiscountType } },
      { runValidators: true }
    )
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
}

export default DiscountService
