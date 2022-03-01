import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { FindConfig } from "../types/common"
import { FilterableProductTypeProps } from "../types/product"
import { ProductType } from "../models/product-type"
import { ProductTypeRepository } from "../repositories/product-type"

/**
 * Provides layer to manipulate products.
 * @extends BaseService
 */
class ProductTypeService extends BaseService {
  private manager_: EntityManager
  private typeRepository_: typeof ProductTypeRepository
  constructor({ manager, productTypeRepository }) {
    super()

    this.manager_ = manager
    this.typeRepository_ = productTypeRepository
  }

  withTransaction(transactionManager: EntityManager): ProductTypeService {
    if (!transactionManager) {
      return this
    }

    const cloned = new ProductTypeService({
      manager: transactionManager,
      productTypeRepository: this.typeRepository_,
    })

    cloned.transactionManager_ = transactionManager
    cloned.manager_ = transactionManager

    return cloned
  }

  /**
   * Gets a product by id.
   * Throws in case of DB Error and if product was not found.
   * @param id - id of the product to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return {Promise<Product>} the result of the find one operation.
   */
  async retrieve(
    id: string,
    config: FindConfig<ProductType> = {}
  ): Promise<ProductType> {
    const typeRepo = this.manager_.getCustomRepository(this.typeRepository_)

    const query = this.buildQuery_({ id }, config)
    const type = await typeRepo.findOne(query)

    if (!type) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with id: ${id} was not found`
      )
    }

    return type
  }

  /**
   * Lists product types
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: FilterableProductTypeProps = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<ProductType[]> {
    const typeRepo = this.manager_.getCustomRepository(this.typeRepository_)

    const query = this.buildQuery_(selector, config)
    return await typeRepo.find(query)
  }

  /**
   * Lists product tags and adds count.
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: FilterableProductTypeProps = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<[ProductType[], number]> {
    const typeRepo = this.manager_.getCustomRepository(this.typeRepository_)

    const query = this.buildQuery_(selector, config)
    return await typeRepo.findAndCount(query)
  }
}

export default ProductTypeService
