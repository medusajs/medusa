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
      provider = this.container_[`tp_${region.tax_provider_id}`] as ITaxService
    } else {
      provider = this.container_["systemTaxService"] as ITaxService
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
    order: Cart | Order,
    calculationContext: TaxCalculationContext
  ): Promise<LineItemTaxLine[]> {
    const calculationLines: TaxCalculationLine[] = await Promise.all(
      order.items.map(async (l) => {
        return {
          item: l,
          rates: await this.getRegionRatesForProduct(
            l.variant.product_id,
            calculationContext.region
          ),
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
    const cacheHit = await this.getCacheHit(productId, region.id)
    if (cacheHit) {
      return cacheHit
    }

    let toReturn: TaxServiceRate[] = []
    if (region.tax_rates.length > 0) {
      const productRates = await this.productTaxRateService_.list({
        product_id: productId,
        rate_id: region.tax_rates.map((tr) => tr.id),
      })

      if (productRates.length > 0) {
        toReturn = productRates.map((pr) => {
          const rate = region.tax_rates.find((rr) => rr.id === pr.rate_id)
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

  async getCacheHit(
    productId: string,
    regionId: string
  ): Promise<TaxServiceRate[] | false> {
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

    return false
  }
}

export default TaxProviderService
