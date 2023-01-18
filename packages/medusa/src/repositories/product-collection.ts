import { ProductCollection } from "../models"
import { dataSource } from "../loaders/database"
import { ExtendedFindConfig } from "../types/common"
import { buildLegacySelectOrRelationsFrom } from "../utils"

// eslint-disable-next-line max-len
export const ProductCollectionRepository = dataSource
  .getRepository(ProductCollection)
  .extend({
    async findAndCountByDiscountConditionId(
      conditionId: string,
      query: ExtendedFindConfig<ProductCollection>
    ): Promise<[ProductCollection[], number]> {
      const qb = this.createQueryBuilder("pc")

      if (query?.select) {
        const legacySelect = buildLegacySelectOrRelationsFrom(query.select)
        qb.select(legacySelect.map((select) => `pc.${select}`))
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
