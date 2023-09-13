import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { ProductCategory } from "@models"
import { Context, DAL, ProductCategoryTransformOptions } from "@medusajs/types"
import groupBy from "lodash/groupBy"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { DALUtils, isDefined, MedusaError } from "@medusajs/utils"

import { ProductCategoryServiceTypes } from "../types"

export type ReorderConditions = {
  targetCategoryId: string
  originalParentId: string | null
  targetParentId: string | null | undefined
  originalRank: number
  targetRank: number | undefined
  shouldChangeParent: boolean
  shouldChangeRank: boolean
  shouldIncrementRank: boolean
  shouldDeleteElement: boolean
}

export const tempReorderRank = 99999

// eslint-disable-next-line max-len
export class ProductCategoryRepository extends DALUtils.MikroOrmBaseTreeRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    transformOptions: ProductCategoryTransformOptions = {},
    context: Context = {}
  ): Promise<ProductCategory[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    const { includeDescendantsTree } = transformOptions
    findOptions_.options ??= {}
    const fields = (findOptions_.options.fields ??= [])

    // Ref: Building descendants
    // mpath and parent_category_id needs to be added to the query for the tree building to be done accurately
    if (includeDescendantsTree) {
      fields.indexOf("mpath") === -1 && fields.push("mpath")
      fields.indexOf("parent_category_id") === -1 &&
        fields.push("parent_category_id")
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    const productCategories = await manager.find(
      ProductCategory,
      findOptions_.where as MikroFilterQuery<ProductCategory>,
      findOptions_.options as MikroOptions<ProductCategory>
    )

    if (!includeDescendantsTree) {
      return productCategories
    }

    return this.buildProductCategoriesWithDescendants(
      productCategories,
      findOptions_
    )
  }

  async buildProductCategoriesWithDescendants(
    productCategories: ProductCategory[],
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    context: Context = {}
  ): Promise<ProductCategory[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    for (let productCategory of productCategories) {
      const whereOptions = {
        ...findOptions.where,
        mpath: {
          $like: `${productCategory.mpath}%`,
        },
      }

      if ("parent_category_id" in whereOptions) {
        delete whereOptions.parent_category_id
      }

      if ("id" in whereOptions) {
        delete whereOptions.id
      }

      const descendantsForCategory = await manager.find(
        ProductCategory,
        whereOptions as MikroFilterQuery<ProductCategory>,
        findOptions.options as MikroOptions<ProductCategory>
      )

      const descendantsByParentId = groupBy(
        descendantsForCategory,
        (pc) => pc.parent_category_id
      )

      const addChildrenToCategory = (category, children) => {
        category.category_children = (children || []).map((categoryChild) => {
          const moreChildren = descendantsByParentId[categoryChild.id] || []

          return addChildrenToCategory(categoryChild, moreChildren)
        })

        return category
      }

      const children = descendantsByParentId[productCategory.id] || []
      productCategory = addChildrenToCategory(productCategory, children)
    }

    return productCategories
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    transformOptions: ProductCategoryTransformOptions = {},
    context: Context = {}
  ): Promise<[ProductCategory[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    const { includeDescendantsTree } = transformOptions
    findOptions_.options ??= {}
    const fields = (findOptions_.options.fields ??= [])

    // Ref: Building descendants
    // mpath and parent_category_id needs to be added to the query for the tree building to be done accurately
    if (includeDescendantsTree) {
      fields.indexOf("mpath") === -1 && fields.push("mpath")
      fields.indexOf("parent_category_id") === -1 &&
        fields.push("parent_category_id")
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    const [productCategories, count] = await manager.findAndCount(
      ProductCategory,
      findOptions_.where as MikroFilterQuery<ProductCategory>,
      findOptions_.options as MikroOptions<ProductCategory>
    )

    if (!includeDescendantsTree) {
      return [productCategories, count]
    }

    return [
      await this.buildProductCategoriesWithDescendants(
        productCategories,
        findOptions_
      ),
      count,
    ]
  }

  async delete(id: string, context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const productCategory = await manager.findOneOrFail(
      ProductCategory,
      { id },
      {
        populate: ["category_children"],
      }
    )

    if (productCategory.category_children.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Deleting ProductCategory (${id}) with category children is not allowed`
      )
    }

    const conditions = this.fetchReorderConditions(
      productCategory,
      {
        parent_category_id: productCategory.parent_category_id,
        rank: productCategory.rank,
      },
      true
    )

    await this.performReordering(manager, conditions)
    await (manager as SqlEntityManager).nativeDelete(
      ProductCategory,
      { id: id },
      {}
    )
  }

  async create(
    data: ProductCategoryServiceTypes.CreateProductCategoryDTO,
    context: Context = {}
  ): Promise<ProductCategory> {
    const categoryData = { ...data }
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const siblings = await manager.find(ProductCategory, {
      parent_category_id: categoryData?.parent_category_id || null,
    })

    if (!isDefined(categoryData.rank)) {
      categoryData.rank = siblings.length
    }

    const productCategory = manager.create(ProductCategory, categoryData)

    manager.persist(productCategory)

    return productCategory
  }

  async update(
    id: string,
    data: ProductCategoryServiceTypes.UpdateProductCategoryDTO,
    context: Context = {}
  ): Promise<ProductCategory> {
    const categoryData = { ...data }
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const productCategory = await manager.findOneOrFail(ProductCategory, { id })

    const conditions = this.fetchReorderConditions(
      productCategory,
      categoryData
    )

    if (conditions.shouldChangeRank || conditions.shouldChangeParent) {
      categoryData.rank = tempReorderRank
    }

    // await this.transformParentIdToEntity(categoryData)

    for (const key in categoryData) {
      if (isDefined(categoryData[key])) {
        productCategory[key] = categoryData[key]
      }
    }

    manager.assign(productCategory, categoryData)
    manager.persist(productCategory)

    await this.performReordering(manager, conditions)

    return productCategory
  }

  protected fetchReorderConditions(
    productCategory: ProductCategory,
    data: ProductCategoryServiceTypes.UpdateProductCategoryDTO,
    shouldDeleteElement = false
  ): ReorderConditions {
    const originalParentId = productCategory.parent_category_id || null
    const targetParentId = data.parent_category_id
    const originalRank = productCategory.rank || 0
    const targetRank = data.rank
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
    manager: SqlEntityManager,
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
      (await this.shiftSiblings(manager, {
        ...conditions,
        targetRank: conditions.originalRank,
        targetParentId: conditions.originalParentId,
      }))

    // If we change parent, we need to shift the siblings of the new parent
    // to create a rank that the targetCategory will occupy.
    shouldChangeParent &&
      shouldChangeRank &&
      (await this.shiftSiblings(manager, {
        ...conditions,
        shouldIncrementRank: true,
      }))

    // If we only change rank, we need to shift the siblings
    // to create a rank that the targetCategory will occupy.
    ;((!shouldChangeParent && shouldChangeRank) || shouldDeleteElement) &&
      (await this.shiftSiblings(manager, {
        ...conditions,
        targetParentId: conditions.originalParentId,
      }))
  }

  protected async shiftSiblings(
    manager: SqlEntityManager,
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
    const siblingCount = await manager.count(ProductCategory, {
      parent_category_id: targetParentId || null,
      id: { $ne: targetCategoryId },
    })

    // The category record that will be placed at the requested rank
    // We've temporarily placed it at a temporary rank that is
    // beyond a reasonable value (tempReorderRank)
    const targetCategory = await manager.findOne(ProductCategory, {
      id: targetCategoryId,
      parent_category_id: targetParentId || null,
      rank: tempReorderRank,
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
      rankCondition = { $gte: targetRank }
    } else if (originalRank > targetRank) {
      shouldIncrementRank = true
      rankCondition = { $gte: targetRank, $lt: originalRank }
    } else {
      shouldIncrementRank = false
      rankCondition = { $gte: originalRank, $lt: targetRank }
    }

    // Scope out the list of siblings that we need to shift up or down
    const siblingsToShift = await manager.find(
      ProductCategory,
      {
        parent_category_id: targetParentId || null,
        rank: rankCondition,
        id: { $ne: targetCategoryId },
      },
      {
        orderBy: { rank: shouldIncrementRank ? "DESC" : "ASC" },
      }
    )

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

      if (!isDefined(sibling.rank)) {
        throw new Error("sibling rank is not defined")
      }

      const rank = shouldIncrementRank ? ++sibling.rank : --sibling.rank

      manager.assign(sibling, { rank })
      manager.persist(sibling)
    }

    // The targetCategory will not be present in the query when we are shifting
    // siblings of the old parent of the targetCategory.
    if (!targetCategory) {
      return
    }

    // Place the targetCategory in the requested rank
    manager.assign(targetCategory, { rank: targetRank })
    manager.persist(targetCategory)
  }
}
