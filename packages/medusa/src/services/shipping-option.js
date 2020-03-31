import mongoose from "mongoose"
import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate profiles.
 * @implements BaseService
 */
class ShippingOptionService extends BaseService {
  /** @param { shippingOptionModel: (ShippingOptionModel) } */
  constructor({ shippingOptionModel, fulfillmentProviderService }) {
    super()

    /** @private @const {ShippingProfileModel} */
    this.optionModel_ = shippingOptionModel

    /** @private @const {ProductService} */
    this.providerService_ = fulfillmentProviderService
  }

  /**
   * Used to validate product ids. Throws an error if the cast fails
   * @param {string} rawId - the raw product id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The shippingOptionId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Validates a requirement
   * @param {ShippingRequirement} requirement - the requirement to validate
   * @return {ShippingRequirement} a validated shipping requirement
   */
  validateRequirement_(requirement) {
    if (!requirement.type) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "A Shipping Requirement must have a type field"
      )
    }

    if (
      requirement.type !== "min_subtotal" &&
      requirement.type !== "max_subtotal"
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Requirement type must be one of min_subtotal, max_subtotal"
      )
    }

    return requirement
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.optionModel_.find(selector)
  }

  /**
   * Gets a profile by id.
   * Throws in case of DB Error and if profile was not found.
   * @param {string} optionId - the id of the profile to get.
   * @return {Promise<Product>} the profile document.
   */
  async retrieve(optionId) {
    const validatedId = this.validateId_(optionId)
    const option = await this.optionModel_
      .findOne({ _id: validatedId })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!option) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Shipping Option with ${optionId} was not found`
      )
    }

    return option
  }

  /**
   * @typedef ShippingOptionPrice
   * @property {string} type - one of flat_rate, calculated
   * @property {number} value - the value if available
   */

  /**
   * Sets the price of a shipping option
   * @param {string} optionId - the option to set price for
   * @param {ShippingOptionPrice} - the price to set
   * @return {Promise} the update result
   */
  async setPrice(optionId, price) {
    const option = await this.retrieve(optionId)

    if (
      !price.type ||
      (price.type !== "flat_rate" && price.type !== "calculated")
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The price must be of type flat_rate or calculated"
      )
    }

    if (price.type === "calculated") {
      const provider = this.providerService_.retrieveProvider(
        option.provider_id
      )
      const canCalculate = await provider.canCalculate(option.data)
      if (!canCalculate) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The fulfillment provider cannot calculate prices for this option"
        )
      }
    }

    if (price.type === "flat_rate" && (!price.amount || price.amount < 0)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Flat rate prices must have a postive amount field."
      )
    }

    return this.optionModel_.updateOne(
      {
        _id: option._id,
      },
      {
        $set: { price },
      }
    )
  }

  /**
   * Updates a profile. Metadata updates and product updates should use
   * dedicated methods, e.g. `setMetadata`, `addProduct`, etc. The function
   * will throw errors if metadata or product updates are attempted.
   * @param {string} optionId - the id of the option. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  update(optionId, update) {
    const validatedId = this.validateId_(optionId)

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    if (update.region_id || update.provider_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Region and Provider cannot be updated after creation"
      )
    }

    if (update.requirements) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use addRequirement, removeRequirement to update the requirements field"
      )
    }

    if (update.price) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setPrice to update the price field"
      )
    }

    return this.optionModel_
      .updateOne(
        { _id: validatedId },
        { $set: update },
        { runValidators: true }
      )
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Deletes a profile with a given profile id.
   * @param {string} optionId - the id of the profile to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(optionId) {
    let option
    try {
      option = await this.retrieve(optionId)
    } catch (error) {
      // Delete is idempotent, but we return a promise to allow then-chaining
      return Promise.resolve()
    }

    return this.optionModel_.deleteOne({ _id: option._id }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * @typedef ShippingRequirement
   * @property {string} type - one of max_subtotal, min_subtotal
   * @property {number} value - the value to match against
   */

  /**
   * Adds a requirement to a shipping option. Only 1 requirement of each type
   * is allowed.
   * @param {string} optionId - the option to add the requirement to.
   * @param {ShippingRequirement} requirement - the requirement for the option.
   * @return {Promise} the result of update
   */
  async addRequirement(optionId, requirement) {
    const option = await this.retrieve(optionId)
    const validatedRequirement = this.validateRequirement_(requirement)

    if (option.requirements.find(r => r.type === validatedRequirement.type)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A requirement with type: ${validatedRequirement.type} already exists`
      )
    }

    return this.optionModel_.updateOne(
      { _id: option._id },
      { $push: { requirements: validatedRequirement } }
    )
  }

  /**
   * Removes a requirement from a shipping option
   * @param {string} optionId - the shipping option to remove from
   * @param {string} requirementId - the id of the requirement to remove
   * @return {Promise} the result of update
   */
  async removeRequirement(optionId, requirementId) {
    const option = await this.retrieve(optionId)

    if (!option.requirements.find(r => r._id === requirementId)) {
      // Remove is idempotent
      return Promise.resolve()
    }

    return this.optionModel_.updateOne(
      { _id: option._id },
      { $pull: { requirements: { _id: requirementId } } }
    )
  }

  /**
   * Decorates a shipping option.
   * @param {ShippingOption} shippingOption - the shipping option to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {ShippingOption} the decorated ShippingOption.
   */
  async decorate(shippingOption, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    let decorated = _.pick(shippingOption, fields.concat(requiredFields))

    return decorated
  }

  /**
   * Dedicated method to set metadata for a shipping option.
   * @param {string} optionId - the option to set metadata for.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  setMetadata(optionId, key, value) {
    const validatedId = this.validateId_(optionId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.optionModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default ShippingOptionService
