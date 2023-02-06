import { MedusaError } from "medusa-core-utils"
import { EntityManager, ILike } from "typeorm"
import { ProductType } from "../models"
import { ProductTypeRepository } from "../repositories/product-type"
import { FindConfig, Selector } from "../types/common"
import { TransactionBaseService } from "../interfaces"
import { buildQuery, isString } from "../utils"

class ProductTypeService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly typeRepository_: typeof ProductTypeRepository

  constructor({ manager, productTypeRepository }) {
    super(arguments[0])

    this.manager_ = manager
    this.typeRepository_ = productTypeRepository
  }

  /**
   * Gets a product type by id.
   * Throws in case of DB Error and if product was not found.
   * @param id - id of the product to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve(
    id: string,
    config: FindConfig<ProductType> = {}
  ): Promise<ProductType> {
    const typeRepo = this.manager_.getCustomRepository(this.typeRepository_)

    const query = buildQuery({ id }, config)
    const type = await typeRepo.findOne(query)

    if (!type) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product type with id: ${id} was not found`
      )
    }

    return type
  }

  /**
   * Lists product types
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: Selector<ProductType> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<ProductType[]> {
    const [productTypes] = await this.listAndCount(selector, config)
    return productTypes
  }

  /**
   * Lists product types and adds count.
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: Selector<ProductType> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<[ProductType[], number]> {
    const typeRepo = this.manager_.getCustomRepository(this.typeRepository_)

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      query.where.value = ILike(`%${q}%`)
    }

    if (query.where.discount_condition_id) {
      const discountConditionId = query.where.discount_condition_id as string
      delete query.where.discount_condition_id
      return await typeRepo.findAndCountByDiscountConditionId(
        discountConditionId,
        query
      )
    }

    return await typeRepo.findAndCount(query)
  }
}

export default ProductTypeService
