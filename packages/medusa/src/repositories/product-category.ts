import {
  Brackets,
  FindOptionsWhere,
  ILike,
  DeleteResult,
  In,
  FindOneOptions,
} from "typeorm"
import { ProductCategory } from "../models/product-category"
import { ExtendedFindConfig, QuerySelector } from "../types/common"
import { dataSource } from "../loaders/database"
import { buildLegacyFieldsListFrom } from "../utils"
import { isEmpty } from "lodash"

export const ProductCategoryRepository = dataSource
  .getTreeRepository(ProductCategory)
  .extend({
    async findOneWithDescendants(
      query: FindOneOptions<ProductCategory>,
      treeScope: QuerySelector<ProductCategory> = {}
    ): Promise<ProductCategory | null> {
      const productCategory = await this.findOne(query)

      if (!productCategory) {
        return productCategory
      }

      return sortChildren(
        // Returns the productCategory with all of its descendants until the last child node
        await this.findDescendantsTree(productCategory),
        treeScope
      )
    },

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

      const legacySelect = buildLegacyFieldsListFrom(options_.select)
      const legacyRelations = buildLegacyFieldsListFrom(options_.relations)

      const selectStatements = (relationName: string): string[] => {
        const modelColumns = this.metadata.ownColumns.map(
          (column) => column.propertyName
        )
        const selectColumns = legacySelect.length ? legacySelect : modelColumns

        return selectColumns.map((column) => {
          return `${relationName}.${column}`
        })
      }

      const queryBuilder = this.createQueryBuilder(entityName)
        .select(selectStatements(entityName))
        .skip(options_.skip)
        .take(options_.take)
        .addOrderBy(`${entityName}.rank`, "ASC")
        .addOrderBy(`${entityName}.handle`, "ASC")

      if (q) {
        delete options_.where?.name
        delete options_.where?.handle

        queryBuilder.where(
          new Brackets((bracket) => {
            bracket
              .where({ name: ILike(`%${q}%`) })
              .orWhere({ handle: ILike(`%${q}%`) })
          })
        )
      }

      queryBuilder.andWhere(options_.where)

      const includedTreeRelations: string[] = legacyRelations.filter((rel) =>
        ProductCategory.treeRelations.includes(rel)
      )

      includedTreeRelations.forEach((treeRelation) => {
        const treeWhere = Object.entries(treeScope)
          .map((entry) => `${treeRelation}.${entry[0]} = :${entry[0]}`)
          .join(" AND ")

        queryBuilder
          .leftJoin(
            `${entityName}.${treeRelation}`,
            treeRelation,
            treeWhere,
            treeScope
          )
          .addSelect(selectStatements(treeRelation))
          .addOrderBy(`${treeRelation}.rank`, "ASC")
          .addOrderBy(`${treeRelation}.handle`, "ASC")
      })

      const nonTreeRelations: string[] = legacyRelations.filter(
        (rel) => !ProductCategory.treeRelations.includes(rel)
      )

      nonTreeRelations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`${entityName}.${relation}`, relation)
      })

      let [categories, count] = await queryBuilder.getManyAndCount()

      if (includeTree) {
        categories = await Promise.all(
          categories.map(async (productCategory) => {
            productCategory = await this.findDescendantsTree(productCategory)

            return sortChildren(productCategory, treeScope)
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

const scopeChildren = (
  category: ProductCategory,
  treeScope: QuerySelector<ProductCategory> = {}
): ProductCategory => {
  if (isEmpty(treeScope)) {
    return category
  }

  category.category_children = category.category_children.filter(
    (categoryChild) => {
      return !Object.entries(treeScope).some(
        ([attribute, value]) => categoryChild[attribute] !== value
      )
    }
  )

  return category
}

const sortChildren = (
  category: ProductCategory,
  treeScope: QuerySelector<ProductCategory> = {}
): ProductCategory => {
  if (category.category_children) {
    category.category_children = category?.category_children
      .map(
        // Before we sort the children, we need scope the children
        // to conform to treeScope conditions
        (child) => sortChildren(scopeChildren(child, treeScope), treeScope)
      )
      .sort((a, b) => a.rank - b.rank)
  }

  return category
}
