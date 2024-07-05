import { selectorConstraintsToString } from "@medusajs/utils"
import { isDefined, MedusaError } from "medusa-core-utils"
import { Between, EntityManager, MoreThanOrEqual, Not } from "typeorm"
import { EventBusService } from "."
import { TransactionBaseService } from "../interfaces"
import { ProductCategory } from "../models"
import { ProductCategoryRepository } from "../repositories/product-category"
import {
  FindConfig,
  QuerySelector,
  Selector,
  TreeQuerySelector,
} from "../types/common"
import {
  CreateProductCategoryInput,
  ReorderConditions,
  tempReorderRank,
  UpdateProductCategoryInput,
} from "../types/product-category"
import { buildQuery, nullableValue, setMetadata } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: EventBusService
  productCategoryRepository: typeof ProductCategoryRepository
}

/**
 * Provides layer to manipulate product categories.
 */
class ProductCategoryService extends TransactionBaseService {
  protected readonly productCategoryRepo_: typeof ProductCategoryRepository
  protected readonly eventBusService_: EventBusService

  static Events = {
    CREATED: "product-category.created",
    UPDATED: "product-category.updated",
    DELETED: "product-category.deleted",
  }

  constructor({
    productCategoryRepository,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.eventBusService_ = eventBusService
    this.productCategoryRepo_ = productCategoryRepository
  }

  /**
   * Lists product category based on the provided parameters and includes the count of
   * product category that match the query.
   * @param selector - Filter options for product category.
   * @param config - Configuration for query.
   * @param treeSelector - Filter options for product category tree relations
   * @return an array containing the product category as
   *   the first element and the total count of product category that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: TreeQuerySelector<ProductCategory>,
    config: FindConfig<ProductCategory> = {
      skip: 0,
      take: 100,
    },
    treeSelector: QuerySelector<ProductCategory> = {}
  ): Promise<[ProductCategory[], number]> {
    const includeDescendantsTree = !!selector.include_descendants_tree
    delete selector.include_descendants_tree

    const productCategoryRepo = this.activeManager_.withRepository(
      this.productCategoryRepo_
    )

    const selector_ = { ...selector }
    let q: string | undefined

    if ("q" in selector_) {
      q = selector_.q
      delete selector_.q
    }

    const query = buildQuery(selector_, config)

    return await productCategoryRepo.getFreeTextSearchResultsAndCount(
      query,
      q,
      treeSelector,
      includeDescendantsTree
    )
  }

  /**
   * A generic retrieve for fining product categories by different attributes.
   *
   * @param config - the config of the product category to retrieve.
   * @param selector
   * @param treeSelector
   * @return the product category.
   */
  protected async retrieve_(
    config: FindConfig<ProductCategory> = {},
    selector: Selector<ProductCategory> = {},
    treeSelector: QuerySelector<ProductCategory> = {}
  ) {
    const productCategoryRepo = this.activeManager_.withRepository(
      this.productCategoryRepo_
    )

    const query = buildQuery(selector, config)
    const productCategory = await productCategoryRepo.findOneWithDescendants(
      query,
      treeSelector
    )

    if (!productCategory) {
      const selectorConstraints = selectorConstraintsToString(selector)

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `ProductCategory with ${selectorConstraints} was not found`
      )
    }

    return productCategory
  }

  /**
   * Retrieves a product category by id.
   * @param productCategoryId - the id of the product category to retrieve.
   * @param config - the config of the product category to retrieve.
   * @param selector
   * @param treeSelector
   * @return the product category.
   */
  async retrieve(
    productCategoryId: string,
    config: FindConfig<ProductCategory> = {},
    selector: Selector<ProductCategory> = {},
    treeSelector: QuerySelector<ProductCategory> = {}
  ): Promise<ProductCategory> {
    if (!isDefined(productCategoryId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productCategoryId" must be defined`
      )
    }

    const selectors = Object.assign({ id: productCategoryId }, selector)
    return this.retrieve_(config, selectors, treeSelector)
  }

  /**
   * Retrieves a product category by handle.
   *
   * @param handle - the handle of the category
   * @param config - the config of the product category to retrieve.
   * @param selector
   * @param treeSelector
   * @return the product category.
   */
  async retrieveByHandle(
    handle: string,
    config: FindConfig<ProductCategory> = {},
    selector: Selector<ProductCategory> = {},
    treeSelector: QuerySelector<ProductCategory> = {}
  ) {
    if (!isDefined(handle)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"handle" must be defined`
      )
    }

    const selectors = Object.assign({ handle }, selector)
    return this.retrieve_(config, selectors, treeSelector)
  }

  /**
   * Creates a product category
   * @param productCategoryInput - parameters to create a product category
   * @return created product category
   */
  async create(
    productCategoryInput: CreateProductCategoryInput
  ): Promise<ProductCategory> {
    return await this.atomicPhase_(async (manager) => {
      const pcRepo = manager.withRepository(this.productCategoryRepo_)
      const siblingCount = await pcRepo.countBy({
        parent_category_id: nullableValue(
          productCategoryInput.parent_category_id
        ),
      })

      productCategoryInput.rank = siblingCount

      await this.transformParentIdToEntity(productCategoryInput)

      let productCategory = pcRepo.create(productCategoryInput)
      productCategory = await pcRepo.save(productCategory)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(ProductCategoryService.Events.CREATED, {
          id: productCategory.id,
        })

      return productCategory
    })
  }

  /**
   * Updates a product category
   * @param productCategoryId - id of product category to update
   * @param productCategoryInput - parameters to update in product category
   * @return updated product category
   */
  async update(
    productCategoryId: string,
    productCategoryInput: UpdateProductCategoryInput
  ): Promise<ProductCategory> {
    return await this.atomicPhase_(async (manager) => {
      let productCategory = await this.retrieve(productCategoryId)

      const productCategoryRepo = manager.withRepository(
        this.productCategoryRepo_
      )

      const { metadata, ...rest } = productCategoryInput

      if (metadata) {
        productCategory.metadata = setMetadata(productCategory, metadata)
      }

      const conditions = this.fetchReorderConditions(
        productCategory,
        productCategoryInput
      )

      if (conditions.shouldChangeRank || conditions.shouldChangeParent) {
        productCategoryInput.rank = tempReorderRank
      }

      await this.transformParentIdToEntity(productCategoryInput)

      for (const key in productCategoryInput) {
        if (isDefined(productCategoryInput[key])) {
          productCategory[key] = productCategoryInput[key]
        }
      }

      productCategory = await productCategoryRepo.save(productCategory)

      await this.performReordering(productCategoryRepo, conditions)
      await this.eventBusService_
        .withTransaction(manager)
        .emit(ProductCategoryService.Events.UPDATED, {
          id: productCategory.id,
        })

      return productCategory
    })
  }

  /**
   * Deletes a product category
   *
   * @param productCategoryId is the id of the product category to delete
   * @return a promise
   */
  async delete(productCategoryId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productCategoryRepository: typeof ProductCategoryRepository =
        manager.withRepository(this.productCategoryRepo_)

      const productCategory = await this.retrieve(productCategoryId, {
        relations: ["category_children"],
      }).catch((err) => void 0)

      if (!productCategory) {
        return
      }

      const conditions = this.fetchReorderConditions(
        productCategory,
        {
          parent_category_id: productCategory.parent_category_id,
          rank: productCategory.rank,
        },
        true
      )

      if (productCategory.category_children.length > 0) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Deleting ProductCategory (${productCategoryId}) with category children is not allowed`
        )
      }

      await productCategoryRepository.delete(productCategory.id)
      await this.performReordering(productCategoryRepository, conditions)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(ProductCategoryService.Events.DELETED, {
          id: productCategory.id,
        })
    })
  }

  /**
   * Add a batch of product to a product category
   * @param productCategoryId - The id of the product category on which to add the products
   * @param productIds - The products ids to attach to the product category
   * @return the product category on which the products have been added
   */
  async addProducts(
    productCategoryId: string,
    productIds: string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productCategoryRepository = manager.withRepository(
        this.productCategoryRepo_
      )

      await productCategoryRepository.addProducts(productCategoryId, productIds)
    })
  }

  /**
   * Remove a batch of product from a product category
   * @param productCategoryId - The id of the product category on which to remove the products
   * @param productIds - The products ids to remove from the product category
   * @return the product category on which the products have been removed
   */
  async removeProducts(
    productCategoryId: string,
    productIds: string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productCategoryRepository = manager.withRepository(
        this.productCategoryRepo_
      )

      await productCategoryRepository.removeProducts(
        productCategoryId,
        productIds
      )
    })
  }

  protected fetchReorderConditions(
    productCategory: ProductCategory,
    input: UpdateProductCategoryInput,
    shouldDeleteElement = false
  ): ReorderConditions {
    const originalParentId = productCategory.parent_category_id
    const targetParentId = input.parent_category_id
    const originalRank = productCategory.rank
    const targetRank = input.rank
    const shouldChangeParent =
      targetParentId !== undefined && targetParentId !== originalParentId
    const shouldChangeRank =
      shouldChangeParent ||
      (isDefined(targetRank) && originalRank !== targetRank)

    return {
      targetCategoryId: productCategory.id,
      originalParentId,
      targetParentId,
      originalRank,
      targetRank,
      shouldChangeParent,
      shouldChangeRank,
      shouldIncrementRank: false,
      shouldDeleteElement,
    }
  }

  protected async performReordering(
    repository: typeof ProductCategoryRepository,
    conditions: ReorderConditions
  ): Promise<void> {
    const { shouldChangeParent, shouldChangeRank, shouldDeleteElement } =
      conditions

    if (!(shouldChangeParent || shouldChangeRank || shouldDeleteElement)) {
      return
    }

    // If we change parent, we need to shift the siblings to eliminate the
    // rank occupied by the targetCategory in the original parent.
    shouldChangeParent &&
      (await this.shiftSiblings(repository, {
        ...conditions,
        targetRank: conditions.originalRank,
        targetParentId: conditions.originalParentId,
      }))

    // If we change parent, we need to shift the siblings of the new parent
    // to create a rank that the targetCategory will occupy.
    shouldChangeParent &&
      shouldChangeRank &&
      (await this.shiftSiblings(repository, {
        ...conditions,
        shouldIncrementRank: true,
      }))

    // If we only change rank, we need to shift the siblings
    // to create a rank that the targetCategory will occupy.
    ;((!shouldChangeParent && shouldChangeRank) || shouldDeleteElement) &&
      (await this.shiftSiblings(repository, {
        ...conditions,
        targetParentId: conditions.originalParentId,
      }))
  }

  protected async shiftSiblings(
    repository: typeof ProductCategoryRepository,
    conditions: ReorderConditions
  ): Promise<void> {
    let { shouldIncrementRank, targetRank } = conditions
    const {
      shouldChangeParent,
      originalRank,
      targetParentId,
      targetCategoryId,
      shouldDeleteElement,
    } = conditions

    // The current sibling count will replace targetRank if
    // targetRank is greater than the count of siblings.
    const siblingCount = await repository.countBy({
      parent_category_id: nullableValue(targetParentId),
      id: Not(targetCategoryId),
    })

    // The category record that will be placed at the requested rank
    // We've temporarily placed it at a temporary rank that is
    // beyond a reasonable value (tempReorderRank)
    const targetCategory = await repository.findOne({
      where: {
        id: targetCategoryId,
        parent_category_id: nullableValue(targetParentId),
        rank: tempReorderRank,
      },
    })

    // If the targetRank is not present, or if targetRank is beyond the
    // rank of the last category, we set the rank as the last rank
    if (targetRank === undefined || targetRank > siblingCount) {
      targetRank = siblingCount
    }

    let rankCondition

    // If parent doesn't change, we only need to get the ranks
    // in between the original rank and the target rank.
    if (shouldChangeParent || shouldDeleteElement) {
      rankCondition = MoreThanOrEqual(targetRank)
    } else if (originalRank > targetRank) {
      shouldIncrementRank = true
      rankCondition = Between(targetRank, originalRank)
    } else {
      shouldIncrementRank = false
      rankCondition = Between(originalRank, targetRank)
    }

    // Scope out the list of siblings that we need to shift up or down
    const siblingsToShift = await repository.find({
      where: {
        parent_category_id: nullableValue(targetParentId),
        rank: rankCondition,
        id: Not(targetCategoryId),
      },
      order: {
        // depending on whether we shift up or down, we order accordingly
        rank: shouldIncrementRank ? "DESC" : "ASC",
      },
    })

    // Depending on the conditions, we get a subset of the siblings
    // and independently shift them up or down a rank
    for (let index = 0; index < siblingsToShift.length; index++) {
      const sibling = siblingsToShift[index]

      // Depending on the condition, we could also have the targetCategory
      // in the siblings list, we skip shifting the target until all other siblings
      // have been shifted.
      if (sibling.id === targetCategoryId) {
        continue
      }

      sibling.rank = shouldIncrementRank ? ++sibling.rank : --sibling.rank

      await repository.save(sibling)
    }

    // The targetCategory will not be present in the query when we are shifting
    // siblings of the old parent of the targetCategory.
    if (!targetCategory) {
      return
    }

    // Place the targetCategory in the requested rank
    targetCategory.rank = targetRank
    await repository.save(targetCategory)
  }

  /**
   * Accepts an input object and transforms product_category_id
   * into product_category entity.
   * @param productCategoryInput - params used to create/update
   * @return transformed productCategoryInput
   */
  protected async transformParentIdToEntity(
    productCategoryInput:
      | CreateProductCategoryInput
      | UpdateProductCategoryInput
  ): Promise<CreateProductCategoryInput | UpdateProductCategoryInput> {
    // Typeorm only updates mpath when the category entity of the parent
    // is passed into create/save. For this reason, every time we create a
    // category, we must fetch the entity and push to create
    const parentCategoryId = productCategoryInput.parent_category_id

    if (parentCategoryId === undefined) {
      return productCategoryInput
    }

    // It is really important that the parentCategory is either null or a record.
    // If the null is not explicitly passed to make it a root element, the mpath gets
    // incorrectly set
    const parentCategory = parentCategoryId
      ? await this.retrieve(parentCategoryId)
      : null

    productCategoryInput.parent_category = parentCategory
    delete productCategoryInput.parent_category_id

    return productCategoryInput
  }
}

export default ProductCategoryService
