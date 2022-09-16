import { ProductType } from "../models"
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
      const result = await this.save(created)

      return result
    },
  })
