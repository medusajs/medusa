import { Context, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceListRule } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRuleRepository: DAL.RepositoryService
}

export default class PriceListRuleService<
  TEntity extends PriceListRule = PriceListRule
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceListRuleDTO
    update: ServiceTypes.UpdatePriceListRuleDTO
  },
  {
    list: ServiceTypes.FilterablePriceListRuleProps
    listAndCount: ServiceTypes.FilterablePriceListRuleProps
  }
>(PriceListRule)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }

  async create(
    data: ServiceTypes.CreatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<TEntity[]> {
    const priceListRule = data.map((priceListRule) => {
      const {
        price_list_id: priceListId,
        rule_type_id: ruleTypeId,
        ...createData
      } = priceListRule

      if (priceListId) {
        createData.price_list = priceListId
      }

      if (ruleTypeId) {
        createData.rule_type = ruleTypeId
      }

      return createData
    })

    return await super.create(priceListRule, context)
  }

  async update(
    data: ServiceTypes.UpdatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<TEntity[]> {
    const priceListRules = data.map((priceListRule) => {
      const { price_list_id, rule_type_id, ...priceListRuleData } =
        priceListRule

      if (price_list_id) {
        priceListRuleData.price_list = price_list_id
      }

      if (rule_type_id) {
        priceListRuleData.rule_type = rule_type_id
      }

      return priceListRuleData
    })

    return await super.update(priceListRules, context)
  }
}
