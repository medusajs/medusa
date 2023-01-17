import { ProductType } from "../models/product-type"
import { ExtendedFindConfig } from "../types/common"
import { buildLegacySelectOrRelationsFrom } from "../utils"
import { dataSource } from "../loaders/database"

type UpsertTypeInput = Partial<ProductType> & {
  value: string
}

export const ProductTypeRepository = dataSource
  .getRepository(ProductType)
  .extend({
    async upsertType(type?: UpsertTypeInput): Promise<ProductType | null> {
      if (!type) {
        return null
      }

      const existing = await this.findOne({
        where: { value: type.value },
      })

      if (existing) {
        return existing
      }

      const created = this.create({
        value: type.value,
      })
      return await this.save(created)
    },

    async findAndCountByDiscountConditionId(
      conditionId: string,
      query: ExtendedFindConfig<ProductType>
    ): Promise<[ProductType[], number]> {
      const qb = this.createQueryBuilder("pt")

      if (query?.select) {
        const legacySelect = buildLegacySelectOrRelationsFrom(query.select)
        qb.select(legacySelect.map((select) => `pt.${select}`))
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
          "discount_condition_product_type",
          "dc_pt",
          `dc_pt.product_type_id = pt.id AND dc_pt.condition_id = :dcId`,
          { dcId: conditionId }
        )
        .getManyAndCount()
    },
  })
export default ProductTypeRepository
