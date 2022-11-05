import { EntityManager, ILike } from "typeorm"
import { ProductOption } from "../models"
import { FindConfig, Selector } from "../types/common"
import { TransactionBaseService } from "../interfaces"
import { buildQuery, isString } from "../utils"
import { ProductOptionRepository } from "../repositories/product-option"
import { MedusaError } from "medusa-core-utils"

class ProductOptionService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly optionRepository_: typeof ProductOptionRepository

  constructor({ manager, productOptionRepository }) {
    super(arguments[0])

    this.manager_ = manager
    this.optionRepository_ = productOptionRepository
  }

  /**
   * Retrieves a product option by id.
   * @param productOptionId - the id of the product option to retrieve.
   * @param config - the config of the product option to retrieve.
   * @return the product option.
   */
  async retrieve(
    productOptionId: string,
    config: FindConfig<ProductOption> = {}
  ): Promise<ProductOption> {
    const optionRepository = this.manager_.getCustomRepository(
      this.optionRepository_
    )

    const query = buildQuery({ id: productOptionId }, config)
    const productOption = await optionRepository.findOne(query)

    if (!productOption) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product option with id: ${productOptionId} was not found`
      )
    }

    return productOption
  }

  /**
   * Lists product options and adds count.
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: Selector<ProductOption> & {
      q?: string
    } = {},
    config: FindConfig<ProductOption> = { skip: 0, take: 20 }
  ): Promise<[ProductOption[], number]> {
    const typeRepo = this.manager_.getCustomRepository(this.optionRepository_)

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      query.where.title = ILike(`%${q}%`)
    }

    return await typeRepo.findAndCount(query)
  }
}

export default ProductOptionService
