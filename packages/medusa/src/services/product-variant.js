import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

/**
 * Provides layer to manipulate product variants.
 * @implements BaseService
 */
class ProductVariantService extends BaseService {
  /** @param { productVariantModel: (ProductVariantModel) } */
  constructor({ productVariantModel, eventBusService, regionService }) {
    super()

    /** @private @const {ProductVariantModel} */
    this.productVariantModel_ = productVariantModel

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {RegionService} */
    this.regionService_ = regionService
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
        "The variantId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Gets a product variant by id.
   * @param {string} variantId - the id of the product to get.
   * @return {Promise<Product>} the product document.
   */
  async retrieve(variantId) {
    const validatedId = this.validateId_(variantId)
    const variant = await this.productVariantModel_
      .findOne({ _id: validatedId })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variant with ${variantId} was not found`
      )
    }
    return variant
  }

  /**
   * Creates an unpublished product variant.
   * @param {object} variant - the variant to create
   * @return {Promise} resolves to the creation result.
   */
  async createDraft(productVariant) {
    return this.productVariantModel_
      .create({
        ...productVariant,
        published: false,
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Creates an publishes variant.
   * @param {string} variantId - ID of the variant to publish.
   * @return {Promise} resolves to the creation result.
   */
  publish(variantId) {
    return this.productVariantModel_
      .updateOne({ _id: variantId }, { $set: { published: true } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Updates a variant. Metadata updates and price updates should
   * use dedicated methods, e.g. `setMetadata`, etc. The function
   * will throw errors if metadata updates and price updates are attempted.
   * @param {string} variantId - the id of the variant. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(variantId, update) {
    const validatedId = this.validateId_(variantId)

    if (update.prices) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setCurrencyPrices, setRegionPrices method to update prices field"
      )
    }

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    return this.productVariantModel_
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
   * Sets the default price for the given currency.
   * @param {string} variantId - the id of the variant to set prices for
   * @param {string} currencyCode - the currency to set prices for
   * @param {number} amount - the amount to set the price to
   * @return {Promise} the result of the update operation
   */
  async setCurrencyPrice(variantId, currencyCode, amount) {
    const variant = await this.retrieve(variantId)

    // If prices already exist we need to update all prices with the same
    // currency
    if (variant.prices.length) {
      let foundDefault = false
      const newPrices = variant.prices.map(moneyAmount => {
        if (moneyAmount.currency_code === currencyCode) {
          moneyAmount.amount = amount

          if (!moneyAmount.region_id) {
            foundDefault = true
          }
        }

        return moneyAmount
      })

      // If there is no price entries for the currency we are updating we need
      // to push it
      if (!foundDefault) {
        newPrices.push({
          currency_code: currencyCode,
          amount,
        })
      }

      return this.productVariantModel_.updateOne(
        {
          _id: variant._id,
        },
        {
          $set: {
            prices: newPrices,
          },
        }
      )
    }

    return this.productVariantModel_.updateOne(
      {
        _id: variant._id,
      },
      {
        $set: {
          prices: [
            {
              currency_code: currencyCode,
              amount,
            },
          ],
        },
      }
    )
  }

  /**
   * Gets the price specific to a region. If no region specific money amount
   * exists the function will try to use a currency price. If no default
   * currency price exists the function will throw an error.
   * @param {string} variantId - the id of the variant to get price from
   * @param {string} regionId - the id of the region to get price for
   * @return {number} the price specific to the region
   */
  async getRegionPrice(variantId, regionId) {
    const variant = await this.retrieve(variantId)
    const region = await this.regionService_.retrieve(regionId)

    let price
    variant.prices.forEach(({ region_id, amount, currency_code }) => {
      if (!price && !region_id && currency_code === region.currency_code) {
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

  /**
   * Sets the price of a specific region
   * @param {string} variantId - the id of the variant to update
   * @param {string} regionId - the id of the region to set price for
   * @param {number} amount - the amount to set the price to
   * @return {Promise} the result of the update operation
   */
  async setRegionPrice(variantId, regionId, amount) {
    const variant = await this.retrieve(variantId)
    const region = await this.regionService_.retrieve(regionId)

    // If prices already exist we need to update all prices with the same currency
    if (variant.prices.length) {
      let foundRegion = false
      const newPrices = variant.prices.map(moneyAmount => {
        if (moneyAmount.region_id === region._id) {
          moneyAmount.amount = amount
          foundRegion = true
        }

        return moneyAmount
      })

      // If the region doesn't exist in the prices we need to push it
      if (!foundRegion) {
        newPrices.push({
          region_id: region._id,
          currency_code: region.currency_code,
          amount,
        })
      }

      return this.productVariantModel_.updateOne(
        {
          _id: variant._id,
        },
        {
          $set: {
            prices: newPrices,
          },
        }
      )
    }

    // Set the price both for default currency price and for the region
    return this.productVariantModel_.updateOne(
      {
        _id: variant._id,
      },
      {
        $set: {
          prices: [
            {
              region_id: region._id,
              currency_code: region.currency_code,
              amount,
            },
            {
              currency_code: region.currency_code,
              amount,
            },
          ],
        },
      }
    )
  }

  /**
   * Adds option value to a varaint.
   * Fails when product with variant does not exists or
   * if that product does not have an option with the given
   * option id. Fails if given variant is not found.
   * Option value must be of type string or number.
   * @param {string} variantId - the variant to decorate.
   * @param {string} optionId - the option from product.
   * @param {string | number} optionValue - option value to add.
   * @return {Promise} the result of the update operation.
   */
  async addOptionValue(variantId, optionId, optionValue) {
    const variant = await this.retrieve(variantId)

    if (typeof optionValue !== "string" && typeof optionValue !== "number") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Option value is not of type string or number`
      )
    }

    return this.productVariantModel_.updateOne(
      { _id: variant._id },
      { $push: { options: { option_id: optionId, value: `${optionValue}` } } }
    )
  }

  /**
   * Deletes option value from given variant.
   * Fails when product with variant does not exists or
   * if that product has an option with the given
   * option id.
   * This method should only be used from the product service.
   * @param {string} variantId - the variant to decorate.
   * @param {string} optionId - the option from product.
   * @return {Promise} the result of the update operation.
   */
  async deleteOptionValue(variantId, optionId) {
    return this.productVariantModel_.updateOne(
      { _id: variantId },
      { $pull: { options: { option_id: optionId } } }
    )
  }

  /**
   * Checks if the inventory of a variant can cover a given quantity. Will
   * return true if the variant doesn't have managed inventory or if the variant
   * allows backorders or if the inventory quantity is greater than `quantity`.
   * @params {string} variantId - the id of the variant to check
   * @params {number} quantity - the number of units to check availability for
   * @return {boolean} true if the inventory covers the quantity
   */
  async canCoverQuantity(variantId, quantity) {
    const variant = await this.retrieve(variantId)

    const { inventory_quantity, allow_backorder, manage_inventory } = variant
    return (
      !manage_inventory || allow_backorder || inventory_quantity >= quantity
    )
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.productVariantModel_.find(selector)
  }

  /**
   * Deletes a variant from given variant id.
   * @param {string} variantId - the id of the variant to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(variantId) {
    let variant
    try {
      variant = await this.retrieve(variantId)
    } catch (error) {
      // Delete is idempotent, but we return a promise to allow then-chaining
      return Promise.resolve()
    }

    return this.productVariantModel_
      .deleteOne({ _id: variant._id })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Decorates a variant with variant variants.
   * @param {ProductVariant} variant - the variant to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {ProductVariant} return the decorated variant.
   */
  async decorate(variant, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(variant, fields.concat(requiredFields))
    return decorated
  }

  /**
   * Dedicated method to set metadata for a variant.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} variantId - the variant to decorate.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  setMetadata(variantId, key, value) {
    const validatedId = this.validateId_(variantId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.productVariantModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default ProductVariantService
