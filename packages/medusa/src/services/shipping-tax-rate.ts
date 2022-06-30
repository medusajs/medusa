import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { ShippingTaxRate } from "../models/shipping-tax-rate"
import { ShippingTaxRateRepository } from "../repositories/shipping-tax-rate"
import { FindConfig } from "../types/common"
import { FilterableShippingTaxRateProps } from "../types/shipping-tax-rate"

/**
 * Provides layer to manipulate Shipping variants.
 * @extends BaseService
 */
class ShippingTaxRateService extends BaseService {
  private manager_: EntityManager
  private shippingTaxRateRepository_: typeof ShippingTaxRateRepository

  constructor({ manager, shippingTaxRateRepository }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ShippingVariantModel} */
    this.shippingTaxRateRepository_ = shippingTaxRateRepository
  }

  withTransaction(transactionManager: EntityManager): ShippingTaxRateService {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShippingTaxRateService({
      manager: transactionManager,
      shippingTaxRateRepository: this.ShippingTaxRateRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Lists Shipping Tax Rates given a certain query.
   * @param selector - the query object for find
   * @param config - query config object for variant retrieval
   * @return the result of the find operation
   */
  async list(
    selector: FilterableShippingTaxRateProps,
    config: FindConfig<ShippingTaxRate> = { relations: [], skip: 0, take: 20 }
  ): Promise<ShippingTaxRate[]> {
    const sTaxRateRepo = this.manager_.getCustomRepository(
      this.shippingTaxRateRepository_
    )

    const query = this.buildQuery_(selector, config)

    return await sTaxRateRepo.find(query)
  }
}

export default ShippingTaxRateService
