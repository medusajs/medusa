import { ProductTaxRate } from "../models"
import { ProductTaxRateRepository } from "../repositories/product-tax-rate"
import { FindConfig } from "../types/common"
import { FilterableProductTaxRateProps } from "../types/product-tax-rate"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"

class ProductTaxRateService extends TransactionBaseService {
  protected readonly productTaxRateRepository_: typeof ProductTaxRateRepository

  constructor({ productTaxRateRepository }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.productTaxRateRepository_ = productTaxRateRepository
  }

  /**
   * @param selector - the query object for find
   * @param config - query config object for variant retrieval
   * @return the result of the find operation
   */
  async list(
    selector: FilterableProductTaxRateProps,
    config: FindConfig<ProductTaxRate> = { relations: [], skip: 0, take: 20 }
  ): Promise<ProductTaxRate[]> {
    const pTaxRateRepo = this.activeManager_.withRepository(
      this.productTaxRateRepository_
    )

    const query = buildQuery(selector, config)

    return await pTaxRateRepo.find(query)
  }
}

export default ProductTaxRateService
