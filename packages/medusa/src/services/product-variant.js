import { BaseService } from "../interfaces"

/**
 * Provides layer to manipulate products.
 * @implements BaseService
 */
class ProductVariantService extends BaseService {
  /** @param { productModel: (ProductModel) } */
  constructor({ productVariantModel, eventBusService }) {
    super()

    /** @private @const {ProductVariantModel} */
    this.productVariantModel_ = productVariantModel

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  /**
   * Creates an unpublished product.
   * @param {object} product - the product to create
   * @return {Promise} resolves to the creation result.
   */
  createDraft(productVariant) {
    return this.productVariantModel_.create({
      ...productVariant,
      published: false,
    })
  }

  /**
   * Creates an publishes product.
   * @param {string} productId - ID of the product to publish.
   * @return {Promise} resolves to the creation result.
   */
  publish(variantId) {
    return this.productVariantModel_.updateOne(
      { _id: variantId },
      { $set: { published: true } }
    )
  }

  /**
   *
   */
  addOptionValue(variantId, optionId, optionValue) {
  }
}

export default ProductVariantService
