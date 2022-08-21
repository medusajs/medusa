import { EntityRepository, Repository } from "typeorm"
import { ProductType } from "../models/product-type"

type UpsertTypeInput = Partial<ProductType> & {
  value: string
}
@EntityRepository(ProductType)
export class ProductTypeRepository extends Repository<ProductType> {
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
  }
}
