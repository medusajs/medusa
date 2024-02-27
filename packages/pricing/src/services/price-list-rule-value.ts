import { Context, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceListRuleValue } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRuleValueRepository: DAL.RepositoryService
}

export default class PriceListRuleValueService<
  TEntity extends PriceListRuleValue = PriceListRuleValue
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  PriceListRuleValue
)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }

  create(
    data: ServiceTypes.CreatePriceListRuleValueDTO[],
    context: Context
  ): Promise<TEntity[]>

  create(
    data: ServiceTypes.CreatePriceListRuleValueDTO,
    context: Context
  ): Promise<TEntity>

  async create(
    data:
      | ServiceTypes.CreatePriceListRuleValueDTO
      | ServiceTypes.CreatePriceListRuleValueDTO[],
    context: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    const priceListRuleValues = data_.map((priceRuleValueData) => {
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
