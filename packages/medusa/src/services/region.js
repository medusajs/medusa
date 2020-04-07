import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { countries } from "../utils/countries"
import { currencies } from "../utils/currencies"

/**
 * Provides layer to manipulate regions.
 * @implements BaseService
 */
class RegionService extends BaseService {
  constructor({
    regionModel,
    paymentProviderService,
    fulfillmentProviderService,
  }) {
    super()

    /** @private @const {RegionModel} */
    this.regionModel_ = regionModel

    /** @private @const {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @const {FulfillmentProviderService} */
    this.fulfillmentProviderService_ = fulfillmentProviderService
  }

  async create(rawRegion) {
    const region = await this.validateFields_(rawRegion)
    return this.regionModel_.create(region)
  }

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

  async validateFields_(region, id = undefined) {
    if (region.tax_rate) {
      this.validateTaxRate_(region.tax_rate)
    }

    if (region.currency_code) {
      region.currency_code = region.currency_code.toUpperCase()
      this.validateCurrency_(region.currency_code)
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

  validateTaxRate_(taxRate) {
    if (taxRate > 1 || taxRate < 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The tax_rate must be between 0 and 1"
      )
    }
  }

  validateCurrency_(currencyCode) {
    if (!currencies[currencyCode]) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid currency code"
      )
    }
  }

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
    if (existing && existing._id !== id) {
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
    const { value, error } = schema.validate(rawId)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The regionId could not be casted to an ObjectId"
      )
    }

    return value
  }

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

  delete(regionId) {
    return this.regionModel_.deleteOne({
      _id: regionId,
    })
  }

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
}

export default RegionService
