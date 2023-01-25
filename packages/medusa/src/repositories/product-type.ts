import { ProductType } from "../models/product-type"
import { ExtendedFindConfig } from "../types/common"
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
      return await this.createQueryBuilder("pt")
        .where(query.where)
        .setFindOptions(query)
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
