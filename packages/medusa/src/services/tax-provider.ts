import { MedusaError } from "medusa-core-utils"
import { AwilixContainer } from "awilix"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import Redis from "ioredis"

import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { Region } from "../models/region"
import { Cart } from "../models/cart"
import { Order } from "../models/order"
import {
  ITaxService,
  TaxCalculationContext,
  TaxCalculationLine,
} from "../interfaces/tax-service"

import { TaxServiceRate } from "../types/tax-service"

import ProductTaxRateService from "./product-tax-rate"

const CACHE_TIME = 30 // seconds

/**
 * Provides layer to manipulate users.
 * @extends BaseService
 */
class TaxProviderService extends BaseService {
  private container_: AwilixContainer
  private manager_: EntityManager
  private transactionManager_: EntityManager
  private productTaxRateService_: ProductTaxRateService
  private taxLineRepo_: typeof LineItemTaxLineRepository
  private redis_: Redis

  constructor(container: AwilixContainer) {
    super()

    this.container_ = container
    this.taxLineRepo_ = container["lineItemTaxLineRepository"]
    this.productTaxRateService_ = container["productTaxRateService"]
    this.eventBus_ = container["eventBusService"]
    this.manager_ = container["manager"]
    this.redis_ = container["redisClient"]
  }

  withTransaction(transactionManager: EntityManager): TaxProviderService {
    if (!transactionManager) {
      return this
    }

    const cloned = new TaxProviderService(this.container_)

    cloned.transactionManager_ = transactionManager
    return cloned
  }

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

  async getTaxLines(
    cartOrOrder: Cart | Order,
    calculationContext: TaxCalculationContext
  ): Promise<LineItemTaxLine[]> {
    const calculationLines = await Promise.all(
      cartOrOrder.items.map(async (l) => {
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

    const taxProvider = this.retrieveProvider(calculationContext.region)
    const providerLines = await taxProvider.getTaxLines(
      calculationLines,
      calculationContext
    )

    const liTaxLineRepo = this.manager_.getCustomRepository(this.taxLineRepo_)

    return providerLines.map((pl) => {
      // Only creates entity; does not persist to db
      return liTaxLineRepo.create({
        item_id: pl.item_id,
        rate: pl.rate,
        name: pl.name,
        code: pl.code,
        metadata: pl.metadata,
      })
    })
  }

  async getRegionRatesForProduct(
    productId: string,
    region: Region
  ): Promise<TaxServiceRate[]> {
    const cacheHit = await this.getCacheEntry(productId, region.id)
    if (cacheHit) {
      return cacheHit
    }

    let toReturn: TaxServiceRate[] = []
    const regionRates = region.tax_rates
    if (regionRates !== null && regionRates.length > 0) {
      const productRates = await this.productTaxRateService_.list({
        product_id: productId,
        rate_id: regionRates.map((tr) => tr.id),
      })

      if (productRates.length > 0) {
        toReturn = productRates.map((pr) => {
          const rate = regionRates.find((rr) => rr.id === pr.rate_id)
          if (!rate) {
            throw new MedusaError(
              MedusaError.Types.UNEXPECTED_STATE,
              "An error occured while calculating tax rates"
            )
          }

          return {
            rate: rate.rate,
            name: rate.name,
            code: rate.code,
          }
        })
      }
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

  getCacheKey(productId: string, regionId: string): string {
    return `txrtcache:${productId}:${regionId}`
  }

  async setCache(
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

  async getCacheEntry(
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
