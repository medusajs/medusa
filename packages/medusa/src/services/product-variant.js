import _ from "lodash"
import { BaseService } from "medusa-interfaces"
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
    productVariantModel,
    eventBusService,
    regionService,
    moneyAmountRepository,
    productOptionValueRepository,
  }) {
    super()

    /** @private @const {ProductVariantModel} */
    this.productVariantModel_ = productVariantModel

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    this.moneyAmountRepository_ = moneyAmountRepository

    this.productOptionValueRepository_ = productOptionValueRepository
  }

  /**
   * Used to validate product ids. Throws an error if the cast fails
   * @param {string} rawId - the raw product id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    return rawId
  }

  /**
   * Gets a product variant by id.
   * @param {string} variantId - the id of the product to get.
   * @return {Promise<Product>} the product document.
   */
  async retrieve(variantId) {
    const validatedId = this.validateId_(variantId)
    const variantRepo = this.manager_.getCustomRepository(
      this.variantRepository_
    )

    const variant = await variantRepo.findOneOrFail({
      where: { id: validatedId },
    })

    return variant
  }

  /**
   * Creates an unpublished product variant. Will validate against parent product
   * to ensure that the variant can in fact be created.
   * @param {string} productId - the product the variant will be added to
   * @param {object} variant - the variant to create
   * @return {Promise} resolves to the creation result.
   */
  async create(productId, variant) {
    return this.atomicPhase_(async manager => {
      const productRepo = manager.getCustomRepository(this.productRepository_)
      const variantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const product = await productRepo.findOneOrFail({
        where: { id: productId },
        relations: ["variants", "options"],
      })

      if (product.options.length !== variant.options.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product options length does not match variant options length. Product has ${product.options.length} and variant has ${variant.options.length}.`
        )
      }

      product.options.forEach(option => {
        if (!variant.options.find(vo => option.id.equals(vo.option_id))) {
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

      const productVariant = await variantRepo.create(variant)

      const result = await variantRepo.save(productVariant)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.CREATED, result)
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
        .emit(ProductVariantService.Events.CREATED, result)
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
        variant = await variantRepo.findOneOrFail({ where: { id: variantId } })
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
            await this.setCurrencyPrice(
              variant.id,
              price.currency_code,
              price.amount,
              price.sale_amount || undefined
            )
          }
        }
      }

      if (options) {
        for (const option of options) {
          await this.updateOptionValue(variantId, option.option_id, value)
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
  async setCurrencyPrice(variantId, currencyCode, amount) {
    return this.atomicPhase_(async manager => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      const priceToUpdate = moneyAmountRepo.findOne({
        where: { currency_code: currencyCode, variant_id: variantId },
      })

      if (!priceToUpdate) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Money amount does not exist`
        )
      }

      priceToUpdate.amount = amount
      priceToUpdate.saleAmount = saleAmount

      const result = await moneyAmountRepo.save(priceToUpdate)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.UPDATED, result)
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
      const regionRepo = manager.getCustomRepository(this.regionRepository_)

      const region = await regionRepo.findOneOrFail({ where: { id: regionId } })

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
  async setRegionPrice(variantId, regionId, amount, saleAmount) {
    return this.atomicPhase_(async manager => {
      const moneyAmountRepo = manager.getCustomRepository(
        this.moneyAmountRepository_
      )

      const priceToUpdate = moneyAmountRepo.findOne({
        where: { region_id: regionId, variant_id: variantId },
      })

      if (!priceToUpdate) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Money amount does not exist`
        )
      }

      priceToUpdate.amount = amount
      priceToUpdate.saleAmount = saleAmount

      const result = await moneyAmountRepo.save(priceToUpdate)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.UPDATED, result)
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
    return atomicPhase_(async manager => {
      const productOptionValueRepo = manager.getCustomRepository(
        this.productOptionValueRepository_
      )

      const productOptionValue = await productOptionValueRepo.findOneOrFail({
        where: { variant_id: variantId, option_id: optionId },
      })

      productOptionValue.value = optionValue

      const result = await productOptionValueRepo.save(productOptionValue)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.UPDATED, result)
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
    return atomicPhase_(async manager => {
      const productOptionValueRepo = manager.getCustomRepository(
        this.productOptionValueRepository_
      )

      const productOptionValue = await productOptionValueRepo.create({
        variant_id: variantId,
        option_id: optionId,
        value: optionValue,
      })

      const result = await productOptionValueRepo.save(productOptionValue)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductVariantService.Events.UPDATED, result)
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
    return atomicPhase_(async manager => {
      const productOptionValueRepo = manager.getCustomRepository(
        this.productOptionValueRepository_
      )

      const productOptionValue = await productOptionValueRepo.findOne({
        variant_id: variantId,
        option_id: optionId,
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
  async list(selector) {
    const variantRepo = this.manager_.getCustomRepository(
      this.variantRepository_
    )

    const variants = await variantRepo.find({ where: selector })

    return variants
  }

  /**
   * Deletes variant.
   * Will never fail due to delete being idempotent.
   * @param {string} variantId - the id of the variant to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} empty promise
   */
  async delete(variantId) {
    return atomicPhase_(async manager => {
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
   * Decorates a variant with variant variants.
   * @param {ProductVariant} variant - the variant to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {ProductVariant} return the decorated variant.
   */
  async decorate(variant, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(variant, fields.concat(requiredFields))
    const final = await this.runDecorators_(decorated)
    return final
  }

  /**
   * Dedicated method to set metadata for a variant.
   * @param {string} variant - the variant to set metadata for.
   * @param {Object} metadata - the metadata to set
   * @return {Object} updated metadata object
   */
  async setMetadata_(variant, metadata) {
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
