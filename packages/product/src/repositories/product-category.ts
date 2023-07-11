import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { Product, ProductCategory } from "@models"
import { Context, DAL, ProductCategoryTransformOptions } from "@medusajs/types"
import groupBy from "lodash/groupBy"
import { AbstractTreeRepositoryBase } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class ProductCategoryRepository extends AbstractTreeRepositoryBase<ProductCategory> {
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

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
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
      delete whereOptions.id

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
    context: Context = {}
  ): Promise<[ProductCategory[], number]> {
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

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    const result = await this.manager_.findAndCount(
      ProductCategory,
      findOptions_.where as MikroFilterQuery<ProductCategory>,
      findOptions_.options as MikroOptions<ProductCategory>
    )

    if (!includeDescendantsTree) {
      return result
    }

    return [
      await this.buildProductCategoriesWithDescendants(
        result[0],
        findOptions_
      ),
      result[1]
    ]
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    await manager.nativeDelete(Product, { id: { $in: ids } }, {})
  }

  async create(
    data: unknown[],
    context: Context = {}
  ): Promise<ProductCategory[]> {
    throw new Error("Method not implemented.")
  }
}
