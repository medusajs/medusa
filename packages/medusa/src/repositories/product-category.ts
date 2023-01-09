import { EntityRepository, TreeRepository, Brackets } from "typeorm"
import { ProductCategory } from "../models/product-category"
import { ExtendedFindConfig, Selector } from "../types/common"

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {
  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: ExtendedFindConfig<ProductCategory, Selector<ProductCategory>> = {
      where: {},
    }
  ): Promise<[ProductCategory[], number]> {
    const options_ = { ...options }

    delete options_?.where?.name
    delete options_?.where?.handle

    let builtQuery = this.createQueryBuilder("product_category")
      .select()
      .where(options_.where)
      .andWhere(
        new Brackets((bracket) => {
          bracket
            .where(`product_category.handle ILIKE :q`, { q: `%${q}%` })
            .orWhere(`product_category.name ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(options.skip)
      .take(options.take)

    if (options.withDeleted) {
      builtQuery = builtQuery.withDeleted()
    }

    return await builtQuery.getManyAndCount()
  }
}
