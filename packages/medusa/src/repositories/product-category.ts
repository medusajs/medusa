import { EntityRepository, TreeRepository, Brackets, ILike } from "typeorm"
import { ProductCategory } from "../models/product-category"
import { ExtendedFindConfig, Selector } from "../types/common"

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {
  public async getFreeTextSearchResultsAndCount(
    options: ExtendedFindConfig<ProductCategory, Selector<ProductCategory>> = {
      where: {},
    },
    q: string | undefined
  ): Promise<[ProductCategory[], number]> {
    const options_ = { ...options }
    const entityName = "product_category"

    const queryBuilder = this.createQueryBuilder(entityName)
      .select()
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

    if (options_.withDeleted) {
      queryBuilder.withDeleted()
    }

    if (options_.relations?.length) {
      options_.relations.forEach((rel) => {
        queryBuilder.leftJoinAndSelect(`${entityName}.${rel}`, rel)
      })
    }

    return await queryBuilder.getManyAndCount()
  }
}
