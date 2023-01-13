import { EntityRepository, TreeRepository, Brackets, ILike } from "typeorm"
import { ProductCategory } from "../models/product-category"
import { ExtendedFindConfig, Selector, QuerySelector } from "../types/common"

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {
  public async getFreeTextSearchResultsAndCount(
    options: ExtendedFindConfig<ProductCategory, Selector<ProductCategory>> = {
      where: {},
    },
    q: string | undefined,
    treeSelector: QuerySelector<ProductCategory> = {},
  ): Promise<[ProductCategory[], number]> {
    const entityName = "product_category"
    const options_ = { ...options }

    const selectStatements = (relationName: string): string[] => {
      return (options_.select || []).map((column) => {
        return `${relationName}.${column}`
      })
    }

    const treeWhereStatements = (relationName: string): string => {
      return Object.entries(treeSelector).map((entry) => {
        return `${relationName}.${entry[0]} = :${entry[0]}`
      }).join(" AND ")
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

    if (options_.relations?.length) {
      options_.relations.forEach((rel) => {
        const whereQuery = treeWhereStatements(rel)

        queryBuilder
          .leftJoin(
            `${entityName}.${rel}`,
            rel,
            whereQuery,
            treeSelector,
          )
          .addSelect(selectStatements(rel))
      })
    }

    if (options_.withDeleted) {
      queryBuilder.withDeleted()
    }

    return await queryBuilder.getManyAndCount()
  }
}
