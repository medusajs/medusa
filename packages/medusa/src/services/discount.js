import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"
import _ from "lodash"

/**
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({ discountModel, totalsService }) {
    super()

    /** @private @const {DiscountModel} */
    this.discountModel_ = discountModel

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService
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
}

export default DiscountService
