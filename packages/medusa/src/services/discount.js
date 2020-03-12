import { BaseService } from "medusa-interfaces"
import { Validator } from "medusa-core-utils"

/**
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({ discountModel }) {
    super()

    this.discountModel_ = discountModel
  }
  // class DiscountModel extends BaseModel {
  //   static modelName = "Discount"

  //   static schema = {
  //     code: { type: String, required: true, unique: true },
  //     discount_value: { type: Number, required: true, min: 0, max: 100 },
  //     type: {
  //       Type: String,
  //       required: true,
  //       default: "all",
  //       enum: ["shipping", "total", "item", "all"],
  //     },
  //     usage_count: { type: Number, default: 0 },
  //     limit: { type: Number },
  //     starts_at: { type: Date },
  //     ends_at: { type: Date },
  //   }
  // }

  validate_(discount) {
    const schema = Validator.object().keys({
      code: Validator.string().required(),
      discount_value: Validator.number().required(),
      type: Validator.string().required(),
      usage_count: Validator.number(),
      limit: Validator.number(),
      starts_at: Validator.date(),
      ends_at: Validator.date(),
    })

    const { value, error } = schema.validate(discount)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        error.details[0].message
      )
    }

    return value
  }

  async createDiscount(discount) {
    const validatedDiscount = this.validate_(discount)
    return this.discountModel_.create(discount).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
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

  async retrieve(discountId) {
    const validatedId = this.validate_(discountId)
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
    const validatedDiscount = this.validate_(update)

    return this.discountModel_.updateOne(
      {
        _id: discount._id,
      },
      {
        $set: validatedDiscount,
      }
    )
  }
}

export default AuthService
