import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { PriceSetRuleType } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceSetRuleTypeRepository: DAL.RepositoryService
}

export default class PriceSetRuleTypeService<
  TEntity extends PriceSetRuleType = PriceSetRuleType
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceSetRuleTypeDTO
    update: ServiceTypes.UpdatePriceSetRuleTypeDTO
  },
  {
    list: ServiceTypes.FilterablePriceSetRuleTypeProps
    listAndCount: ServiceTypes.FilterablePriceSetRuleTypeProps
  }
>(PriceSetRuleType)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
