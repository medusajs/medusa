import { FindConfig } from "../common"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"

export interface ILinkModule {
  __joinerConfig(): ModuleJoinerConfig

  list(
    filters?: Record<string, unknown>,
    config?: FindConfig<unknown>,
    sharedContext?: Context
  ): Promise<unknown[]>

  listAndCount(
    filters?: Record<string, unknown>,
    config?: FindConfig<unknown>,
    sharedContext?: Context
  ): Promise<[unknown[], number]>

  create(
    primaryKeyOrBulkData:
      | string
      | string[]
      | [string | string[], string, Record<string, unknown>?][],
    foreignKeyData?: string,
    sharedContext?: Context
  ): Promise<unknown[]>

  dismiss(
    primaryKeyOrBulkData: string | string[] | [string | string[], string][],
    foreignKeyData?: string,
    sharedContext?: Context
  ): Promise<unknown[]>

  delete(data: unknown | unknown[], sharedContext?: Context): Promise<unknown[]>

  softDelete(
    data: unknown | unknown[],
    { returnLinkableKeys }?: { returnLinkableKeys?: string[] },
    sharedContext?: Context
  ): Promise<Record<string, unknown[]> | void>

  restore(
    data: unknown | unknown[],
    { returnLinkableKeys }?: { returnLinkableKeys?: string[] },
    sharedContext?: Context
  ): Promise<Record<string, unknown[]> | void>
}
