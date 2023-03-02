import { DeleteResult, FindOptionsWhere, ILike, In } from "typeorm"
import { ProductCategory } from "../models"
import { ExtendedFindConfig, QuerySelector } from "../types/common"
import { dataSource } from "../loaders/database"

const sortChildren = (category: ProductCategory): ProductCategory => {
  if (category.category_children) {
    category.category_children = category?.category_children
      .map((child) => sortChildren(child))
      .sort((a, b) => a.position - b.position)
  }

  return category
}

export const ProductCategoryRepository = dataSource
  .getTreeRepository(ProductCategory)
  .extend({
    async getFreeTextSearchResultsAndCount(
      options: ExtendedFindConfig<ProductCategory> = {
        where: {},
      },
      q?: string,
      treeScope: QuerySelector<ProductCategory> = {},
      includeTree = false
    ): Promise<[ProductCategory[], number]> {
      const entityName = "product_category"
      const options_ = { ...options }
      options_.where = options_.where as FindOptionsWhere<ProductCategory>
      options_.order = options_.order ?? {}

      const queryBuilder = this.createQueryBuilder(entityName)

      queryBuilder.addOrderBy(`${entityName}.position`, "ASC")
      queryBuilder.addOrderBy(`${entityName}.handle`, "ASC")

      if (options_.relations?.category_children) {
        options_.order.category_children = { position: "ASC", handle: "ASC" }
        Object.assign(options_.where?.category_children || {}, treeScope)
      }

      if (options_.relations?.parent_category) {
        options_.order.parent_category = { position: "ASC", handle: "ASC" }
        Object.assign(options_.where?.parent_category || {}, treeScope)
      }

      if (q) {
        delete options_.where?.name
        delete options_.where?.handle

        options_.where = [
          {
            ...options_.where,
            name: ILike(`%${q}%`),
          },
          {
            ...options_.where,
            handle: ILike(`%${q}%`),
          },
        ]
      }

      if (options_.withDeleted) {
        queryBuilder.withDeleted()
      }

      queryBuilder.setFindOptions(options_)

      let [categories, count] = await queryBuilder.getManyAndCount()

      if (includeTree) {
        categories = await Promise.all(
          categories.map(async (productCategory) => {
            productCategory = await this.findDescendantsTree(productCategory)

            return sortChildren(productCategory)
          })
        )
      }

      return [categories, count]
    },

    async addProducts(
      productCategoryId: string,
      productIds: string[]
    ): Promise<void> {
      await this.createQueryBuilder()
        .insert()
        .into(ProductCategory.productCategoryProductJoinTable)
        .values(
          productIds.map((id) => ({
            product_category_id: productCategoryId,
            product_id: id,
          }))
        )
        .orIgnore()
        .execute()
    },

    async removeProducts(
      productCategoryId: string,
      productIds: string[]
    ): Promise<DeleteResult> {
      return await this.createQueryBuilder()
        .delete()
        .from(ProductCategory.productCategoryProductJoinTable)
        .where({
          product_category_id: productCategoryId,
          product_id: In(productIds),
        })
        .execute()
    },
  })

export default ProductCategoryRepository
