import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

class AddOnService extends BaseService {
  static Events = {
    UPDATED: "add_on.updated",
    CREATED: "add_on.created",
  }

  constructor(
    {
      addOnModel,
      productService,
      productVariantService,
      regionService,
      eventBusService,
    },
    options
  ) {
    super()

    this.addOnModel_ = addOnModel

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.regionService_ = regionService

    this.eventBus_ = eventBusService

    this.options_ = options
  }

  /**
   * Used to validate add-on ids. Throws an error if the cast fails
   * @param {string} rawId - the raw add-on id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The addOnId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector, offset, limit) {
    return this.addOnModel_.find(selector, {}, offset, limit)
  }

  /**
   * Gets an add-on by id.
   * @param {string} addOnId - the id of the add-on to get.
   * @return {Promise<AddOn>} the add-on document.
   */
  async retrieve(addOnId) {
    const validatedId = this.validateId_(addOnId)
    const addOn = await this.addOnModel_
      .findOne({ _id: validatedId })
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!addOn) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Add-on with ${addOnId} was not found`
      )
    }
    return addOn
  }

  /**
   * Creates an add-on.
   * @param {object} addOn - the add-on to create
   * @return {Promise} resolves to the creation result.
   */
  async create(addOn) {
    await Promise.all(
      addOn.valid_for.map((prodId) => {
        this.productService_.retrieve(prodId)
      })
    )

    return this.addOnModel_
      .create(addOn)
      .then((result) => {
        this.eventBus_.emit(AddOnService.Events.CREATED, result)
        return result
      })
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Deletes an add-on.
   * @param {object} addOnId - the add-on to delete
   * @return {Promise} resolves to the deletion result.
   */
  async delete(addOnId) {
    const addOn = await this.retrieve(addOnId)
    return this.addOnModel_.deleteOne({ _id: addOn._id })
  }

  /**
   * Retrieves all valid add-ons for a given product.
   * @param {object} productId - the product id to find add-ons for
   * @return {Promise} returns a promise containing all add-ons for the product
   */
  async retrieveByProduct(productId) {
    const product = await this.productService_.retrieve(productId)
    return this.addOnModel_.find({ valid_for: product._id })
  }

  /**
   * Updates an add-on. Metadata updates should use dedicated methods, e.g.
   * `setMetadata`, etc. The function will throw errors if metadata updates
   * are attempted.
   * @param {string} addOnId - the id of the add-on. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(addOnId, update) {
    const validatedId = this.validateId_(addOnId)

    await Promise.all(
      update.valid_for.map((prodId) => {
        this.productService_.retrieve(prodId)
      })
    )

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    return this.addOnModel_
      .updateOne(
        { _id: validatedId },
        { $set: update },
        { runValidators: true }
      )
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Gets the price specific to a region. If no region specific money amount
   * exists the function will try to use a currency price. If no default
   * currency price exists the function will throw an error.
   * @param {string} addOnId - the id of the add-on to get price from
   * @param {string} regionId - the id of the region to get price for
   * @return {number} the price specific to the region
   */
  async getRegionPrice(addOnId, regionId) {
    const addOn = await this.retrieve(addOnId)
    const region = await this.regionService_.retrieve(regionId)

    let price
    addOn.prices.forEach(({ amount, currency_code }) => {
      if (!price && currency_code === region.currency_code) {
        // If we haven't yet found a price and the current money amount is
        // the default money amount for the currency of the region we have found
        // a possible price match
        price = amount
      } else if (region_id === region._id) {
        // If the region matches directly with the money amount this is the best
        // price
        price = amount
      }
    })

    // Return the price if we found a suitable match
    if (price) {
      return price
    }

    // If we got this far no price could be found for the region
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `A price for region: ${region.name} could not be found`
    )
  }
}

export default AddOnService
