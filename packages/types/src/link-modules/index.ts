import { FindConfig } from "../common"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"

export interface ILinkModule {
  __joinerConfig(): ModuleJoinerConfig

  list(
    filters: Record<string, unknown>,
    config: FindConfig<unknown>,
    sharedContext?: Context
  ): Promise<unknown[]>

  listAndCount(
    filters: Record<string, unknown>,
    config: FindConfig<unknown>,
    sharedContext?: Context
  ): Promise<[unknown[], number]>

  create(data: unknown[], sharedContext?: Context): Promise<unknown[]>

  delete(productIds: string[], sharedContext?: Context): Promise<unknown[]>

  softDelete(productIds: string[], sharedContext?: Context): Promise<unknown[]>

  restore(productIds: string[], sharedContext?: Context): Promise<unknown[]>
}
