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
  protected readonly productCategoryRepo_: typeof ProductCategoryRepository
  protected transactionManager_: EntityManager | undefined

  constructor({ manager, productCategoryRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])
    this.manager_ = manager

    this.productCategoryRepo_ = productCategoryRepository
  }

  /**
   * Retrieves a product category by id.
   * @param productCategoryId - the id of the product category to retrieve.
   * @param config - the config of the product category to retrieve.
   * @return the product category.
   */
  async retrieve(
    productCategoryId: string,
    config: FindConfig<ProductCategory> = {}
  ): Promise<ProductCategory> {
    if (!isDefined(productCategoryId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productCategoryId" must be defined`
      )
    }

    const query = buildQuery({ id: productCategoryId }, config)
    const productCategoryRepo = this.manager_.getCustomRepository(
      this.productCategoryRepo_
    )

    const productCategory = await productCategoryRepo.findOne(query)

    if (!productCategory) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `ProductCategory with id: ${productCategoryId} was not found`
      )
    }

    // Returns the productCategory with all of its descendants until the last child node
    const productCategoryTree = await productCategoryRepo.findDescendantsTree(
      productCategory
    )

    return productCategoryTree
  }

  /**
   * Deletes a product category
   *
   * @param productCategoryId is the id of the product category to delete
   * @return a promise
   */
  async delete(productCategoryId: string): Promise<void> {
    const productCategoryRepository: ProductCategoryRepository =
      this.manager_.getCustomRepository(this.productCategoryRepo_)

    const productCategory = await this.retrieve(productCategoryId, {
      relations: ["category_children"],
    })

    if (productCategory.category_children.length === 0) {
      await productCategoryRepository.softRemove(productCategory)
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Deleting ProductCategory (${productCategoryId}) with category children is not allowed`
      )
    }
  }
}

export default ProductCategoryService
