import { MedusaError } from "medusa-core-utils"
import { EntityManager, ILike, SelectQueryBuilder } from "typeorm"
import { ProductType } from "../models/product-type"
import { ProductTypeRepository } from "../repositories/product-type"
import { FindConfig } from "../types/common"
import { FilterableProductTypeProps } from "../types/product"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"

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
   * Gets a product by id.
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
        `Product with id: ${id} was not found`
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
    selector: FilterableProductTypeProps = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<ProductType[]> {
    const typeRepo = this.manager_.getCustomRepository(this.typeRepository_)

    const query = buildQuery(selector, config)
    return await typeRepo.find(query)
  }

  /**
   * Lists product tags and adds count.
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: FilterableProductTypeProps = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<[ProductType[], number]> {
    const typeRepo = this.manager_.getCustomRepository(this.typeRepository_)

    let q: string | undefined = undefined
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      const where = query.where

      delete where.value

      query.where = (qb: SelectQueryBuilder<ProductType>): void => {
        qb.where(where).andWhere([{ value: ILike(`%${q}%`) }])
      }
    }

    return await typeRepo.findAndCount(query)
  }
}

export default ProductTypeService
