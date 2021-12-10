import { BaseService } from "medusa-interfaces"
import { INCLUDE_PRESENTMENT_PRICES } from "../utils/const"

class ShopifyService extends BaseService {
  constructor(
    {
      manager,
      shippingProfileService,
      shopifyProductService,
      shopifyCollectionService,
      shopifyClientService,
    },
    options
  ) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {ShippingProfileService} */
    this.shippingProfileService_ = shippingProfileService
    /** @private @const {ShopifyProductService} */
    this.productService_ = shopifyProductService
    /** @private @const {ShopifyCollectionService} */
    this.collectionService_ = shopifyCollectionService
    /** @private @const {ShopifyRestClient} */
    this.client_ = shopifyClientService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyService({
      manager: transactionManager,
      options: this.options,
      shippingProfileService: this.shippingProfileService_,
      shopifyClientService: this.client_,
      shopifyProductService: this.productService_,
      shopifyCollectionService: this.collectionService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async importShopify() {
    return this.atomicPhase_(async (manager) => {
      await this.shippingProfileService_.createDefault()
      await this.shippingProfileService_.createGiftCardDefault()

      const products = await this.client_.list(
        "products",
        INCLUDE_PRESENTMENT_PRICES
      )
      const customCollections = await this.client_.list("custom_collections")
      const smartCollections = await this.client_.list("smart_collections")
      const collects = await this.client_.list("collects")

      await this.collectionService_
        .withTransaction(manager)
        .createWithProducts(
          collects,
          [...customCollections, ...smartCollections],
          products
        )

      for (const product of products) {
        await this.productService_.withTransaction(manager).create(product)
      }
    })
  }
}

export default ShopifyService
