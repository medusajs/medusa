import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager, IsNull, MoreThanOrEqual, Between, Not } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { ProductCategory } from "../models"
import { ProductCategoryRepository } from "../repositories/product-category"
import {
  FindConfig,
  QuerySelector,
  TreeQuerySelector,
  Selector,
} from "../types/common"
import { buildQuery, nullableValue } from "../utils"
import { EventBusService } from "."
import {
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
  ReorderConditions,
  tempReorderPosition,
} from "../types/product-category"
import { isNumber } from "lodash"

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
   * @return an array containing the product category as
   *   the first element and the total count of product category that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: TreeQuerySelector<ProductCategory>,
    config: FindConfig<ProductCategory> = {
      skip: 0,
      take: 100,
      order: { position: "ASC" },
    },
    treeSelector: QuerySelector<ProductCategory> = {}
  ): Promise<[ProductCategory[], number]> {
    const includeDescendantsTree = selector.include_descendants_tree || false
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
   * Retrieves a product category by id.
   * @param productCategoryId - the id of the product category to retrieve.
   * @param config - the config of the product category to retrieve.
   * @return the product category.
   */
  async retrieve(
    productCategoryId: string,
    config: FindConfig<ProductCategory> = {},
    selector: Selector<ProductCategory> = {}
  ): Promise<ProductCategory> {
    if (!isDefined(productCategoryId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productCategoryId" must be defined`
      )
    }

    const selectors = Object.assign({ id: productCategoryId }, selector)
    const query = buildQuery(selectors, config)
    const productCategoryRepo = this.activeManager_.withRepository(
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

      productCategoryInput.position = siblingCount

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

      const conditions = this.fetchReorderConditions(
        productCategory,
        productCategoryInput
      )

      if (conditions.shouldChangePosition || conditions.shouldChangeParent) {
        productCategoryInput.position = tempReorderPosition
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
          position: productCategory.position,
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
    const originalPosition = productCategory.position
    const targetPosition = input.position
    const shouldChangeParent =
      targetParentId !== undefined && targetParentId !== originalParentId
    const shouldIncrementPosition = false
    const shouldChangePosition =
      shouldChangeParent || originalPosition !== targetPosition

    return {
      targetCategoryId: productCategory.id,
      originalParentId,
      targetParentId,
      originalPosition,
      targetPosition,
      shouldChangeParent,
      shouldChangePosition,
      shouldIncrementPosition,
      shouldDeleteElement,
    }
  }

  protected async performReordering(
    repository: typeof ProductCategoryRepository,
    conditions: ReorderConditions
  ): Promise<void> {
    const { shouldChangeParent, shouldChangePosition, shouldDeleteElement } =
      conditions

    if (!(shouldChangeParent || shouldChangePosition || shouldDeleteElement)) {
      return
    }

    // If we change parent, we need to shift the siblings to eliminate the
    // position occupied by the targetCategory in the original parent.
    shouldChangeParent &&
      (await this.shiftSiblings(repository, {
        ...conditions,
        targetPosition: conditions.originalPosition,
        targetParentId: conditions.originalParentId,
      }))

    // If we change parent, we need to shift the siblings of the new parent
    // to create a position that the targetCategory will occupy.
    shouldChangeParent &&
      shouldChangePosition &&
      (await this.shiftSiblings(repository, {
        ...conditions,
        shouldIncrementPosition: true,
      }))

    // If we only change position, we need to shift the siblings
    // to create a position that the targetCategory will occupy.
    ;((!shouldChangeParent && shouldChangePosition) || shouldDeleteElement) &&
      (await this.shiftSiblings(repository, {
        ...conditions,
        targetParentId: conditions.originalParentId,
      }))
  }

  protected async shiftSiblings(
    repository: typeof ProductCategoryRepository,
    conditions: ReorderConditions
  ): Promise<void> {
    let { shouldIncrementPosition, targetPosition } = conditions
    const {
      shouldChangeParent,
      originalPosition,
      targetParentId,
      targetCategoryId,
      shouldDeleteElement,
    } = conditions

    // The current sibling count will replace targetPosition if
    // targetPosition is greater than the count of siblings.
    const siblingCount = await repository.countBy({
      parent_category_id: nullableValue(targetParentId),
      id: Not(targetCategoryId),
    })

    // The category record that will be placed at the requested position
    // We've temporarily placed it at a temporary position that is
    // beyond a reasonable value (tempReorderPosition)
    const targetCategory = await repository.findOne({
      where: {
        id: targetCategoryId,
        parent_category_id: nullableValue(targetParentId),
        position: tempReorderPosition,
      },
    })

    // If the targetPosition is not present, or if targetPosition is beyond the
    // position of the last category, we set the position as the last position
    if (targetPosition === undefined || targetPosition > siblingCount) {
      targetPosition = siblingCount
    }

    let positionCondition

    // If parent doesn't change, we only need to get the positions
    // in between the original position and the target position.
    if (shouldChangeParent || shouldDeleteElement) {
      positionCondition = MoreThanOrEqual(targetPosition)
    } else if (originalPosition > targetPosition) {
      shouldIncrementPosition = true
      positionCondition = Between(targetPosition, originalPosition)
    } else {
      shouldIncrementPosition = false
      positionCondition = Between(originalPosition, targetPosition)
    }

    // Scope out the list of siblings that we need to shift up or down
    const siblingsToShift = await repository.find({
      where: {
        parent_category_id: nullableValue(targetParentId),
        position: positionCondition,
        id: Not(targetCategoryId),
      },
      order: {
        // depending on whether we shift up or down, we order accordingly
        position: shouldIncrementPosition ? "DESC" : "ASC",
      },
    })

    // Depending on the conditions, we get a subset of the siblings
    // and independently shift them up or down a position
    for (let index = 0; index < siblingsToShift.length; index++) {
      const sibling = siblingsToShift[index]

      // Depending on the condition, we could also have the targetCategory
      // in the siblings list, we skip shifting the target until all other siblings
      // have been shifted.
      if (sibling.id === targetCategoryId) {
        continue
      }

      sibling.position = shouldIncrementPosition
        ? sibling.position + 1
        : sibling.position - 1

      await repository.save(sibling)
    }

    // The targetCategory will not be present in the query when we are shifting
    // siblings of the old parent of the targetCategory.
    if (!targetCategory) {
      return
    }

    // Place the targetCategory in the requested position
    targetCategory.position = targetPosition
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
    // is passed into create/save. For this reason, everytime we create a
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
