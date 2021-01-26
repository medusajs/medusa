import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { Brackets, Raw, IsNull } from "typeorm"
import { Validator, MedusaError } from "medusa-core-utils"

/**
 * Provides layer to manipulate product variants.
 * @implements BaseService
 */
class ProductVariantService extends BaseService {
  static Events = {
    UPDATED: "product-variant.updated",
    CREATED: "product-variant.created",
  }

  /** @param { productVariantModel: (ProductVariantModel) } */
  constructor({
    manager,
    productVariantRepository,
    productRepository,
    eventBusService,
    regionService,
    moneyAmountRepository,
    productOptionValueRepository,
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
  }

  withTransaction(transactionManager) {
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
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Gets a product variant by id.
   * @param {string} variantId - the id of the product to get.
   * @return {Promise<Product>} the product document.
   */
  async retrieve(variantId, config = {}) {
    const variantRepo = this.manager_.getCustomRepository(
      this.productVariantRepository_
    )
    const validatedId = this.validateId_(variantId)
    const query = this.buildQuery_({ id: validatedId }, config)
    const variant = await variantRepo.findOne(query)

    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variant with id: ${variantId} was not found`
      )
    }

    return variant
  }

  /**
   * Gets a product variant by id.
   * @param {string} variantId - the id of the product to get.
   * @return {Promise<Product>} the product document.
   */
  async retrieveBySKU(sku, config = {}) {
    const variantRepo = this.manager_.getCustomRepository(
      this.productVariantRepository_
    )
    const query = this.buildQuery_({ sku }, config)
    const variant = await variantRepo.findOne(query)

    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variant with sku: ${sku} was not found`
      )
    }

    return variant
  }

  /**
   * Creates an unpublished product variant. Will validate against parent product
   * to ensure that the variant can in fact be created.
   * @param {string} productOrProductId - the product the variant will be added to
   * @param {object} variant - the variant to create
   * @return {Promise} resolves to the creation result.
   */
  async create(productOrProductId, variant) {
    return this.atomicPhase_(async manager => {
      const productRepo = manager.getCustomRepository(this.productRepository_)
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const { prices, ...rest } = variant

      let product = productOrProductId

      if (typeof product === `string`) {
        product = await productRepo.findOne({
          where: { id: productOrProductId },
          relations: ["variants", "variants.options", "options"],
        })
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

      product.options.forEach(option => {
        if (!variant.options.find(vo => option.id === vo.option_id)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Variant options do not contain value for ${option.title}`
          )
        }
      })

      let variantExists = undefined
      variantExists = product.variants.find(v => {
        return v.options.every(option => {
          const variantOption = variant.options.find(
            o => option.option_id === o.option_id
          )

          return option.value === variantOption.value
        })
      })

      if (variantExists) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variant with title ${variantExists.title} with provided options already exists`
        )
      }

      const toCreate = {
        ...rest,
        product_id: product.id,
      }

      const productVariant = await variantRepo.create(toCreate)

      const result = await variantRepo.save(productVariant)

      if (prices) {
        for (const price of prices) {
          if (price.region_id) {
            await this.setRegionPrice(
              result.id,
              price.region_id,
              price.amount,
              price.sale_amount || undefined
            )
          } else {
            await this.setCurrencyPrice(result.id, price)
          }
        }
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Publishes an existing variant.
   * @param {string} variantId - id of the variant to publish.
   * @return {Promise}
   */
  async publish(variantId) {
    return this.atomicPhase_(async manager => {
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const variant = await this.retrieve(variantId)

      variant.published = true

      const result = await variantRepo.save(variant)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.UPDATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Updates a variant.
   * Price updates should use dedicated methods.
   * The function will throw, if price updates are attempted.
   * @param {string | ProductVariant} variant - the id of the variant. Must be a
   *   string that can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(variantOrVariantId, update) {
    return this.atomicPhase_(async manager => {
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )
      let variant = variantOrVariantId

      if (typeof variant === `string`) {
        variant = await this.retrieve(variantOrVariantId)
      } else if (!variant.id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variant id missing`
        )
      }

      const { prices, options, metadata, ...rest } = update

      if (prices) {
        for (const price of prices) {
          if (price.region_id) {
            await this.setRegionPrice(
              variant.id,
              price.region_id,
              price.amount,
              price.sale_amount || undefined
            )
          } else {
            await this.setCurrencyPrice(variant.id, price)
          }
        }
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

      if (metadata) {
        variant.metadata = this.setMetadata_(variant, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        variant[key] = value
      }

      const result = await variantRepo.save(variant)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Sets the default price for the given currency.
   * @param {string} variantId - the id of the variant to set prices for
   * @param {string} currencyCode - the currency to set prices for
   * @param {number} amount - the amount to set the price to
   * @param {number} saleAmount - the sale amount to set the price to
   * @return {Promise} the result of the update operation
   */
  async setCurrencyPrice(variantId, price) {
    return this.atomicPhase_(async manager => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      let moneyAmount
      moneyAmount = await moneyAmountRepo.findOne({
        where: {
          currency_code: price.currency_code.toLowerCase(),
          variant_id: variantId,
          region_id: IsNull(),
        },
      })

      if (!moneyAmount) {
        moneyAmount = await moneyAmountRepo.create({
          ...price,
          currency_code: price.currency_code.toLowerCase(),
          variant_id: variantId,
        })
      } else {
        moneyAmount.amount = price.amount
        moneyAmount.sale_amount = price.sale_amount
      }

      const result = await moneyAmountRepo.save(moneyAmount)
      return result
    })
  }

  /**
   * Gets the price specific to a region. If no region specific money amount
   * exists the function will try to use a currency price. If no default
   * currency price exists the function will throw an error.
   * @param {string} variantId - the id of the variant to get price from
   * @param {string} regionId - the id of the region to get price for
   * @return {number} the price specific to the region
   */
  async getRegionPrice(variantId, regionId) {
    return this.atomicPhase_(async manager => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(regionId)

      // Find region price based on region id
      let moneyAmount = await moneyAmountRepo.findOne({
        where: { region_id: regionId, variant_id: variantId },
      })

      // If no price could be find based on region id, we try to fetch
      // based on the region currency code
      if (!moneyAmount) {
        moneyAmount = await moneyAmountRepo.findOne({
          where: { variant_id: variantId, currency_code: region.currency_code },
        })
      }

      // Still, if no price is found, we throw
      if (!moneyAmount) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `A price for region: ${region.name} could not be found`
        )
      }

      // Always return sale price, if present
      if (moneyAmount.sale_amount) {
        return moneyAmount.sale_amount
      } else {
        return moneyAmount.amount
      }
    })
  }

  /**
   * Sets the price of a specific region
   * @param {string} variantId - the id of the variant to update
   * @param {string} regionId - the id of the region to set price for
   * @param {number} amount - the amount to set the price to
   * @param {number} saleAmount - the sale amount to set the price to
   * @return {Promise} the result of the update operation
   */
  async setRegionPrice(variantId, price) {
    return this.atomicPhase_(async manager => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      let moneyAmount
      moneyAmount = await moneyAmountRepo.findOne({
        where: {
          variant_id: variantId,
          region_id: price.region_id,
        },
      })

      if (!moneyAmount) {
        moneyAmount = await moneyAmountRepo.create({
          ...price,
          variant_id: variantId,
        })
      } else {
        moneyAmount.amount = price.amount
        moneyAmount.sale_amount = price.sale_amount
      }

      const result = await moneyAmountRepo.save(moneyAmount)
      return result
    })
  }

  /**
   * Updates variant's option value.
   * Option value must be of type string or number.
   * @param {string} variantId - the variant to decorate.
   * @param {string} optionId - the option from product.
   * @param {string | number} optionValue - option value to add.
   * @return {Promise} the result of the update operation.
   */
  async updateOptionValue(variantId, optionId, optionValue) {
    return this.atomicPhase_(async manager => {
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

      const result = await productOptionValueRepo.save(productOptionValue)
      return result
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
   * @param {string | number} optionValue - option value to add.
   * @return {Promise} the result of the update operation.
   */
  async addOptionValue(variantId, optionId, optionValue) {
    return this.atomicPhase_(async manager => {
      const productOptionValueRepo = manager.getCustomRepository(
        this.productOptionValueRepository_
      )

      const productOptionValue = await productOptionValueRepo.create({
        variant_id: variantId,
        option_id: optionId,
        value: optionValue,
      })

      const result = await productOptionValueRepo.save(productOptionValue)
      return result
    })
  }

  /**
   * Deletes option value from given variant.
   * Will never fail due to delete being idempotent.
   * @param {string} variantId - the variant to decorate.
   * @param {string} optionId - the option from product.
   * @return {Promise} empty promise
   */
  async deleteOptionValue(variantId, optionId) {
    return this.atomicPhase_(async manager => {
      const productOptionValueRepo = manager.getCustomRepository(
        this.productOptionValueRepository_
      )

      const productOptionValue = await productOptionValueRepo.findOne({
        where: {
          variant_id: variantId,
          option_id: optionId,
        },
      })

      if (!productOptionValue) return Promise.resolve()

      await productOptionValueRepo.softRemove(productOptionValue)

      return Promise.resolve()
    })
  }

  /**
   * Checks if the inventory of a variant can cover a given quantity. Will
   * return true if the variant doesn't have managed inventory or if the variant
   * allows backorders or if the inventory quantity is greater than `quantity`.
   * @params {string} variantId - the id of the variant to check
   * @params {number} quantity - the number of units to check availability for
   * @return {boolean} true if the inventory covers the quantity
   */
  async canCoverQuantity(variantId, quantity) {
    const variant = await this.retrieve(variantId)

    const { inventory_quantity, allow_backorder, manage_inventory } = variant
    return (
      !manage_inventory || allow_backorder || inventory_quantity >= quantity
    )
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  async list(selector = {}, config = { relations: [], skip: 0, take: 20 }) {
    const productVariantRepo = this.manager_.getCustomRepository(
      this.productVariantRepository_
    )

    let q
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

      query.where = qb => {
        qb.where(where).andWhere(
          new Brackets(qb => {
            qb.where([
              { sku: Raw(a => `${a} ILIKE :q`, { q: `%${q}%` }) },
              { title: Raw(a => `${a} ILIKE :q`, { q: `%${q}%` }) },
            ]).orWhere(`product.title ILIKE :q`, { q: `%${q}%` })
          })
        )
      }
    }

    return productVariantRepo.find(query)
  }

  /**
   * Deletes variant.
   * Will never fail due to delete being idempotent.
   * @param {string} variantId - the id of the variant to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} empty promise
   */
  async delete(variantId) {
    return this.atomicPhase_(async manager => {
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const variant = await variantRepo.findOne({ where: { id: variantId } })

      if (!variant) return Promise.resolve()

      await variantRepo.softRemove(variant)

      return Promise.resolve()
    })
  }

  /**
   * Dedicated method to set metadata for a variant.
   * @param {string} variant - the variant to set metadata for.
   * @param {Object} metadata - the metadata to set
   * @return {Object} updated metadata object
   */
  setMetadata_(variant, metadata) {
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
}

export default ProductVariantService
