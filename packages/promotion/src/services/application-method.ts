import { DAL, PromotionTypes } from "@medusajs/types"
import { ApplicationMethod } from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  applicationMethodRepository: DAL.RepositoryService
}

export default class ApplicationMethodService<
  TEntity extends ApplicationMethod = ApplicationMethod
> extends ModulesSdkUtils.abstractServiceFactory<
  ApplicationMethod,
  InjectedDependencies,
  {
    retrieve: PromotionTypes.ApplicationMethodDTO
    list: PromotionTypes.ApplicationMethodDTO
    listAndCount: PromotionTypes.ApplicationMethodDTO
    create: PromotionTypes.CreateApplicationMethodDTO
    update: PromotionTypes.UpdateApplicationMethodDTO
  },
  {
    list: PromotionTypes.FilterableApplicationMethodProps
    listAndCount: PromotionTypes.FilterableApplicationMethodProps
  }
>(ApplicationMethod) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
