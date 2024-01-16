import { DAL, PromotionTypes } from "@medusajs/types"
import { ApplicationMethod } from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  applicationMethodRepository: DAL.RepositoryService
}

export default class ApplicationMethodService<
  TEntity extends ApplicationMethod = ApplicationMethod
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: PromotionTypes.CreateApplicationMethodDTO
    update: PromotionTypes.UpdateApplicationMethodDTO
  },
  {
    list: PromotionTypes.FilterableApplicationMethodProps
    listAndCount: PromotionTypes.FilterableApplicationMethodProps
  }
>(ApplicationMethod)<TEntity> {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
