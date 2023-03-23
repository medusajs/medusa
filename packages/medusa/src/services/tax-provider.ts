import { AwilixContainer } from "awilix"
import { MedusaError } from "medusa-core-utils"
import { In } from "typeorm"

import { ICacheService, IEventBusService } from "@medusajs/types"
import {
  ITaxService,
  ItemTaxCalculationLine,
  TaxCalculationContext,
  TransactionBaseService
} from "../interfaces"
import {
  Cart,
  LineItem,
  LineItemTaxLine,
  Region,
  ShippingMethod,
  ShippingMethodTaxLine,
  TaxProvider
} from "../models"
import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line"
import { ShippingMethodTaxLineRepository } from "../repositories/shipping-method-tax-line"
import { TaxProviderRepository } from "../repositories/tax-provider"
import { isCart } from "../types/cart"
import { TaxLinesMaps, TaxServiceRate } from "../types/tax-service"
import TaxRateService from "./tax-rate"

type RegionDetails = {
  id: string
  tax_rate: number | null
}

/**
 * Finds tax providers and assists in tax related operations.
 */
class TaxProviderService extends TransactionBaseService {
  protected readonly container_: AwilixContainer
  protected readonly cacheService_: ICacheService
  protected readonly taxRateService_: TaxRateService
  protected readonly taxLineRepo_: typeof LineItemTaxLineRepository
  protected readonly smTaxLineRepo_: typeof ShippingMethodTaxLineRepository
  protected readonly taxProviderRepo_: typeof TaxProviderRepository
  protected readonly eventBus_: IEventBusService

  constructor(container: AwilixContainer) {
    super(container)

    this.container_ = container
    this.cacheService_ = container["cacheService"]
    this.taxLineRepo_ = container["lineItemTaxLineRepository"]
    this.smTaxLineRepo_ = container["shippingMethodTaxLineRepository"]
    this.taxRateService_ = container["taxRateService"]
    this.eventBus_ = container["eventBusService"]
    this.taxProviderRepo_ = container["taxProviderRepository"]
  }

  async list(): Promise<TaxProvider[]> {
    const tpRepo = this.activeManager_.withRepository(this.taxProviderRepo_)
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
      try {
        provider = this.container_[`tp_${region.tax_provider_id}`]
      } catch (e) {
        // noop
      }
    } else {
      provider = this.container_["systemTaxService"]
    }

    if (!provider!) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a tax provider with id: ${region.tax_provider_id}`
      )
    }

    return provider
  }

  async clearLineItemsTaxLines(itemIds: string[]): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const taxLineRepo = transactionManager.withRepository(this.taxLineRepo_)

      await taxLineRepo.delete({ item_id: In(itemIds) })
    })
  }

  async clearTaxLines(cartId: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const taxLineRepo = transactionManager.withRepository(this.taxLineRepo_)
      const shippingTaxRepo = transactionManager.withRepository(
        this.smTaxLineRepo_
      )

      await Promise.all([
        taxLineRepo.deleteForCart(cartId),
        shippingTaxRepo.deleteForCart(cartId),
      ])
    })
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
    return await this.atomicPhase_(async (transactionManager) => {
      let taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[] = []
      if (isCart(cartOrLineItems)) {
        taxLines = await this.getTaxLines(
          cartOrLineItems.items,
          calculationContext
        )
      } else {
        taxLines = await this.getTaxLines(cartOrLineItems, calculationContext)
      }

      const itemTaxLineRepo = transactionManager.withRepository(
        this.taxLineRepo_
      )
      const shippingTaxLineRepo = transactionManager.withRepository(
        this.smTaxLineRepo_
      )

      const { shipping, lineItems } = taxLines.reduce<{
        shipping: ShippingMethodTaxLine[]
        lineItems: LineItemTaxLine[]
      }>(
        (acc, tl) => {
          if ("item_id" in tl) {
            acc.lineItems.push(tl)
          } else {
            acc.shipping.push(tl)
          }

          return acc
        },
        { shipping: [], lineItems: [] }
      )

      return (
        await Promise.all([
          itemTaxLineRepo.upsertLines(lineItems),
          shippingTaxLineRepo.upsertLines(shipping),
        ])
      ).flat()
    })
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
    return await this.atomicPhase_(async (transactionManager) => {
      const taxLines = await this.getShippingTaxLines(
        shippingMethod,
        calculationContext
      )
      return await transactionManager.save(taxLines)
    })
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

    const smTaxLineRepo = this.activeManager_.withRepository(
      this.smTaxLineRepo_
    )

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

        if (l.variant_id && !l.variant) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Unable to get the tax lines for the item ${l.id}, it contains a variant_id but the variant is missing.`
          )
        }

        if (l.variant?.product_id) {
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

    const liTaxLineRepo = this.activeManager_.withRepository(this.taxLineRepo_)
    const smTaxLineRepo = this.activeManager_.withRepository(
      this.smTaxLineRepo_
    )

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
   * Return a map of tax lines for line items and shipping methods
   * @param items
   * @param calculationContext
   * @protected
   */
  async getTaxLinesMap(
    items: LineItem[],
    calculationContext: TaxCalculationContext
  ): Promise<TaxLinesMaps> {
    const lineItemsTaxLinesMap = {}
    const shippingMethodsTaxLinesMap = {}

    const taxLines = await this.getTaxLines(items, calculationContext)

    taxLines.forEach((taxLine) => {
      if ("item_id" in taxLine) {
        const itemTaxLines = lineItemsTaxLinesMap[taxLine.item_id] ?? []
        itemTaxLines.push(taxLine)
        lineItemsTaxLinesMap[taxLine.item_id] = itemTaxLines
      }
      if ("shipping_method_id" in taxLine) {
        const shippingMethodTaxLines =
          shippingMethodsTaxLinesMap[taxLine.shipping_method_id] ?? []
        shippingMethodTaxLines.push(taxLine)
        shippingMethodsTaxLinesMap[taxLine.shipping_method_id] =
          shippingMethodTaxLines
      }
    })

    return {
      lineItemsTaxLines: lineItemsTaxLinesMap,
      shippingMethodsTaxLines: shippingMethodsTaxLinesMap,
    }
  }

  /**
   * Gets the tax rates configured for a shipping option. The rates are cached
   * between calls.
   * @param optionId - the option id of the shipping method.
   * @param regionDetails - the region to get configured rates for.
   * @return the tax rates configured for the shipping option.
   */
  async getRegionRatesForShipping(
    optionId: string,
    regionDetails: RegionDetails
  ): Promise<TaxServiceRate[]> {
    const cacheKey = this.getCacheKey(optionId, regionDetails.id)
    const cacheHit = await this.cacheService_.get<TaxServiceRate[]>(cacheKey)
    if (cacheHit) {
      return cacheHit
    }

    let toReturn: TaxServiceRate[] = []
    const optionRates = await this.taxRateService_
      .withTransaction(this.activeManager_)
      .listByShippingOption(optionId)

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
          rate: regionDetails.tax_rate,
          name: "default",
          code: "default",
        },
      ]
    }

    await this.cacheService_.set(cacheKey, toReturn)

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
    region: RegionDetails
  ): Promise<TaxServiceRate[]> {
    const cacheKey = this.getCacheKey(productId, region.id)
    const cacheHit = await this.cacheService_.get<TaxServiceRate[]>(cacheKey)
    if (cacheHit) {
      return cacheHit
    }

    let toReturn: TaxServiceRate[] = []
    const productRates = await this.taxRateService_
      .withTransaction(this.activeManager_)
      .listByProduct(productId, {
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

    await this.cacheService_.set(cacheKey, toReturn)

    return toReturn
  }

  /**
   * The cache key to get cache hits by.
   * @param id - the entity id to cache
   * @param regionId - the region id to cache
   * @return the cache key to use for the id set
   */
  private getCacheKey(id: string, regionId: string): string {
    return `txrtcache:${id}:${regionId}`
  }

  async registerInstalledProviders(providers: string[]): Promise<void> {
    const model = this.activeManager_.withRepository(this.taxProviderRepo_)
    await model.update({}, { is_installed: false })

    for (const p of providers) {
      const n = model.create({ id: p, is_installed: true })
      await model.save(n)
    }
  }
}

export default TaxProviderService
