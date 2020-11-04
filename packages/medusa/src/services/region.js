import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { countries } from "../utils/countries"

/**
 * Provides layer to manipulate regions.
 * @implements BaseService
 */
class RegionService extends BaseService {
  constructor({
    regionModel,
    storeService,
    paymentProviderService,
    fulfillmentProviderService,
  }) {
    super()

    /** @private @const {RegionModel} */
    this.regionModel_ = regionModel

    /** @private @const {StoreService} */
    this.storeService_ = storeService

    /** @private @const {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @const {FulfillmentProviderService} */
    this.fulfillmentProviderService_ = fulfillmentProviderService
  }

  /**
   * Creates a region.
   * @param {Region} rawRegion - the unvalidated region
   * @return {Region} the newly created region
   */
  async create(rawRegion) {
    const region = await this.validateFields_(rawRegion)
    return this.regionModel_.create(region)
  }

  /**
   * Updates a region. Note metadata cannot be set with the update function, use
   * setMetadata instead.
   * @param {string} regionId - the region to update
   * @param {object} update - the data to update the region with
   * @return {Promise} the result of the update operation
   */
  async update(regionId, update) {
    const region = await this.validateFields_(update, regionId)
    return this.regionModel_.updateOne(
      {
        _id: regionId,
      },
      {
        $set: region,
      }
    )
  }

  /**
   * Validates fields for creation and updates. If the region already exisits
   * the id can be passed to check that country updates are allowed.
   * @param {object} region - the region data to validate
   * @param {string?} id - optional id of the region to check against
   * @return {object} the validated region data
   */
  async validateFields_(region, id = undefined) {
    if (region.tax_rate) {
      this.validateTaxRate_(region.tax_rate)
    }

    if (region.currency_code) {
      region.currency_code = region.currency_code.toUpperCase()
      await this.validateCurrency_(region.currency_code)
    }

    if (region.countries) {
      region.countries = await Promise.all(
        region.countries.map(countryCode =>
          this.validateCountry_(countryCode, id)
        )
      ).catch(err => {
        throw err
      })
    }

    if (region.metadata) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Please use setMetadata"
      )
    }

    if (region.fulfillment_providers) {
      // Will throw if we do not find the provider
      region.fulfillment_providers.forEach(pId => {
        this.fulfillmentProviderService_.retrieveProvider(pId)
      })
    }

    if (region.payment_providers) {
      // Will throw if we do not find the provider
      region.payment_providers.forEach(pId => {
        this.paymentProviderService_.retrieveProvider(pId)
      })
    }

    return region
  }

  /**
   * Validates a tax rate. Will throw if the tax rate is not between 0 and 1.
   * @param {number} taxRate - a number representing the tax rate of the region
   */
  validateTaxRate_(taxRate) {
    if (taxRate > 1 || taxRate < 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The tax_rate must be between 0 and 1"
      )
    }
  }

  /**
   * Validates a currency code. Will throw if the currency code doesn't exist.
   * @param {string} currencyCode - an ISO currency code
   */
  async validateCurrency_(currencyCode) {
    const store = await this.storeService_.retrieve()

    if (!store.currencies.includes(currencyCode.toUpperCase())) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid currency code"
      )
    }
  }

  /**
   * Validates a country code. Will normalize the code before checking for
   * existence.
   * @param {string} code - a 2 digit alphanumeric ISO country code
   * @param {string} id - the id of the current region to check against
   */
  async validateCountry_(code, id) {
    const countryCode = code.toUpperCase()
    const country = countries.find(c => c.alpha2 === countryCode)
    if (!country) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid country code"
      )
    }

    const existing = await this.regionModel_.findOne({ countries: countryCode })
    if (existing && !existing._id.equals(id)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `${country.name} already exists in ${existing.name}, delete it in that region before adding it`
      )
    }

    return countryCode
  }

  /**
   * Used to validate region ids. Throws an error if the cast fails
   * @param {string} rawId - the raw region id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The regionId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Retrieves a region by its id.
   * @param {string} regionId - the id of the region to retrieve
   * @return {Region} the region
   */
  async retrieve(regionId) {
    const validatedId = this.validateId_(regionId)
    const region = await this.regionModel_.findOne({ _id: validatedId })

    if (!region) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Region with ${regionId} was not found`
      )
    }
    return region
  }

  /**
   * Lists all regions based on a query
   * @param {string} regionId - the id of the region to retrieve
   * @return {Region} the region
   */
  async list(query) {
    const regions = await this.regionModel_.find(query)
    return regions
  }

  /**
   * Deletes a region.
   * @param {string} regionId - the region to delete
   * @return {Promise} the result of the delete operation
   */
  delete(regionId) {
    return this.regionModel_.deleteOne({
      _id: regionId,
    })
  }

  /**
   * Adds a country to the region.
   * @param {string} regionId - the region to add a country to
   * @param {string} code - a 2 digit alphanumeric ISO country code.
   * @return {Promise} the result of the update operation
   */
  async addCountry(regionId, code) {
    const region = await this.retrieve(regionId)
    const countryCode = await this.validateCountry_(code, regionId)

    if (region.countries.includes(countryCode)) {
      return Promise.resolve()
    }

    return this.regionModel_.updateOne(
      {
        _id: region._id,
      },
      {
        $push: { countries: countryCode },
      }
    )
  }

  /**
   * Removes a country from a Region
   * @param {string} regionId - the region to remove from
   * @param {string} code - a 2 digit alphanumeric ISO country code to remove
   * @return {Promise} the result of the update operation
   */
  async removeCountry(regionId, code) {
    const countryCode = code.toUpperCase()
    const region = await this.retrieve(regionId)

    return this.regionModel_.updateOne(
      { _id: region._id },
      {
        $pull: {
          countries: countryCode,
        },
      }
    )
  }

  /**
   * Adds a payment provider that is available in the region. Fails if the
   * provider doesn't exist.
   * @param {string} regionId - the region to add the provider to
   * @param {string} providerId - the provider to add to the region
   * @return {Promise} the result of the update operation
   */
  async addPaymentProvider(regionId, providerId) {
    const region = await this.retrieve(regionId)

    if (region.payment_providers.includes(providerId)) {
      return Promise.resolve()
    }

    // Will throw if we do not find the provider
    this.paymentProviderService_.retrieveProvider(providerId)

    return this.regionModel_.updateOne(
      {
        _id: region._id,
      },
      {
        $push: { payment_providers: providerId },
      }
    )
  }

  /**
   * Adds a fulfillment provider that is available in the region. Fails if the
   * provider doesn't exist.
   * @param {string} regionId - the region to add the provider to
   * @param {string} providerId - the provider to add to the region
   * @return {Promise} the result of the update operation
   */
  async addFulfillmentProvider(regionId, providerId) {
    const region = await this.retrieve(regionId)

    if (region.fulfillment_providers.includes(providerId)) {
      return Promise.resolve()
    }

    // Will throw if we do not find the provider
    this.fulfillmentProviderService_.retrieveProvider(providerId)

    return this.regionModel_.updateOne(
      {
        _id: region._id,
      },
      {
        $push: { fulfillment_providers: providerId },
      }
    )
  }

  /**
   * Removes a payment provider from a region. Is idempotent.
   * @param {string} regionId - the region to remove the provider from
   * @param {string} providerId - the provider to remove from the region
   * @return {Promise} the result of the update operation
   */
  async removePaymentProvider(regionId, providerId) {
    const region = await this.retrieve(regionId)

    return this.regionModel_.updateOne(
      { _id: region._id },
      {
        $pull: {
          payment_providers: providerId,
        },
      }
    )
  }

  /**
   * Removes a fulfillment provider from a region. Is idempotent.
   * @param {string} regionId - the region to remove the provider from
   * @param {string} providerId - the provider to remove from the region
   * @return {Promise} the result of the update operation
   */
  async removeFulfillmentProvider(regionId, providerId) {
    const region = await this.retrieve(regionId)

    return this.regionModel_.updateOne(
      { _id: region._id },
      {
        $pull: {
          fulfillment_providers: providerId,
        },
      }
    )
  }

  /**
   * Decorates a region
   * @param {object} region - the region to decorate
   * @param {[string]} fields - the fields to include
   * @param {[string]} expandFields - the fields to expand
   * @return {Region} the region
   */
  async decorate(region, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(region, fields.concat(requiredFields))
    const final = await this.runDecorators_(decorated)
    return final
  }

  /**
   * Dedicated method to set metadata for a region.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} regionId - the region to decorate.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  async setMetadata(regionId, key, value) {
    const validatedId = this.validateId_(regionId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.regionModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Dedicated method to delete metadata for an region.
   * @param {string} regionId - the region to delete metadata from.
   * @param {string} key - key for metadata field
   * @return {Promise} resolves to the updated result.
   */
  async deleteMetadata(regionId, key) {
    const validatedId = this.validateId_(regionId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.regionModel_
      .updateOne({ _id: validatedId }, { $unset: { [keyPath]: "" } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default RegionService
