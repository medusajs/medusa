import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types"

import { SalesChannel } from "@models"

type InjectedDependencies = {
  salesChannelRepository: DAL.RepositoryService
}

export default class SalesChannelService<
  TEntity extends SalesChannel = SalesChannel
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateSalesChannelDTO
    update: UpdateSalesChannelDTO
  }
>(SalesChannel)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
