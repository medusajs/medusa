import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { countries } from "../utils/countries"

/**
 * Provides layer to manipulate regions.
 * @extends BaseService
 */
class RegionService extends BaseService {
  static Events = {
    UPDATED: "region.updated",
    CREATED: "region.created",
    DELETED: "region.deleted",
  }

  constructor({
    manager,
    regionRepository,
    countryRepository,
    storeService,
    eventBusService,
    currencyRepository,
    paymentProviderRepository,
    fulfillmentProviderRepository,
    taxProviderRepository,
    paymentProviderService,
    fulfillmentProviderService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {RegionRepository} */
    this.regionRepository_ = regionRepository

    /** @private @const {CountryRepository} */
    this.countryRepository_ = countryRepository

    /** @private @const {StoreService} */
    this.storeService_ = storeService

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {CurrencyRepository} */
    this.currencyRepository_ = currencyRepository

    /** @private @const {PaymentProviderRepository} */
    this.paymentProviderRepository_ = paymentProviderRepository

    /** @private @const {FulfillmentProviderRepository} */
    this.fulfillmentProviderRepository_ = fulfillmentProviderRepository

    /** @private @const {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @const {typeof TaxProviderService} */
    this.taxProviderRepository_ = taxProviderRepository

    /** @private @const {FulfillmentProviderService} */
    this.fulfillmentProviderService_ = fulfillmentProviderService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new RegionService({
      manager: transactionManager,
      regionRepository: this.regionRepository_,
      currencyRepository: this.currencyRepository_,
      countryRepository: this.countryRepository_,
      storeService: this.storeService_,
      eventBusService: this.eventBus_,
      paymentProviderRepository: this.paymentProviderRepository_,
      paymentProviderService: this.paymentProviderService_,
      taxProviderRepository: this.taxProviderRepository_,
      taxProviderService: this.taxProviderService_,
      fulfillmentProviderRepository: this.fulfillmentProviderRepository_,
      fulfillmentProviderService: this.fulfillmentProviderService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Creates a region.
   * @param {Region} regionObject - the unvalidated region
   * @return {Region} the newly created region
   */
  async create(regionObject) {
    return this.atomicPhase_(async (manager) => {
      const regionRepository = manager.getCustomRepository(
        this.regionRepository_
      )
      const currencyRepository = manager.getCustomRepository(
        this.currencyRepository_
      )

      const { metadata, currency_code, ...toValidate } = regionObject

      const validated = await this.validateFields_(toValidate)

      if (currency_code) {
        // will throw if currency is not added to store currencies
        await this.validateCurrency_(currency_code)
        const currency = await currencyRepository.findOne({
          where: { code: currency_code.toLowerCase() },
        })

        if (!currency) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Could not find currency with code ${currency_code}`
          )
        }

        regionObject.currency = currency
        regionObject.currency_code = currency_code.toLowerCase()
      }

      if (metadata) {
        regionObject.metadata = this.setMetadata_(regionObject, metadata)
      }

      for (const [key, value] of Object.entries(validated)) {
        regionObject[key] = value
      }

      const created = regionRepository.create(regionObject)
      const result = await regionRepository.save(created)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Updates a region
   * @param {string} regionId - the region to update
   * @param {object} update - the data to update the region with
   * @return {Promise} the result of the update operation
   */
  async update(regionId, update) {
    return this.atomicPhase_(async (manager) => {
      const regionRepository = manager.getCustomRepository(
        this.regionRepository_
      )
      const currencyRepository = manager.getCustomRepository(
        this.currencyRepository_
      )

      const region = await this.retrieve(regionId)

      const { metadata, currency_code, ...toValidate } = update

      const validated = await this.validateFields_(toValidate, region.id)

      if (currency_code) {
        // will throw if currency is not added to store currencies
        await this.validateCurrency_(currency_code)
        const currency = await currencyRepository.findOne({
          where: { code: currency_code.toLowerCase() },
        })

        if (!currency) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Could not find currency with code ${currency_code}`
          )
        }

        region.currency_code = currency_code.toLowerCase()
      }

      if (metadata) {
        region.metadata = this.setMetadata_(region, metadata)
      }

      for (const [key, value] of Object.entries(validated)) {
        region[key] = value
      }

      const result = await regionRepository.save(region)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.UPDATED, {
          id: result.id,
          fields: Object.keys(update),
        })

      return result
    })
  }

  /**
   * Validates fields for creation and updates. If the region already exisits
   * the id can be passed to check that country updates are allowed.
   * @param {object} region - the region data to validate
   * @param {string?} id - optional id of the region to check against
   * @return {object} the validated region data
   */
  async validateFields_(region, id = undefined) {
    const ppRepository = this.manager_.getCustomRepository(
      this.paymentProviderRepository_
    )
    const fpRepository = this.manager_.getCustomRepository(
      this.fulfillmentProviderRepository_
    )
    const tpRepository = this.manager_.getCustomRepository(
      this.taxProviderRepository_
    )

    if (region.tax_rate) {
      this.validateTaxRate_(region.tax_rate)
    }

    if (region.countries) {
      region.countries = await Promise.all(
        region.countries.map((countryCode) =>
          this.validateCountry_(countryCode, id)
        )
      ).catch((err) => {
        throw err
      })
    }

    if (region.tax_provider_id) {
      const tp = await tpRepository.findOne({
        where: { id: region.tax_provider_id },
      })
      if (!tp) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Tax provider not found"
        )
      }
    }

    if (region.payment_providers) {
      region.payment_providers = await Promise.all(
        region.payment_providers.map(async (pId) => {
          const pp = await ppRepository.findOne({ where: { id: pId } })
          if (!pp) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Payment provider not found"
            )
          }

          return pp
        })
      )
    }

    if (region.fulfillment_providers) {
      region.fulfillment_providers = await Promise.all(
        region.fulfillment_providers.map(async (fId) => {
          const fp = await fpRepository.findOne({ where: { id: fId } })
          if (!fp) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Fulfillment provider not found"
            )
          }

          return fp
        })
      )
    }

    return region
  }

  /**
   * Validates a tax rate. Will throw if the tax rate is not between 0 and 1.
   * @param {number} taxRate - a number representing the tax rate of the region
   */
  validateTaxRate_(taxRate) {
    if (taxRate > 100 || taxRate < 0) {
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
    const store = await this.storeService_
      .withTransaction(this.transactionManager_)
      .retrieve(["currencies"])

    const storeCurrencies = store.currencies.map((curr) => curr.code)

    if (!storeCurrencies.includes(currencyCode.toLowerCase())) {
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
   * @param {string} regionId - the id of the current region to check against
   */
  async validateCountry_(code, regionId) {
    const countryRepository = this.manager_.getCustomRepository(
      this.countryRepository_
    )

    const countryCode = code.toUpperCase()
    const validCountry = countries.find((c) => c.alpha2 === countryCode)
    if (!validCountry) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid country code"
      )
    }

    const country = await countryRepository.findOne({
      where: {
        iso_2: code.toLowerCase(),
      },
    })

    if (!country) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Country with code ${code} not found`
      )
    }

    if (country.region_id && country.region_id !== regionId) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `${country.name} already exists in ${country.name}, delete it in that region before adding it`
      )
    }

    return country
  }

  async retrieveByCountryCode(code, config = {}) {
    const countryRepository = this.manager_.getCustomRepository(
      this.countryRepository_
    )

    const country = await countryRepository.findOne({
      where: {
        iso_2: code.toLowerCase(),
      },
    })

    if (!country) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Country with code ${code} not found`
      )
    }

    if (!country.region_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Country does not belong to a region`
      )
    }

    return await this.retrieve(country.region_id, config)
  }

  /**
   * Retrieves a region by its id.
   * @param {string} regionId - the id of the region to retrieve
   * @param {object} config - configuration settings
   * @return {Region} the region
   */
  async retrieve(regionId, config = {}) {
    const regionRepository = this.manager_.getCustomRepository(
      this.regionRepository_
    )

    const validatedId = this.validateId_(regionId)
    const query = this.buildQuery_({ id: validatedId }, config)
    const region = await regionRepository.findOne(query)

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
   * @param {object} selector - query object for find
   * @param {object} config - configuration settings
   * @return {Promise} result of the find operation
   */
  async list(selector = {}, config = { relations: [], skip: 0, take: 10 }) {
    const regionRepo = this.manager_.getCustomRepository(this.regionRepository_)

    const query = this.buildQuery_(selector, config)
    return regionRepo.find(query)
  }

  /**
   * Deletes a region.
   * @param {string} regionId - the region to delete
   * @return {Promise} the result of the delete operation
   */
  async delete(regionId) {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)

      const region = await regionRepo.findOne({ where: { id: regionId } })

      if (!region) {
        return Promise.resolve()
      }

      await regionRepo.softRemove(region)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.DELETED, {
          id: regionId,
        })

      return Promise.resolve()
    })
  }

  /**
   * Adds a country to the region.
   * @param {string} regionId - the region to add a country to
   * @param {string} code - a 2 digit alphanumeric ISO country code.
   * @return {Promise} the result of the update operation
   */
  async addCountry(regionId, code) {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)

      const country = await this.validateCountry_(code, regionId)

      const region = await this.retrieve(regionId, { relations: ["countries"] })

      // Check if region already has country
      if (
        region.countries &&
        region.countries.map((c) => c.iso_2).includes(country.iso_2)
      ) {
        return region
      }

      region.countries = [...(region.countries || []), country]

      const updated = await regionRepo.save(region)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.UPDATED, {
          id: updated.id,
          fields: ["countries"],
        })

      return updated
    })
  }

  /**
   * Removes a country from a Region
   * @param {string} regionId - the region to remove from
   * @param {string} code - a 2 digit alphanumeric ISO country code to remove
   * @return {Promise} the result of the update operation
   */
  async removeCountry(regionId, code) {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)

      const region = await this.retrieve(regionId, { relations: ["countries"] })

      // Check if region contains country. If not, we simpy resolve
      if (
        region.countries &&
        !region.countries.map((c) => c.iso_2).includes(code)
      ) {
        return region
      }

      region.countries = region.countries.filter(
        (country) => country.iso_2 !== code
      )

      const updated = await regionRepo.save(region)
      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.UPDATED, {
          id: updated.id,
          fields: ["countries"],
        })
      return updated
    })
  }

  /**
   * Adds a payment provider that is available in the region. Fails if the
   * provider doesn't exist.
   * @param {string} regionId - the region to add the provider to
   * @param {string} providerId - the provider to add to the region
   * @return {Promise} the result of the update operation
   */
  async addPaymentProvider(regionId, providerId) {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)
      const ppRepo = manager.getCustomRepository(
        this.paymentProviderRepository_
      )

      const region = await this.retrieve(regionId, {
        relations: ["payment_providers"],
      })

      // Check if region already has payment provider
      if (region.payment_providers.find(({ id }) => id === providerId)) {
        return region
      }

      const pp = await ppRepo.findOne({ where: { id: providerId } })

      if (!pp) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Payment provider ${providerId} was not found`
        )
      }

      region.payment_providers = [...region.payment_providers, pp]

      const updated = await regionRepo.save(region)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.UPDATED, {
          id: updated.id,
          fields: ["payment_providers"],
        })

      return updated
    })
  }

  /**
   * Adds a fulfillment provider that is available in the region. Fails if the
   * provider doesn't exist.
   * @param {string} regionId - the region to add the provider to
   * @param {string} providerId - the provider to add to the region
   * @return {Promise} the result of the update operation
   */
  async addFulfillmentProvider(regionId, providerId) {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)
      const fpRepo = manager.getCustomRepository(
        this.fulfillmentProviderRepository_
      )

      const region = await this.retrieve(regionId, {
        relations: ["fulfillment_providers"],
      })

      // Check if region already has payment provider
      if (region.fulfillment_providers.find(({ id }) => id === providerId)) {
        return Promise.resolve()
      }

      const fp = await fpRepo.findOne({ where: { id: providerId } })

      if (!fp) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Fulfillment provider ${providerId} was not found`
        )
      }

      region.fulfillment_providers = [...region.fulfillment_providers, fp]

      const updated = await regionRepo.save(region)
      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.UPDATED, {
          id: updated.id,
          fields: ["fulfillment_providers"],
        })
      return updated
    })
  }

  /**
   * Removes a payment provider from a region. Is idempotent.
   * @param {string} regionId - the region to remove the provider from
   * @param {string} providerId - the provider to remove from the region
   * @return {Promise} the result of the update operation
   */
  async removePaymentProvider(regionId, providerId) {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)

      const region = await this.retrieve(regionId, {
        relations: ["payment_providers"],
      })

      // Check if region already has payment provider
      if (!region.payment_providers.find(({ id }) => id === providerId)) {
        return Promise.resolve()
      }

      region.payment_providers = region.payment_providers.filter(
        ({ id }) => id !== providerId
      )

      const updated = await regionRepo.save(region)
      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.UPDATED, {
          id: updated.id,
          fields: ["payment_providers"],
        })
      return updated
    })
  }

  /**
   * Removes a fulfillment provider from a region. Is idempotent.
   * @param {string} regionId - the region to remove the provider from
   * @param {string} providerId - the provider to remove from the region
   * @return {Promise} the result of the update operation
   */
  async removeFulfillmentProvider(regionId, providerId) {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)

      const region = await this.retrieve(regionId, {
        relations: ["fulfillment_providers"],
      })

      // Check if region already has payment provider
      if (!region.fulfillment_providers.find(({ id }) => id === providerId)) {
        return Promise.resolve()
      }

      region.fulfillment_providers = region.fulfillment_providers.filter(
        ({ id }) => id !== providerId
      )

      const updated = await regionRepo.save(region)
      await this.eventBus_
        .withTransaction(manager)
        .emit(RegionService.Events.UPDATED, {
          id: updated.id,
          fields: ["fulfillment_providers"],
        })
      return updated
    })
  }
}

export default RegionService
