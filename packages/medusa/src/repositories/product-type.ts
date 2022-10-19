import { EntityRepository, Repository } from "typeorm"
import { ProductType } from "../models/product-type"
import { ExtendedFindConfig, Selector } from "../types/common"

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
    return await this.save(created)
  }

  async findAndCountByDiscountConditionId(
    conditionId: string,
    query: ExtendedFindConfig<ProductType, Selector<ProductType>>
  ): Promise<[ProductType[], number]> {
    const qb = this.createQueryBuilder("pt")

    if (query?.select) {
      qb.select(query.select.map((select) => `pt.${select}`))
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
  }
}
