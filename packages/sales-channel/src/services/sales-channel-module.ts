import { Context, DAL, FindConfig } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"

import { SalesChannel } from "@models"

type InjectedDependencies = {
  salesChannelRepository: DAL.RepositoryService
}

export default class SalesChannelModuleService<TEntity extends {}> {
  protected readonly salesChannelRepository_: DAL.RepositoryService

  constructor({ salesChannelRepository }: InjectedDependencies) {
    this.salesChannelRepository_ = salesChannelRepository
  }

  @InjectManager("salesChannelRepository_")
  async list(
    filters: {} = {},
    config: FindConfig<{}> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<SalesChannel>(
      filters,
      config
    )

    return (await this.salesChannelRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }
}
