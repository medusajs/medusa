import { ProductCollection } from "../models"
import { dataSource } from "../loaders/database"
import { ExtendedFindConfig } from "../types/common"

// eslint-disable-next-line max-len
export const ProductCollectionRepository = dataSource
  .getRepository(ProductCollection)
  .extend({
    async findAndCountByDiscountConditionId(
      conditionId: string,
      query: ExtendedFindConfig<ProductCollection>
    ): Promise<[ProductCollection[], number]> {
      const qb = this.createQueryBuilder("pc")
        .setFindOptions(query)
        .innerJoin(
          "discount_condition_product_collection",
          "dc_pc",
          `dc_pc.product_collection_id = pc.id AND dc_pc.condition_id = :dcId`,
          { dcId: conditionId }
        )

      return await Promise.all([qb.getMany(), qb.getCount()])
    },
  })
export default ProductCollectionRepository
