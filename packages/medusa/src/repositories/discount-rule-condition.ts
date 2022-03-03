import {
  EntityRepository,
  FindManyOptions,
  FindOptionsUtils,
  In,
  Not,
  Repository,
} from "typeorm"
import { DiscountRuleCondition } from "../models/discount-rule-condition"
import { ProductTaxRate } from "../models/product-tax-rate"

@EntityRepository(DiscountRuleCondition)
export class DiscountRuleConditionRepository extends Repository<
  DiscountRuleCondition
> {
  getFindQueryBuilder(findOptions: FindManyOptions<DiscountRuleCondition>) {
    const qb = this.createQueryBuilder("drc")
    const cleanOptions = findOptions

    if (typeof findOptions.select !== "undefined") {
      const selectableCols: (keyof DiscountRuleCondition)[] = []
      for (const k of findOptions.select) {
        selectableCols.push(k)
      }
      cleanOptions.select = selectableCols
    }

    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(
      qb,
      cleanOptions
    )

    return qb
  }

  async findOneWithResolution(
    findOptions: FindManyOptions<DiscountRuleCondition>
  ) {
    const qb = this.getFindQueryBuilder(findOptions)
    return await qb.getOne()
  }

  async findAndCountWithResolution(
    findOptions: FindManyOptions<DiscountRuleCondition>
  ) {
    const qb = this.getFindQueryBuilder(findOptions)
    return await qb.getManyAndCount()
  }

  async addProducts(
    id: string,
    productIds: string[],
    overrideExisting = false
  ): Promise<DiscountRuleCondition[]> {
    const toInsert = productIds.map((pId) => ({ rate_id: id, product_id: pId }))
    const insertResult = await this.createQueryBuilder()
      .insert()
      .orIgnore(true)
      .into(ProductTaxRate)
      .values(toInsert)
      .execute()

    if (overrideExisting) {
      await this.createQueryBuilder()
        .delete()
        .from(ProductTaxRate)
        .where({ rate_id: id, product_id: Not(In(productIds)) })
        .execute()
    }

    return await this.manager
      .createQueryBuilder(ProductTaxRate, "ptr")
      .select()
      .where(insertResult.identifiers)
      .getMany()
  }
}
