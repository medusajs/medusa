import { DAL, PromotionTypes } from "@medusajs/types"
import { ApplicationMethod } from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"
import { CreateApplicationMethodDTO, UpdateApplicationMethodDTO } from "@types"

type InjectedDependencies = {
  applicationMethodRepository: DAL.RepositoryService
}

export default class ApplicationMethodService<
  TEntity extends ApplicationMethod = ApplicationMethod
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateApplicationMethodDTO
    update: UpdateApplicationMethodDTO
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
