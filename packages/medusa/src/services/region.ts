import { DeepPartial, EntityManager } from "typeorm"

import { isDefined, MedusaError } from "medusa-core-utils"

import { TransactionBaseService } from "../interfaces"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { Country, Currency, Region } from "../models"
import { CountryRepository } from "../repositories/country"
import { CurrencyRepository } from "../repositories/currency"
import { FulfillmentProviderRepository } from "../repositories/fulfillment-provider"
import { PaymentProviderRepository } from "../repositories/payment-provider"
import { RegionRepository } from "../repositories/region"
import { TaxProviderRepository } from "../repositories/tax-provider"
import { FindConfig, Selector } from "../types/common"
import { CreateRegionInput, UpdateRegionInput } from "../types/region"
import { buildQuery, setMetadata } from "../utils"
import { countries } from "../utils/countries"
import { FlagRouter } from "../utils/flag-router"
import EventBusService from "./event-bus"
import FulfillmentProviderService from "./fulfillment-provider"
import { PaymentProviderService } from "./index"
import StoreService from "./store"

type InjectedDependencies = {
  manager: EntityManager
  storeService: StoreService
  eventBusService: EventBusService
  paymentProviderService: PaymentProviderService
  fulfillmentProviderService: FulfillmentProviderService
  featureFlagRouter: FlagRouter

  regionRepository: typeof RegionRepository
  countryRepository: typeof CountryRepository
  currencyRepository: typeof CurrencyRepository
  taxProviderRepository: typeof TaxProviderRepository
  paymentProviderRepository: typeof PaymentProviderRepository
  fulfillmentProviderRepository: typeof FulfillmentProviderRepository
}

/**
 * Provides layer to manipulate regions.
 */
class RegionService extends TransactionBaseService {
  static Events = {
    UPDATED: "region.updated",
    CREATED: "region.created",
    DELETED: "region.deleted",
  }

  protected featureFlagRouter_: FlagRouter

  protected readonly eventBus_: EventBusService
  protected readonly storeService_: StoreService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly fulfillmentProviderService_: FulfillmentProviderService
  protected readonly regionRepository_: typeof RegionRepository
  protected readonly countryRepository_: typeof CountryRepository
  protected readonly currencyRepository_: typeof CurrencyRepository
  // eslint-disable-next-line max-len
  protected readonly paymentProviderRepository_: typeof PaymentProviderRepository
  // eslint-disable-next-line max-len
  protected readonly fulfillmentProviderRepository_: typeof FulfillmentProviderRepository
  protected readonly taxProviderRepository_: typeof TaxProviderRepository

  constructor({
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
    featureFlagRouter,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.regionRepository_ = regionRepository
    this.countryRepository_ = countryRepository
    this.storeService_ = storeService
    this.eventBus_ = eventBusService
    this.currencyRepository_ = currencyRepository
    this.paymentProviderRepository_ = paymentProviderRepository
    this.fulfillmentProviderRepository_ = fulfillmentProviderRepository
    this.paymentProviderService_ = paymentProviderService
    this.taxProviderRepository_ = taxProviderRepository
    this.fulfillmentProviderService_ = fulfillmentProviderService

    this.featureFlagRouter_ = featureFlagRouter
  }

  /**
   * Creates a region.
   *
   * @param data - the unvalidated region
   * @return the newly created region
   */
  async create(data: CreateRegionInput): Promise<Region> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepository = manager.withRepository(this.regionRepository_)
      const currencyRepository = manager.withRepository(
        this.currencyRepository_
      )

      const regionObject = { ...data } as DeepPartial<Region>
      const { metadata, currency_code, includes_tax, ...toValidate } = data

      const validated = await this.validateFields(toValidate)

      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        )
      ) {
        if (typeof includes_tax !== "undefined") {
          regionObject.includes_tax = includes_tax
        }
      }

      if (currency_code) {
        // will throw if currency is not added to store currencies
        await this.validateCurrency(currency_code)
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
        regionObject.metadata = setMetadata(
          { metadata: regionObject.metadata ?? null },
          metadata
        )
      }

      for (const [key, value] of Object.entries(validated)) {
        regionObject[key] = value
      }

      const created = regionRepository.create(regionObject) as Region
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
   *
   * @param regionId - the region to update
   * @param update - the data to update the region with
   * @return the result of the update operation
   */
  async update(regionId: string, update: UpdateRegionInput): Promise<Region> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepository = manager.withRepository(this.regionRepository_)
      const currencyRepository = manager.withRepository(
        this.currencyRepository_
      )

      const region = await this.retrieve(regionId)

      const { metadata, currency_code, includes_tax, ...toValidate } = update

      const validated = await this.validateFields(toValidate, region.id)

      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        )
      ) {
        if (typeof includes_tax !== "undefined") {
          region.includes_tax = includes_tax
        }
      }

      if (currency_code) {
        // will throw if currency is not added to store currencies
        await this.validateCurrency(currency_code)
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
        region.metadata = setMetadata(region, metadata)
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
   * Validates fields for creation and updates. If the region already exists
   * the id can be passed to check that country updates are allowed.
   *
   * @param regionData - the region data to validate
   * @param id - optional id of the region to check against
   * @return the validated region data
   */
  protected async validateFields<
    T extends CreateRegionInput | UpdateRegionInput
  >(
    regionData: Omit<T, "metadata" | "currency_code">,
    id?: T extends UpdateRegionInput ? string : undefined
  ): Promise<DeepPartial<Region>> {
    const ppRepository = this.activeManager_.withRepository(
      this.paymentProviderRepository_
    )
    const fpRepository = this.activeManager_.withRepository(
      this.fulfillmentProviderRepository_
    )
    const tpRepository = this.activeManager_.withRepository(
      this.taxProviderRepository_
    )

    const region = { ...regionData } as DeepPartial<Region>

    if (region.tax_rate) {
      this.validateTaxRate(region.tax_rate)
    }

    if (regionData.countries) {
      region.countries = await Promise.all(
        regionData.countries!.map(async (countryCode) =>
          this.validateCountry(countryCode, id!)
        )
      ).catch((err) => {
        throw err
      })
    }

    if ((regionData as UpdateRegionInput).tax_provider_id) {
      const tp = await tpRepository.findOne({
        where: { id: (regionData as UpdateRegionInput).tax_provider_id! },
      })
      if (!tp) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Tax provider not found"
        )
      }
    }

    if (regionData.payment_providers) {
      region.payment_providers = await Promise.all(
        regionData.payment_providers.map(async (pId) => {
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

    if (regionData.fulfillment_providers) {
      region.fulfillment_providers = await Promise.all(
        regionData.fulfillment_providers.map(async (fId) => {
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
   *
   * @param taxRate - a number representing the tax rate of the region
   * @throws if the tax rate isn't number between 0-100
   * @return void
   */
  protected validateTaxRate(taxRate: number): void | never {
    if (taxRate > 100 || taxRate < 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The tax_rate must be between 0 and 1"
      )
    }
  }

  /**
   * Validates a currency code. Will throw if the currency code doesn't exist.
   *
   * @param currencyCode - an ISO currency code
   * @throws if the provided currency code is invalid
   * @return void
   */
  protected async validateCurrency(
    currencyCode: Currency["code"]
  ): Promise<void | never> {
    const store = await this.storeService_
      .withTransaction(this.transactionManager_)
      .retrieve({ relations: ["currencies"] })

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
   *
   * @param code - a 2 digit alphanumeric ISO country code
   * @param regionId - the id of the current region to check against
   * @return the validated Country
   */
  protected async validateCountry(
    code: Country["iso_2"],
    regionId: string
  ): Promise<Country | never> {
    const countryRepository = this.activeManager_.withRepository(
      this.countryRepository_
    )

    const countryCode = code.toUpperCase()
    const isCountryExists = countries.some(
      (country) => country.alpha2 === countryCode
    )
    if (!isCountryExists) {
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
        `${country.display_name} already exists in region ${country.region_id}`
      )
    }

    return country
  }

  /**
   * Retrieve a region by country code.
   *
   * @param code - a 2 digit alphanumeric ISO country code
   * @param config - region find config
   * @return a Region with country code
   */
  async retrieveByCountryCode(
    code: Country["iso_2"],
    config: FindConfig<Region> = {}
  ): Promise<Region | never> {
    const countryRepository = this.activeManager_.withRepository(
      this.countryRepository_
    )

    const query = buildQuery({ iso_2: code.toLowerCase() }, {})
    const country = await countryRepository.findOne(query)

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
   * Retrieves a region by name.
   *
   * @param name - the name of the region to retrieve
   * @return region with the matching name
   */
  async retrieveByName(name: string): Promise<Region | never> {
    const [region] = await this.list({ name }, { take: 1 })

    if (!region) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Region "${name}" was not found`
      )
    }

    return region
  }

  /**
   * Retrieves a region by its id.
   *
   * @param regionId - the id of the region to retrieve
   * @param config - configuration settings
   * @return the region
   */
  async retrieve(
    regionId: string,
    config: FindConfig<Region> = {}
  ): Promise<Region | never> {
    if (!isDefined(regionId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"regionId" must be defined`
      )
    }

    const regionRepository = this.activeManager_.withRepository(
      this.regionRepository_
    )

    const query = buildQuery({ id: regionId }, config)
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
   *
   * @param {object} selector - query object for find
   * @param {object} config - configuration settings
   * @return {Promise} result of the find operation
   */
  async list(
    selector: Selector<Region> = {},
    config: FindConfig<Region> = {
      relations: [],
      skip: 0,
      take: 10,
    }
  ): Promise<Region[]> {
    const regionRepo = this.activeManager_.withRepository(
      this.regionRepository_
    )

    const query = buildQuery(selector, config)
    return regionRepo.find(query)
  }

  /**
   * Deletes a region.
   *
   * @param regionId - the region to delete
   * @return the result of the delete operation
   */
  async delete(regionId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_)
      const countryRepo = manager.withRepository(this.countryRepository_)

      const region = await this.retrieve(regionId, { relations: ["countries"] })

      if (!region) {
        return Promise.resolve()
      }

      await regionRepo.softRemove(region)
      await countryRepo.update({ region_id: region.id }, { region_id: null })

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
   *
   * @param regionId - the region to add a country to
   * @param code - a 2 digit alphanumeric ISO country code.
   * @return the updated Region
   */
  async addCountry(regionId: string, code: Country["iso_2"]): Promise<Region> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_)

      const country = await this.validateCountry(code, regionId)

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
   * Removes a country from a Region.
   *
   * @param regionId - the region to remove from
   * @param code - a 2 digit alphanumeric ISO country code to remove
   * @return the updated Region
   */
  async removeCountry(
    regionId: string,
    code: Country["iso_2"]
  ): Promise<Region> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_)

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
   *
   * @param regionId - the region to add the provider to
   * @param providerId - the provider to add to the region
   * @return the updated Region
   */
  async addPaymentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_)
      const ppRepo = manager.withRepository(this.paymentProviderRepository_)

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
   *
   * @param regionId - the region to add the provider to
   * @param providerId - the provider to add to the region
   * @return the updated Region
   */
  async addFulfillmentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_)
      const fpRepo = manager.withRepository(this.fulfillmentProviderRepository_)

      const region = await this.retrieve(regionId, {
        relations: ["fulfillment_providers"],
      })

      // Check if region already has payment provider
      if (region.fulfillment_providers.find(({ id }) => id === providerId)) {
        return Promise.resolve(region)
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
   *
   * @param regionId - the region to remove the provider from
   * @param providerId - the provider to remove from the region
   * @return the updated Region
   */
  async removePaymentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_)

      const region = await this.retrieve(regionId, {
        relations: ["payment_providers"],
      })

      // Check if region already has payment provider
      if (!region.payment_providers.find(({ id }) => id === providerId)) {
        return Promise.resolve(region)
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
   *
   * @param regionId - the region to remove the provider from
   * @param providerId - the provider to remove from the region
   * @return the updated Region
   */
  async removeFulfillmentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
    return await this.atomicPhase_(async (manager) => {
      const regionRepo = manager.withRepository(this.regionRepository_)

      const region = await this.retrieve(regionId, {
        relations: ["fulfillment_providers"],
      })

      // Check if region already has payment provider
      if (!region.fulfillment_providers.find(({ id }) => id === providerId)) {
        return Promise.resolve(region)
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
