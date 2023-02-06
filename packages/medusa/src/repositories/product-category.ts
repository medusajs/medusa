import {
  EntityRepository,
  TreeRepository,
  Brackets,
  ILike,
  getConnection,
  DeleteResult,
  In,
} from "typeorm"
import { ProductCategory } from "../models/product-category"
import { ExtendedFindConfig, Selector, QuerySelector } from "../types/common"

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {
  public async getFreeTextSearchResultsAndCount(
    options: ExtendedFindConfig<ProductCategory, Selector<ProductCategory>> = {
      where: {},
    },
    q: string | undefined,
    treeScope: QuerySelector<ProductCategory> = {}
  ): Promise<[ProductCategory[], number]> {
    const entityName = "product_category"
    const options_ = { ...options }
    const relations = options_.relations || []

    const selectStatements = (relationName: string): string[] => {
      const modelColumns = this.manager.connection
        .getMetadata(ProductCategory)
        .ownColumns.map((column) => column.propertyName)

      return (options_.select || modelColumns).map((column) => {
        return `${relationName}.${column}`
      })
    }

    const queryBuilder = this.createQueryBuilder(entityName)
      .select(selectStatements(entityName))
      .skip(options_.skip)
      .take(options_.take)

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

    const includedTreeRelations: string[] = relations.filter((rel) =>
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
    })

    const nonTreeRelations: string[] = relations.filter(
      (rel) => !ProductCategory.treeRelations.includes(rel)
    )

    nonTreeRelations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`${entityName}.${relation}`, relation)
    })

    if (options_.withDeleted) {
      queryBuilder.withDeleted()
    }

    return await queryBuilder.getManyAndCount()
  }

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
  }

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
  }
}
