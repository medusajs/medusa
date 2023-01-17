import { EntityRepository, TreeRepository, Brackets, ILike, FindOptionsRelations } from "typeorm"
import { ProductCategory } from "../models/product-category"
import { ExtendedFindConfig, Selector } from "../types/common"
import { dataSource } from "../loaders/database"

export const ProductCategoryRepository = dataSource.getTreeRepository(ProductCategory).extend({
  async getFreeTextSearchResultsAndCount(
    options: ExtendedFindConfig<ProductCategory> = {
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

    Object.entries((options_.relations || {}) as FindOptionsRelations<ProductCategory>).forEach(([rel, _]) => {
      queryBuilder.leftJoinAndSelect(`${entityName}.${rel}`, rel)
    })

    return await queryBuilder.getManyAndCount()
  }
})
export default ProductCategoryRepository
