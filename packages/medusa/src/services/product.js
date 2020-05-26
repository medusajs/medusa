import mongoose from "mongoose"
import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate products.
 * @implements BaseService
 */
class ProductService extends BaseService {
  /** @param { productModel: (ProductModel) } */
  constructor({ productModel, eventBusService, productVariantService }) {
    super()

    /** @private @const {ProductModel} */
    this.productModel_ = productModel

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService
  }

  /**
   * Used to validate product ids. Throws an error if the cast fails
   * @param {string} rawId - the raw product id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The productId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.productModel_.find(selector)
  }

  /**
   * Gets a product by id.
   * Throws in case of DB Error and if product was not found.
   * @param {string} productId - the id of the product to get.
   * @return {Promise<Product>} the product document.
   */
  async retrieve(productId) {
    const validatedId = this.validateId_(productId)
    const product = await this.productModel_
      .findOne({ _id: validatedId })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!product) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with ${productId} was not found`
      )
    }
    return product
  }

  /**
   * Gets all variants belonging to a product.
   * @param {string} productId - the id of the product to get variants from.
   * @return {Promise} an array of variants
   */
  async retrieveVariants(productId) {
    const product = await this.retrieve(productId)
    return this.productVariantService_.list({ _id: { $in: product.variants } })
  }

  /**
   * Creates an unpublished product.
   * @param {object} product - the product to create
   * @return {Promise} resolves to the creation result.
   */
  createDraft(product) {
    return this.productModel_
      .create({
        ...product,
        published: false,
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Creates an publishes product.
   * @param {string} productId - ID of the product to publish.
   * @return {Promise} resolves to the creation result.
   */
  publish(productId) {
    return this.productModel_
      .updateOne({ _id: productId }, { $set: { published: true } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Updates a product. Metadata updates and product variant updates should
   * use dedicated methods, e.g. `setMetadata`, `addVariant`, etc. The function
   * will throw errors if metadata or product variant updates are attempted.
   * @param {string} productId - the id of the product. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  update(productId, update) {
    const validatedId = this.validateId_(productId)

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    if (update.variants) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use addVariant, reorderVariants, removeVariant to update Product Variants"
      )
    }

    return this.productModel_
      .updateOne(
        { _id: validatedId },
        { $set: update },
        { runValidators: true }
      )
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Deletes a product from a given product id. The product's associated
   * variants will also be deleted.
   * @param {string} productId - the id of the product to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(productId) {
    let product
    try {
      product = await this.retrieve(productId)
    } catch (error) {
      // Delete is idempotent, but we return a promise to allow then-chaining
      return Promise.resolve()
    }

    await Promise.all(
      product.variants.map(id => this.productVariantService_.delete(id))
    ).catch(err => {
      throw err
    })

    return this.productModel_.deleteOne({ _id: product._id }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Adds a product variant to a product. Will check that the given product
   * variant has correct option values.
   * @param {string} productId - the product the variant will be added to
   * @param {string} variantId - the variant to add to the product
   * @return {Promise} the result of update
   */
  async createVariant(productId, variant) {
    const product = await this.retrieve(productId)

    if (product.options.length !== variant.options.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product options length does not match variant options length. Product has ${product.options.length} and variant has ${variant.options.length}.`
      )
    }

    product.options.forEach(option => {
      if (!variant.options.find(vo => option._id.equals(vo.option_id))) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variant options do not contain value for ${option.title}`
        )
      }
    })

    let combinationExists = false
    if (product.variants && product.variants.length) {
      // Check if option value of the variant to add already exists. Go through
      // each existing variant. Check if this variants option values are
      // identical to the option values of the variant being added.
      combinationExists = product.variants.some(async vId => {
        const v = await this.productVariantService_.retrieve(vId)
        return v.options.reduce((acc, option, index) => {
          return acc && option.value === variant.options[index].value
        }, true)
      })
    }

    if (combinationExists) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variant with provided options already exists`
      )
    }

    const newVariant = await this.productVariantService_.createDraft(variant)

    return this.productModel_.updateOne(
      { _id: product._id },
      { $push: { variants: newVariant._id } }
    )
  }

  /**
   * Adds an option to a product. Options can, for example, be "Size", "Color",
   * etc. Will update all the products variants with a dummy value for the newly
   * created option. The same option cannot be added more than once.
   * @param {string} productId - the product to apply the new option to
   * @param {string} optionTitle - the display title of the option, e.g. "Size"
   * @return {Promise} the result of the model update operation
   */
  async addOption(productId, optionTitle) {
    const product = await this.retrieve(productId)

    // Make sure that option doesn't already exist
    if (product.options.find(o => o.title === optionTitle)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `An option with the title: ${optionTitle} already exists`
      )
    }

    const optionId = mongoose.Types.ObjectId()

    // All product variants must have at least a dummy value for the new option
    if (product.variants) {
      await Promise.all(
        product.variants.map(async variantId =>
          this.productVariantService_.addOptionValue(
            variantId,
            optionId,
            "Default Value"
          )
        )
      ).catch(err => {
        // If any of the variants failed to add the new option value we clean up
        return Promise.all(
          product.variants.map(async variantId =>
            this.productVariantService_.deleteOptionValue(variantId, optionId)
          )
        ).then(() => {
          throw err
        })
      })
    }

    // Everything went well add the product option
    return this.productModel_
      .updateOne(
        { _id: productId },
        {
          $push: {
            options: {
              _id: optionId,
              title: optionTitle,
              product_id: productId,
            },
          },
        }
      )
      .catch(err => {
        // If we failed to update the product clean up its variants
        return Promise.all(
          product.variants.map(async variantId =>
            this.productVariantService_.deleteOptionValue(variantId, optionId)
          )
        ).then(() => {
          throw err
        })
      })
  }

  async reorderVariants(productId, variantOrder) {
    const product = await this.retrieve(productId)

    if (product.variants.length !== variantOrder.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product variants and new variant order differ in length. To delete or add variants use removeVariant or addVariant`
      )
    }

    const newOrder = variantOrder.map(vId => {
      const variant = product.variants.find(id => id === vId)
      if (!variant) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product has no variant with id: ${vId}`
        )
      }

      return variant
    })

    return this.productModel_.updateOne(
      {
        _id: productId,
      },
      {
        $set: { variants: newOrder },
      }
    )
  }

  /**
   * Changes the order of a product's options. Will throw if the length of
   * optionOrder and the length of the product's options are different. Will
   * throw optionOrder contains an id not associated with the product.
   * @param {string} productId - the product whose options we are reordering
   * @param {[ObjectId]} optionId - the ids of the product's options in the
   *    new order
   * @return {Promise} the result of the update operation
   */
  async reorderOptions(productId, optionOrder) {
    const product = await this.retrieve(productId)

    if (product.options.length !== optionOrder.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product options and new options order differ in length. To delete or add options use removeOption or addOption`
      )
    }

    const newOrder = optionOrder.map(oId => {
      const option = product.options.find(o => o._id === oId)
      if (!option) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product has no option with id: ${oId}`
        )
      }

      return option
    })

    return this.productModel_.updateOne(
      {
        _id: productId,
      },
      {
        $set: { options: newOrder },
      }
    )
  }

  /**
   * Updates a product's option. Throws if the call tries to update an option
   * not associated with the product. Throws if the updated title already exists.
   * @param {string} productId - the product whose option we are updating
   * @param {string} optionId - the id of the option we are updating
   * @param {object} data - the data to update the option with
   * @return {Promise} the result of the update operation
   */
  async updateOption(productId, optionId, data) {
    const product = await this.retrieve(productId)

    const option = product.options.find(o => o._id === optionId)
    if (!option) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product has no option with id: ${optionId}`
      )
    }

    const { title, values } = data
    const titleExists = product.options.some(
      o => o.title.toUpperCase() === title.toUpperCase()
    )

    if (titleExists) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `An option with title ${title} already exists`
      )
    }

    const update = {}
    update["options.$.title"] = title

    return this.productModel_.updateOne(
      {
        _id: productId,
        "options._id": optionId,
      },
      {
        $set: update,
      }
    )
  }

  /**
   * Delete an option from a product.
   * @param {string} productId - the product to delete an option from
   * @param {string} optionId - the option to delete
   * @return {Promise} return the result of update
   */
  async deleteOption(productId, optionId) {
    const product = await this.retrieve(productId)

    if (!product.options.find(o => o._id.equals(optionId))) {
      return Promise.resolve()
    }

    if (product.variants.length) {
      // For the option we want to delete, make sure that all variants have the
      // same option values. The reason for doing is, that we want to avoid
      // duplicate variants. For example, if we have a product with size and
      // color options, that has four variants: (black, 1), (black, 2),
      // (blue, 1), (blue, 2) and we delete the size option from the product,
      // we would end up with four variants: (black), (black), (blue), (blue).
      // We now have two duplicate variants. To ensure that this does not
      // happen, we will force the user to select which variants to keep.
      const firstVariant = await this.productVariantService_.retrieve(
        product.variants[0]
      )
      const valueToMatch = firstVariant.options.find(
        o => o.option_id === optionId
      ).value

      const equalsFirst = await Promise.all(
        product.variants.map(async vId => {
          const v = await this.productVariantService_.retrieve(vId)
          const option = v.options.find(o => o.option_id === optionId)
          return option.value === valueToMatch
        })
      )

      if (!equalsFirst.every(v => v)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `To delete an option, first delete all variants, such that when option is deleted, no duplicate variants will exist. For more info check MEDUSA.com`
        )
      }
    }

    const result = await this.productModel_.updateOne(
      { _id: productId },
      {
        $pull: {
          options: {
            _id: optionId,
          },
        },
      }
    )

    // If we reached this point, we can delete option value from variants
    if (product.variants) {
      await Promise.all(
        product.variants.map(async variantId =>
          this.productVariantService_.deleteOptionValue(variantId, optionId)
        )
      )
    }

    return result
  }

  /**
   * Removes variant from product
   * @param {string} productId - the product to remove the variant from
   * @param {string} variantId - the variant to remove from product
   * @return {Promise} the result of update
   */
  async deleteVariant(productId, variantId) {
    const product = await this.retrieve(productId)

    await this.productVariantService_.delete(variantId)

    return this.productModel_.updateOne(
      { _id: product._id },
      {
        $pull: {
          variants: variantId,
        },
      }
    )
  }

  async updateOptionValue(productId, variantId, optionId, value) {
    const product = await this.retrieve(productId)

    // Check if the product-to-variant relationship holds
    if (!product.variants.includes(variantId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The variant could not be found in the product"
      )
    }

    // Retrieve all variants
    const variants = await this.retrieveVariants(productId)
    const toUpdate = variants.find(v => v._id.equals(variantId))

    // Check if an update would create duplicate variants
    const canUpdate = variants.every(v => {
      // The variant we update is irrelevant
      if (v._id.equals(variantId)) {
        return true
      }

      // Check if the variant's options are identical to the variant we
      // are updating
      const hasMatchingOptions = v.options.every(option => {
        if (option.option_id === optionId) {
          return option.value === value
        }

        const toUpdateOption = toUpdate.options.find(
          o => o.option_id === option.option_id
        )
        return toUpdateOption.value === option.value
      })

      return !hasMatchingOptions
    })

    if (!canUpdate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "A variant with the given option value combination already exist"
      )
    }

    return this.productVariantService_.updateOptionValue(
      variantId,
      optionId,
      value
    )
  }

  /**
   * Decorates a product with product variants.
   * @param {Product} product - the product to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Product} return the decorated product.
   */
  async decorate(product, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(product, fields.concat(requiredFields))
    if (expandFields.includes("variants")) {
      decorated.variants = await Promise.all(
        product.variants.map(variantId =>
          this.productVariantService_.retrieve(variantId)
        )
      )
    }
    return decorated
  }

  /**
   * Dedicated method to set metadata for a product.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} productId - the product to decorate.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  setMetadata(productId, key, value) {
    const validatedId = this.validateId_(productId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.productModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default ProductService
