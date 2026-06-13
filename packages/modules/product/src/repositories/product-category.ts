import {
  Context,
  DAL,
  InferEntityType,
  ProductCategoryTransformOptions,
  ProductTypes,
} from "@medusajs/framework/types"
import { DALUtils, isDefined, MedusaError } from "@medusajs/framework/utils"
import {
  LoadStrategy,
  FindOptions as MikroOptions,
} from "@medusajs/framework/mikro-orm/core"
import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"
import { ProductCategory } from "@models"
import { UpdateCategoryInput } from "@types"

// eslint-disable-next-line max-len
export class ProductCategoryRepository extends DALUtils.MikroOrmBaseTreeRepository<
  typeof ProductCategory
> {
  buildFindOptions(
    findOptions: DAL.FindOptions<typeof ProductCategory> = { where: {} },
    familyOptions: ProductCategoryTransformOptions = {}
  ) {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}
    findOptions_.options.orderBy ??= {
      id: "ASC",
      rank: "ASC",
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
    findOptions: DAL.FindOptions<typeof ProductCategory> = { where: {} },
    transformOptions: ProductCategoryTransformOptions = {},
    context: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    const findOptions_ = this.buildFindOptions(findOptions, transformOptions)

    DALUtils.pruneFindOptionsAgainstMetadata(
      manager.getDriver().getMetadata().get(ProductCategory.name),
      findOptions_.options as { fields?: unknown; populate?: unknown }
    )

    const productCategories = await manager.find<
      InferEntityType<typeof ProductCategory>
    >(
      ProductCategory.name,
      findOptions_.where,
      { ...findOptions_.options } as any // TODO
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
      findOptions_,
      context
    )

    return this.sortCategoriesByRank(categoriesTree)
  }

  sortCategoriesByRank(
    categories: InferEntityType<typeof ProductCategory>[]
  ): InferEntityType<typeof ProductCategory>[] {
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
    productCategories: InferEntityType<typeof ProductCategory>[],
    findOptions: DAL.FindOptions<typeof ProductCategory> & {
      serialize?: boolean
    } = { where: {} },
    context: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    const { serialize = true } = findOptions
    delete findOptions.serialize

    const manager = super.getActiveManager<SqlEntityManager>(context)

    // We dont want to get the relations as we will fetch all the categories and build the tree manually
    let relationIndex =
      findOptions.options?.populate?.indexOf("parent_category") ?? -1
    const shouldPopulateParent = relationIndex !== -1
    if (shouldPopulateParent && include.ancestors) {
      findOptions.options!.populate!.splice(relationIndex as number, 1)
    }

    relationIndex =
      findOptions.options?.populate?.indexOf("category_children") ?? -1
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

    const where = { ...findOptions.where, $or: mpaths }
    const options = {
      ...findOptions.options,
      limit: undefined,
      offset: 0,
    } as MikroOptions<any>

    delete where.id
    delete where.handle
    delete where.mpath
    delete where.parent_category_id

    const categoriesInTree = serialize
      ? await this.serialize<InferEntityType<typeof ProductCategory>[]>(
          await manager.find(ProductCategory.name, where, options)
        )
      : await manager.find(ProductCategory.name, where, options)

    const categoriesById = new Map(categoriesInTree.map((cat) => [cat.id, cat]))

    categoriesInTree.forEach((cat: any) => {
      if (cat.parent_category_id && include.ancestors) {
        cat.parent_category = categoriesById.get(cat.parent_category_id)
        cat.parent_category_id = categoriesById.get(cat.parent_category_id)?.[
          "id"
        ]
      }
    })

    const populateChildren = (category, level = 0) => {
      const categories = categoriesInTree.filter(
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
    findOptions: DAL.FindOptions<typeof ProductCategory> = { where: {} },
    transformOptions: ProductCategoryTransformOptions = {},
    context: Context = {}
  ): Promise<[InferEntityType<typeof ProductCategory>[], number]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    const findOptions_ = this.buildFindOptions(findOptions, transformOptions)

    DALUtils.pruneFindOptionsAgainstMetadata(
      manager.getDriver().getMetadata().get(ProductCategory.name),
      findOptions_.options as { fields?: unknown; populate?: unknown }
    )

    const [productCategories, count] = (await manager.findAndCount(
      ProductCategory.name,
      findOptions_.where,
      findOptions_.options as any
    )) as unknown as [InferEntityType<typeof ProductCategory>[], number]

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
      findOptions_,
      context
    )

    return [this.sortCategoriesByRank(categoriesTree), count]
  }

  async delete(ids: string[], context: Context = {}): Promise<string[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    await this.baseDelete(ids, context)
    await manager.nativeDelete(ProductCategory.name, { id: ids }, {})
    return ids
  }

  async softDelete(
    ids: string[],
    context: Context = {}
  ): Promise<
    [InferEntityType<typeof ProductCategory>[], Record<string, unknown[]>]
  > {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    await this.baseDelete(ids, context)

    const categories = await Promise.all(
      ids.map(async (id) => {
        const productCategory = await manager.findOne<
          InferEntityType<typeof ProductCategory>
        >(ProductCategory.name, {
          id,
        })

        if (!productCategory) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `ProductCategory with id: ${id} was not found`
          )
        }

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
  ): Promise<
    [InferEntityType<typeof ProductCategory>[], Record<string, unknown[]>]
  > {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    const categories = await Promise.all(
      ids.map(async (id) => {
        const productCategory = await manager.findOneOrFail<
          InferEntityType<typeof ProductCategory>
        >(ProductCategory.name, {
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
        const productCategory = await manager.findOne<
          InferEntityType<typeof ProductCategory>
        >(
          ProductCategory.name,
          { id },
          {
            populate: ["category_children"],
          } as any // TODO
        )

        if (!productCategory) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `ProductCategory with id: ${id} was not found`
          )
        }

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
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)

    const categories = await Promise.all(
      data.map(async (entry, i) => {
        const categoryData: Partial<InferEntityType<typeof ProductCategory>> = {
          ...entry,
        }
        const siblingsCount = await manager.count(ProductCategory.name, {
          parent_category_id: categoryData?.parent_category_id || null,
        })

        categoryData.rank ??= siblingsCount + i
        if (categoryData.rank > siblingsCount + i) {
          categoryData.rank = siblingsCount + i
        }

        // There is no need to rerank if it is the last item in the list
        if (categoryData.rank < siblingsCount + i) {
          await this.rerankSiblingsAfterCreation(manager, categoryData)
        }

        // Set the base mpath if the category has a parent. The model `create` hook will append the own id to the base mpath.
        let parentCategory: InferEntityType<typeof ProductCategory> | null =
          null
        const parentCategoryId =
          categoryData.parent_category_id ?? categoryData.parent_category?.id

        if (parentCategoryId) {
          parentCategory = await manager.findOne<
            InferEntityType<typeof ProductCategory>
          >(ProductCategory.name, parentCategoryId)

          if (!parentCategory) {
            throw new MedusaError(
              MedusaError.Types.INVALID_ARGUMENT,
              `Parent category with id: '${parentCategoryId}' does not exist`
            )
          }
        }

        const result = await manager.create<
          InferEntityType<typeof ProductCategory>
        >(
          ProductCategory.name,
          categoryData as unknown as InferEntityType<typeof ProductCategory>
        )

        /**
         * Since "mpath" calculation relies on the id of the created
         * category, we have to compute it after calling manager.create. So
         * that we can access the "category.id" which is under the hood
         * defined by DML.
         */
        manager.assign(result, {
          mpath: parentCategory
            ? `${parentCategory.mpath}.${result.id}`
            : result.id,
        })

        return result
      })
    )

    manager.persist(categories)
    return categories
  }

  async update(
    data: UpdateCategoryInput[],
    context: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    const manager = super.getActiveManager<SqlEntityManager>(context)
    const categories = await Promise.all(
      data.map(async (entry, i) => {
        const categoryData: Partial<InferEntityType<typeof ProductCategory>> = {
          ...entry,
        }
        let productCategory = await manager.findOne<
          InferEntityType<typeof ProductCategory>
        >(ProductCategory.name, categoryData.id!)

        if (!productCategory) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `ProductCategory with id: ${categoryData.id} was not found`
          )
        }

        // If the parent or rank are not changed, no need to reorder anything.
        if (
          !isDefined(categoryData.parent_category_id) &&
          !isDefined(categoryData.rank)
        ) {
          for (const key in categoryData) {
            if (isDefined(categoryData[key])) {
              productCategory[key] = categoryData[key]
            }
          }

          manager.assign(productCategory, categoryData)
          return productCategory
        }

        // If the parent is changed, we need to rerank the siblings of the old parent and the new parent.
        if (
          isDefined(categoryData.parent_category_id) &&
          categoryData.parent_category_id !== productCategory.parent_category_id
        ) {
          // Calculate the new mpath
          if (categoryData.parent_category_id === null) {
            categoryData.mpath = ""
          } else {
            productCategory = (
              await this.buildProductCategoriesWithTree(
                {
                  descendants: true,
                },
                [productCategory],
                {
                  where: { id: productCategory.id },
                  serialize: false,
                },
                context
              )
            )[0]

            const newParentCategory = await manager.findOne<
              InferEntityType<typeof ProductCategory>
            >(ProductCategory.name, categoryData.parent_category_id)

            if (!newParentCategory) {
              throw new MedusaError(
                MedusaError.Types.INVALID_ARGUMENT,
                `Parent category with id: '${categoryData.parent_category_id}' does not exist`
              )
            }

            const categoryDataChildren =
              categoryData.category_children?.flatMap(
                (child) => child.category_children ?? []
              )

            const categoryDataChildrenMap = new Map(
              categoryDataChildren?.map((child) => [child.id, child])
            )

            function updateMpathRecursively(
              category: InferEntityType<typeof ProductCategory>,
              newBaseMpath: string
            ) {
              const newMpath = `${newBaseMpath}.${category.id}`
              category.mpath = newMpath
              for (let child of category.category_children) {
                child = manager.getReference(
                  ProductCategory.name,
                  child.id
                ) as any
                manager.assign(
                  child,
                  categoryDataChildrenMap.get(child.id) ?? {}
                )
                updateMpathRecursively(child, newMpath)
              }
            }

            updateMpathRecursively(
              productCategory!,
              (newParentCategory as any).mpath!
            )
            // categoryData.mpath = `${newParentCategory.mpath}.${productCategory.id}`
          }

          // Rerank the siblings in the new parent
          const siblingsCount = await manager.count(ProductCategory.name, {
            parent_category_id: categoryData.parent_category_id,
          })

          categoryData.rank ??= siblingsCount + i
          if (categoryData.rank > siblingsCount + i) {
            categoryData.rank = siblingsCount + i
          }

          // There is no need to rerank if it is the last item in the list
          if (categoryData.rank < siblingsCount + i) {
            await this.rerankSiblingsAfterCreation(manager, categoryData)
          }

          // Rerank the old parent's siblings
          await this.rerankSiblingsAfterDeletion(manager, productCategory)

          for (const key in categoryData) {
            if (isDefined(categoryData[key])) {
              productCategory[key] = categoryData[key]
            }
          }

          manager.assign(productCategory, categoryData)
          return productCategory
          // If only the rank changed, we need to rerank all siblings.
        } else if (isDefined(categoryData.rank)) {
          const siblingsCount = await manager.count(ProductCategory.name, {
            parent_category_id: productCategory.parent_category_id,
          })

          // Subtracting 1 since we don't count the modified category itself
          if (categoryData.rank > siblingsCount - 1 + i) {
            categoryData.rank = siblingsCount - 1 + i
          }

          await this.rerankAllSiblings(
            manager,
            productCategory,
            categoryData as Partial<InferEntityType<typeof ProductCategory>> & {
              rank: number
            }
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
    removedSibling: Partial<InferEntityType<typeof ProductCategory>>
  ) {
    const affectedSiblings = await manager.find<
      InferEntityType<typeof ProductCategory>
    >(ProductCategory.name, {
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
    addedSibling: Partial<InferEntityType<typeof ProductCategory>>
  ) {
    const affectedSiblings = await manager.find<
      InferEntityType<typeof ProductCategory>
    >(ProductCategory.name, {
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
    originalSibling: Partial<InferEntityType<typeof ProductCategory>> & {
      rank: number
    },
    updatedSibling: Partial<InferEntityType<typeof ProductCategory>> & {
      rank: number
    }
  ) {
    if (originalSibling.rank === updatedSibling.rank) {
      return
    }

    if (originalSibling.rank < updatedSibling.rank) {
      const siblings = await manager.find<
        InferEntityType<typeof ProductCategory>
      >(
        ProductCategory.name,
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
      const siblings = await manager.find<
        InferEntityType<typeof ProductCategory>
      >(
        ProductCategory.name,
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
