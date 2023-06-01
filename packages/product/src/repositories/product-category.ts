import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { deduplicateIfNecessary } from "../utils"
import { ProductCategory } from "@models"
import { DAL, ProductCategoryTransformOptions } from "@medusajs/types"
import groupBy from "lodash/groupBy"

export class ProductCategoryRepository
  implements DAL.RepositoryService<ProductCategory>
{
  protected readonly manager_: SqlEntityManager

  constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async find(
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} },
    transformOptions: ProductCategoryTransformOptions = {},
    context: { transaction?: any } = {}
  ): Promise<ProductCategory[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }
    const { includeDescendantsTree } = transformOptions

    findOptions_.options ??= {}
    const fields = (findOptions_.options.fields ??= [])
    findOptions_.options.limit ??= 15

    // Ref: Building descendants
    // mpath and parent_category_id needs to be added to the query for the tree building to be done accurately
    if (includeDescendantsTree) {
      fields.indexOf("mpath") === -1 && fields.push("mpath")
      fields.indexOf("parent_category_id") === -1 &&
        fields.push("parent_category_id")
    }

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transaction) {
      Object.assign(findOptions_.options, { ctx: context.transaction })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    const productCategories = await this.manager_.find(
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
    findOptions: DAL.FindOptions<ProductCategory> = { where: {} }
  ): Promise<ProductCategory[]> {
    for (let productCategory of productCategories) {
      const whereOptions = {
        ...findOptions.where,
        mpath: {
          $like: `${productCategory.mpath}%`,
        },
      }
      delete whereOptions.parent_category_id

      const descendantsForCategory = await this.manager_.find(
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
    context: { transaction?: any } = {}
  ): Promise<[ProductCategory[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transaction) {
      Object.assign(findOptions_.options, { ctx: context.transaction })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.findAndCount(
      ProductCategory,
      findOptions_.where as MikroFilterQuery<ProductCategory>,
      findOptions_.options as MikroOptions<ProductCategory>
    )
  }
}
