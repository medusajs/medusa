import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { Brackets, EntityManager, ILike, SelectQueryBuilder } from "typeorm"
import {
  IPriceSelectionStrategy,
  PriceSelectionContext,
} from "../interfaces/price-selection-strategy"
import { MoneyAmount } from "../models/money-amount"
import { Product } from "../models/product"
import { ProductOptionValue } from "../models/product-option-value"
import { ProductVariant } from "../models/product-variant"
import { CartRepository } from "../repositories/cart"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { ProductRepository } from "../repositories/product"
import { ProductOptionValueRepository } from "../repositories/product-option-value"
import {
  FindWithRelationsOptions,
  ProductVariantRepository,
} from "../repositories/product-variant"
import EventBusService from "../services/event-bus"
import RegionService from "../services/region"
import { FindConfig } from "../types/common"
import {
  CreateProductVariantInput,
  FilterableProductVariantProps,
  GetRegionPriceContext,
  ProductVariantPrice,
  UpdateProductVariantInput,
} from "../types/product-variant"

/**
 * Provides layer to manipulate product variants.
 * @extends BaseService
 */
class ProductVariantService extends BaseService {
  static Events = {
    UPDATED: "product-variant.updated",
    CREATED: "product-variant.created",
    DELETED: "product-variant.deleted",
  }

  private manager_: EntityManager
  private productVariantRepository_: typeof ProductVariantRepository
  private productRepository_: typeof ProductRepository
  private eventBus_: EventBusService
  private regionService_: RegionService
  private priceSelectionStrategy_: IPriceSelectionStrategy
  private moneyAmountRepository_: typeof MoneyAmountRepository
  private productOptionValueRepository_: typeof ProductOptionValueRepository
  private cartRepository_: typeof CartRepository

  constructor({
    manager,
    productVariantRepository,
    productRepository,
    eventBusService,
    regionService,
    moneyAmountRepository,
    productOptionValueRepository,
    cartRepository,
    priceSelectionStrategy,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ProductVariantModel} */
    this.productVariantRepository_ = productVariantRepository

    /** @private @const {ProductModel} */
    this.productRepository_ = productRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    this.moneyAmountRepository_ = moneyAmountRepository

    this.productOptionValueRepository_ = productOptionValueRepository

    this.cartRepository_ = cartRepository

    this.priceSelectionStrategy_ = priceSelectionStrategy
  }

  withTransaction(transactionManager: EntityManager): ProductVariantService {
    if (!transactionManager) {
      return this
    }

    const cloned = new ProductVariantService({
      manager: transactionManager,
      productVariantRepository: this.productVariantRepository_,
      productRepository: this.productRepository_,
      eventBusService: this.eventBus_,
      regionService: this.regionService_,
      moneyAmountRepository: this.moneyAmountRepository_,
      productOptionValueRepository: this.productOptionValueRepository_,
      cartRepository: this.cartRepository_,
      priceSelectionStrategy: this.priceSelectionStrategy_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Gets a product variant by id.
   * @param {string} variantId - the id of the product to get.
   * @param {FindConfig<ProductVariant>} config - query config object for variant retrieval.
   * @return {Promise<Product>} the product document.
   */
  async retrieve(
    variantId: string,
    config: FindConfig<ProductVariant> & PriceSelectionContext = {
      include_discount_prices: false,
    }
  ): Promise<ProductVariant> {
    const variantRepo = this.manager_.getCustomRepository(
      this.productVariantRepository_
    )
    const validatedId = this.validateId_(variantId)

    const priceIndex = config.relations?.indexOf("prices") ?? -1
    if (priceIndex >= 0 && config.relations) {
      config.relations = [...config.relations]
      config.relations.splice(priceIndex, 1)
    }

    const query = this.buildQuery_({ id: validatedId }, config)
    const variant = await variantRepo.findOne(query)

    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variant with id: ${variantId} was not found`
      )
    }

    return priceIndex >= 0
      ? ((await this.setAdditionalPrices(
          variant,
          config.currency_code,
          config.region_id,
          config.cart_id,
          config.customer_id,
          config.include_discount_prices
        )) as ProductVariant)
      : variant
  }

  /**
   * Gets a product variant by id.
   * @param {string} sku - The unique stock keeping unit used to identify the product variant.
   * @param {FindConfig<ProductVariant>} config - query config object for variant retrieval.
   * @return {Promise<Product>} the product document.
   */
  async retrieveBySKU(
    sku: string,
    config: FindConfig<ProductVariant> & PriceSelectionContext = {
      include_discount_prices: false,
    }
  ): Promise<ProductVariant> {
    const variantRepo = this.manager_.getCustomRepository(
      this.productVariantRepository_
    )

    const priceIndex = config.relations?.indexOf("prices") ?? -1
    if (priceIndex >= 0 && config.relations) {
      config.relations = [...config.relations]
      config.relations.splice(priceIndex, 1)
    }

    const query = this.buildQuery_({ sku }, config)
    const variant = await variantRepo.findOne(query)

    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variant with sku: ${sku} was not found`
      )
    }

    return priceIndex >= 0
      ? ((await this.setAdditionalPrices(
          variant,
          config.currency_code,
          config.region_id,
          config.cart_id,
          config.customer_id,
          config.include_discount_prices
        )) as ProductVariant)
      : variant
  }

  /**
   * Creates an unpublished product variant. Will validate against parent product
   * to ensure that the variant can in fact be created.
   * @param {string} productOrProductId - the product the variant will be added to
   * @param {object} variant - the variant to create
   * @return {Promise} resolves to the creation result.
   */
  async create(
    productOrProductId: string | Product,
    variant: CreateProductVariantInput
  ): Promise<ProductVariant> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const { prices, ...rest } = variant

      let product = productOrProductId as Product

      if (typeof product === `string`) {
        product = (await productRepo.findOne({
          where: { id: productOrProductId },
          relations: ["variants", "variants.options", "options"],
        })) as Product
      } else if (!product.id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product id missing`
        )
      }

      if (product.options.length !== variant.options.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product options length does not match variant options length. Product has ${product.options.length} and variant has ${variant.options.length}.`
        )
      }

      product.options.forEach((option) => {
        if (!variant.options.find((vo) => option.id === vo.option_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Variant options do not contain value for ${option.title}`
          )
        }
      })

      const variantExists = product.variants.find((v) => {
        return v.options.every((option) => {
          const variantOption = variant.options.find(
            (o) => option.option_id === o.option_id
          )

          return option.value === variantOption?.value
        })
      })

      if (variantExists) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `Variant with title ${variantExists.title} with provided options already exists`
        )
      }

      if (!rest.variant_rank) {
        rest.variant_rank = product.variants.length
      }

      const toCreate = {
        ...rest,
        product_id: product.id,
      }

      const productVariant = variantRepo.create(toCreate)

      const result = await variantRepo.save(productVariant)

      if (prices) {
        for (const price of prices) {
          if (price.region_id) {
            await this.setRegionPrice(result.id, {
              amount: price.amount,
              region_id: price.region_id,
            })
          } else {
            await this.setCurrencyPrice(result.id, price)
          }
        }
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.CREATED, {
          id: result.id,
          product_id: result.product_id,
        })

      return result
    })
  }

  /**
   * Updates a variant.
   * Price updates should use dedicated methods.
   * The function will throw, if price updates are attempted.
   * @param {string | ProductVariant} variantOrVariantId - variant or id of a variant.
   * @param {object} update - an object with the update values.
   * @param {object} config - an object with the config values for returning the variant.
   * @return {Promise} resolves to the update result.
   */
  async update(
    variantOrVariantId: string | Partial<ProductVariant>,
    update: UpdateProductVariantInput
  ): Promise<ProductVariant> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      let variant = variantOrVariantId as ProductVariant
      if (typeof variant === `string`) {
        const variantRes = await variantRepo.findOne({
          where: { id: variantOrVariantId as string },
        })
        if (typeof variant === "undefined") {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Variant with id ${variantOrVariantId} was not found`
          )
        } else {
          variant = variantRes as ProductVariant
        }
      } else if (!variant.id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variant id missing`
        )
      }

      const { prices, options, metadata, inventory_quantity, ...rest } = update

      if (prices) {
        await this.updateVariantPrices(variant.id, prices)
      }

      if (options) {
        for (const option of options) {
          await this.updateOptionValue(
            variant.id,
            option.option_id,
            option.value
          )
        }
      }

      if (typeof metadata === "object") {
        variant.metadata = this.setMetadata_(variant, metadata as object)
      }

      if (typeof inventory_quantity === "number") {
        variant.inventory_quantity = inventory_quantity as number
      }

      for (const [key, value] of Object.entries(rest)) {
        variant[key] = value
      }

      const result = await variantRepo.save(variant)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.UPDATED, {
          id: result.id,
          product_id: result.product_id,
          fields: Object.keys(update),
        })

      return result
    })
  }

  /**
   * Updates a variant's prices.
   * Deletes any prices that are not in the update object, and is not associated with a price list.
   * @param variantId - the id of variant variant
   * @param prices - the update prices
   * @returns {Promise<void>} empty promise
   */
  async updateVariantPrices(
    variantId: string,
    prices: ProductVariantPrice[]
  ): Promise<void> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      // get prices to be deleted
      const obsoletePrices = await moneyAmountRepo.findVariantPricesNotIn(
        variantId,
        prices
      )

      for (const price of prices) {
        if (price.region_id) {
          await this.setRegionPrice(variantId, {
            region_id: price.region_id,
            amount: price.amount,
          })
        } else {
          await this.setCurrencyPrice(variantId, price)
        }
      }

      await moneyAmountRepo.remove(obsoletePrices)
    })
  }

  /**
   * Gets the price specific to a region. If no region specific money amount
   * exists the function will try to use a currency price. If no default
   * currency price exists the function will throw an error.
   * @param {string} variantId - the id of the variant to get price from
   * @param {GetRegionPriceContext} context - context for getting region price
   * @return {number} the price specific to the region
   */
  async getRegionPrice(
    variantId: string,
    context: GetRegionPriceContext
  ): Promise<number> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(context.regionId)

      const prices = await this.priceSelectionStrategy_
        .withTransaction(manager)
        .calculateVariantPrice(variantId, {
          region_id: context.regionId,
          currency_code: region.currency_code,
          quantity: context.quantity,
          customer_id: context.customer_id,
          include_discount_prices: !!context.include_discount_prices,
        })

      return prices.calculatedPrice
    })
  }

  /**
   * Sets the default price of a specific region
   * @param {string} variantId - the id of the variant to update
   * @param {string} price - the price for the variant.
   * @return {Promise} the result of the update operation
   */
  async setRegionPrice(
    variantId: string,
    price: ProductVariantPrice
  ): Promise<MoneyAmount> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      let moneyAmount = await moneyAmountRepo.findOne({
        where: {
          variant_id: variantId,
          region_id: price.region_id,
          price_list_id: null,
        },
      })

      if (!moneyAmount) {
        moneyAmount = moneyAmountRepo.create({
          ...price,
          variant_id: variantId,
        })
      } else {
        moneyAmount.amount = price.amount
      }

      const result = await moneyAmountRepo.save(moneyAmount)
      return result
    })
  }

  /**
   * Sets the default price for the given currency.
   * @param {string} variantId - the id of the variant to set prices for
   * @param {ProductVariantPrice} price - the price for the variant
   * @return {Promise} the result of the update operation
   */
  async setCurrencyPrice(
    variantId: string,
    price: ProductVariantPrice
  ): Promise<MoneyAmount> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      return await moneyAmountRepo.upsertVariantCurrencyPrice(variantId, price)
    })
  }

  /**
   * Updates variant's option value.
   * Option value must be of type string or number.
   * @param {string} variantId - the variant to decorate.
   * @param {string} optionId - the option from product.
   * @param {string} optionValue - option value to add.
   * @return {Promise} the result of the update operation.
   */
  async updateOptionValue(
    variantId: string,
    optionId: string,
    optionValue: string
  ): Promise<ProductOptionValue> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const productOptionValueRepo = manager.getCustomRepository(
        this.productOptionValueRepository_
      )

      const productOptionValue = await productOptionValueRepo.findOne({
        where: { variant_id: variantId, option_id: optionId },
      })

      if (!productOptionValue) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Product option value not found`
        )
      }

      productOptionValue.value = optionValue

      return await productOptionValueRepo.save(productOptionValue)
    })
  }

  /**
   * Adds option value to a varaint.
   * Fails when product with variant does not exists or
   * if that product does not have an option with the given
   * option id. Fails if given variant is not found.
   * Option value must be of type string or number.
   * @param {string} variantId - the variant to decorate.
   * @param {string} optionId - the option from product.
   * @param {string} optionValue - option value to add.
   * @return {Promise} the result of the update operation.
   */
  async addOptionValue(
    variantId: string,
    optionId: string,
    optionValue: string
  ): Promise<ProductOptionValue> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const productOptionValueRepo = manager.getCustomRepository(
        this.productOptionValueRepository_
      )

      const productOptionValue = productOptionValueRepo.create({
        variant_id: variantId,
        option_id: optionId,
        value: optionValue,
      })

      return await productOptionValueRepo.save(productOptionValue)
    })
  }

  /**
   * Deletes option value from given variant.
   * Will never fail due to delete being idempotent.
   * @param {string} variantId - the variant to decorate.
   * @param {string} optionId - the option from product.
   * @return {Promise} empty promise
   */
  async deleteOptionValue(variantId: string, optionId: string): Promise<void> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const productOptionValueRepo: ProductOptionValueRepository =
        manager.getCustomRepository(this.productOptionValueRepository_)

      const productOptionValue = await productOptionValueRepo.findOne({
        where: {
          variant_id: variantId,
          option_id: optionId,
        },
      })

      if (!productOptionValue) {
        return Promise.resolve()
      }

      await productOptionValueRepo.softRemove(productOptionValue)

      return Promise.resolve()
    })
  }

  /**
   * @param {object} selector - the query object for find
   * @param {FindConfig<ProductVariant>} config - query config object for variant retrieval
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: FilterableProductVariantProps,
    config: FindConfig<ProductVariant> & PriceSelectionContext = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<[ProductVariant[], number]> {
    const variantRepo = this.manager_.getCustomRepository(
      this.productVariantRepository_
    )

    const priceIndex = config.relations?.indexOf("prices") ?? -1
    if (priceIndex >= 0 && config.relations) {
      config.relations = [...config.relations]
      config.relations.splice(priceIndex, 1)
    }

    const { q, query, relations } = this.prepareListQuery_(selector, config)

    if (q) {
      const qb = this.getFreeTextQueryBuilder_(variantRepo, query, q)
      const [raw, count] = await qb.getManyAndCount()

      const variants = await variantRepo.findWithRelations(
        relations,
        raw.map((i) => i.id),
        query.withDeleted ?? false
      )
      if (priceIndex >= 0) {
        const res = await this.setAdditionalPrices(
          variants,
          config.currency_code,
          config.region_id,
          config.cart_id,
          config.customer_id,
          config.include_discount_prices
        )
        return [res as ProductVariant[], count]
      }

      return [variants, count]
    }

    const [variants, count] = await variantRepo.findWithRelationsAndCount(
      relations,
      query
    )

    if (priceIndex >= 0) {
      const res = await this.setAdditionalPrices(
        variants,
        config.currency_code,
        config.region_id,
        config.cart_id,
        config.customer_id,
        config.include_discount_prices
      )
      return [res as ProductVariant[], count]
    }

    return [variants, count]
  }

  /**
   * @param {FilterableProductVariantProps} selector - the query object for find
   * @param {FindConfig<ProductVariant>} config - query config object for variant retrieval
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: FilterableProductVariantProps,
    config: FindConfig<ProductVariant> & PriceSelectionContext = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ): Promise<ProductVariant[]> {
    const productVariantRepo = this.manager_.getCustomRepository(
      this.productVariantRepository_
    )

    const priceIndex = config.relations?.indexOf("prices") ?? -1
    if (priceIndex >= 0 && config.relations) {
      config.relations = [...config.relations]
      config.relations.splice(priceIndex, 1)
    }

    let q: string | undefined
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (q) {
      const where = query.where

      delete where.sku
      delete where.title

      query.join = {
        alias: "variant",
        innerJoin: {
          product: "variant.product",
        },
      }

      query.where = (qb: SelectQueryBuilder<ProductVariant>): void => {
        qb.where(where).andWhere([
          { sku: ILike(`%${q}%`) },
          { title: ILike(`%${q}%`) },
          { product: { title: ILike(`%${q}%`) } },
        ])
      }
    }

    const variants = await productVariantRepo.find(query)

    return priceIndex >= 0
      ? ((await this.setAdditionalPrices(
          variants,
          config.currency_code,
          config.region_id,
          config.cart_id,
          config.customer_id,
          config.include_discount_prices
        )) as ProductVariant[])
      : variants
  }

  /**
   * Deletes variant.
   * Will never fail due to delete being idempotent.
   * @param {string} variantId - the id of the variant to delete. Must be
   *   castable as an ObjectId
   * @return {Promise<void>} empty promise
   */
  async delete(variantId: string): Promise<void> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const variant = await variantRepo.findOne({
        where: { id: variantId },
        relations: ["prices"],
      })

      if (!variant) {
        return Promise.resolve()
      }

      await variantRepo.softRemove(variant)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.DELETED, {
          id: variant.id,
          product_id: variant.product_id,
          metadata: variant.metadata,
        })

      return Promise.resolve()
    })
  }

  /**
   * Dedicated method to set metadata for a variant.
   * @param {string} variant - the variant to set metadata for.
   * @param {Object} metadata - the metadata to set
   * @return {Object} updated metadata object
   */
  setMetadata_(
    variant: ProductVariant,
    metadata: object
  ): Record<string, unknown> {
    const existing = variant.metadata || {}
    const newData = {}
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof key !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Key type is invalid. Metadata keys must be strings"
        )
      }

      newData[key] = value
    }

    const updated = {
      ...existing,
      ...newData,
    }

    return updated
  }

  /**
   * Creates a query object to be used for list queries.
   * @param {object} selector - the selector to create the query from
   * @param {object} config - the config to use for the query
   * @return {object} an object containing the query, relations and free-text
   *   search param.
   */
  prepareListQuery_(
    selector: FilterableProductVariantProps,
    config: FindConfig<ProductVariant>
  ): { query: FindWithRelationsOptions; relations: string[]; q?: string } {
    let q: string | undefined
    if (typeof selector.q !== "undefined") {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query,
      relations: rels,
      q,
    }
  }

  /**
   * Lists variants based on the provided parameters and includes the count of
   * variants that match the query.
   * @param {object} variantRepo - the variant repository
   * @param {object} query - object that defines the scope for what should be returned
   * @param {object} q - free text query
   * @return {Promise<[ProductVariant[], number]>} an array containing the products as the first element and the total
   *   count of products that matches the query as the second element.
   */
  getFreeTextQueryBuilder_(
    variantRepo: ProductVariantRepository,
    query: FindWithRelationsOptions,
    q?: string
  ): SelectQueryBuilder<ProductVariant> {
    const where = query.where

    if (typeof where === "object") {
      if ("title" in where) {
        delete where.title
      }
    }

    let qb = variantRepo
      .createQueryBuilder("pv")
      .take(query.take)
      .skip(Math.max(query.skip ?? 0, 0))
      .leftJoinAndSelect("pv.product", "product")
      .select(["pv.id"])
      .where(where!)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`product.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`pv.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`pv.sku ILIKE :q`, { q: `%${q}%` })
        })
      )

    if (query.withDeleted) {
      qb = qb.withDeleted()
    }

    return qb
  }

  /**
   * Set additional prices on a list of variants.
   * @param {ProductVariant | ProductVariant[] } variant variant on which to set additional prices
   * @param {string} currency_code currency code to fetch prices for
   * @param {string} region_id region to fetch prices for
   * @param {string} cart_id string of cart to use as a basis for getting currency and region
   * @param {string} customer_id id of potentially logged in customer, used to get prices valid for their customer groups
   * @param {boolean} include_discount_prices should result include discount pricing
   * @return {Promise<ProductVariant | ProductVariant[]>} A list of variants with variants decorated with "additional_prices"
   */
  async setAdditionalPrices(
    variant,
    currency_code,
    region_id,
    cart_id,
    customer_id,
    include_discount_prices = false
  ): Promise<ProductVariant | ProductVariant[]> {
    return this.atomicPhase_(async (manager) => {
      const cartRepo = manager.getCustomRepository(this.cartRepository_)

      let regionId = region_id
      let currencyCode = currency_code

      if (cart_id) {
        const cart = await cartRepo.findOne({
          where: { id: cart_id },
          relations: ["region"],
        })

        regionId = cart.region.id
        currencyCode = cart.region.currency_code
      }

      const variantArray = Array.isArray(variant) ? variant : [variant]

      const priceSelectionStrategy =
        this.priceSelectionStrategy_.withTransaction(manager)

      const variantsWithPrices = await Promise.all(
        variantArray.map(async (v) => {
          const prices = await priceSelectionStrategy.calculateVariantPrice(
            v.id,
            {
              region_id: regionId,
              currency_code: currencyCode,
              cart_id: cart_id,
              customer_id: customer_id,
              include_discount_prices: include_discount_prices,
            }
          )

          return {
            ...v,
            prices: prices.prices,
            original_price: prices.originalPrice,
            calculated_price: prices.calculatedPrice,
            calculated_price_type: prices.calculatedPriceType,
          }
        })
      )

      return Array.isArray(variant) ? variantsWithPrices : variantsWithPrices[0]
    })
  }
}

export default ProductVariantService
