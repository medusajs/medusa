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
