import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"
import _ from "lodash"

/**
 * Provides layer to manipulate discounts.
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({
    discountModel,
    totalsService,
    productVariantService,
    regionService,
  }) {
    super()

    /** @private @const {DiscountModel} */
    this.discountModel_ = discountModel

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {RegionService} */
    this.regionService_ = regionService
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
  setMetadata(discountId, key, value) {
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
}

export default DiscountService
