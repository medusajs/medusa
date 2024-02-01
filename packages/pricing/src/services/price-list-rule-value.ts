import { Context, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceListRuleValue } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRuleValueRepository: DAL.RepositoryService
}

export default class PriceListRuleValueService<
  TEntity extends PriceListRuleValue = PriceListRuleValue
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    update: ServiceTypes.UpdatePriceListRuleValueDTO
  },
  {
    list: ServiceTypes.FilterablePriceListRuleValueProps
    listAndCount: ServiceTypes.FilterablePriceListRuleValueProps
  }
>(PriceListRuleValue)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }

  async create(
    data: ServiceTypes.CreatePriceListRuleValueDTO[],
    context: Context = {}
  ): Promise<TEntity[]> {
    const priceListRuleValues = data.map((priceRuleValueData) => {
      const { price_list_rule_id: priceListRuleId, ...priceRuleValue } =
        priceRuleValueData

      if (priceListRuleId) {
        priceRuleValue.price_list_rule = priceListRuleId
      }

      return priceRuleValue
    })

    return await super.create(priceListRuleValues, context)
  }
}
