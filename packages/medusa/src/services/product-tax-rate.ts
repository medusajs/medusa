import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { ProductTaxRate } from "../models/product-tax-rate"
import { ProductTaxRateRepository } from "../repositories/product-tax-rate"
import { FindConfig } from "../types/common"
import { FilterableProductTaxRateProps } from "../types/product-tax-rate"

/**
 * Provides layer to manipulate product variants.
 * @extends BaseService
 */
class ProductTaxRateService extends BaseService {
  private manager_: EntityManager
  private productTaxRateRepository_: typeof ProductTaxRateRepository

  constructor({ manager, productTaxRateRepository }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ProductVariantModel} */
    this.productTaxRateRepository_ = productTaxRateRepository
  }

  withTransaction(transactionManager: EntityManager): ProductTaxRateService {
    if (!transactionManager) {
      return this
    }

    const cloned = new ProductTaxRateService({
      manager: transactionManager,
      productTaxRateRepository: this.productTaxRateRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * @param {FilterableProductVariantProps} selector - the query object for find
   * @param {FindConfig<ProductVariant>} config - query config object for variant retrieval
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: FilterableProductTaxRateProps,
    config: FindConfig<ProductTaxRate> = { relations: [], skip: 0, take: 20 }
  ): Promise<ProductTaxRate[]> {
    const pTaxRateRepo = this.manager_.getCustomRepository(
      this.productTaxRateRepository_
    )

    const query = this.buildQuery_(selector, config)

    return await pTaxRateRepo.find(query)
  }
}

export default ProductTaxRateService
