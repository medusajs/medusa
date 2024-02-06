import { Context, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceRule } from "@models"

import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceRuleRepository: DAL.RepositoryService
}

export default class PriceRuleService<
  TEntity extends PriceRule = PriceRule
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  PriceRule
)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }

  create(
    data: ServiceTypes.CreatePriceRuleDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]>
  create(
    data: ServiceTypes.CreatePriceRuleDTO,
    sharedContext?: Context
  ): Promise<TEntity>

  async create(
    data: ServiceTypes.CreatePriceRuleDTO | ServiceTypes.CreatePriceRuleDTO[],
    sharedContext: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    const toCreate = data_.map((ruleData) => {
      const ruleDataClone = { ...ruleData } as any

      ruleDataClone.rule_type ??= ruleData.rule_type_id
      ruleDataClone.price_set ??= ruleData.price_set_id
      ruleDataClone.price_set_money_amount ??=
        ruleData.price_set_money_amount_id

      return ruleDataClone
    })

    return await super.create(toCreate, sharedContext)
  }
}
