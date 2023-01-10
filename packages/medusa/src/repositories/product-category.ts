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

    const queryBuilder = this.createQueryBuilder("product_category")
      .select()
      .skip(options.skip)
      .take(options.take)

    if (q) {
      delete options_?.where?.name
      delete options_?.where?.handle

      queryBuilder.where(
        new Brackets((bracket) => {
          bracket
            .where({ name: ILike(`%${q}%`) })
            .orWhere({ handle: ILike(`%${q}%`) })
        })
      )
    }

    queryBuilder.andWhere(options.where)

    if (options.withDeleted) {
      queryBuilder.withDeleted()
    }

    if (options.relations?.length) {
      options.relations.forEach((rel) => {
        queryBuilder.leftJoinAndSelect(`product_category.${rel}`, rel)
      })
    }

    return await queryBuilder.getManyAndCount()
  }
}
