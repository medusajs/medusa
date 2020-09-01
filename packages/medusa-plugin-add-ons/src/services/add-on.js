import _ from "lodash"
import { BaseService } from "medusa-interfaces"

class AddOnService extends BaseService {
  static Events = {
    UPDATED: "add_on.updated",
    CREATED: "add_on.created",
  }

  constructor(
    { addOnModel, productService, productVariantService, eventBusService },
    options
  ) {
    super()

    this.addOnModel_ = addOnModel

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.eventBus_ = eventBusService

    this.options_ = options
  }

  /**
   * Used to validate product ids. Throws an error if the cast fails
   * @param {string} rawId - the raw product id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The productId could not be casted to an ObjectId"
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
   * Creates an unpublished add-on.
   * @param {object} addOn - the add-on to create
   * @return {Promise} resolves to the creation result.
   */
  async create(addOn) {
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
   * Updates a product. Metadata updates and product variant updates should
   * use dedicated methods, e.g. `setMetadata`, `addVariant`, etc. The function
   * will throw errors if metadata or product variant updates are attempted.
   * @param {string} productId - the id of the product. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(productId, update) {
    const validatedId = this.validateId_(productId)

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    if (update.variants) {
      const existingVariants = await this.retrieveVariants(validatedId)
      for (const existing of existingVariants) {
        if (!update.variants.find((v) => v._id && existing._id.equals(v._id))) {
          await this.deleteVariant(productId, existing._id)
        }
      }

      await Promise.all(
        update.variants.map(async (variant) => {
          if (variant._id) {
            const variantFromDb = existingVariants.find((v) =>
              v._id.equals(variant._id)
            )
            if (variant.prices && variant.prices.length) {
              // if equal we dont want to update
              const isPricesEqual = compareObjectsByProp(
                variant,
                variantFromDb,
                "prices"
              )

              if (!isPricesEqual) {
                for (const price of variant.prices) {
                  if (price.region_id) {
                    await this.productVariantService_.setRegionPrice(
                      variant._id,
                      price.region_id,
                      price.amount
                    )
                  } else {
                    await this.productVariantService_.setCurrencyPrice(
                      variant._id,
                      price.currency_code,
                      price.amount
                    )
                  }
                }
              }
            }

            if (variant.options && variant.options.length) {
              // if equal we dont want to update
              const isOptionsEqual = compareObjectsByProp(
                variant,
                variantFromDb,
                "options"
              )

              if (!isOptionsEqual) {
                for (const option of variant.options) {
                  await this.updateOptionValue(
                    productId,
                    variant._id,
                    option.option_id,
                    option.value
                  )
                }
              }
            }

            delete variant.prices
            delete variant.options

            if (!_.isEmpty(variant)) {
              await this.productVariantService_.update(variant._id, variant)
            }
          } else {
            await this.createVariant(productId, variant).then((res) => res._id)
          }
        })
      )

      delete update.variants
    }

    return this.addOnModel_
      .updateOne(
        { _id: validatedId },
        { $set: update },
        { runValidators: true }
      )
      .then((result) => {
        this.eventBus_.emit(ProductService.Events.UPDATED, result)
        return result
      })
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default AddOnService
