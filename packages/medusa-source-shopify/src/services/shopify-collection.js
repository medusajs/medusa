import { BaseService } from "medusa-interfaces"
import { removeIndex } from "../utils/remove-index"

class ShopifyCollectionService extends BaseService {
  constructor(
    { manager, shopifyProductService, productCollectionService },
    options
  ) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {ShopifyProductService} */
    this.productService_ = shopifyProductService
    /** @private @const {ProductCollectionService} */
    this.collectionService_ = productCollectionService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyCollectionService({
      manager: transactionManager,
      options: this.options,
      shopifyProductService: this.productService_,
      productCollectionService: this.collectionService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   *
   * @param {Object[]} collects
   * @param {Object[]} collections
   * @param {Object[]} products
   * @return {Promise}
   */
  async createWithProducts(collects, collections, products) {
    return this.atomicPhase_(async (manager) => {
      const normalizedCollections = collections.map((c) =>
        this.normalizeCollection_(c)
      )

      const result = []

      for (const nc of normalizedCollections) {
        let collection = await this.collectionService_
          .retrieveByHandle(nc.handle)
          .catch((_) => undefined)

        if (!collection) {
          collection = await this.collectionService_
            .withTransaction(manager)
            .create(nc)
        }

        const productIds = collects.reduce((productIds, c) => {
          if (c.collection_id === collection.metadata.sh_id) {
            productIds.push(c.product_id)
          }
          return productIds
        }, [])

        const reducedProducts = products.reduce((reducedProducts, p) => {
          if (productIds.includes(p.id)) {
            reducedProducts.push(p)
            removeIndex(products, p)
          }
          return reducedProducts
        }, [])

        for (const product of reducedProducts) {
          await this.productService_
            .withTransaction(manager)
            .create(product, collection.id)
        }

        result.push(collection)
      }

      return result
    })
  }

  normalizeCollection_(shopifyCollection) {
    return {
      title: shopifyCollection.title,
      handle: shopifyCollection.handle,
      metadata: {
        sh_id: shopifyCollection.id,
        sh_body: shopifyCollection.body_html,
      },
    }
  }
}

export default ShopifyCollectionService
