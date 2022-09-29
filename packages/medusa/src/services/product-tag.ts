import { MedusaError } from "medusa-core-utils"
import { EntityManager, ILike, SelectQueryBuilder } from "typeorm"
import { ProductTag } from "../models"
import { ProductTagRepository } from "../repositories/product-tag"
import { FindConfig } from "../types/common"
import { FilterableProductTagProps } from "../types/product"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"

type ProductTagConstructorProps = {
  manager: EntityManager
  productTagRepository: typeof ProductTagRepository
}

class ProductTagService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly tagRepo_: typeof ProductTagRepository

  constructor({ manager, productTagRepository }: ProductTagConstructorProps) {
    super(arguments[0])
    this.manager_ = manager
    this.tagRepo_ = productTagRepository
  }

  /**
   * Retrieves a product tag by id.
   * @param tagId - the id of the product tag to retrieve
   * @param config - the config to retrieve the tag by
   * @return the collection.
   */
  async retrieve(
    tagId: string,
    config: FindConfig<ProductTag> = {}
  ): Promise<ProductTag> {
    const tagRepo = this.manager_.getCustomRepository(this.tagRepo_)

    const query = buildQuery({ id: tagId }, config)
    const tag = await tagRepo.findOne(query)

    if (!tag) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product tag with id: ${tagId} was not found`
      )
    }

    return tag
  }

  /**
   * Creates a product tag
   * @param tag - the product tag to create
   * @return created product tag
   */
  async create(tag: Partial<ProductTag>): Promise<ProductTag> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const tagRepo = manager.getCustomRepository(this.tagRepo_)

      const productTag = tagRepo.create(tag)
      return await tagRepo.save(productTag)
    })
  }

  /**
   * Lists product tags
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: FilterableProductTagProps = {},
    config: FindConfig<ProductTag> = { skip: 0, take: 20 }
  ): Promise<ProductTag[]> {
    const tagRepo = this.manager_.getCustomRepository(this.tagRepo_)

    const query = buildQuery(selector, config)
    return await tagRepo.find(query)
  }

  /**
   * Lists product tags and adds count.
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: FilterableProductTagProps = {},
    config: FindConfig<ProductTag> = { skip: 0, take: 20 }
  ): Promise<[ProductTag[], number]> {
    const tagRepo = this.manager_.getCustomRepository(this.tagRepo_)

    let q: string | undefined = undefined
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      const where = query.where

      delete where.value

      query.where = (qb: SelectQueryBuilder<ProductTag>): void => {
        qb.where(where).andWhere([{ value: ILike(`%${q}%`) }])
      }
    }

    return await tagRepo.findAndCount(query)
  }
}

export default ProductTagService
