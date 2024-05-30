import { IPricingModuleService, RemoteQueryFunction } from "@medusajs/types"
import { FlagRouter, promiseAll } from "@medusajs/utils"
import {
  CustomerService,
  ProductVariantService,
  RegionService,
  TaxProviderService,
} from "."
import {
  IPriceSelectionStrategy,
  PriceSelectionContext,
} from "../interfaces/price-selection-strategy"
import { Product, ProductVariant, Region, ShippingOption } from "../models"
import {
  PricedProduct,
  PricedShippingOption,
  PricedVariant,
  PricingContext,
  ProductVariantPricing,
  TaxedPricing,
} from "../types/pricing"

import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { TaxServiceRate } from "../types/tax-service"
import { calculatePriceTaxAmount } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  productVariantService: ProductVariantService
  taxProviderService: TaxProviderService
  regionService: RegionService
  customerService: CustomerService
  priceSelectionStrategy: IPriceSelectionStrategy
  featureFlagRouter: FlagRouter
  remoteQuery: RemoteQueryFunction
  pricingModuleService: IPricingModuleService
}

/**
 * Allows retrieval of prices.
 */
class PricingService extends TransactionBaseService {
  protected readonly regionService: RegionService
  protected readonly taxProviderService: TaxProviderService
  protected readonly customerService_: CustomerService
  protected readonly priceSelectionStrategy: IPriceSelectionStrategy
  protected readonly productVariantService: ProductVariantService
  protected readonly featureFlagRouter: FlagRouter

  protected get pricingModuleService(): IPricingModuleService {
    return this.__container__.pricingModuleService
  }

  protected get remoteQuery(): RemoteQueryFunction {
    return this.__container__.remoteQuery
  }

  constructor({
    productVariantService,
    taxProviderService,
    regionService,
    priceSelectionStrategy,
    featureFlagRouter,
    customerService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.regionService = regionService
    this.taxProviderService = taxProviderService
    this.priceSelectionStrategy = priceSelectionStrategy
    this.productVariantService = productVariantService
    this.customerService_ = customerService
    this.featureFlagRouter = featureFlagRouter
  }

  /**
   * Collects additional information necessary for completing the price
   * selection.
   * @param context - the price selection context to use
   * @return The pricing context
   */
  async collectPricingContext(
    context: PriceSelectionContext
  ): Promise<PricingContext> {
    let automaticTaxes = false
    let taxRate: number | null = null
    let currencyCode = context.currency_code

    let region: Region
    if (context.region_id) {
      region = await this.regionService
        .withTransaction(this.activeManager_)
        .retrieve(context.region_id, {
          select: ["id", "currency_code", "automatic_taxes", "tax_rate"],
        })

      currencyCode = region.currency_code
      automaticTaxes = region.automatic_taxes
      taxRate = region.tax_rate
    }

    return {
      price_selection: {
        ...context,
        currency_code: currencyCode,
      },
      automatic_taxes: automaticTaxes,
      tax_rate: taxRate,
    }
  }

  /**
   * Gets the prices for a product variant
   * @param variantPricing - the prices retrieved from a variant
   * @param productRates - the tax rates that the product has applied
   * @return The tax related variant prices.
   */
  calculateTaxes(
    variantPricing: ProductVariantPricing,
    productRates: TaxServiceRate[]
  ): TaxedPricing {
    const rate = productRates.reduce(
      (accRate: number, nextTaxRate: TaxServiceRate) => {
        return accRate + (nextTaxRate.rate || 0) / 100
      },
      0
    )

    const taxedPricing: TaxedPricing = {
      original_tax: null,
      calculated_tax: null,
      original_price_incl_tax: null,
      calculated_price_incl_tax: null,
      tax_rates: productRates,
    }

    if (variantPricing.calculated_price !== null) {
      const includesTax = !!(
        this.featureFlagRouter.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) && variantPricing.calculated_price_includes_tax
      )
      taxedPricing.calculated_tax = Math.round(
        calculatePriceTaxAmount({
          price: variantPricing.calculated_price,
          taxRate: rate,
          includesTax,
        })
      )

      taxedPricing.calculated_price_incl_tax =
        variantPricing.calculated_price_includes_tax
          ? variantPricing.calculated_price
          : variantPricing.calculated_price + taxedPricing.calculated_tax
    }

    if (variantPricing.original_price !== null) {
      const includesTax = !!(
        this.featureFlagRouter.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) && variantPricing.original_price_includes_tax
      )
      taxedPricing.original_tax = Math.round(
        calculatePriceTaxAmount({
          price: variantPricing.original_price,
          taxRate: rate,
          includesTax,
        })
      )

      taxedPricing.original_price_incl_tax =
        variantPricing.original_price_includes_tax
          ? variantPricing.original_price
          : variantPricing.original_price + taxedPricing.original_tax
    }

    return taxedPricing
  }

  private async getProductVariantPricing_(
    data: {
      variantId: string
      quantity?: number
    }[],
    context: PricingContext
  ): Promise<Map<string, ProductVariantPricing>> {
    const variantsPricing = await this.priceSelectionStrategy
      .withTransaction(this.activeManager_)
      .calculateVariantPrice(data, context.price_selection)

    const pricingResultMap = new Map<string, ProductVariantPricing>()

    for (const [variantId, pricing] of variantsPricing.entries()) {
      const pricingResult: ProductVariantPricing = {
        prices: pricing.prices,
        original_price: pricing.originalPrice,
        calculated_price: pricing.calculatedPrice,
        calculated_price_type: pricing.calculatedPriceType,
        original_price_includes_tax: pricing.originalPriceIncludesTax,
        calculated_price_includes_tax: pricing.calculatedPriceIncludesTax,
        original_price_incl_tax: null,
        calculated_price_incl_tax: null,
        original_tax: null,
        calculated_tax: null,
        tax_rates: null,
      }

      if (context.automatic_taxes && context.price_selection.region_id) {
        const taxRates = context.price_selection.tax_rates || []
        const taxResults = this.calculateTaxes(pricingResult, taxRates)

        pricingResult.original_price_incl_tax =
          taxResults.original_price_incl_tax
        pricingResult.calculated_price_incl_tax =
          taxResults.calculated_price_incl_tax
        pricingResult.original_tax = taxResults.original_tax
        pricingResult.calculated_tax = taxResults.calculated_tax
        pricingResult.tax_rates = taxResults.tax_rates
      }

      pricingResultMap.set(variantId, pricingResult)
    }

    return pricingResultMap
  }

  /**
   * Gets the prices for a product variant.
   * @param variant
   * @param context - the price selection context to use
   * @return The product variant prices
   */
  async getProductVariantPricing(
    variant: Pick<ProductVariant, "id" | "product_id">,
    context: PriceSelectionContext | PricingContext
  ): Promise<ProductVariantPricing> {
    let pricingContext: PricingContext
    if ("automatic_taxes" in context) {
      pricingContext = context
    } else {
      pricingContext = await this.collectPricingContext(context)
    }

    let productRates: Map<string, TaxServiceRate[]> = new Map()

    if (
      pricingContext.automatic_taxes &&
      pricingContext.price_selection.region_id
    ) {
      // Here we assume that the variants belongs to the same product since the context is shared
      const productId = variant.product_id
      productRates = await this.taxProviderService.getRegionRatesForProduct(
        productId,
        {
          id: pricingContext.price_selection.region_id,
          tax_rate: pricingContext.tax_rate,
        }
      )
      pricingContext.price_selection.tax_rates = productRates.get(productId)
    }

    const productVariantPricing = await this.getProductVariantPricing_(
      [
        {
          variantId: variant.id,
          quantity: pricingContext.price_selection.quantity,
        },
      ],
      pricingContext
    )

    return productVariantPricing.get(variant.id)!
  }

  /**
   * Gets the prices for a product variant by a variant id.
   * @param variantId - the id of the variant to get prices for
   * @param context - the price selection context to use
   * @return The product variant prices
   * @deprecated Use {@link getProductVariantsPricing} instead.
   */
  async getProductVariantPricingById(
    variantId: string,
    context: PriceSelectionContext | PricingContext
  ): Promise<ProductVariantPricing> {
    let pricingContext: PricingContext
    if ("automatic_taxes" in context) {
      pricingContext = context
    } else {
      pricingContext = await this.collectPricingContext(context)
    }

    let productRates: TaxServiceRate[] = []
    if (
      pricingContext.automatic_taxes &&
      pricingContext.price_selection.region_id
    ) {
      const { product_id } = await this.productVariantService
        .withTransaction(this.activeManager_)
        .retrieve(variantId, { select: ["id", "product_id"] })

      const regionRatesForProduct = await this.taxProviderService
        .withTransaction(this.activeManager_)
        .getRegionRatesForProduct([product_id], {
          id: pricingContext.price_selection.region_id,
          tax_rate: pricingContext.tax_rate,
        })

      productRates = regionRatesForProduct.get(product_id)!
    }

    pricingContext.price_selection.tax_rates = productRates
    const productVariantPricing = await this.getProductVariantPricing_(
      [{ variantId }],
      pricingContext
    )

    return productVariantPricing.get(variantId)!
  }

  /**
   * Gets the prices for a collection of variants.
   * @param data
   * @param context - the price selection context to use
   * @return The product variant prices
   */
  async getProductVariantsPricing(
    data: { variantId: string; quantity?: number }[],
    context: PriceSelectionContext | PricingContext
  ): Promise<{ [variant_id: string]: ProductVariantPricing }> {
    let pricingContext: PricingContext
    if ("automatic_taxes" in context) {
      pricingContext = context
    } else {
      pricingContext = await this.collectPricingContext(context)
    }

    const dataMap = new Map(data.map((d) => [d.variantId, d]))

    const variants = await this.productVariantService
      .withTransaction(this.activeManager_)
      .list(
        { id: data.map((d) => d.variantId) },
        { select: ["id", "product_id"] }
      )

    let productsRatesMap: Map<string, TaxServiceRate[]> = new Map()

    if (pricingContext.price_selection.region_id) {
      // Here we assume that the variants belongs to the same product since the context is shared
      const productId = variants[0]?.product_id
      productsRatesMap = await this.taxProviderService
        .withTransaction(this.activeManager_)
        .getRegionRatesForProduct(productId, {
          id: pricingContext.price_selection.region_id,
          tax_rate: pricingContext.tax_rate,
        })

      pricingContext.price_selection.tax_rates =
        productsRatesMap.get(productId)!
    }

    const variantsPricingMap = await this.getProductVariantPricing_(
      variants.map((v) => ({
        variantId: v.id,
        quantity: dataMap.get(v.id)!.quantity,
      })),
      pricingContext
    )

    const pricingResult: { [variant_id: string]: ProductVariantPricing } = {}
    for (const { variantId } of data) {
      pricingResult[variantId] = variantsPricingMap.get(variantId)!
    }

    return pricingResult
  }

  private async getProductPricing_(
    data: { productId: string; variants: ProductVariant[] }[],
    context: PricingContext
  ): Promise<Map<string, Record<string, ProductVariantPricing>>> {
    let taxRatesMap: Map<string, TaxServiceRate[]>

    if (context.automatic_taxes && context.price_selection.region_id) {
      taxRatesMap = await this.taxProviderService
        .withTransaction(this.activeManager_)
        .getRegionRatesForProduct(
          data.map((d) => d.productId),
          {
            id: context.price_selection.region_id,
            tax_rate: context.tax_rate,
          }
        )
    }

    const productsPricingMap = new Map<
      string,
      Record<string, ProductVariantPricing>
    >()

    await promiseAll(
      data.map(async ({ productId, variants }) => {
        const pricingData = variants.map((variant) => {
          return { variantId: variant.id }
        })

        const context_ = { ...context }
        if (context_.automatic_taxes && context_.price_selection.region_id) {
          context_.price_selection.tax_rates = taxRatesMap.get(productId)!
        }

        const variantsPricingMap = await this.getProductVariantPricing_(
          pricingData,
          context_
        )

        const productVariantsPricing = productsPricingMap.get(productId) || {}
        variantsPricingMap.forEach((variantPricing, variantId) => {
          productVariantsPricing[variantId] = variantPricing
        })
        productsPricingMap.set(productId, productVariantsPricing)
      })
    )

    return productsPricingMap
  }

  /**
   * Gets all the variant prices for a product. All the product's variants will
   * be fetched.
   * @param product - the product to get pricing for.
   * @param context - the price selection context to use
   * @return A map of variant ids to their corresponding prices
   */
  async getProductPricing(
    product: Pick<Product, "id" | "variants">,
    context: PriceSelectionContext
  ): Promise<Record<string, ProductVariantPricing>> {
    const pricingContext = await this.collectPricingContext(context)
    const productPricing = await this.getProductPricing_(
      [{ productId: product.id, variants: product.variants }],
      pricingContext
    )
    return productPricing.get(product.id)!
  }

  /**
   * Gets all the variant prices for a product by the product id
   * @param productId - the id of the product to get prices for
   * @param context - the price selection context to use
   * @return A map of variant ids to their corresponding prices
   */
  async getProductPricingById(
    productId: string,
    context: PriceSelectionContext
  ): Promise<Record<string, ProductVariantPricing>> {
    const pricingContext = await this.collectPricingContext(context)
    const variants = await this.productVariantService.list(
      { product_id: productId },
      { select: ["id"] }
    )
    const productPricing = await this.getProductPricing_(
      [{ productId, variants }],
      pricingContext
    )
    return productPricing.get(productId)!
  }

  /**
   * Set additional prices on a list of product variants.
   * @param variants
   * @param context - the price selection context to use
   * @return A list of products with variants decorated with prices
   */
  async setVariantPrices(
    variants: ProductVariant[],
    context: PriceSelectionContext = {}
  ): Promise<PricedVariant[]> {
    const pricingContext = await this.collectPricingContext(context)

    const variantsPricingMap = await this.getProductVariantsPricing(
      variants.map((v) => ({
        variantId: v.id,
        quantity: context.quantity,
      })),
      pricingContext
    )

    return variants.map((variant) => {
      const variantPricing = variantsPricingMap[variant.id]
      Object.assign(variant, variantPricing)
      return variant as unknown as PricedVariant
    })
  }

  /**
   * Set additional prices on a list of products.
   * @param products - list of products on which to set additional prices
   * @param context - the price selection context to use
   * @return A list of products with variants decorated with prices
   */
  async setProductPrices(
    products: Product[],
    context: PriceSelectionContext = {}
  ): Promise<(Product | PricedProduct)[]> {
    const pricingContext = await this.collectPricingContext(context)

    const pricingData = products
      .filter((p) => p.variants.length)
      .map((product) => ({
        productId: product.id,
        variants: product.variants,
      }))

    const productsVariantsPricingMap = await this.getProductPricing_(
      pricingData,
      pricingContext
    )

    return products.map((product) => {
      if (!product?.variants?.length) {
        return product
      }

      product.variants.map((productVariant): PricedVariant => {
        const variantPricing = productsVariantsPricingMap.get(product.id)!
        const pricing = variantPricing[productVariant.id]

        Object.assign(productVariant, pricing)
        return productVariant as unknown as PricedVariant
      })

      return product
    })
  }

  async setAdminVariantPricing(
    variants: ProductVariant[],
    context: PriceSelectionContext = {}
  ): Promise<PricedVariant[]> {
    return await this.setVariantPrices(variants, context)
  }

  async setAdminProductPricing(
    products: Product[]
  ): Promise<(Product | PricedProduct)[]> {
    return await this.setProductPrices(products)
  }

  /**
   * Gets the prices for a shipping option.
   * @param shippingOption - the shipping option to get prices for
   * @param context - the price selection context to use
   * @return The shipping option prices
   */
  async getShippingOptionPricing(
    shippingOption: ShippingOption,
    context: PriceSelectionContext | PricingContext
  ): Promise<PricedShippingOption> {
    let pricingContext: PricingContext
    if ("automatic_taxes" in context) {
      pricingContext = context
    } else {
      pricingContext =
        (context as PricingContext) ??
        (await this.collectPricingContext(context))
    }

    let shippingOptionRates: TaxServiceRate[] = []
    if (
      pricingContext.automatic_taxes &&
      pricingContext.price_selection.region_id
    ) {
      shippingOptionRates = await this.taxProviderService
        .withTransaction(this.activeManager_)
        .getRegionRatesForShipping(shippingOption.id, {
          id: pricingContext.price_selection.region_id,
          tax_rate: pricingContext.tax_rate,
        })
    }

    const price = shippingOption.amount || 0
    const rate = shippingOptionRates.reduce(
      (accRate: number, nextTaxRate: TaxServiceRate) => {
        return accRate + (nextTaxRate.rate || 0) / 100
      },
      0
    )

    const includesTax =
      this.featureFlagRouter.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) && shippingOption.includes_tax

    const taxAmount = Math.round(
      calculatePriceTaxAmount({
        taxRate: rate,
        price,
        includesTax,
      })
    )
    const totalInclTax = includesTax ? price : price + taxAmount

    return {
      ...shippingOption,
      price_incl_tax: totalInclTax,
      tax_rates: shippingOptionRates,
      tax_amount: taxAmount,
    }
  }

  /**
   * Set additional prices on a list of shipping options.
   * @param shippingOptions - list of shipping options on which to set additional prices
   * @param context - the price selection context to use
   * @return A list of shipping options with prices
   */
  async setShippingOptionPrices(
    shippingOptions: ShippingOption[],
    context: Omit<PriceSelectionContext, "region_id"> = {}
  ): Promise<PricedShippingOption[]> {
    const regions = new Set<string>()

    for (const shippingOption of shippingOptions) {
      regions.add(shippingOption.region_id)
    }

    const contexts = await promiseAll(
      [...regions].map(async (regionId) => {
        return {
          context: await this.collectPricingContext({
            ...context,
            region_id: regionId,
          }),
          region_id: regionId,
        }
      })
    )

    const shippingOptionPricingPromises: Promise<PricedShippingOption>[] = []

    shippingOptions.map(async (shippingOption) => {
      const pricingContext = contexts.find(
        (c) => c.region_id === shippingOption.region_id
      )

      if (!pricingContext) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Could not find pricing context for shipping option"
        )
      }

      shippingOptionPricingPromises.push(
        this.getShippingOptionPricing(shippingOption, pricingContext.context)
      )
    })

    return await promiseAll(shippingOptionPricingPromises)
  }
}

export default PricingService
