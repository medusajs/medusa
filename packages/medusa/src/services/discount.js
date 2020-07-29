import _ from "lodash"
import randomize from "randomatic"
import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

/**
 * Provides layer to manipulate discounts.
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({
    discountModel,
    dynamicDiscountCodeModel,
    totalsService,
    productVariantService,
    regionService,
    eventBusService,
  }) {
    super()

    /** @private @const {DiscountModel} */
    this.discountModel_ = discountModel

    /** @private @const {DynamicDiscountCodeModel} */
    this.dynamicCodeModel_ = dynamicDiscountCodeModel

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  /**
   * Validates discount id
   * @param {string} rawId - the raw id to validate
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The discount id could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Creates a discount rule with provided data given that the data is validated.
   * @param {DiscountRule} discountRule - the discount rule to create
   * @return {Promise} the result of the create operation
   */
  validateDiscountRule_(discountRule) {
    const schema = Validator.object().keys({
      description: Validator.string(),
      type: Validator.string().required(),
      value: Validator.number()
        .min(0)
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

  /**
   * Used to normalize discount codes to uppercase.
   * @param {string} discountCode - the discount code to normalize
   * @return {string} the normalized discount code
   */
  normalizeDiscountCode_(discountCode) {
    return discountCode.toUpperCase()
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.discountModel_.find(selector)
  }

  /**
   * Creates a discount with provided data given that the data is validated.
   * Normalizes discount code to uppercase.
   * @param {Discount} discount - the discount data to create
   * @return {Promise} the result of the create operation
   */
  async create(discount) {
    discount.discount_rule = this.validateDiscountRule_(discount.discount_rule)

    discount.code = this.normalizeDiscountCode_(discount.code)

    return this.discountModel_.create(discount).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Gets a discount by id.
   * @param {string} discountId - id of discount to retrieve
   * @return {Promise<Discount>} the discount document
   */
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

  /**
   * Gets a discount by discount code.
   * @param {string} discountCode - discount code of discount to retrieve
   * @return {Promise<Discount>} the discount document
   */
  async retrieveByCode(discountCode) {
    discountCode = this.normalizeDiscountCode_(discountCode)
    let discount = await this.discountModel_
      .findOne({ code: discountCode })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!discount) {
      const dynamicCode = await this.dynamicCodeModel_
        .findOne({ code: discountCode })
        .catch(err => {
          throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
        })

      if (!dynamicCode) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Discount with code ${discountCode} was not found`
        )
      }

      discount = await this.retrieve(dynamicCode.discount_id)
      if (!discount) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Discount with code ${discountCode} was not found`
        )
      }

      discount.code = discountCode
      discount.disabled = dynamicCode.disabled
    }

    return discount
  }

  /**
   * Updates a discount.
   * @param {string} discountId - discount id of discount to update
   * @param {Discount} update - the data to update the discount with
   * @return {Promise} the result of the update operation
   */
  async update(discountId, update) {
    const discount = await this.retrieve(discountId)

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Use setMetadata to update discount metadata"
      )
    }

    if (update.discount_rule) {
      update.discount_rule = this.validateDiscountRule_(update.discount_rule)
    }

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $set: update },
      { runValidators: true }
    )
  }

  /**
   * Generates a gift card with the specified value which is valid in the
   * specified region.
   * @param {number} value - the value that the gift card represents
   * @param {string} regionId - the id of the region in which the gift card can
   *    be used
   * @return {Discount} the newly created gift card
   */
  async generateGiftCard(value, regionId) {
    const region = await this.regionService_.retrieve(regionId)

    const code = [
      randomize("A0", 4),
      randomize("A0", 4),
      randomize("A0", 4),
      randomize("A0", 4),
    ].join("-")

    const discountRule = this.validateDiscountRule_({
      type: "fixed",
      allocation: "total",
      value,
    })

    return this.discountModel_.create({
      code,
      discount_rule: discountRule,
      is_giftcard: true,
      regions: [region._id],
    })
  }

  /**
   * Creates a dynamic code for a discount id.
   * @param {string} discountId - the id of the discount to create a code for
   * @param {string} code - the code to identify the discount by
   * @return {Promise} the newly created dynamic code
   */
  async createDynamicCode(discountId, data) {
    const discount = await this.retrieve(discountId)
    if (!discount.is_dynamic) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Discount must be set to dynamic"
      )
    }

    const code = this.normalizeDiscountCode_(data.code)
    return this.dynamicCodeModel_.create({
      ...data,
      discount_id: discount._id,
      code,
    })
  }

  /**
   * Creates a dynamic code for a discount id.
   * @param {string} discountId - the id of the discount to create a code for
   * @param {string} code - the code to identify the discount by
   * @return {Promise} the newly created dynamic code
   */
  async deleteDynamicCode(discountId, code) {
    const discont = await this.retrieve(discountId)
    if (!discount.is_dynamic) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Discount must be set to dynamic"
      )
    }

    return this.dynamicCodeModel_.deleteOne({
      code,
    })
  }

  /**
   * Adds a valid variant to the discount rule valid_for array.
   * @param {string} discountId - id of discount
   * @param {string} variantId - id of variant to add
   * @return {Promise} the result of the update operation
   */
  async addValidVariant(discountId, variantId) {
    const discount = await this.retrieve(discountId)

    const variant = await this.productVariantService_.retrieve(variantId)

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $push: { discount_rule: { valid_for: variant._id } } },
      { runValidators: true }
    )
  }

  /**
   * Removes a valid variant from the discount rule valid_for array
   * @param {string} discountId - id of discount
   * @param {string} variantId - id of variant to add
   * @return {Promise} the result of the update operation
   */
  async removeValidVariant(discountId, variantId) {
    const discount = await this.retrieve(discountId)

    const variant = await this.productVariantService_.retrieve(variantId)

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $pull: { discount_rule: { valid_for: variant._id } } },
      { runValidators: true }
    )
  }

  /**
   * Adds a region to the discount regions array.
   * @param {string} discountId - id of discount
   * @param {string} regionId - id of region to add
   * @return {Promise} the result of the update operation
   */
  async addRegion(discountId, regionId) {
    const discount = await this.retrieve(discountId)

    const region = await this.regionService_.retrieve(regionId)

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $push: { regions: region._id } },
      { runValidators: true }
    )
  }

  /**
   * Removes a region from the discount regions array.
   * @param {string} discountId - id of discount
   * @param {string} regionId - id of region to remove
   * @return {Promise} the result of the update operation
   */
  async removeRegion(discountId, regionId) {
    const discount = await this.retrieve(discountId)

    const region = await this.regionService_.retrieve(regionId)

    return this.discountModel_.updateOne(
      { _id: discount._id },
      { $pull: { regions: region._id } },
      { runValidators: true }
    )
  }

  /**
   * Deletes a discount idempotently
   * @param {string} discountId - id of discount to delete
   * @return {Promise} the result of the delete operation
   */
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

  /**
   * Dedicated method to set metadata for a discount.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} discountId - the id to apply metadata to.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  async setMetadata(discountId, key, value) {
    const validatedId = this.validateId_(discountId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.discountModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Dedicated method to delete metadata for a discount.
   * @param {string} discountId - the discount to delete metadata from.
   * @param {string} key - key for metadata field
   * @return {Promise} resolves to the updated result.
   */
  async deleteMetadata(discountId, key) {
    const validatedId = this.validateId_(discountId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.discountModel_
      .updateOne({ _id: validatedId }, { $unset: { [keyPath]: "" } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default DiscountService
