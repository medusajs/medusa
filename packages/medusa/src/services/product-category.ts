import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { ProductCategory } from "../models"
import { ProductCategoryRepository } from "../repositories/product-category"
import { FindConfig, Selector } from "../types/common"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  productCategoryRepository: typeof ProductCategoryRepository
}

/**
 * Provides layer to manipulate product categories.
 */
class ProductCategoryService extends TransactionBaseService {
  protected manager_: EntityManager
  protected readonly productCategoryRepository_: typeof ProductCategoryRepository
  protected transactionManager_: EntityManager | undefined

  constructor({
    manager,
    productCategoryRepository,
  }: InjectedDependencies) {
    super(arguments[0])
    this.manager_ = manager

    this.productCategoryRepository_ = productCategoryRepository
  }

  /**
   * Retrieves a product category by id.
   * @param id - the id of the product category to retrieve.
   * @param config - the config of the product category to retrieve.
   * @return the product category.
   */
  async retrieve(
    id: string,
    config: FindConfig<ProductCategory> = {},
  ): Promise<ProductCategory> {
    if (!isDefined(id)) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, `"id" must be defined`)
    }

    const query = buildQuery({ id: id }, config)
    const productCategoryRepo = this.manager_.getCustomRepository(
      this.productCategoryRepository_
    )

    const productCategory = await productCategoryRepo.findOne(query)

    if (!productCategory) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `ProductCategory with id: ${id} was not found`
      )
    }

    // Returns the productCategory with all of its descendants until the last child node
    const productCategoryTree = await productCategoryRepo.findDescendantsTree(productCategory)

    return productCategoryTree
  }
}

export default ProductCategoryService
