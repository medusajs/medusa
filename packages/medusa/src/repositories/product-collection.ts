import { dataSource } from "../loaders/database"
import { ProductCollection } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common"

export const ProductCollectionRepository = dataSource
  .getRepository(ProductCollection)
  .extend({
    async findAndCountByDiscountConditionId(
      conditionId: string,
      query: ExtendedFindConfig<ProductCollection, Selector<ProductCollection>>
    ): Promise<[ProductCollection[], number]> {
      const qb = this.createQueryBuilder("pc")

      if (query?.select) {
        qb.select(query.select.map((select) => `pc.${select}`))
      }

      if (query.skip) {
        qb.skip(query.skip)
      }

      if (query.take) {
        qb.take(query.take)
      }

      return await qb
        .where(query.where)
        .innerJoin(
          "discount_condition_product_collection",
          "dc_pc",
          `dc_pc.product_collection_id = pc.id AND dc_pc.condition_id = :dcId`,
          { dcId: conditionId }
        )
        .getManyAndCount()
    },
  })

export default ProductCollectionRepository
