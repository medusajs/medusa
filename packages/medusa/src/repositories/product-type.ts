import { ProductType } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

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

      const queryBuilder = this.createQueryBuilder()
        .insert()
        .into(ProductType)
        .values(created as QueryDeepPartialEntity<ProductType>)

      if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
        const rawTypes = await queryBuilder.execute()
        return this.create(rawTypes.generatedMaps[0])
      }

      const rawTypes = await queryBuilder.returning("*").execute()
      return this.create(rawTypes.generatedMaps[0])
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
