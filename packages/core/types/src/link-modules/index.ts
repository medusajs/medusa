import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"

/**
 * Link descriptor containing metadata about the link's
 * modules and models.
 */
export type PlannerActionLinkDescriptor = {
  fromModule: string
  toModule: string
  fromModel: string
  toModel: string
}

/**
 * A list of actions prepared and executed by
 * the "ILinkMigrationsPlanner".
 */
export type LinkMigrationsPlannerAction =
  | {
      action: "create" | "update" | "notify"
      linkDescriptor: PlannerActionLinkDescriptor
      sql: string
      tableName: string
    }
  | {
      action: "noop"
      tableName: string
      linkDescriptor: PlannerActionLinkDescriptor
    }
  | {
      action: "delete"
      tableName: string
    }

export interface ILinkMigrationsPlanner {
  createPlan(): Promise<LinkMigrationsPlannerAction[]>
  executePlan(actions: LinkMigrationsPlannerAction[]): Promise<void>
}

export interface ILinkModule extends IModuleService {
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

  delete(data: unknown | unknown[], sharedContext?: Context): Promise<void>

  softDelete(
    data: unknown | unknown[],
    config?: SoftDeleteReturn,
    sharedContext?: Context
  ): Promise<Record<string, unknown[]> | void>

  restore(
    data: unknown | unknown[],
    config?: RestoreReturn,
    sharedContext?: Context
  ): Promise<Record<string, unknown[]> | void>
}
