import { BaseService } from "medusa-interfaces"
import { removeIndex } from "../utils/remove-index"
import axios from "axios"

class ShopifyRegionService extends BaseService {
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

    const cloned = new ShopifyRegionService({
      manager: transactionManager,
      options: this.options,
      shopifyProductService: this.productService_,
      productCollectionService: this.collectionService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async createRegions() {
    const countries = await axios
      .get(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/countries.json`,
        refundObject,
        {
          headers: {
            "X-Shopify-Access-Token": this.options.password,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        return res.data.countries
      })
  }

  normalizeRegion_(data) {
    return {}
  }
}

export default ShopifyRegionService
