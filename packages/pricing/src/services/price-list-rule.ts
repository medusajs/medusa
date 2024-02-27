import { Context, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceListRule } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceListRuleRepository: DAL.RepositoryService
}

export default class PriceListRuleService<
  TEntity extends PriceListRule = PriceListRule
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  PriceListRule
)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }

  create(
    data: ServiceTypes.CreatePriceListRuleDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]>
  create(
    data: ServiceTypes.CreatePriceListRuleDTO,
    sharedContext?: Context
  ): Promise<TEntity>

  async create(
    data:
      | ServiceTypes.CreatePriceListRuleDTO
      | ServiceTypes.CreatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    const priceListRule = data_.map((priceListRule) => {
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

  // @ts-ignore
  update(
    data: ServiceTypes.UpdatePriceListRuleDTO[],
    context: Context
  ): Promise<TEntity[]>

  // @ts-ignore
  update(
    data: ServiceTypes.UpdatePriceListRuleDTO,
    context: Context
  ): Promise<TEntity>

  // TODO add support for selector? and then rm ts ignore
  // @ts-ignore
  async update(
    data:
      | ServiceTypes.UpdatePriceListRuleDTO
      | ServiceTypes.UpdatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    const priceListRules = data_.map((priceListRule) => {
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
