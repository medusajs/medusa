import { MedusaError } from "medusa-core-utils"
import { AwilixContainer } from "awilix"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import Redis from "ioredis"

import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line"
import { ShippingMethodTaxLineRepository } from "../repositories/shipping-method-tax-line"
import { TaxProviderRepository } from "../repositories/tax-provider"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { TaxProvider } from "../models/tax-provider"
import { LineItem } from "../models/line-item"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"
import { ShippingMethod } from "../models/shipping-method"
import { Region } from "../models/region"
import { Cart } from "../models/cart"
import { isCart } from "../types/cart"
import {
  ITaxService,
  ItemTaxCalculationLine,
  TaxCalculationContext,
} from "../interfaces/tax-service"

import { TaxServiceRate } from "../types/tax-service"

import TaxRateService from "./tax-rate"

const CACHE_TIME = 30 // seconds

/**
 * Finds tax providers and assists in tax related operations.
 */
class TaxProviderService extends BaseService {
  private container_: AwilixContainer
  private manager_: EntityManager
  private transactionManager_: EntityManager
  private taxRateService_: TaxRateService
  private taxLineRepo_: typeof LineItemTaxLineRepository
  private smTaxLineRepo_: typeof ShippingMethodTaxLineRepository
  private taxProviderRepo_: typeof TaxProviderRepository
  private redis_: Redis

  constructor(container: AwilixContainer) {
    super()

    this.container_ = container
    this.taxLineRepo_ = container["lineItemTaxLineRepository"]
    this.smTaxLineRepo_ = container["shippingMethodTaxLineRepository"]
    this.taxRateService_ = container["taxRateService"]
    this.eventBus_ = container["eventBusService"]
    this.taxProviderRepo_ = container["taxProviderRepository"]
    this.manager_ = container["manager"]
    this.redis_ = container["redisClient"]
  }

  withTransaction(transactionManager: EntityManager): TaxProviderService {
    if (!transactionManager) {
      return this
    }

    const cloned = new TaxProviderService(this.container_)

    cloned.transactionManager_ = transactionManager
    cloned.manager_ = transactionManager

    return cloned
  }

  async list(): Promise<TaxProvider[]> {
    const tpRepo = this.manager_.getCustomRepository(this.taxProviderRepo_)
    return tpRepo.find({})
  }

  /**
   * Retrieves the relevant tax provider for the given region.
   * @param region - the region to get tax provider for.
   * @return the region specific tax provider
   */
  retrieveProvider(region: Region): ITaxService {
    let provider: ITaxService
    if (region.tax_provider_id) {
      provider = this.container_[`tp_${region.tax_provider_id}`]
    } else {
      provider = this.container_["systemTaxService"]
    }

    if (!provider) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a tax provider with id: ${region.tax_provider_id}`
      )
    }

    return provider
  }

  /**
   * Persists the tax lines relevant for an order to the database.
   * @param cartOrLineItems - the cart or line items to create tax lines for
   * @param calculationContext - the calculation context to get tax lines by
   * @return the newly created tax lines
   */
  async createTaxLines(
    cartOrLineItems: Cart | LineItem[],
    calculationContext: TaxCalculationContext
  ): Promise<(ShippingMethodTaxLine | LineItemTaxLine)[]> {
    let taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[] = []
    if (isCart(cartOrLineItems)) {
      taxLines = await this.getTaxLines(
        cartOrLineItems.items,
        calculationContext
      )
    } else {
      taxLines = await this.getTaxLines(cartOrLineItems, calculationContext)
    }

    return this.manager_.save(taxLines)
  }

  /**
   * Persists the tax lines relevant for a shipping method to the database. Used
   * for return shipping methods.
   * @param shippingMethod - the shipping method to create tax lines for
   * @param calculationContext - the calculation context to get tax lines by
   * @return the newly created tax lines
   */
  async createShippingTaxLines(
    shippingMethod: ShippingMethod,
    calculationContext: TaxCalculationContext
  ): Promise<(ShippingMethodTaxLine | LineItemTaxLine)[]> {
    const taxLines = await this.getShippingTaxLines(
      shippingMethod,
      calculationContext
    )
    return this.manager_.save(taxLines)
  }

  /**
   * Gets the relevant tax lines for a shipping method. Note: this method
   * doesn't persist the tax lines. Use createShippingTaxLines if you wish to
   * persist the tax lines to the DB layer.
   * @param shippingMethod - the shipping method to get tax lines for
   * @param calculationContext - the calculation context to get tax lines by
   * @return the computed tax lines
   */
  async getShippingTaxLines(
    shippingMethod: ShippingMethod,
    calculationContext: TaxCalculationContext
  ): Promise<ShippingMethodTaxLine[]> {
    const calculationLines = [
      {
        shipping_method: shippingMethod,
        rates: await this.getRegionRatesForShipping(
          shippingMethod.shipping_option_id,
          calculationContext.region
        ),
      },
    ]

    const taxProvider = this.retrieveProvider(calculationContext.region)
    const providerLines = await taxProvider.getTaxLines(
      [],
      calculationLines,
      calculationContext
    )

    const smTaxLineRepo = this.manager_.getCustomRepository(this.smTaxLineRepo_)

    // .create only creates entities nothing is persisted in DB
    return providerLines.map((pl) => {
      if (!("shipping_method_id" in pl)) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Expected only shipping method tax lines"
        )
      }

      return smTaxLineRepo.create({
        shipping_method_id: pl.shipping_method_id,
        rate: pl.rate,
        name: pl.name,
        code: pl.code,
        metadata: pl.metadata,
      })
    })
  }

  /**
   * Gets the relevant tax lines for an order or cart. If an order is provided
   * the order's tax lines will be returned. If a cart is provided the tax lines
   * will be computed from the tax rules and potentially a 3rd party tax plugin.
   * Note: this method doesn't persist the tax lines. Use createTaxLines if you
   * wish to persist the tax lines to the DB layer.
   * @param lineItems - the cart or order to get tax lines for
   * @param calculationContext - the calculation context to get tax lines by
   * @return the computed tax lines
   */
  async getTaxLines(
    lineItems: LineItem[],
    calculationContext: TaxCalculationContext
  ): Promise<(ShippingMethodTaxLine | LineItemTaxLine)[]> {
    const calculationLines = await Promise.all(
      lineItems.map(async (l) => {
        if (l.is_return) {
          return null
        }

        if (l.variant && l.variant.product_id) {
          return {
            item: l,
            rates: await this.getRegionRatesForProduct(
              l.variant.product_id,
              calculationContext.region
            ),
          }
        }

        /*
         * If the line item is custom and therefore not associated with a
         * product we assume no taxes - we should consider adding rate overrides
         * to custom lines at some point
         */
        return {
          item: l,
          rates: [],
        }
      })
    )

    const shippingCalculationLines = await Promise.all(
      calculationContext.shipping_methods.map(async (sm) => {
        return {
          shipping_method: sm,
          rates: await this.getRegionRatesForShipping(
            sm.shipping_option_id,
            calculationContext.region
          ),
        }
      })
    )

    const taxProvider = this.retrieveProvider(calculationContext.region)
    const providerLines = await taxProvider.getTaxLines(
      calculationLines.filter((v) => v !== null) as ItemTaxCalculationLine[],
      shippingCalculationLines,
      calculationContext
    )

    const liTaxLineRepo = this.manager_.getCustomRepository(this.taxLineRepo_)
    const smTaxLineRepo = this.manager_.getCustomRepository(this.smTaxLineRepo_)

    // .create only creates entities nothing is persisted in DB
    return providerLines.map((pl) => {
      if ("shipping_method_id" in pl) {
        return smTaxLineRepo.create({
          shipping_method_id: pl.shipping_method_id,
          rate: pl.rate,
          name: pl.name,
          code: pl.code,
          metadata: pl.metadata,
        })
      }

      if (!("item_id" in pl)) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Tax Provider returned invalid tax lines"
        )
      }

      return liTaxLineRepo.create({
        item_id: pl.item_id,
        rate: pl.rate,
        name: pl.name,
        code: pl.code,
        metadata: pl.metadata,
      })
    })
  }

  /**
   * Gets the tax rates configured for a shipping option. The rates are cached
   * between calls.
   * @param optionId - the option id of the shipping method.
   * @param region - the region to get configured rates for.
   * @return the tax rates configured for the shipping option.
   */
  async getRegionRatesForShipping(
    optionId: string,
    region: Region
  ): Promise<TaxServiceRate[]> {
    const cacheHit = await this.getCacheEntry(optionId, region.id)
    if (cacheHit) {
      return cacheHit
    }

    let toReturn: TaxServiceRate[] = []
    const optionRates = await this.taxRateService_.listByShippingOption(
      optionId,
      { region_id: region.id }
    )

    if (optionRates.length > 0) {
      toReturn = optionRates.map((pr) => {
        return {
          rate: pr.rate,
          name: pr.name,
          code: pr.code,
        }
      })
    }

    if (toReturn.length === 0) {
      toReturn = [
        {
          rate: region.tax_rate,
          name: "default",
          code: "default",
        },
      ]
    }

    await this.setCache(optionId, region.id, toReturn)

    return toReturn
  }

  /**
   * Gets the tax rates configured for a product. The rates are cached between
   * calls.
   * @param productId - the product id to get rates for
   * @param region - the region to get configured rates for.
   * @return the tax rates configured for the shipping option.
   */
  async getRegionRatesForProduct(
    productId: string,
    region: Region
  ): Promise<TaxServiceRate[]> {
    const cacheHit = await this.getCacheEntry(productId, region.id)
    if (cacheHit) {
      return cacheHit
    }

    let toReturn: TaxServiceRate[] = []
    const productRates = await this.taxRateService_.listByProduct(productId, {
      region_id: region.id,
    })

    if (productRates.length > 0) {
      toReturn = productRates.map((pr) => {
        return {
          rate: pr.rate,
          name: pr.name,
          code: pr.code,
        }
      })
    }

    if (toReturn.length === 0) {
      toReturn = [
        {
          rate: region.tax_rate,
          name: "default",
          code: "default",
        },
      ]
    }

    await this.setCache(productId, region.id, toReturn)

    return toReturn
  }

  /**
   * The cache key to get cache hits by.
   * @param productId - the product id to cache
   * @param regionId - the region id to cache
   * @return the cache key to use for the id set
   */
  private getCacheKey(productId: string, regionId: string): string {
    return `txrtcache:${productId}:${regionId}`
  }

  /**
   * Sets the cache results for a set of ids
   * @param productId - the product id to cache
   * @param regionId - the region id to cache
   * @param value - tax rates to cache
   * @return promise that resolves after the cache has been set
   */
  private async setCache(
    productId: string,
    regionId: string,
    value: TaxServiceRate[]
  ): Promise<void> {
    const cacheKey = this.getCacheKey(productId, regionId)
    return await this.redis_.set(
      cacheKey,
      JSON.stringify(value),
      "EX",
      CACHE_TIME
    )
  }

  /**
   * Gets the cache results for a set of ids
   * @param productId - the product id to cache
   * @param regionId - the region id to cache
   * @return the cached result or null
   */
  private async getCacheEntry(
    productId: string,
    regionId: string
  ): Promise<TaxServiceRate[] | null> {
    const cacheKey = this.getCacheKey(productId, regionId)

    try {
      const cacheHit = await this.redis_.get(cacheKey)
      if (cacheHit) {
        // TODO: Validate that cache has correct data
        const parsedResults = JSON.parse(cacheHit) as TaxServiceRate[]
        return parsedResults
      }
    } catch (_) {
      // noop - cache parse failed
      await this.redis_.del(cacheKey)
    }

    return null
  }
}

export default TaxProviderService
