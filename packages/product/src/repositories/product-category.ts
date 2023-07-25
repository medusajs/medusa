import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { Product, ProductCategory } from "@models"
import { Context, DAL, ProductCategoryTransformOptions } from "@medusajs/types"
import groupBy from "lodash/groupBy"
import { BaseTreeRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InjectTransactionManager, MedusaContext, isDefined } from "@medusajs/utils"

import { ProductCategoryServiceTypes } from "../types"

export class ProductCategoryRepository extends BaseTreeRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
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

      delete whereOptions.parent_category_id
      delete whereOptions.id

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

      let children = descendantsByParentId[productCategory.id] || []
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

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<void> {
    await (manager as SqlEntityManager).nativeDelete(
      Product,
      { id: { $in: ids } },
      {}
    )
  }

  @InjectTransactionManager()
  async create(
    data: ProductCategoryServiceTypes.CreateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductCategory> {
    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    const parentIds = []
    const includeNull = parentIds.includes(null)
    const parentCategories = await manager.find(
      ProductCategory,
      {
        $or: [
          { parent_category_id: { $in: parentIds.filter(Boolean) } },
          (includeNull ? { parent_category_id: { $eq: null } } : {})
        ]
      }
    )

    const parentCategoryMap = new Map<string | null, ProductCategory[]>()

    parentCategories.forEach((category) => {
      const parentCategoryId = category.parent_category_id || null
      const array = parentCategoryMap.get(parentCategoryId) || []

      array.push(category)

      parentCategoryMap.set(parentCategoryId, array)
    })

    const productCategories = data.map((categoryData, index) => {
      const parentCategoryId = categoryData?.parent_category_id || null
      const siblings = parentCategoryMap.get(parentCategoryId) || []

      if (!isDefined(categoryData.rank)) {
        categoryData.rank = siblings.length
      }

      return manager.create(ProductCategory, categoryData)
    })

    await manager.persist(productCategories)

    return productCategories
  }
}
