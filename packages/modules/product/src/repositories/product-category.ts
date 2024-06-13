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
import { UpdateCategoryInput } from "@types"

// eslint-disable-next-line max-len
export class ProductCategoryRepository extends DALUtils.MikroOrmBaseTreeRepository<ProductCategory> {
  buildFindOptions(
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    familyOptions: ProductCategoryTransformOptions = {}
  ) {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {
      orderBy: { rank: "ASC" },
    }

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
      findOptions_.options as MikroOptions<ProductCategory>
    )

    if (
      !transformOptions.includeDescendantsTree &&
      !transformOptions.includeAncestorsTree
    ) {
      return productCategories
    }

    const categoriesTree = await this.buildProductCategoriesWithTree(
      {
        descendants: transformOptions.includeDescendantsTree,
        ancestors: transformOptions.includeAncestorsTree,
      },
      productCategories,
      findOptions_
    )

    return this.sortCategoriesByRank(categoriesTree)
  }

  sortCategoriesByRank(categories: ProductCategory[]): ProductCategory[] {
    const sortedCategories = categories.sort((a, b) => a.rank - b.rank)

    for (const category of sortedCategories) {
      if (category.category_children) {
        // All data up to this point is manipulated as an array, but it is a Collection<ProductCategory> type under the hood, so we are casting to any here.
        category.category_children = this.sortCategoriesByRank(
          category.category_children as any
        ) as any
      }
    }

    return sortedCategories
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
          parentMpaths.add(parent + mpath)
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

    const categoriesTree = await this.buildProductCategoriesWithTree(
      {
        descendants: transformOptions.includeDescendantsTree,
        ancestors: transformOptions.includeAncestorsTree,
      },
      productCategories,
      findOptions_
    )

    return [this.sortCategoriesByRank(categoriesTree), count]
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    await this.baseDelete(ids, context)
    await manager.nativeDelete(ProductCategory, { id: ids }, {})
  }

  async softDelete(
    ids: string[],
    context: Context = {}
  ): Promise<[ProductCategory[], Record<string, unknown[]>]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    await this.baseDelete(ids, context)

    const categories = await Promise.all(
      ids.map(async (id) => {
        const productCategory = await manager.findOneOrFail(ProductCategory, {
          id,
        })
        manager.assign(productCategory, { deleted_at: new Date() })
        return productCategory
      })
    )

    manager.persist(categories)
    return [categories, {}]
  }

  async restore(
    ids: string[],
    context: Context = {}
  ): Promise<[ProductCategory[], Record<string, unknown[]>]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    const categories = await Promise.all(
      ids.map(async (id) => {
        const productCategory = await manager.findOneOrFail(ProductCategory, {
          id,
        })
        manager.assign(productCategory, { deleted_at: null })
        return productCategory
      })
    )

    manager.persist(categories)
    return [categories, {}]
  }

  async baseDelete(ids: string[], context: Context = {}): Promise<void> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    await Promise.all(
      ids.map(async (id) => {
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

        await this.rerankSiblingsAfterDeletion(manager, productCategory)
      })
    )
  }

  async create(
    data: ProductTypes.CreateProductCategoryDTO[],
    context: Context = {}
  ): Promise<ProductCategory[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    const categories = await Promise.all(
      data.map(async (entry, i) => {
        const categoryData: Partial<ProductCategory> = { ...entry }
        const siblingsCount = await manager.count(ProductCategory, {
          parent_category_id: categoryData?.parent_category_id || null,
        })

        if (!isDefined(categoryData.rank)) {
          categoryData.rank = siblingsCount + i
        } else {
          if (categoryData.rank > siblingsCount + i) {
            categoryData.rank = siblingsCount + i
          }

          await this.rerankSiblingsAfterCreation(manager, categoryData)
        }

        // Set the base mpath if the category has a parent. The model `create` hook will append the own id to the base mpath.
        const parentCategoryId =
          categoryData.parent_category_id ?? categoryData.parent_category?.id

        if (parentCategoryId) {
          const parentCategory = await manager.findOne(
            ProductCategory,
            parentCategoryId
          )

          if (!parentCategory) {
            throw new MedusaError(
              MedusaError.Types.INVALID_ARGUMENT,
              `Parent category with id: '${parentCategoryId}' does not exist`
            )
          }

          categoryData.mpath = parentCategory.mpath
        }

        return manager.create(ProductCategory, categoryData as ProductCategory)
      })
    )

    manager.persist(categories)
    return categories
  }

  async update(
    data: UpdateCategoryInput[],
    context: Context = {}
  ): Promise<ProductCategory[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    const categories = await Promise.all(
      data.map(async (entry, i) => {
        const categoryData: Partial<ProductCategory> = { ...entry }
        const productCategory = await manager.findOneOrFail(ProductCategory, {
          id: categoryData.id,
        })

        if (
          categoryData.parent_category_id &&
          categoryData.parent_category_id !== productCategory.parent_category_id
        ) {
          const newParentCategory = await manager.findOne(
            ProductCategory,
            categoryData.parent_category_id
          )
          if (!newParentCategory) {
            throw new MedusaError(
              MedusaError.Types.INVALID_ARGUMENT,
              `Parent category with id: '${categoryData.parent_category_id}' does not exist`
            )
          }

          categoryData.mpath = `${newParentCategory.mpath}.${productCategory.id}`

          const siblingsCount = await manager.count(ProductCategory, {
            parent_category_id: categoryData.parent_category_id,
          })
          if (!isDefined(categoryData.rank)) {
            categoryData.rank = siblingsCount + i
          } else {
            if (categoryData.rank > siblingsCount + i) {
              categoryData.rank = siblingsCount + i
            }

            await this.rerankSiblingsAfterCreation(manager, categoryData)
          }

          await this.rerankSiblingsAfterDeletion(manager, productCategory)
        }
        // In the case of the parent being updated, we do a delete/create reranking. If only the rank was updated, we need to shift all siblings
        else if (isDefined(categoryData.rank)) {
          const siblingsCount = await manager.count(ProductCategory, {
            parent_category_id: productCategory.parent_category_id,
          })

          // We don't cout the updated category itself.
          if (categoryData.rank > siblingsCount - 1 + i) {
            categoryData.rank = siblingsCount - 1 + i
          }

          await this.rerankAllSiblings(
            manager,
            productCategory,
            categoryData as ProductCategory
          )
        }

        for (const key in categoryData) {
          if (isDefined(categoryData[key])) {
            productCategory[key] = categoryData[key]
          }
        }

        manager.assign(productCategory, categoryData)
        return productCategory
      })
    )

    manager.persist(categories)
    return categories
  }

  protected async rerankSiblingsAfterDeletion(
    manager: SqlEntityManager,
    removedSibling: Partial<ProductCategory>
  ) {
    const affectedSiblings = await manager.find(ProductCategory, {
      parent_category_id: removedSibling.parent_category_id,
      rank: { $gt: removedSibling.rank },
    })

    const updatedSiblings = affectedSiblings.map((sibling) => {
      manager.assign(sibling, { rank: sibling.rank - 1 })
      return sibling
    })

    manager.persist(updatedSiblings)
  }

  protected async rerankSiblingsAfterCreation(
    manager: SqlEntityManager,
    addedSibling: Partial<ProductCategory>
  ) {
    const affectedSiblings = await manager.find(ProductCategory, {
      parent_category_id: addedSibling.parent_category_id,
      rank: { $gte: addedSibling.rank },
    })

    const updatedSiblings = affectedSiblings.map((sibling) => {
      manager.assign(sibling, { rank: sibling.rank + 1 })
      return sibling
    })

    manager.persist(updatedSiblings)
  }

  protected async rerankAllSiblings(
    manager: SqlEntityManager,
    originalSibling: Partial<ProductCategory> & { rank: number },
    updatedSibling: Partial<ProductCategory> & { rank: number }
  ) {
    if (originalSibling.rank === updatedSibling.rank) {
      return
    }

    if (originalSibling.rank < updatedSibling.rank) {
      const siblings = await manager.find(
        ProductCategory,
        {
          parent_category_id: originalSibling.parent_category_id,
          rank: { $gt: originalSibling.rank, $lte: updatedSibling.rank },
        },
        { orderBy: { rank: "ASC" } }
      )

      const updatedSiblings = siblings.map((sibling) => {
        manager.assign(sibling, { rank: sibling.rank - 1 })
        return sibling
      })

      manager.persist(updatedSiblings)
    } else {
      const siblings = await manager.find(
        ProductCategory,
        {
          parent_category_id: originalSibling.parent_category_id,
          rank: { $gte: updatedSibling.rank, $lt: originalSibling.rank },
        },
        { orderBy: { rank: "ASC" } }
      )

      const updatedSiblings = siblings.map((sibling) => {
        manager.assign(sibling, { rank: sibling.rank + 1 })
        return sibling
      })

      manager.persist(updatedSiblings)
    }
  }
}
