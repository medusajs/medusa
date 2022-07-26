import { EntityManager } from "typeorm"

import { MedusaError } from "medusa-core-utils"

import StoreService from "./store"
import EventBusService from "./event-bus"
import { countries } from "../utils/countries"
import { TransactionBaseService } from "../interfaces"
import { RegionRepository } from "../repositories/region"
import { CountryRepository } from "../repositories/country"
import { CurrencyRepository } from "../repositories/currency"
import { PaymentProviderRepository } from "../repositories/payment-provider"
import { FulfillmentProviderRepository } from "../repositories/fulfillment-provider"
import { TaxProviderRepository } from "../repositories/tax-provider"
import FulfillmentProviderService from "./fulfillment-provider"
import { Country, Currency, Region } from "../models"
import { Selector } from "../types/common"
import {
  CreateRegionInput,
  FindRegionConfig,
  UpdateRegionInput,
} from "../types/region"

type InjectedDependencies = {
  manager: EntityManager
  storeService: StoreService
  eventBusService: EventBusService
  fulfillmentProviderService: FulfillmentProviderService

  regionRepository: typeof RegionRepository
  countryRepository: typeof CountryRepository
  currencyRepository: typeof CurrencyRepository
  taxProviderRepository: typeof TaxProviderRepository
  paymentProviderService: typeof PaymentProviderRepository
  paymentProviderRepository: typeof PaymentProviderRepository
  fulfillmentProviderRepository: typeof FulfillmentProviderRepository
}

type ValidationPartial<T> = Omit<T, "metadata" | "currency_code">

/**
 * Provides layer to manipulate regions.
 * @extends BaseService
 */
class RegionService extends TransactionBaseService<RegionService> {
  static Events = {
    UPDATED: "region.updated",
    CREATED: "region.created",
    DELETED: "region.deleted",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly eventBus_: EventBusService
  protected readonly storeService_: StoreService
  protected readonly fulfillmentProviderService_: FulfillmentProviderService
  protected readonly regionRepository_: typeof RegionRepository
  protected readonly countryRepository_: typeof CountryRepository
  protected readonly currencyRepository_: typeof CurrencyRepository
  protected readonly paymentProviderRepository_: typeof PaymentProviderRepository
  protected readonly fulfillmentProviderRepository_: typeof FulfillmentProviderRepository
  protected readonly taxProviderRepository_: typeof TaxProviderRepository
  protected readonly paymentProviderService_: typeof PaymentProviderRepository

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
  }: InjectedDependencies) {
    super({
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
    })

    this.manager_ = manager
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
  }

  /**
   * Creates a region.
   *
   * @param regionObject - the unvalidated region
   * @return the newly created region
   */
  async create(regionObject: CreateRegionInput): Promise<Region> {
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

        ;(regionObject as CreateRegionInput & { currency: Currency }).currency =
          currency
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
   *
   * @param regionId - the region to update
   * @param update - the data to update the region with
   * @return the result of the update operation
   */
  async update(regionId: string, update: UpdateRegionInput): Promise<Region> {
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
   * Validates fields for creation and updates. If the region already exists
   * the id can be passed to check that country updates are allowed.
   *
   * @param region - the region data to validate
   * @param id - optional id of the region to check against
   * @return the validated region data
   */
  async validateFields_<T extends CreateRegionInput>(
    region: ValidationPartial<T>
  ): Promise<T>
  async validateFields_<T extends UpdateRegionInput>(
    region: ValidationPartial<T>,
    id: string
  ): Promise<T>
  async validateFields_<T extends CreateRegionInput | UpdateRegionInput>(
    region: T,
    id?: string
  ): Promise<T> {
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

    if ((region as T & { countries: Country[] }).countries) {
      ;(region.countries as unknown as Country[]) = await Promise.all(
        region.countries!.map((countryCode) =>
          this.validateCountry_(countryCode, id!)
        )
      ).catch((err) => {
        throw err
      })
    }

    if ((region as UpdateRegionInput).tax_provider_id) {
      const tp = await tpRepository.findOne({
        where: { id: (region as UpdateRegionInput).tax_provider_id },
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
   *
   * @param taxRate - a number representing the tax rate of the region
   * @throws if the tax rate isn't number between 0-100
   * @return void
   */
  validateTaxRate_(taxRate: number): void | never {
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
  async validateCurrency_(
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
  async validateCountry_(
    code: Country["iso_2"],
    regionId: string
  ): Promise<Country | never> {
    const countryRepository = this.manager_.getCustomRepository(
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
    config: FindRegionConfig = {}
  ): Promise<Region | never> {
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
   *
   * @param regionId - the id of the region to retrieve
   * @param config - configuration settings
   * @return the region
   */
  async retrieve(
    regionId: string,
    config: FindRegionConfig = {}
  ): Promise<Region | never> {
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
   *
   * @param {object} selector - query object for find
   * @param {object} config - configuration settings
   * @return {Promise} result of the find operation
   */
  async list(
    selector: Selector<Region> = {},
    config: FindRegionConfig = {
      relations: [],
      skip: 0,
      take: 10,
    }
  ): Promise<Region[]> {
    const regionRepo = this.manager_.getCustomRepository(this.regionRepository_)

    const query = this.buildQuery_(selector, config)
    return regionRepo.find(query)
  }

  /**
   * Deletes a region.
   *
   * @param regionId - the region to delete
   * @return the result of the delete operation
   */
  async delete(regionId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const regionRepo = manager.getCustomRepository(this.regionRepository_)
      const countryRepo = manager.getCustomRepository(this.countryRepository_)

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
   *
   * @param regionId - the region to add the provider to
   * @param providerId - the provider to add to the region
   * @return the updated Region
   */
  async addPaymentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
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
   *
   * @param regionId - the region to add the provider to
   * @param providerId - the provider to add to the region
   * @return the updated Region
   */
  async addFulfillmentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
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
   *
   * @param regionId - the region to remove the provider from
   * @param providerId - the provider to remove from the region
   * @return the updated Region
   */
  async removePaymentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
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
   *
   * @param regionId - the region to remove the provider from
   * @param providerId - the provider to remove from the region
   * @return the updated Region
   */
  async removeFulfillmentProvider(
    regionId: string,
    providerId: string
  ): Promise<Region | never> {
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
