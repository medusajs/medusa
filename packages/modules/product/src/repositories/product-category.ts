import {
  Context,
  DAL,
  ProductCategoryTransformOptions,
  ProductTypes,
} from "@medusajs/types"
import { DALUtils, isDefined, MedusaError } from "@medusajs/utils"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductCategory } from "@models"

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
export class ProductCategoryRepository extends DALUtils.MikroOrmBaseTreeRepository<ProductCategory> {
  buildFindOptions(
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    familyOptions: ProductCategoryTransformOptions = {}
  ) {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    const fields = (findOptions_.options.fields ??= [])
    const populate = (findOptions_.options.populate ??= [])

    // Ref: Building descendants
    // mpath and parent_category_id needs to be added to the query for the tree building to be done accurately
    if (
      familyOptions.includeDescendantsTree ||
      familyOptions.includeAncestorsTree
    ) {
      fields.indexOf("mpath") === -1 && fields.push("mpath")
      fields.indexOf("parent_category_id") === -1 &&
        fields.push("parent_category_id")
    }

    const shouldExpandParent =
      familyOptions.includeAncestorsTree ||
      populate.includes("parent_category") ||
      fields.some((field) => field.startsWith("parent_category."))

    if (shouldExpandParent) {
      populate.indexOf("parent_category") === -1 &&
        populate.push("parent_category")
    }

    const shouldExpandChildren =
      familyOptions.includeDescendantsTree ||
      populate.includes("category_children") ||
      fields.some((field) => field.startsWith("category_children."))

    if (shouldExpandChildren) {
      populate.indexOf("category_children") === -1 &&
        populate.push("category_children")
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return findOptions_
  }

  async find(
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    transformOptions: ProductCategoryTransformOptions = {},
    context: Context = {}
  ): Promise<ProductCategory[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = this.buildFindOptions(findOptions, transformOptions)

    const productCategories = await manager.find(
      ProductCategory,
      findOptions_.where as MikroFilterQuery<ProductCategory>,
      { ...findOptions_.options } as MikroOptions<ProductCategory>
    )

    if (
      !transformOptions.includeDescendantsTree &&
      !transformOptions.includeAncestorsTree
    ) {
      return productCategories
    }

    return await this.buildProductCategoriesWithTree(
      {
        descendants: transformOptions.includeDescendantsTree,
        ancestors: transformOptions.includeAncestorsTree,
      },
      productCategories,
      findOptions_
    )
  }

  async buildProductCategoriesWithTree(
    include: {
      descendants?: boolean
      ancestors?: boolean
    },
    productCategories: ProductCategory[],
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    context: Context = {}
  ): Promise<ProductCategory[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    // We dont want to get the relations as we will fetch all the categories and build the tree manually
    let relationIndex =
      findOptions.options?.populate?.indexOf("parent_category")
    const shouldPopulateParent = relationIndex !== -1
    if (shouldPopulateParent && include.ancestors) {
      findOptions.options!.populate!.splice(relationIndex as number, 1)
    }

    relationIndex = findOptions.options?.populate?.indexOf("category_children")
    const shouldPopulateChildren = relationIndex !== -1
    if (shouldPopulateChildren && include.descendants) {
      findOptions.options!.populate!.splice(relationIndex as number, 1)
    }

    const mpaths: any[] = []
    const parentMpaths = new Set()
    for (const cat of productCategories) {
      if (include.descendants) {
        mpaths.push({ mpath: { $like: `${cat.mpath}%` } })
      }

      if (include.ancestors) {
        let parent = ""
        cat.mpath?.split(".").forEach((mpath) => {
          if (mpath === "") {
            return
          }
          parentMpaths.add(parent + mpath + ".")
          parent += mpath + "."
        })
      }
    }

    mpaths.push({ mpath: Array.from(parentMpaths) })

    const whereOptions = {
      ...findOptions.where,
      $or: mpaths,
    }

    if ("parent_category_id" in whereOptions) {
      delete whereOptions.parent_category_id
    }

    if ("id" in whereOptions) {
      delete whereOptions.id
    }

    let allCategories = await manager.find(
      ProductCategory,
      whereOptions as MikroFilterQuery<ProductCategory>,
      findOptions.options as MikroOptions<ProductCategory>
    )

    allCategories = JSON.parse(JSON.stringify(allCategories))

    const categoriesById = new Map(allCategories.map((cat) => [cat.id, cat]))

    allCategories.forEach((cat: any) => {
      if (cat.parent_category_id && include.ancestors) {
        cat.parent_category = categoriesById.get(cat.parent_category_id)
      }
    })

    const populateChildren = (category, level = 0) => {
      const categories = allCategories.filter(
        (child) => child.parent_category_id === category.id
      )

      if (include.descendants) {
        category.category_children = categories.map((child) => {
          return populateChildren(categoriesById.get(child.id), level + 1)
        })
      }

      if (level === 0) {
        if (!include.ancestors && !shouldPopulateParent) {
          delete category.parent_category
        }

        return category
      }

      if (include.ancestors) {
        delete category.category_children
      }

      if (include.descendants) {
        delete category.parent_category
      }

      return category
    }

    const populatedProductCategories = productCategories.map((cat) => {
      const fullCategory = categoriesById.get(cat.id)
      return populateChildren(fullCategory)
    })

    return populatedProductCategories
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    transformOptions: ProductCategoryTransformOptions = {},
    context: Context = {}
  ): Promise<[ProductCategory[], number]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = this.buildFindOptions(findOptions, transformOptions)

    const [productCategories, count] = await manager.findAndCount(
      ProductCategory,
      findOptions_.where as MikroFilterQuery<ProductCategory>,
      findOptions_.options as MikroOptions<ProductCategory>
    )

    if (
      !transformOptions.includeDescendantsTree &&
      !transformOptions.includeAncestorsTree
    ) {
      return [productCategories, count]
    }

    return [
      await this.buildProductCategoriesWithTree(
        {
          descendants: transformOptions.includeDescendantsTree,
          ancestors: transformOptions.includeAncestorsTree,
        },
        productCategories,
        findOptions_
      ),
      count,
    ]
  }

  async delete(id: string, context: Context = {}): Promise<void> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
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
    await manager.nativeDelete(ProductCategory, { id: id }, {})
  }

  async create(
    data: ProductTypes.CreateProductCategoryDTO,
    context: Context = {}
  ): Promise<ProductCategory> {
    const categoryData = { ...data }
    const manager = super.getActiveManager<SqlEntityManager>(context)
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
    data: ProductTypes.UpdateProductCategoryDTO,
    context: Context = {}
  ): Promise<ProductCategory> {
    const categoryData = { ...data }
    const manager = super.getActiveManager<SqlEntityManager>(context)
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
    data: ProductTypes.UpdateProductCategoryDTO,
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
      rankCondition = { $gte: targetRank, $lte: originalRank }
    } else {
      shouldIncrementRank = false
      rankCondition = { $gte: originalRank, $lte: targetRank }
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

      const rank = shouldIncrementRank ? ++sibling.rank! : --sibling.rank!

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
