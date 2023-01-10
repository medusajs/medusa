import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { ProductCategory } from "../models"
import { ProductCategoryRepository } from "../repositories/product-category"
import { FindConfig, Selector, QuerySelector } from "../types/common"
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
   * Lists product category based on the provided parameters and includes the count of
   * product category that match the query.
   * @return an array containing the product category as
   *   the first element and the total count of product category that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: QuerySelector<ProductCategory>,
    config: FindConfig<ProductCategory> = {
      skip: 0,
      take: 100,
      order: { created_at: "DESC" },
    }
  ): Promise<[ProductCategory[], number]> {
    const manager = this.transactionManager_ ?? this.manager_
    const productCategoryRepo = manager.getCustomRepository(
      this.productCategoryRepo_
    )

    const selector_ = { ...selector }
    let q: string | undefined

    if ("q" in selector_) {
      q = selector_.q
      delete selector_.q
    }

    const query = buildQuery(selector_, config)

    return await productCategoryRepo.getFreeTextSearchResultsAndCount(query, q)
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
    return await this.atomicPhase_(async (manager) => {
      const productCategoryRepository: ProductCategoryRepository =
        manager.getCustomRepository(this.productCategoryRepo_)

      const productCategory = await this.retrieve(productCategoryId, {
        relations: ["category_children"],
      }).catch((err) => void 0)

      if (!productCategory) {
        return Promise.resolve()
      }

      if (productCategory.category_children.length > 0) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Deleting ProductCategory (${productCategoryId}) with category children is not allowed`
        )
      }

      await productCategoryRepository.delete(productCategory.id)

      return Promise.resolve()
    })
  }
}

export default ProductCategoryService
